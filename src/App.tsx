import React, { useState } from 'react';
import { HRProvider, useHR } from './context/HRContext';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { NotificationDrawer } from './components/notifications/NotificationDrawer';
import { HRDashboard } from './components/dashboard/HRDashboard';
import { ManagerDashboard } from './components/dashboard/ManagerDashboard';
import { EmployeeDashboard } from './components/dashboard/EmployeeDashboard';
import { EmployeeDirectory } from './components/employees/EmployeeDirectory';
import { AttendanceTracker } from './components/attendance/AttendanceTracker';
import { LeaveManagement } from './components/leaves/LeaveManagement';
import { AnnouncementsBoard } from './components/announcements/AnnouncementsBoard';
import { TrainingCenter } from './components/training/TrainingCenter';
import { ReportsAnalytics } from './components/analytics/ReportsAnalytics';
import { Menu, ShieldAlert, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, activeTab, setActiveTab } = useHR();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  // Global modal triggers from Header / Quick actions
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isApplyLeaveModalOpen, setIsApplyLeaveModalOpen] = useState(false);
  const [isNewAnnouncementModalOpen, setIsNewAnnouncementModalOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        if (currentUser.role === 'hr') {
          return (
            <HRDashboard
              onOpenAddEmployee={() => {
                setActiveTab('employees');
                setIsAddEmployeeModalOpen(true);
              }}
              onOpenNewAnnouncement={() => {
                setActiveTab('announcements');
                setIsNewAnnouncementModalOpen(true);
              }}
            />
          );
        }
        if (currentUser.role === 'manager') {
          return <ManagerDashboard />;
        }
        return (
          <EmployeeDashboard
            onOpenApplyLeave={() => {
              setActiveTab('leaves');
              setIsApplyLeaveModalOpen(true);
            }}
          />
        );

      case 'employees':
        return (
          <EmployeeDirectory
            isAddModalOpenInitially={isAddEmployeeModalOpen}
            onCloseAddModal={() => setIsAddEmployeeModalOpen(false)}
          />
        );

      case 'attendance':
        return <AttendanceTracker />;

      case 'leaves':
        return (
          <LeaveManagement
            isApplyModalOpenInitially={isApplyLeaveModalOpen}
            onCloseApplyModal={() => setIsApplyLeaveModalOpen(false)}
          />
        );

      case 'announcements':
        return (
          <AnnouncementsBoard
            isCreateModalOpenInitially={isNewAnnouncementModalOpen}
            onCloseCreateModal={() => setIsNewAnnouncementModalOpen(false)}
          />
        );

      case 'training':
        return <TrainingCenter />;

      case 'analytics':
        return <ReportsAnalytics />;

      default:
        return <HRDashboard onOpenAddEmployee={() => {}} onOpenNewAnnouncement={() => {}} />;
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* Main Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header */}
        <div className="flex items-center">
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-3 text-slate-600 hover:text-slate-900 border-b border-slate-200 bg-white"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1 min-w-0">
            <Header onOpenNotifications={() => setNotificationDrawerOpen(true)} />
          </div>
        </div>

        {/* Viewport Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Slide-over Notification Drawer */}
      <NotificationDrawer
        isOpen={notificationDrawerOpen}
        onClose={() => setNotificationDrawerOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <HRProvider>
      <AppContent />
    </HRProvider>
  );
}
