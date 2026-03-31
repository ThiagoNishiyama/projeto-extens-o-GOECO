import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

import AppLayout from '@/components/layout/AppLayout';
import Home from '@/pages/Home';
import Community from '@/pages/Community';
import Gamification from '@/pages/Gamification';
import Marketplace from '@/pages/Marketplace';
import ProductDetail from '@/pages/ProductDetail';
import MapPage from '@/pages/MapPage';
import Messages from '@/pages/Messages';
import QRCodePage from '@/pages/QRCode';
import Profile from '@/pages/Profile';
import Notifications from '@/pages/Notifications';
import PublicProfile from '@/pages/PublicProfile';
import EcoAssistant from '@/pages/EcoAssistant';
import ImpactDashboard from '@/pages/ImpactDashboard';
import ChatBot from '@/components/ChatBot';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <span className="text-white font-space font-bold text-sm">GO</span>
          </div>
          <div className="w-8 h-8 border-4 border-muted border-t-primary rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/comunidade" element={<Community />} />
        <Route path="/gamificacao" element={<Gamification />} />
        <Route path="/negociacao" element={<Marketplace />} />
        <Route path="/negociacao/:id" element={<ProductDetail />} />
        <Route path="/mapa" element={<MapPage />} />
        <Route path="/mensagens" element={<Messages />} />
        <Route path="/qrcode" element={<QRCodePage />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/notificacoes" element={<Notifications />} />
        <Route path="/usuario" element={<PublicProfile />} />
        <Route path="/assistente" element={<EcoAssistant />} />
        <Route path="/impacto" element={<ImpactDashboard />} />
      </Route>
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
          <ChatBot />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App