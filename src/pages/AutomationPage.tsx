import React, { useState } from 'react';
import { Search, Plus, Edit, Copy, Trash, Power, AlertCircle } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { toast, Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

// Mock data for automations
const mockAutomations = [
  { 
    id: 1, 
    name: 'Boas-vindas Lead', 
    status: 'active', 
    interactions: 1245, 
    createdAt: '2025-04-15T10:00:00', 
    updatedAt: '2025-04-30T15:30:00', 
  },
  { 
    id: 2, 
    name: 'Qualificação Inicial', 
    status: 'active', 
    interactions: 856, 
    createdAt: '2025-04-20T14:30:00', 
    updatedAt: '2025-04-30T16:45:00', 
  },
  { 
    id: 3, 
    name: 'Follow-up Inativo', 
    status: 'inactive', 
    interactions: 324, 
    createdAt: '2025-04-25T09:15:00', 
    updatedAt: '2025-04-29T11:20:00', 
  },
];

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  automationName: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onConfirm, automationName }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirmar Exclusão">
      <div className="mt-2">
        <p className="text-sm text-gray-500">
          Tem certeza que deseja excluir a automação "{automationName}"? Esta ação não pode ser desfeita.
        </p>
      </div>
      <div className="mt-6 flex justify-end space-x-3">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Excluir
        </Button>
      </div>
    </Modal>
  );
};

const AutomationRow: React.FC<{
  automation: typeof mockAutomations[0];
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
  onDuplicate: (id: number) => void;
  onEdit: (id: number) => void;
}> = ({ automation, onDelete, onToggleStatus, onDuplicate, onEdit }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center">
        <div className="text-sm font-medium text-gray-900">{automation.name}</div>
      </div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        automation.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
      }`}>
        {automation.status === 'active' ? 'Ativo' : 'Inativo'}
      </span>
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {automation.interactions.toLocaleString()}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(automation.createdAt).toLocaleDateString('pt-BR')}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {new Date(automation.updatedAt).toLocaleDateString('pt-BR')}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div className="flex justify-end space-x-2">
        <button 
          className="text-gray-400 hover:text-blue-600"
          onClick={() => onEdit(automation.id)}
        >
          <Edit className="h-4 w-4" />
        </button>
        <button 
          className="text-gray-400 hover:text-blue-600"
          onClick={() => onDuplicate(automation.id)}
        >
          <Copy className="h-4 w-4" />
        </button>
        <button 
          className="text-gray-400 hover:text-green-600"
          onClick={() => onToggleStatus(automation.id)}
        >
          <Power className="h-4 w-4" />
        </button>
        <button 
          className="text-gray-400 hover:text-red-600"
          onClick={() => onDelete(automation.id)}
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </td>
  </tr>
);

const AutomationPage: React.FC = () => {
  const navigate = useNavigate();
  const [automations, setAutomations] = useState(mockAutomations);
  const [searchAutomation, setSearchAutomation] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; automationId: number | null; automationName: string }>({
    isOpen: false,
    automationId: null,
    automationName: '',
  });

  const filteredAutomations = automations.filter(automation =>
    automation.name.toLowerCase().includes(searchAutomation.toLowerCase())
  );

  const handleDelete = (id: number) => {
    const automation = automations.find(a => a.id === id);
    if (automation) {
      setDeleteModal({
        isOpen: true,
        automationId: id,
        automationName: automation.name,
      });
    }
  };

  const confirmDelete = () => {
    if (deleteModal.automationId) {
      setAutomations(automations.filter(a => a.id !== deleteModal.automationId));
      toast.success('Automação excluída com sucesso');
      setDeleteModal({ isOpen: false, automationId: null, automationName: '' });
    }
  };

  const handleToggleStatus = (id: number) => {
    setAutomations(automations.map(automation => {
      if (automation.id === id) {
        const newStatus = automation.status === 'active' ? 'inactive' : 'active';
        toast.success(`Automação ${newStatus === 'active' ? 'ativada' : 'desativada'} com sucesso`);
        return { ...automation, status: newStatus };
      }
      return automation;
    }));
  };

  const handleDuplicate = (id: number) => {
    const originalAutomation = automations.find(a => a.id === id);
    if (originalAutomation) {
      const newAutomation = {
        ...originalAutomation,
        id: Math.max(...automations.map(a => a.id)) + 1,
        name: `Cópia de ${originalAutomation.name}`,
        status: 'inactive',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAutomations([...automations, newAutomation]);
      toast.success('Automação duplicada com sucesso');
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/automations/${id}/editar`);
  };

  const handleNewAutomation = () => {
    navigate('/automations/novo');
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, automationId: null, automationName: '' })}
        onConfirm={confirmDelete}
        automationName={deleteModal.automationName}
      />

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestão de Automações</h1>
          <p className="text-gray-600 mt-1">Gerencie seus fluxos automatizados de mensagens</p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus className="h-4 w-4" />}
          onClick={handleNewAutomation}
        >
          Nova Automação
        </Button>
      </div>

      <Card>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="Buscar automações"
              value={searchAutomation}
              onChange={(e) => setSearchAutomation(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nome da Automação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Interações
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Criação
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Última Alteração
                </th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Ações</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAutomations.map(automation => (
                <AutomationRow 
                  key={automation.id} 
                  automation={automation}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                  onDuplicate={handleDuplicate}
                  onEdit={handleEdit}
                />
              ))}
            </tbody>
          </table>

          {filteredAutomations.length === 0 && (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhuma automação encontrada</h3>
              <p className="mt-1 text-sm text-gray-500">
                Comece criando uma nova automação para sua conta.
              </p>
              <div className="mt-6">
                <Button 
                  variant="primary" 
                  size="sm" 
                  icon={<Plus className="h-4 w-4" />}
                  onClick={handleNewAutomation}
                >
                  Nova Automação
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AutomationPage;