import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import {
  Bell,
  UserCheck,
  Check,
  ArrowRightLeft,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface HeaderProps {
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenNotifications }) => {
  const {
    currentUser,
    allUsers,
    setCurrentUser,
    activeTab,
    notifications,
    isCheckedIn,
    workSessionSeconds,
    resetToDefaults,
  } = useHR();

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const unreadCount = notifications.filter(
    (n) => n.userId === currentUser.id && !n.read
  ).length;

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreadcrumbTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return 'Overview & Operational Dashboard';
      case 'employees':
        return 'Employee Directory & Roster';
      case 'attendance':
        return 'Attendance Management & Time Logs';
      case 'leaves':
        return 'Leave Workflows & Balance Quotas';
      case 'announcements':
        return 'Company Bulletins & Announcements';
      case 'training':
        return 'Learning & Professional Development';
      case 'analytics':
        return 'Workforce Reports & Executive Analytics';
      default:
        return 'Management Portal';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-8 px-6 py-3.5 bg-white border-b border-slate-200">
      {/* Zone 1: Brand title & workspace wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <a href="#home" className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
          StaffSync
        </a>
        <span className="hidden sm:inline-block text-xs font-mono text-slate-400">/</span>
        <span className="hidden sm:inline-block text-xs text-slate-500 font-medium whitespace-nowrap">
          HR Management System
        </span>
      </div>

      {/* Zone 2: Contextual location breadcrumb */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-slate-500 shrink-0">
        <span>Apex Dynamics Inc</span>
        <span aria-hidden="true">/</span>
        <span className="font-semibold text-slate-900">{getBreadcrumbTitle()}</span>
        {isCheckedIn && (
          <>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-medium">
              Live Session: {formatTimer(workSessionSeconds)}
            </span>
          </>
        )}
      </div>

      {/* Zone 3: 1 primary action & Role Switcher */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          title="Notifications"
          aria-label="View notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
            </span>
          )}
        </button>

        {/* Quick Role Switcher Button */}
        <div className="relative">
          <button
            onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
            className="flex items-center gap-2.5 px-3 py-1.5 text-xs font-medium text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200/80 whitespace-nowrap"
            title="Switch User Role"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-5 h-5 rounded-full object-cover border border-slate-300"
            />
            <div className="text-left hidden sm:block">
              <p className="font-semibold leading-tight text-slate-900">{currentUser.name}</p>
              <p className="text-[10px] text-slate-500 capitalize">{currentUser.role === 'hr' ? 'HR Personnel (Admin)' : currentUser.role}</p>
            </div>
            <ArrowRightLeft className="w-3.5 h-3.5 text-slate-500 ml-1" />
          </button>

          {/* Role Dropdown */}
          {showRoleSwitcher && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-slate-100">
                <p className="text-xs font-semibold text-slate-900">Switch User Persona</p>
                <p className="text-[11px] text-slate-500">Test role-based access control & permissions</p>
              </div>

              <div className="py-1">
                {allUsers.map((u) => {
                  const isSelected = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      onClick={() => {
                        setCurrentUser(u);
                        setShowRoleSwitcher(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left text-xs transition-colors ${
                        isSelected ? 'bg-slate-100/90 text-slate-900 font-medium' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          referrerPolicy="no-referrer"
                          className="w-7 h-7 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{u.name}</p>
                          <p className="text-[11px] text-slate-500">
                            {u.role.toUpperCase()} · {u.designation}
                          </p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-slate-900 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="px-3 pt-2 mt-1 border-t border-slate-100 flex items-center justify-between text-[11px]">
                <button
                  onClick={() => {
                    if (confirm('Reset all demo state to fresh sample data?')) {
                      resetToDefaults();
                      setShowRoleSwitcher(false);
                    }
                  }}
                  className="flex items-center gap-1.5 text-slate-500 hover:text-rose-600 transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset demo data
                </button>
                <span className="font-mono text-slate-400">v2.4.0</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
