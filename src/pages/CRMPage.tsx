import React, { useState } from 'react';
import { Phone, Eye, Plus, Building2, Clock, User, X } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import Button from '../components/common/Button';
import * as Select from '@radix-ui/react-select';
import * as Dialog from '@radix-ui/react-dialog';
import { toast, Toaster } from 'react-hot-toast';

interface Lead {
  id: string;
  nome: string;
  empresa: string;
  valor: number;
  telefone: string;
  origem: string;
  responsavel: string;
  ultimaAtualizacao: string;
  stage: string;
  produto?: string;
}

const mockLeads: Lead[] = [
  {
    id: '1',
    nome: 'Carlos Silva',
    empresa: 'ABC Transportes',
    valor: 3000,
    telefone: '(11) 98765-4321',
    origem: 'WhatsApp',
    responsavel: 'Ana',
    ultimaAtualizacao: '2025-05-14T10:00:00Z',
    stage: 'novo',
    produto: 'Serviço A'
  },
  {
    id: '2',
    nome: 'Marina Santos',
    empresa: 'XYZ Logística',
    valor: 5000,
    telefone: '(11) 97654-3210',
    origem: 'Site',
    responsavel: 'Pedro',
    ultimaAtualizacao: '2025-05-13T15:30:00Z',
    stage: 'contato',
    produto: 'Serviço B'
  },
  {
    id: '3',
    nome: 'Lucas Oliveira',
    empresa: 'FastCargo LTDA',
    valor: 8000,
    telefone: '(11) 96543-2109',
    origem: 'Indicação',
    responsavel: 'João',
    ultimaAtualizacao: '2025-05-12T09:45:00Z',
    stage: 'qualificado',
    produto: 'Serviço A'
  },
  {
    id: '4',
    nome: 'Roberto Almeida',
    empresa: 'Mega Transportes',
    valor: 12000,
    telefone: '(11) 95432-1098',
    origem: 'WhatsApp',
    responsavel: 'Ana',
    ultimaAtualizacao: '2025-05-11T14:20:00Z',
    stage: 'proposta',
    produto: 'Serviço B'
  },
  {
    id: '5',
    nome: 'Juliana Costa',
    empresa: 'Express Cargo',
    valor: 15000,
    telefone: '(11) 94321-0987',
    origem: 'Site',
    responsavel: 'Pedro',
    ultimaAtualizacao: '2025-05-10T11:15:00Z',
    stage: 'fechamento',
    produto: 'Serviço A'
  }
];

const stages = [
  { id: 'novo', name: 'Novo' },
  { id: 'contato', name: 'Contato' },
  { id: 'qualificado', name: 'Qualificado' },
  { id: 'proposta', name: 'Proposta' },
  { id: 'fechamento', name: 'Fechamento' }
];

const origens = ['Todos', 'WhatsApp', 'Site', 'Indicação'];
const produtos = ['Todos', 'Serviço A', 'Serviço B'];
const responsaveis = ['Ana', 'Pedro', 'João'];

interface NewLeadFormProps {
  onClose: () => void;
  onSave: (lead: Omit<Lead, 'id' | 'ultimaAtualizacao'>) => void;
}

