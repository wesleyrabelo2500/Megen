import React, { useState } from 'react';
import { Settings, Plus, Code, Save, Trash, RefreshCw } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ChatbotPreview from '../components/chatbot/ChatbotPreview';

// Demo responses for the chatbot
const defaultResponses = [
  { 
    id: '1', 
    trigger: 'greeting', 
    patterns: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite'], 
    response: 'Olá! Bem-vindo à Megen. Como posso ajudar você hoje?' 
  },
  { 
    id: '2', 
    trigger: 'services', 
    patterns: ['serviços', 'o que vocês fazem', 'como funciona'], 
    response: 'A Megen oferece soluções de atendimento automatizado, captação de leads e automação de mensagens para empresas de todos os portes.' 
  },
  { 
    id: '3', 
    trigger: 'pricing', 
    patterns: ['preço', 'planos', 'quanto custa', 'valores'], 
    response: 'Temos planos a partir de R$99/mês. Posso colocar você em contato com um consultor para mais detalhes?' 
  },
  { 
    id: '4', 
    trigger: 'contact', 
    patterns: ['contato', 'falar com humano', 'atendente', 'suporte'], 
    response: 'Claro! Por favor, deixe seu nome e email que entraremos em contato o mais breve possível.' 
  },
];

interface Response {
  id: string;
  trigger: string;
  patterns: string[];
  response: string;
}

const ChatbotPage: React.FC = () => {
  const [responses, setResponses] = useState<Response[]>(defaultResponses);
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null);
  const [chatbotName, setChatbotName] = useState('Assistente Megen');
  const [primaryColor, setPrimaryColor] = useState('#1E40AF');
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSelectResponse = (response: Response) => {
    setSelectedResponse(response);
    setIsEditing(true);
  };
  
  const handleNewResponse = () => {
    const newResponse = {
      id: Date.now().toString(),
      trigger: '',
      patterns: [''],
      response: '',
    };
    setSelectedResponse(newResponse);
    setIsEditing(true);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configuração do Chatbot</h1>
          <p className="text-gray-600 mt-1">Personalize seu assistente virtual para seus visitantes</p>
        </div>
        <Button variant="primary" icon={<Settings className="h-4 w-4" />}>
          Configurações Avançadas
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Chatbot Appearance */}
          <Card title="Aparência do Chatbot" className="transition-all duration-300">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Chatbot
                </label>
                <input
                  type="text"
                  value={chatbotName}
                  onChange={(e) => setChatbotName(e.target.value)}
                  className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor Principal
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-10 w-10 border-0 p-0 rounded-md cursor-pointer"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <Button variant="outline" icon={<RefreshCw className="h-4 w-4" />}>
                Restaurar Padrões
              </Button>
            </div>
          </Card>
          
          {/* Response Management */}
          <Card title="Respostas Automáticas" subtitle="Configure as respostas para perguntas comuns">
            <div className="flex justify-end mb-4">
              <Button 
                variant="primary" 
                size="sm" 
                icon={<Plus className="h-4 w-4" />}
                onClick={handleNewResponse}
              >
                Nova Resposta
              </Button>
            </div>
            
            <div className="border rounded-md divide-y divide-gray-200">
              {responses.map(response => (
                <div 
                  key={response.id} 
                  className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors duration-150 ${
                    selectedResponse?.id === response.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                  }`}
                  onClick={() => handleSelectResponse(response)}
                >
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{response.trigger}</h4>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{response.response}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="text-gray-400 hover:text-blue-600">
                        <Code className="h-4 w-4" />
                      </button>
                      <button className="text-gray-400 hover:text-red-600">
                        <Trash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-2">
                      {response.patterns.map((pattern, idx) => (
                        <span key={idx} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
          
          {/* Response Editor (conditionally rendered) */}
          {isEditing && selectedResponse && (
            <Card title="Editar Resposta" className="border-l-4 border-blue-600">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Gatilho
                  </label>
                  <input
                    type="text"
                    value={selectedResponse.trigger}
                    onChange={(e) => setSelectedResponse({...selectedResponse, trigger: e.target.value})}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Ex: greeting, pricing, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Padrões de Reconhecimento (separados por vírgula)
                  </label>
                  <input
                    type="text"
                    value={selectedResponse.patterns.join(', ')}
                    onChange={(e) => setSelectedResponse({
                      ...selectedResponse, 
                      patterns: e.target.value.split(',').map(p => p.trim()).filter(p => p !== '')
                    })}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="olá, oi, bom dia"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Resposta do Chatbot
                  </label>
                  <textarea
                    rows={4}
                    value={selectedResponse.response}
                    onChange={(e) => setSelectedResponse({...selectedResponse, response: e.target.value})}
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Digite a resposta que o chatbot enviará quando reconhecer este padrão"
                  />
                </div>
                
                <div className="flex justify-end space-x-3 pt-3">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="primary"
                    icon={<Save className="h-4 w-4" />}
                    onClick={() => {
                      if (selectedResponse.id && responses.some(r => r.id === selectedResponse.id)) {
                        setResponses(responses.map(r => 
                          r.id === selectedResponse.id ? selectedResponse : r
                        ));
                      } else {
                        setResponses([...responses, selectedResponse]);
                      }
                      setIsEditing(false);
                    }}
                  >
                    Salvar Resposta
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
        
        {/* Chatbot Preview */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <ChatbotPreview 
              name={chatbotName}
              primaryColor={primaryColor}
              responses={responses}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;