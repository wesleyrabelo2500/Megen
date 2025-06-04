import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MessageSquare } from 'lucide-react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import Logo from '../components/common/Logo';

// Mock data for accounts
const mockAccounts = [
  {
    id: 'exitonetimoveis',
    name: 'ExitoNetImoveis',
    leads: 1284,
    activeCampaigns: 3,
    status: 'active',
    lastActivity: '2025-04-30T14:22:00',
  },
  {
    id: 'banco-itau',
    name: 'Banco Itaú',
    leads: 856,
    activeCampaigns: 2,
    status: 'active',
    lastActivity: '2025-04-30T13:15:00',
  },
];

const SelectAccount: React.FC = () => {
  const navigate = useNavigate();

  const handleSelectAccount = (accountId: string) => {
    navigate(`/conta/${accountId}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Logo className="h-8 w-auto" />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Selecione uma Conta</h1>
          <p className="text-gray-600 mt-1">Escolha a conta que deseja gerenciar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockAccounts.map(account => (
            <Card key={account.id} className="transition-all duration-300 hover:shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{account.name}</h3>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {account.leads} leads
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      {account.activeCampaigns} campanhas ativas
                    </div>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  account.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {account.status === 'active' ? 'Ativo' : 'Inativo'}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Button 
                  variant="primary" 
                  size="sm" 
                  fullWidth
                  onClick={() => handleSelectAccount(account.id)}
                >
                  Gerenciar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

export default SelectAccount;