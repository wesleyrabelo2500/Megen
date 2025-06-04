import React from 'react';
import { Users, MessageSquare, BarChart, Workflow } from 'lucide-react';
import Card from '../components/common/Card';
import { useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Mock data for accounts
const mockAccounts = {
  'exitonetimoveis': {
    name: 'ExitoNetImoveis',
    stats: {
      totalLeads: 1284,
      activeCampaigns: 3,
      responseRate: 85,
      activeAutomations: 2
    }
  },
  'banco-itau': {
    name: 'Banco Itaú',
    stats: {
      totalLeads: 856,
      activeCampaigns: 2,
      responseRate: 78,
      activeAutomations: 1
    }
  }
};

const Dashboard: React.FC = () => {
  const { accountId } = useParams();
  const { user } = useAuth();
  const accountData = mockAccounts[accountId as keyof typeof mockAccounts];

  if (!accountData) {
    return <div>Conta não encontrada</div>;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Olá, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-1">
          Dashboard da conta {accountData.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {accountData.stats.totalLeads.toLocaleString()}
              </h3>
              <p className="text-sm text-gray-500">Total de Leads</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {accountData.stats.activeCampaigns}
              </h3>
              <p className="text-sm text-gray-500">Campanhas Ativas</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {accountData.stats.responseRate}%
              </h3>
              <p className="text-sm text-gray-500">Taxa de Resposta</p>
            </div>
          </div>
        </Card>
        
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Workflow className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                {accountData.stats.activeAutomations}
              </h3>
              <p className="text-sm text-gray-500">Automações Ativas</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Future space for graphs and additional metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Gráfico de Leads (Em breve)
          </div>
        </Card>
        <Card>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Métricas de Campanhas (Em breve)
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;