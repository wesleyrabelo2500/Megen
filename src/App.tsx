import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/layout/Layout';
import SelectAccount from './pages/SelectAccount';
import Dashboard from './pages/Dashboard';
import CRMPage from './pages/CRMPage';
import ChatbotPage from './pages/ChatbotPage';
import LeadsPage from './pages/LeadsPage';
import CampaignsPage from './pages/CampaignsPage';
import AutomationPage from './pages/AutomationPage';
import AutomationForm from './pages/AutomationForm';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route path="/selecionar-conta" element={
              <ProtectedRoute>
                <SelectAccount />
              </ProtectedRoute>
            } />
            
            {/* Standalone Automation Form Routes */}
            <Route path="/automations/novo" element={
              <ProtectedRoute>
                <AutomationForm />
              </ProtectedRoute>
            } />
            <Route path="/automations/:automationId/editar" element={
              <ProtectedRoute>
                <AutomationForm />
              </ProtectedRoute>
            } />
            
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/selecionar-conta" replace />
              </ProtectedRoute>
            } />
            
            {/* Account Routes with Layout */}
            <Route path="/conta/:accountId/*" element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    <Route path="dashboard" element={<Dashboard />} />
                    <Route path="crm" element={<CRMPage />} />
                    <Route path="chatbot" element={<ChatbotPage />} />
                    <Route path="leads" element={<LeadsPage />} />
                    <Route path="campaigns" element={<CampaignsPage />} />
                    <Route path="automation" element={<AutomationPage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;