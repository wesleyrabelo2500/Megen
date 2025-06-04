import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { useAuth } from '../../contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  const activeModule = location.pathname.includes('/crm') ? 'crm' : 'chatbot';
  
  const handleModuleChange = (module: 'chatbot' | 'crm') => {
    const accountId = location.pathname.split('/')[2];
    if (module === 'crm') {
      navigate(`/conta/${accountId}/crm`);
    } else {
      navigate(`/conta/${accountId}/dashboard`);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="fixed top-0 left-0 w-full h-16 bg-white z-50 shadow-sm border-b border-gray-200">
        <Navbar 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          showMenuButton={activeModule === 'chatbot'}
        />
      </header>
      
      <div className="pt-16 flex flex-1 flex-col md:flex-row">
        {activeModule === 'chatbot' && (
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={() => setSidebarOpen(false)} 
            activeModule={activeModule}
          />
        )}
        <main className={`
          flex-1 overflow-y-auto
          ${activeModule === 'crm' ? 'p-6' : 'p-4 sm:p-6 lg:p-8'}
        `}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;