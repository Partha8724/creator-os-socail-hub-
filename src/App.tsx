import React, { useState, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { Routes, Route } from 'react-router-dom';
import SmartShell from './components/layout/SmartShell';
import Intro from './components/layout/Intro';
import Dashboard from './pages/Dashboard';
import YouTubeLab from './pages/YouTubeLab';
import VerticalStudio from './pages/VerticalStudio';
import KeywordIntelligence from './pages/Keywords';
import AIOracle from './pages/AIOracle';
import SmartScheduler from './pages/Scheduler';
import HubUpgrade from './pages/HubUpgrade';
import SmartLink from './pages/SmartLink';
import ContentNodes from './pages/ContentNodes';
import ContentForge from './pages/ContentForge';
import ProStudio from './pages/ProStudio';
import Auth from './pages/Auth';
import HubStream from './pages/HubStream';
import Landing from './pages/Landing';
import ConnectAccounts from './pages/ConnectAccounts';
import VidIQAnalytics from './pages/VidIQAnalytics';
import PaymentSuccess from './pages/PaymentSuccess';
import AdminDashboard from './pages/Admin';
import GrowthArchitect from './pages/GrowthArchitect';
import RetentionLab from './pages/RetentionLab';
import ThumbnailStudio from './pages/ThumbnailStudio';
import MetaSuite from './pages/MetaSuite';
import TrendEngine from './pages/TrendEngine';
import CompetitorSpy from './pages/CompetitorSpy';
import SponsorshipEngine from './pages/SponsorshipEngine';
import VideoAnalyzer from './pages/VideoAnalyzer';
import Billing from './pages/Billing';
import Settings from './pages/Settings';
import { UserProvider } from './contexts/UserContext';
import { NotificationProvider } from './contexts/NotificationContext';

export default function App() {
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    const hasSeenIntro = sessionStorage.getItem('hub-intro-seen');
    if (!hasSeenIntro) {
      setShowIntro(true);
    }
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
    sessionStorage.setItem('hub-intro-seen', 'true');
  };

  if (showIntro) {
    return <Intro onComplete={handleIntroComplete} />;
  }

  return (
    <UserProvider>
      <NotificationProvider>
        <Analytics />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route element={<SmartShell />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analytics" element={<VidIQAnalytics />} />
            <Route path="/connect" element={<ConnectAccounts />} />
            <Route path="/stream" element={<HubStream />} />
            <Route path="/links" element={<SmartLink />} />
            <Route path="/content" element={<ContentNodes />} />
            <Route path="/forge" element={<ContentForge />} />
            <Route path="/studio" element={<ProStudio />} />
            <Route path="/youtube" element={<YouTubeLab />} />
            <Route path="/vertical" element={<VerticalStudio />} />
            <Route path="/retention" element={<RetentionLab />} />
            <Route path="/thumbnails" element={<ThumbnailStudio />} />
            <Route path="/architect" element={<GrowthArchitect />} />
            <Route path="/keywords" element={<KeywordIntelligence />} />
            <Route path="/oracle" element={<AIOracle />} />
            <Route path="/scheduler" element={<SmartScheduler />} />
            <Route path="/meta" element={<MetaSuite />} />
            <Route path="/trends" element={<TrendEngine />} />
            <Route path="/competitor" element={<CompetitorSpy />} />
            <Route path="/sponsorship" element={<SponsorshipEngine />} />
            <Route path="/video-analyzer" element={<VideoAnalyzer />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/hub-upgrade" element={<HubUpgrade />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Route>
          <Route path="/auth" element={<Auth />} />
        </Routes>
      </NotificationProvider>
    </UserProvider>
  );
}
