import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import SmartShell from './components/layout/SmartShell';

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
  return (
    <UserProvider>
      <NotificationProvider>

        <Routes>

          {/* Redirect homepage directly to dashboard */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Main App */}
          <Route element={<SmartShell />}>

            <Route
              path="/dashboard"
              element={
                <div style={{
                  color: 'white',
                  fontSize: '40px',
                  padding: '40px'
                }}>
                  Dashboard Working ✅
                </div>
              }
            />

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

          {/* Auth */}
          <Route path="/auth" element={<Auth />} />

        </Routes>

      </NotificationProvider>
    </UserProvider>
  );
}
