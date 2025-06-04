import React, { useState } from 'react';
import { PlusCircle, Calendar, Users, Send, Copy, Edit, Trash, Clock, BarChart } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

// Mock data for campaigns
const mockCampaigns = [
  { 
    id: 1, 
    name: 'Campanha de Boas-vindas', 
    status: 'active', 
    audience: 'Novos Leads', 
    sentCount: 256, 
    openRate: 68, 
    clickRate: 24,
    createdAt: '2025-04-10T14:22:00',
  },
  { 
    id: 2, 
    name: 'Promoção Maio', 
    status: 'scheduled', 
    audience: 'Todos os Leads', 
    sentCount: 0, 
    openRate: 0, 
    clickRate: 0,
    createdAt: '2025-04-28T10:15:00',
    scheduledFor: '2025-05-05T09:00:00',
  },
  { 
    id: 3, 
    name: 'Follow-up de Produtos', 
    status: 'draft', 
    audience: 'Leads Qualificados', 
    sentCount: 0, 
    openRate: 0, 
    clickRate: 0,
    createdAt: '2025-04-30T16:40:00',
  },
  { 
    id: 4, 
    name: 'Webinar: Novidades da Plataforma', 
    status: 'completed', 
    audience: 'Todos os Leads', 
    sentCount: 1024, 
    openRate: 72, 
    clickRate: 42,
    createdAt: '2025-04-15T08:30:00',
  },
];

const CampaignStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    scheduled: 'bg-blue-100 text-blue-800',
    draft: 'bg-gray-100 text-gray-800',
    completed: 'bg-purple-100 text-purple-800',
  };
  
  const labels = {
    active: 'Ativa',
    scheduled: 'Agendada',
    draft: 'Rascunho',
    completed: 'Concluída',
  };
  
  const statusColor = colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  const statusLabel = labels[status as keyof typeof labels] || status;
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
      {statusLabel}
    </span>
  );
};

const CampaignsPage: React.FC = () => {
  const [campaigns] = useState(mockCampaigns);
  const [selectedTab, setSelectedTab] = useState('all');
  
  const tabs = [
    { id: 'all', label: 'Todas', count: campaigns.length },
    { id: 'active', label: 'Ativas', count: campaigns.filter(c => c.status === 'active').length },
    { id: 'scheduled', label: 'Agendadas', count: campaigns.filter(c => c.status === 'scheduled').length },
    { id: 'draft', label: 'Rascunhos', count: campaigns.filter(c => c.status === 'draft').length },
  ];
  
  const filteredCampaigns = selectedTab === 'all' 
    ? campaigns 
    : campaigns.filter(campaign => campaign.status === selectedTab);
    
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campanhas</h1>
          <p className="text-gray-600 mt-1">Gerencie suas campanhas de mensagens</p>
        </div>
        <Button 
          variant="primary" 
          icon={<PlusCircle className="h-4 w-4" />}
        >
          Nova Campanha
        </Button>
      </div>
      
      {/* Campaign Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="transition-all duration-300 hover:shadow-md">
          <div className="flex items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <Send className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">1,280</h3>
              <p className="text-sm text-gray-500">Mensagens Enviadas</p>
            </div>
          </div>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <div className="flex items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">70%</h3>
              <p className="text-sm text-gray-500">Taxa de Abertura</p>
            </div>
          </div>
        </Card>
        
        <Card className="transition-all duration-300 hover:shadow-md">
          <div className="flex items-start">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600">
              <BarChart className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">35%</h3>
              <p className="text-sm text-gray-500">Taxa de Cliques</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                selectedTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
              <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                selectedTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </nav>
      </div>
      
      {/* Campaign Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCampaigns.map((campaign) => (
          <Card key={campaign.id} className="transition-all duration-300 hover:shadow-md">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">{campaign.name}</h3>
                <div className="flex flex-wrap gap-2 mb-2">
                  <CampaignStatusBadge status={campaign.status} />
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {campaign.audience}
                  </span>
                </div>
                
                <div className="mt-4 space-y-2">
                  {campaign.status === 'scheduled' && campaign.scheduledFor && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-1.5" />
                      Agendado para: {formatDate(campaign.scheduledFor)}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1.5" />
                    Criado em: {formatDate(campaign.createdAt)}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100">
                  <Copy className="h-4 w-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-red-600 rounded-md hover:bg-gray-100">
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            {(campaign.status === 'active' || campaign.status === 'completed') && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Enviados</p>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{campaign.sentCount}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Aberturas</p>
                    <p className="mt-1 text-lg font-semibold text-green-600">{campaign.openRate}%</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Cliques</p>
                    <p className="mt-1 text-lg font-semibold text-blue-600">{campaign.clickRate}%</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-200 text-right">
              {campaign.status === 'draft' && (
                <Button variant="primary" size="sm">Editar Campanha</Button>
              )}
              {campaign.status === 'scheduled' && (
                <Button variant="primary" size="sm">Ver Detalhes</Button>
              )}
              {campaign.status === 'active' && (
                <Button variant="outline" size="sm">Pausar Campanha</Button>
              )}
              {campaign.status === 'completed' && (
                <Button variant="outline" size="sm">Ver Relatório</Button>
              )}
            </div>
          </Card>
        ))}
        
        {/* New Campaign Card */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-blue-500 transition-colors cursor-pointer">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-3">
            <PlusCircle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Criar Nova Campanha</h3>
          <p className="text-sm text-gray-500 mb-4">Envie mensagens para seus leads de forma inteligente</p>
          <Button variant="primary" size="sm">Nova Campanha</Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignsPage;