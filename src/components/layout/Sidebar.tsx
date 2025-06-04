import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  Send,
  Workflow,
  UserSquare2,
  X
} from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeModule: 'chatbot' | 'crm';
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label, onClick }) => {
  const { accountId } = useParams();
  const fullPath = `/conta/${accountId}${to}`;
  
  return (
    <NavLink
      to={fullPath}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center px-4 py-3 text-gray-600 transition-colors duration-200 ${
          isActive
            ? 'bg-megen-green bg-opacity-10 text-megen-blue border-r-4 border-megen-green'
            : 'hover:bg-megen-green hover:bg-opacity-5 hover:text-megen-blue'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      <span className="font-medium">{label}</span>
    </NavLink>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeModule }) => {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-gray-600 bg-opacity-50 z-20 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 z-30
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:z-0
      `}>
        <div className="h-16 flex items-center justify-end px-4 md:hidden">
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-5 px-2 space-y-1">
          {activeModule === 'chatbot' ? (
            <>
              <NavItem
                to="/dashboard"
                icon={<LayoutDashboard className="h-5 w-5" />}
                label="Dashboard"
                onClick={onClose}
              />
              <NavItem
                to="/chatbot"
                icon={<MessageSquare className="h-5 w-5" />}
                label="Fluxos de Chatbot"
                onClick={onClose}
              />
              <NavItem
                to="/campaigns"
                icon={<Send className="h-5 w-5" />}
                label="Campanhas WhatsApp"
                onClick={onClose}
              />
              <NavItem
                to="/automation"
                icon={<Workflow className="h-5 w-5" />}
                label="Automações"
                onClick={onClose}
              />
              <NavItem
                to="/leads"
                icon={<Users className="h-5 w-5" />}
                label="Leads Captados"
                onClick={onClose}
              />
            </>
          ) : (
            <NavItem
              to="/crm"
              icon={<UserSquare2 className="h-5 w-5" />}
              label="Pipeline de Vendas"
              onClick={onClose}
            />
          )}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;