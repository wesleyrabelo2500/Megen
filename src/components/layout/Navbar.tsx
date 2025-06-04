import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  Bell, 
  Search, 
  User,
  Settings,
  CreditCard,
  HelpCircle,
  Moon,
  Sun,
  LogOut,
  UserCircle
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../common/Logo';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import * as Switch from '@radix-ui/react-switch';

interface NavbarProps {
  onMenuClick: () => void;
  activeModule: 'chatbot' | 'crm';
  onModuleChange: (module: 'chatbot' | 'crm') => void;
  showMenuButton: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onMenuClick, activeModule, onModuleChange, showMenuButton }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBillingModal, setShowBillingModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  const handleLogout = () => {
    logout();
  };

  const handleSupportClick = () => {
    window.open('https://wa.me/5511999999999', '_blank');
  };
  
  return (
    <nav className="h-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            {showMenuButton && (
              <button
                onClick={onMenuClick}
                className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
            )}
            
            <Link to="/" className="flex-shrink-0 flex items-center ml-4 md:ml-0">
              <Logo className="h-8 w-auto" />
            </Link>

            <div className="hidden md:flex ml-8 space-x-1">
              <button
                onClick={() => onModuleChange('chatbot')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeModule === 'chatbot'
                    ? 'bg-megen-green text-megen-blue'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                Chatbot
              </button>
              <button
                onClick={() => onModuleChange('crm')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeModule === 'crm'
                    ? 'bg-megen-green text-megen-blue'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                CRM
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
              <Bell className="h-6 w-6" />
            </button>

            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600">
                  <span className="sr-only">Abrir menu do usuário</span>
                  <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="w-56 mt-2 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 focus:outline-none"
                  sideOffset={5}
                  align="end"
                >
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                  </div>

                  <div className="py-1">
                    <DropdownMenu.Item
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setShowProfileModal(true)}
                    >
                      <UserCircle className="mr-3 h-4 w-4" />
                      Meu Perfil
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setShowBillingModal(true)}
                    >
                      <CreditCard className="mr-3 h-4 w-4" />
                      Plano e Cobrança
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={() => setShowSettingsModal(true)}
                    >
                      <Settings className="mr-3 h-4 w-4" />
                      Configurações
                    </DropdownMenu.Item>

                    <DropdownMenu.Item
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                      onClick={handleSupportClick}
                    >
                      <HelpCircle className="mr-3 h-4 w-4" />
                      Ajuda / Suporte
                    </DropdownMenu.Item>
                  </div>

                  <div className="py-1">
                    <div className="flex items-center justify-between px-4 py-2 text-sm text-gray-700">
                      <div className="flex items-center">
                        {theme === 'dark' ? (
                          <Moon className="mr-3 h-4 w-4" />
                        ) : (
                          <Sun className="mr-3 h-4 w-4" />
                        )}
                        Modo Escuro
                      </div>
                      <Switch.Root
                        checked={theme === 'dark'}
                        onCheckedChange={toggleTheme}
                        className={`${
                          theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                        } relative inline-flex h-5 w-10 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                      >
                        <Switch.Thumb
                          className={`${
                            theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                          } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                        />
                      </Switch.Root>
                    </div>
                  </div>

                  <div className="py-1">
                    <DropdownMenu.Item
                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 cursor-pointer"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-3 h-4 w-4" />
                      Sair da Conta
                    </DropdownMenu.Item>
                  </div>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          </div>
        </div>
      </div>

      {/* Mobile navigation */}
      <div className="md:hidden border-t border-gray-200 p-2">
        <div className="flex space-x-1">
          <button
            onClick={() => onModuleChange('chatbot')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeModule === 'chatbot'
                ? 'bg-megen-green text-megen-blue'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            Chatbot
          </button>
          <button
            onClick={() => onModuleChange('crm')}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeModule === 'crm'
                ? 'bg-megen-green text-megen-blue'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
            }`}
          >
            CRM
          </button>
        </div>
        {showMenuButton && (
          <div className="relative mt-2">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 sm:text-sm"
              placeholder="Buscar..."
              type="search"
            />
          </div>
        )}
      </div>

      {/* Modals */}
      <Dialog.Root open={showProfileModal} onOpenChange={setShowProfileModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Meu Perfil
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome</label>
                <input
                  type="text"
                  value={user?.name}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={user?.email}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowProfileModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
              >
                Fechar
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={showBillingModal} onOpenChange={setShowBillingModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Plano e Cobrança
            </Dialog.Title>
            <p className="text-gray-500">
              Informações sobre seu plano e cobrança estarão disponíveis em breve.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowBillingModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
              >
                Fechar
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={showSettingsModal} onOpenChange={setShowSettingsModal}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50" />
          <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md">
            <Dialog.Title className="text-lg font-medium text-gray-900 mb-4">
              Configurações
            </Dialog.Title>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Idioma</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fuso Horário</label>
                <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                  <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                </select>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Notificações por Email</span>
                <Switch.Root
                  defaultChecked
                  className="bg-blue-600 relative inline-flex h-5 w-10 items-center rounded-full"
                >
                  <Switch.Thumb className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-5" />
                </Switch.Root>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowSettingsModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 rounded-md"
              >
                Fechar
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </nav>
  );
};

export default Navbar;