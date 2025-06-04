import React from 'react';
import { ArrowDownToLine, ChevronDown, Plus, Trash2 } from 'lucide-react';
import * as Select from '@radix-ui/react-select';
import Button from '../common/Button';

interface Trigger {
  id: string;
  type: string;
}

interface LogicOperator {
  id: string;
  type: 'AND' | 'OR';
}

interface EntryTriggerProps {
  onTriggersUpdate: (triggers: Trigger[], operators: LogicOperator[]) => void;
  selectedTriggers?: Trigger[];
  logicOperators?: LogicOperator[];
}

const triggers = [
  { id: 'segment', label: 'Entrou no Segmento', icon: '🎯' },
  { id: 'tag', label: 'Recebeu a Tag', icon: '🏷️' },
  { id: 'form', label: 'Preencheu o Formulário', icon: '📝' },
  { id: 'manual', label: 'Adicionado Manualmente', icon: '👤' },
  { id: 'link', label: 'Clicou em um Link', icon: '🔗' },
];

const EntryTrigger: React.FC<EntryTriggerProps> = ({ 
  onTriggersUpdate, 
  selectedTriggers = [], 
  logicOperators = []
}) => {
  const handleAddTrigger = () => {
    const newTrigger: Trigger = {
      id: Date.now().toString(),
      type: '',
    };

    const newOperator: LogicOperator = {
      id: `op-${Date.now()}`,
      type: 'OR'
    };

    const updatedTriggers = [...selectedTriggers, newTrigger];
    const updatedOperators = selectedTriggers.length > 0 
      ? [...logicOperators, newOperator]
      : logicOperators;

    onTriggersUpdate(updatedTriggers, updatedOperators);
  };

  const handleTriggerChange = (triggerId: string, newType: string) => {
    const updatedTriggers = selectedTriggers.map(trigger => 
      trigger.id === triggerId ? { ...trigger, type: newType } : trigger
    );
    onTriggersUpdate(updatedTriggers, logicOperators);
  };

  const handleRemoveTrigger = (index: number) => {
    const updatedTriggers = selectedTriggers.filter((_, i) => i !== index);
    const updatedOperators = logicOperators.filter((_, i) => i !== index - 1);
    onTriggersUpdate(updatedTriggers, updatedOperators);
  };

  const handleLogicChange = (index: number, newType: 'AND' | 'OR') => {
    const updatedOperators = logicOperators.map((op, i) => 
      i === index ? { ...op, type: newType } : op
    );
    onTriggersUpdate(selectedTriggers, updatedOperators);
  };

  const getUnusedTriggers = (currentTriggerId: string) => {
    const usedTypes = selectedTriggers
      .filter(t => t.id !== currentTriggerId)
      .map(t => t.type);
    return triggers.filter(t => !usedTypes.includes(t.id));
  };

  return (
    <div className="w-80 space-y-4">
      {/* Header */}
      <div className="bg-megen-green/10 rounded-t-lg border-2 border-megen-green p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-megen-green/20 flex items-center justify-center">
            <ArrowDownToLine className="w-4 h-4 text-megen-blue" />
          </div>
          <h3 className="text-sm font-medium text-megen-blue">Gatilhos de Entrada</h3>
        </div>
      </div>

      {/* Triggers Flow */}
      <div className="space-y-2 relative">
        {selectedTriggers.map((trigger, index) => (
          <React.Fragment key={trigger.id}>
            {/* Trigger Block */}
            <div className="bg-white rounded-lg border-2 border-megen-green/30 p-4 relative">
              <div className="absolute -right-2 -top-2">
                {index > 0 && (
                  <button
                    onClick={() => handleRemoveTrigger(index)}
                    className="p-1.5 bg-white rounded-full border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 transition-colors shadow-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <Select.Root 
                value={trigger.type} 
                onValueChange={(value) => handleTriggerChange(trigger.id, value)}
              >
                <Select.Trigger
                  className={`
                    w-full px-4 py-2.5 rounded-md border text-left
                    flex items-center justify-between
                    ${trigger.type ? 'bg-white' : 'bg-megen-green/5'}
                    hover:bg-megen-green/10 transition-colors
                    ${index === 0 ? 'border-megen-green' : 'border-megen-green/30'}
                  `}
                >
                  <Select.Value placeholder="Selecione o gatilho..." />
                  <Select.Icon>
                    <ChevronDown className="h-4 w-4 text-megen-blue/60" />
                  </Select.Icon>
                </Select.Trigger>

                <Select.Portal>
                  <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
                    <Select.Viewport className="p-1">
                      {getUnusedTriggers(trigger.id).map((availableTrigger) => (
                        <Select.Item
                          key={availableTrigger.id}
                          value={availableTrigger.id}
                          className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-megen-green/10 cursor-pointer rounded-md outline-none"
                        >
                          <span className="flex-shrink-0">{availableTrigger.icon}</span>
                          <Select.ItemText>{availableTrigger.label}</Select.ItemText>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>

            {/* Logic Operator */}
            {index < selectedTriggers.length - 1 && (
              <div className="py-4 flex items-center justify-center relative">
                <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-megen-green/20" />
                <div className="bg-white px-4 py-2 rounded-lg border border-megen-green/30 shadow-sm z-10">
                  <div className="text-sm text-megen-blue/60 mb-1 text-center">
                    Continuar se:
                  </div>
                  <Select.Root
                    value={logicOperators[index]?.type}
                    onValueChange={(value) => handleLogicChange(index, value as 'AND' | 'OR')}
                  >
                    <Select.Trigger className="min-w-[120px] px-4 py-1.5 text-sm font-medium text-megen-blue bg-white rounded-md border border-megen-green hover:bg-megen-green/5">
                      <Select.Value />
                    </Select.Trigger>

                    <Select.Portal>
                      <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200">
                        <Select.Viewport>
                          <Select.Item value="AND" className="px-3 py-2 text-sm hover:bg-megen-green/10 cursor-pointer">
                            <Select.ItemText>E (todas as condições)</Select.ItemText>
                          </Select.Item>
                          <Select.Item value="OR" className="px-3 py-2 text-sm hover:bg-megen-green/10 cursor-pointer">
                            <Select.ItemText>OU (qualquer condição)</Select.ItemText>
                          </Select.Item>
                        </Select.Viewport>
                      </Select.Content>
                    </Select.Portal>
                  </Select.Root>
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Add Trigger Button */}
      {selectedTriggers.length < triggers.length && (
        <div className="mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleAddTrigger}
            icon={<Plus className="h-4 w-4" />}
            fullWidth
            className="border-megen-green text-megen-blue hover:bg-megen-green/10"
          >
            {selectedTriggers.length === 0 ? 'Adicionar primeiro gatilho' : 'Adicionar novo gatilho'}
          </Button>
        </div>
      )}

      {/* Empty State */}
      {selectedTriggers.length === 0 && (
        <p className="text-sm text-megen-blue/60 text-center mt-2">
          Adicione um gatilho para começar a construir seu fluxo de automação
        </p>
      )}
    </div>
  );
};

export default EntryTrigger;