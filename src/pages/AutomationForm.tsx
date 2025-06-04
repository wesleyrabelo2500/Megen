import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Save, ChevronRight, MessageSquare, HelpCircle, GitFork, Flag } from 'lucide-react';
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, DragStartEvent } from '@dnd-kit/core';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import ActionsPanel from '../components/automation/ActionsPanel';
import DropZone from '../components/automation/DropZone';
import AutomationBlock from '../components/automation/AutomationBlock';
import DraggableAction from '../components/automation/DraggableAction';
import EntryTrigger from '../components/automation/EntryTrigger';

interface Trigger {
  id: string;
  type: string;
}

interface LogicOperator {
  id: string;
  type: 'AND' | 'OR';
}

interface Connection {
  from: string;
  to: string;
  tipo: string;
}

interface AutomationBlock {
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
}

const AutomationForm: React.FC = () => {
  const { automationId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [name, setName] = useState('Nova Automação');
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [logicOperators, setLogicOperators] = useState<LogicOperator[]>([]);
  const [blocks, setBlocks] = useState<AutomationBlock[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [blocoOrigemTemporario, setBlocoOrigemTemporario] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const updateConnections = useCallback(() => {
    if (!svgRef.current || !canvasRef.current || !contentRef.current) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    
    connections.forEach((connection) => {
      const fromConnector = document.querySelector(`#block-${connection.from} .output-connector`);
      const toConnector = document.querySelector(`#block-${connection.to} .input-connector`);
      
      if (!fromConnector || !toConnector) return;

      const fromRect = fromConnector.getBoundingClientRect();
      const toRect = toConnector.getBoundingClientRect();
      
      const x1 = fromRect.left - canvasRect.left + fromRect.width / 2;
      const y1 = fromRect.top - canvasRect.top + fromRect.height / 2;
      const x2 = toRect.left - canvasRect.left + toRect.width / 2;
      const y2 = toRect.top - canvasRect.top + toRect.height / 2;

      const path = document.querySelector(`path[data-connection="${connection.from}-${connection.to}"]`);
      if (path) {
        const controlPoint1X = x1 + 80;
        const controlPoint1Y = y1;
        const controlPoint2X = x2 - 80;
        const controlPoint2Y = y2;
        
        path.setAttribute('d', `M ${x1} ${y1} C ${controlPoint1X} ${controlPoint1Y}, ${controlPoint2X} ${controlPoint2Y}, ${x2} ${y2}`);
      }
    });
  }, [connections]);

  useEffect(() => {
    window.addEventListener('resize', updateConnections);
    return () => window.removeEventListener('resize', updateConnections);
  }, [updateConnections]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target !== canvasRef.current) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - translate.x, y: e.clientY - translate.y });
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grabbing';
      canvasRef.current.style.userSelect = 'none';
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !contentRef.current) return;
    
    const newX = e.clientX - startPos.x;
    const newY = e.clientY - startPos.y;
    
    setTranslate({ x: newX, y: newY });
    contentRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    requestAnimationFrame(updateConnections);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (canvasRef.current) {
      canvasRef.current.style.cursor = 'grab';
      canvasRef.current.style.userSelect = 'auto';
    }
  };

  const handleConnectorClick = (blockId: string, type: 'input' | 'output') => {
    if (type === 'output') {
      setBlocoOrigemTemporario(blockId);
    } else if (type === 'input' && blocoOrigemTemporario) {
      if (blocoOrigemTemporario === blockId) {
        setBlocoOrigemTemporario(null);
        return;
      }

      const newConnection: Connection = {
        from: blocoOrigemTemporario,
        to: blockId,
        tipo: 'fluxo'
      };

      setConnections(prev => [...prev, newConnection]);
      setBlocoOrigemTemporario(null);
      requestAnimationFrame(updateConnections);
    }
  };

  const handleUpdateBlock = useCallback((id: string, updates: Partial<AutomationBlock>) => {
    setBlocks(blocks => blocks.map(block => 
      block.id === id ? { ...block, ...updates } : block
    ));
    requestAnimationFrame(updateConnections);
  }, []);

  const handleDeleteBlock = useCallback((id: string) => {
    setBlocks(blocks => blocks.filter(block => block.id !== id));
    setConnections(connections => connections.filter(
      conn => conn.from !== id && conn.to !== id
    ));
    requestAnimationFrame(updateConnections);
  }, []);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;

    if (!over || !triggers.some(t => t.type)) return;

    const dropZoneId = over.id as string;
    const [, blockId] = dropZoneId.split('-');
    const draggedActionType = active.data.current?.type;

    if (draggedActionType) {
      const newBlock: AutomationBlock = {
        id: Date.now().toString(),
        type: draggedActionType,
        content: '',
        ...(draggedActionType === 'question' && {
          options: {
            type: 'text',
            errorMessage: 'Por favor, forneça uma resposta válida',
          },
          responses: [''],
        }),
      };

      const index = blocks.findIndex(block => block.id === blockId);
      const newBlocks = [...blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      setBlocks(newBlocks);
      requestAnimationFrame(updateConnections);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, connection: Connection) => {
    e.preventDefault();
    if (window.confirm('Deseja excluir esta conexão?')) {
      setConnections(connections.filter(
        conn => !(conn.from === connection.from && conn.to === connection.to)
      ));
      requestAnimationFrame(updateConnections);
    }
  };

  const getAccountId = () => {
    const match = location.state?.from?.match?.(/\/conta\/([^/]+)/);
    return match ? match[1] : 'exitonetimoveis';
  };

  const handleBack = () => {
    const accountId = getAccountId();
    navigate(`/conta/${accountId}/automation`);
  };

  const handleSave = async (activate: boolean = false) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const accountId = getAccountId();
      navigate(`/conta/${accountId}/automation`);
    } catch (error) {
      console.error('Error saving automation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTriggersUpdate = (newTriggers: Trigger[], newOperators: LogicOperator[]) => {
    setTriggers(newTriggers);
    setLogicOperators(newOperators);
  };

  const hasValidTrigger = triggers.some(t => t.type);

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="min-h-screen bg-white dark:bg-[#242424]">
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-[#1B1B1B] border-b border-gray-200 dark:border-[#333333] z-50">
          <div className="h-16 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={handleBack}
                icon={<ArrowLeft className="h-4 w-4" />}
              >
                Voltar
              </Button>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="text-xl font-semibold text-gray-900 dark:text-white bg-transparent border-0 focus:ring-0 p-0"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={isLoading || !hasValidTrigger}
              >
                Salvar Rascunho
              </Button>
              <Button
                variant="primary"
                icon={<Save className="h-4 w-4" />}
                onClick={() => handleSave(true)}
                disabled={isLoading || !hasValidTrigger}
              >
                {isLoading ? 'Salvando...' : 'Salvar e Ativar'}
              </Button>
            </div>
          </div>
        </header>
        
        <div className="flex h-[calc(100vh-4rem)]">
          <main 
            ref={canvasRef}
            className="flex-1 pt-24 px-6 relative overflow-hidden dark:bg-[#242424]" 
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              paddingRight: '300px',
              maxWidth: 'calc(100vw - 64px)',
              userSelect: isDragging ? 'none' : 'auto'
            }}
          >
            <svg 
              ref={svgRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              <defs>
                <marker
                  id="arrowhead"
                  markerWidth="10"
                  markerHeight="7"
                  refX="9"
                  refY="3.5"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L10,3.5 L0,7 L2,3.5 z" fill="#4ADE80" />
                </marker>
              </defs>
              {connections.map((connection) => (
                <path
                  key={`${connection.from}-${connection.to}`}
                  data-connection={`${connection.from}-${connection.to}`}
                  stroke="#4ADE80"
                  strokeWidth="2"
                  fill="none"
                  markerEnd="url(#arrowhead)"
                  style={{ pointerEvents: 'auto' }}
                  onClick={(e) => handleContextMenu(e as any, connection)}
                />
              ))}
            </svg>

            <div 
              ref={contentRef}
              className="relative"
              style={{ 
                transform: `translate(${translate.x}px, ${translate.y}px)`,
                transition: isDragging ? 'none' : 'transform 0.1s ease-out'
              }}
            >
              <div className="flex space-x-32" style={{ zIndex: 2, position: 'relative' }}>
                <div>
                  <EntryTrigger
                    onTriggersUpdate={handleTriggersUpdate}
                    selectedTriggers={triggers}
                    logicOperators={logicOperators}
                  />
                  {hasValidTrigger && <DropZone id="dropzone-entry" />}
                </div>

                {blocks.map((block, index) => (
                  <div key={block.id} className="flex flex-col" id={`block-${block.id}`}>
                    {index > 0 && (
                      <DropZone id={`dropzone-${block.id}`} />
                    )}
                    
                    <AutomationBlock
                      {...block}
                      onUpdate={handleUpdateBlock}
                      onDelete={handleDeleteBlock}
                      onConnectorClick={handleConnectorClick}
                    />

                    <DropZone id={`dropzone-after-${block.id}`} />

                    {index < blocks.length - 1 && (
                      <div className="absolute right-[-1.5rem] top-1/2 transform -translate-y-1/2">
                        <ChevronRight className="h-5 w-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </main>

          <ActionsPanel
            isOpen={isActionsOpen && hasValidTrigger}
            onToggle={() => setIsActionsOpen(!isActionsOpen)}
          />
        </div>

        <DragOverlay>
          {activeId && hasValidTrigger && (
            <div className="opacity-75">
              <DraggableAction
                id={activeId}
                type={activeId}
                label="Ação"
                icon={<MessageSquare className="h-4 w-4" />}
              />
            </div>
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
};

export default AutomationForm;