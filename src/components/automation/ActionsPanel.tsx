import React from 'react';
import { MessageSquare, HelpCircle, GitFork, Flag } from 'lucide-react';
import DraggableAction from './DraggableAction';

const availableActions = [
  {
    id: 'send_message',
    type: 'input',
    label: 'Enviar Mensagem',
    icon: <MessageSquare className="w-4 h-4" />,
  },
  {
    id: 'ask_question',
    type: 'question',
    label: 'Fazer Pergunta',
    icon: <HelpCircle className="w-4 h-4" />,
  },
  {
    id: 'conditional',
    type: 'response',
    label: 'Resposta Condicional',
    icon: <GitFork className="w-4 h-4" />,
  },
  {
    id: 'end_flow',
    type: 'end',
    label: 'Finalizar Fluxo',
    icon: <Flag className="w-4 h-4" />,
  },
];

interface ActionsPanelProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ActionsPanel: React.FC<ActionsPanelProps> = ({ isOpen, onToggle }) => {
  return (
    <div className={`
      fixed right-0 top-16 h-full w-64 bg-white border-l border-gray-200 
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0 shadow-lg' : 'translate-x-full'}
    `}>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Ações Disponíveis</h3>
        <div className="space-y-3">
          {availableActions.map((action) => (
            <DraggableAction
              key={action.id}
              id={action.id}
              type={action.type}
              label={action.label}
              icon={action.icon}
            />
          ))}
        </div>
      </div>
      <button
        onClick={onToggle}
        className={`
          absolute left-0 top-4 transform -translate-x-full
          bg-megen-green text-megen-blue border border-megen-green rounded-l-md p-2
          transition-all duration-200 ease-in-out
          hover:bg-megen-green/90 hover:shadow-md hover:scale-105
          ${isOpen ? 'shadow-md' : ''}
        `}
      >
        <MessageSquare className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ActionsPanel;