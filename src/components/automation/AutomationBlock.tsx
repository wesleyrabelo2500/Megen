import React, { useRef, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Select from '@radix-ui/react-select';

interface AutomationBlockProps {
  id: string;
  type: 'input' | 'question' | 'response';
  content: string;
  options?: {
    type: 'text' | 'number' | 'range';
    errorMessage?: string;
    min?: number;
    max?: number;
  };
  responses?: string[];
  onUpdate: (id: string, updates: any) => void;
  onDelete: (id: string) => void;
  onConnectorClick: (blockId: string, type: 'input' | 'output') => void;
}

const AutomationBlock: React.FC<AutomationBlockProps> = ({
  id,
  type,
  content,
  options,
  responses,
  onUpdate,
  onDelete,
  onConnectorClick,
}) => {
  const blockRef = useRef<HTMLDivElement>(null);

  const handleContentChange = (value: string) => {
    onUpdate(id, { content: value });
  };

  const handleOptionsChange = (updates: any) => {
    onUpdate(id, { options: { ...options, ...updates } });
  };

  return (
    <div 
      ref={blockRef} 
      id={`block-${id}`}
      className="w-80 bg-white rounded-lg border border-gray-200 shadow-sm p-4 relative"
      style={{ zIndex: 2, position: 'relative' }}
    >
      {/* Input Connector */}
      <div 
        className="input-connector absolute -left-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 cursor-pointer hover:bg-blue-600 transition-colors shadow-md"
        onClick={() => onConnectorClick(id, 'input')}
      />

      {/* Output Connector */}
      <div 
        className="output-connector absolute -right-3 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-full bg-green-500 cursor-pointer hover:bg-green-600 transition-colors shadow-md"
        onClick={() => onConnectorClick(id, 'output')}
      />

      <div className="absolute right-2 top-2">
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <button className="p-1 hover:bg-gray-100 rounded-md">
              <MoreVertical className="h-4 w-4 text-gray-400" />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content className="bg-white rounded-lg shadow-lg py-1 w-48">
              <DropdownMenu.Item className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                Duplicar Bloco
              </DropdownMenu.Item>
              <DropdownMenu.Item 
                className="px-3 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                onClick={() => onDelete(id)}
              >
                Excluir Bloco
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>

      <h3 className="text-sm font-medium text-gray-900 mb-4">
        {type === 'input' && 'Mensagem Inicial'}
        {type === 'question' && 'Configurar Pergunta'}
        {type === 'response' && 'Resposta Condicional'}
      </h3>

      <div className="space-y-4">
        {type === 'input' && (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Digite a mensagem inicial..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        )}

        {type === 'question' && (
          <>
            <div className="pb-4 border-b border-gray-200">
              <textarea
                value={content}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder="Digite a pergunta..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div className="pb-4 border-b border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de Resposta
              </label>
              <Select.Root
                value={options?.type}
                onValueChange={(value) => handleOptionsChange({ type: value })}
              >
                <Select.Trigger className="w-full rounded-md border border-gray-300 px-3 py-2 text-left shadow-sm focus:border-blue-500 focus:ring-blue-500">
                  <Select.Value />
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content className="bg-white rounded-md shadow-lg">
                    <Select.Viewport>
                      <Select.Item value="text" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                        <Select.ItemText>Texto</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="number" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                        <Select.ItemText>Número</Select.ItemText>
                      </Select.Item>
                      <Select.Item value="range" className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer">
                        <Select.ItemText>Intervalo</Select.ItemText>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {options?.type === 'range' && (
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Mínimo
                  </label>
                  <input
                    type="number"
                    value={options?.min}
                    onChange={(e) => handleOptionsChange({ min: parseInt(e.target.value) })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Valor Máximo
                  </label>
                  <input
                    type="number"
                    value={options?.max}
                    onChange={(e) => handleOptionsChange({ max: parseInt(e.target.value) })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensagem de Erro
              </label>
              <input
                type="text"
                value={options?.errorMessage}
                onChange={(e) => handleOptionsChange({ errorMessage: e.target.value })}
                placeholder="Mensagem quando a resposta for inválida"
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}

        {type === 'response' && (
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="Digite a resposta..."
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        )}
      </div>
    </div>
  );
};

export default React.memo(AutomationBlock);