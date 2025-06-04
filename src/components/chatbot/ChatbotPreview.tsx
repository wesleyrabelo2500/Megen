import React, { useState, useEffect, useRef } from 'react';
import { Send, X, Minimize, Maximize } from 'lucide-react';

interface ChatbotPreviewProps {
  name: string;
  primaryColor: string;
  responses: {
    id: string;
    trigger: string;
    patterns: string[];
    response: string;
  }[];
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatbotPreview: React.FC<ChatbotPreviewProps> = ({ name, primaryColor, responses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: `Olá! Sou o ${name}. Como posso ajudar você hoje?`,
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');

    // Find a matching response
    setTimeout(() => {
      let foundResponse = false;
      
      // Check for pattern matches
      for (const response of responses) {
        if (response.patterns.some(pattern => 
          inputMessage.toLowerCase().includes(pattern.toLowerCase()))) {
          setMessages((prev) => [
            ...prev,
            {
              id: Date.now().toString(),
              text: response.response,
              sender: 'bot',
              timestamp: new Date(),
            },
          ]);
          foundResponse = true;
          break;
        }
      }
      
      // Default response if no match found
      if (!foundResponse) {
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            text: "Desculpe, não entendi. Poderia reformular sua pergunta?",
            sender: 'bot',
            timestamp: new Date(),
          },
        ]);
      }
    }, 800);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <Card title="Preview do Chatbot" className="mb-4">
        <p className="text-sm text-gray-600">Esta é uma visualização de como o chatbot aparecerá para seus visitantes.</p>
      </Card>

      <div className={`overflow-hidden border border-gray-200 rounded-lg shadow-lg transition-all duration-300 ${
        isFullScreen ? 'fixed inset-4 z-50 bg-white' : 'relative'
      }`}>
        {/* Chatbot Header */}
        <div 
          className="flex items-center justify-between p-4 border-b"
          style={{ backgroundColor: primaryColor, color: 'white' }}
        >
          <h3 className="font-medium">{name}</h3>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => setIsFullScreen(!isFullScreen)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              {isFullScreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        {/* Chat Messages */}
        <div className={`bg-gray-50 overflow-y-auto p-4 ${isFullScreen ? 'h-[calc(100%-8rem)]' : 'h-80'}`}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white border border-gray-200 text-gray-800'
                  }`}
                  style={{
                    backgroundColor: message.sender === 'user' ? primaryColor : 'white',
                  }}
                >
                  <p className="text-sm">{message.text}</p>
                  <p className="text-xs mt-1 opacity-70">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        
        {/* Input Field */}
        <div className="border-t border-gray-200 p-4 bg-white">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Digite sua mensagem..."
              className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button
              onClick={handleSendMessage}
              className="p-2 rounded-full text-white"
              style={{ backgroundColor: primaryColor }}
              disabled={!inputMessage.trim()}
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chatbot Bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
          style={{ backgroundColor: primaryColor }}
        >
          <MessageSquare className="h-6 w-6 text-white" />
        </button>
      )}
    </div>
  );
};

const Card: React.FC<{
  title?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ title, children, className = '' }) => {
  return (
    <div className={`bg-white p-4 border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {title && <h3 className="font-medium text-gray-900 mb-2">{title}</h3>}
      {children}
    </div>
  );
};

const MessageSquare: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
};

export default ChatbotPreview;