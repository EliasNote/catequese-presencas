import React, { useState } from 'react';
import { AppProvider, useAppContext } from './store/AppContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCatechists } from './pages/AdminCatechists';
import { AdminStudents } from './pages/AdminStudents';
import { AdminCommunities } from './pages/AdminCommunities';
import { AdminReports } from './pages/AdminReports';
import { CatechistDashboard } from './pages/CatechistDashboard';
import { CatechistStudents } from './pages/CatechistStudents';
import { CatechistMeetings } from './pages/CatechistMeetings';
import { CatechistAttendance } from './pages/CatechistAttendance';

function AppContent() {
  const { currentUser, isLoading } = useAppContext();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);

  if (!currentUser) {
    return <Login />;
  }

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FFF200] border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-500">Carregando dados...</p>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (currentUser.role === 'ADMIN') {
      switch (activeTab) {
        case 'dashboard': return <AdminDashboard />;
        case 'catechists': return <AdminCatechists />;
        case 'students': return <AdminStudents />;
        case 'communities': return <AdminCommunities />;
        case 'reports': return <AdminReports />;
        default: return <AdminDashboard />;
      }
    } else {
      switch (activeTab) {
        case 'dashboard': return <CatechistDashboard setActiveTab={setActiveTab} />;
        case 'students': return <CatechistStudents />;
        case 'meetings': return <CatechistMeetings setActiveTab={setActiveTab} setSelectedMeeting={setSelectedMeetingId} />;
        case 'attendance': return selectedMeetingId ? <CatechistAttendance meetingId={selectedMeetingId} setActiveTab={setActiveTab} /> : <CatechistMeetings setActiveTab={setActiveTab} setSelectedMeeting={setSelectedMeetingId} />;
        default: return <CatechistDashboard setActiveTab={setActiveTab} />;
      }
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