const NewLeadForm: React.FC<NewLeadFormProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nome: '',
    empresa: '',
    telefone: '',
    responsavel: '',
    origem: 'WhatsApp',
    valor: '',
    stage: 'novo',
    produto: 'Serviço A'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório';
    }
    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório';
    }
    if (!formData.empresa.trim()) {
      newErrors.empresa = 'Empresa é obrigatória';
    }
    if (!formData.responsavel) {
      newErrors.responsavel = 'Responsável é obrigatório';
    }
    if (!formData.valor) {
      newErrors.valor = 'Valor é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    onSave({
      ...formData,
      valor: parseFloat(formData.valor)
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nome
        </label>
        <input
          type="text"
          value={formData.nome}
          onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
          className={`block w-full rounded-md border ${
            errors.nome ? 'border-red-300' : 'border-gray-300'
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        />
        {errors.nome && (
          <p className="mt-1 text-sm text-red-600">{errors.nome}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Empresa
        </label>
        <input
          type="text"
          value={formData.empresa}
          onChange={(e) => setFormData({ ...formData, empresa: e.target.value })}
          className={`block w-full rounded-md border ${
            errors.empresa ? 'border-red-300' : 'border-gray-300'
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
        />
        {errors.empresa && (
          <p className="mt-1 text-sm text-red-600">{errors.empresa}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Telefone
        </label>
        <input
          type="tel"
          value={formData.telefone}
          onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
          className={`block w-full rounded-md border ${
            errors.telefone ? 'border-red-300' : 'border-gray-300'
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
          placeholder="(00) 00000-0000"
        />
        {errors.telefone && (
          <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Responsável
        </label>
        <Select.Root 
          value={formData.responsavel}
          onValueChange={(value) => setFormData({ ...formData, responsavel: value })}
        >
          <Select.Trigger className={`inline-flex w-full items-center justify-between rounded-md border ${
            errors.responsavel ? 'border-red-300' : 'border-gray-300'
          } px-3 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}>
            <Select.Value placeholder="Selecione um responsável" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200">
              <Select.Viewport>
                {responsaveis.map(resp => (
                  <Select.Item
                    key={resp}
                    value={resp}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer outline-none focus:bg-gray-100"
                  >
                    <Select.ItemText>{resp}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
        {errors.responsavel && (
          <p className="mt-1 text-sm text-red-600">{errors.responsavel}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Origem
        </label>
        <Select.Root 
          value={formData.origem}
          onValueChange={(value) => setFormData({ ...formData, origem: value })}
        >
          <Select.Trigger className="inline-flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <Select.Value placeholder="Selecione a origem" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200">
              <Select.Viewport>
                {origens.slice(1).map(origem => (
                  <Select.Item
                    key={origem}
                    value={origem}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer outline-none focus:bg-gray-100"
                  >
                    <Select.ItemText>{origem}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Valor (R$)
        </label>
        <input
          type="number"
          value={formData.valor}
          onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
          className={`block w-full rounded-md border ${
            errors.valor ? 'border-red-300' : 'border-gray-300'
          } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2`}
          min="0"
          step="0.01"
        />
        {errors.valor && (
          <p className="mt-1 text-sm text-red-600">{errors.valor}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Produto
        </label>
        <Select.Root 
          value={formData.produto}
          onValueChange={(value) => setFormData({ ...formData, produto: value })}
        >
          <Select.Trigger className="inline-flex w-full items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
            <Select.Value placeholder="Selecione o produto" />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200">
              <Select.Viewport>
                {produtos.slice(1).map(produto => (
                  <Select.Item
                    key={produto}
                    value={produto}
                    className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer outline-none focus:bg-gray-100"
                  >
                    <Select.ItemText>{produto}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit" variant="primary">
          Salvar Lead
        </Button>
      </div>
    </form>
  );
};

const LeadCard: React.FC<{ lead: Lead }> = ({ lead }) => (
  <div
    draggable
    onDragStart={(e) => {
      e.dataTransfer.setData('leadId', lead.id);
      e.currentTarget.classList.add('opacity-50');
      document.body.style.cursor = 'grabbing';
    }}
    onDragEnd={(e) => {
      e.currentTarget.classList.remove('opacity-50');
      document.body.style.cursor = '';
    }}
    className="pipeline-card bg-white p-4 rounded-lg shadow-sm border border-gray-200 
      hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing"
  >
    <div className="flex justify-between items-start mb-2">
      <div>
        <h4 className="font-medium text-gray-900">{lead.nome}</h4>
        <div className="flex items-center text-sm text-gray-500 mt-1">
          <Building2 className="h-3 w-3 mr-1" />
          {lead.empresa}
        </div>
      </div>
      <div className="text-right">
        <div className="font-medium text-green-600">
          R$ {lead.valor.toLocaleString()}
        </div>
        <button 
          className="text-gray-400 hover:text-gray-600 transition-colors mt-1"
          title="Ver detalhes"
        >
          <Eye className="h-4 w-4" />
        </button>
      </div>
    </div>
    
    <div className="space-y-2">
      <div className="flex items-center text-sm text-gray-500">
        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
        {lead.telefone}
      </div>
      
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <User className="h-3 w-3 text-gray-400" />
          <span className="text-gray-600">{lead.responsavel}</span>
        </div>
        <span className={`
          px-2 py-0.5 rounded-full text-xs font-medium
          ${lead.origem === 'WhatsApp' 
            ? 'bg-green-100 text-green-800' 
            : lead.origem === 'Site'
            ? 'bg-blue-100 text-blue-800'
            : 'bg-purple-100 text-purple-800'
          }
        `}>
          {lead.origem}
        </span>
      </div>

      <div className="flex items-center text-xs text-gray-400 mt-2">
        <Clock className="h-3 w-3 mr-1" />
        {formatDistanceToNow(new Date(lead.ultimaAtualizacao), {
          addSuffix: true,
          locale: ptBR
        })}
      </div>
    </div>
  </div>
);

const CRMPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [origemFiltro, setOrigemFiltro] = useState('Todos');
  const [produtoFiltro, setProdutoFiltro] = useState('Todos');
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);

  const moverLeadParaEtapa = (leadId: string, novaEtapa: string) => {
    setLeads(prev => prev.map(lead => {
      if (lead.id === leadId) {
        const updatedLead = { 
          ...lead, 
          stage: novaEtapa,
          ultimaAtualizacao: new Date().toISOString()
        };
        localStorage.setItem(`lead_${leadId}`, JSON.stringify(updatedLead));
        toast.success('Lead atualizado com sucesso');
        return updatedLead;
      }
      return lead;
    }));
  };

  const handleSaveNewLead = (leadData: Omit<Lead, 'id' | 'ultimaAtualizacao'>) => {
    const newLead: Lead = {
      ...leadData,
      id: Date.now().toString(),
      ultimaAtualizacao: new Date().toISOString()
    };
    
    setLeads(prev => [...prev, newLead]);
    localStorage.setItem(`lead_${newLead.id}`, JSON.stringify(newLead));
    toast.success('Lead criado com sucesso');
  };

  const filteredLeads = leads.filter(lead => {
    const matchesOrigem = origemFiltro === 'Todos' || lead.origem === origemFiltro;
    const matchesProduto = produtoFiltro === 'Todos' || lead.produto === produtoFiltro;
    return matchesOrigem && matchesProduto;
  });

  const SelectFilter: React.FC<{
    value: string;
    onChange: (value: string) => void;
    options: string[];
    placeholder: string;
  }> = ({ value, onChange, options, placeholder }) => (
    <Select.Root value={value} onValueChange={onChange}>
      <Select.Trigger className="inline-flex items-center justify-between rounded-md border border-gray-300 px-3 py-2 text-sm bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[160px]">
        <Select.Value placeholder={placeholder} />
      </Select.Trigger>
      <Select.Portal>
        <Select.Content className="bg-white rounded-md shadow-lg border border-gray-200">
          <Select.Viewport>
            {options.map(option => (
              <Select.Item
                key={option}
                value={option}
                className="px-3 py-2 text-sm hover:bg-gray-100 cursor-pointer outline-none focus:bg-gray-100"
              >
                <Select.ItemText>{option}</Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );

  return (
    <div className="h-full flex flex-col">
      <Toaster position="top-right" />
      
      <Dialog.Root open={isNewLeadModalOpen} onOpenChange={setIsNewLeadModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <Dialog.Title className="text-lg font-medium text-gray-900">
                Novo Lead
              </Dialog.Title>
              <Dialog.Close className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </Dialog.Close>
            </div>
            <NewLeadForm
              onClose={() => setIsNewLeadModalOpen(false)}
              onSave={handleSaveNewLead}
            />
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pipeline de Vendas</h1>
          <p className="text-gray-600 mt-1">Gerencie seus leads e oportunidades</p>
        </div>
        <Button 
          variant="primary" 
          icon={<Plus className="h-4 w-4" />}
          onClick={() => setIsNewLeadModalOpen(true)}
        >
          Novo Lead
        </Button>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <SelectFilter
          value={origemFiltro}
          onChange={setOrigemFiltro}
          options={origens}
          placeholder="Filtrar por origem"
        />
        <SelectFilter
          value={produtoFiltro}
          onChange={setProdutoFiltro}
          options={produtos}
          placeholder="Filtrar por produto"
        />
      </div>

      <div 
        className="flex-1 overflow-x-auto pb-6 hide-scrollbar"
        style={{
          scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch',
          scrollBehavior: 'smooth',
        }}
      >
        <div className="inline-flex gap-6 min-w-max px-2">
          {stages.map(stage => (
            <div
              key={stage.id}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('bg-megen-green/10');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('bg-megen-green/10');
              }}
              onDrop={(e) => {
                e.preventDefault();
                const leadId = e.dataTransfer.getData('leadId');
                moverLeadParaEtapa(leadId, stage.id);
                e.currentTarget.classList.remove('bg-megen-green/10');
              }}
              className="pipeline-stage bg-gray-50 rounded-lg p-4 min-w-[280px] w-[280px] flex-shrink-0 transition-colors duration-200"
              style={{ scrollSnapAlign: 'start' }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium text-gray-900">{stage.name}</h3>
                <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
                  {filteredLeads.filter(lead => lead.stage === stage.id).length}
                </span>
              </div>

              <div className="space-y-3">
                {filteredLeads
                  .filter(lead => lead.stage === stage.id)
                  .map(lead => (
                    <LeadCard key={lead.id} lead={lead} />
                  ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default CRMPage;