import React from 'react';
import { useHR } from '../../context/HRContext';
import {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Megaphone,
  GraduationCap,
  BarChart3,
  ShieldAlert,
  Briefcase,
  UserCheck,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { activeTab, setActiveTab, currentUser, leaves, announcements } = useHR();

  const pendingLeavesCount = leaves.filter((l) => l.status === 'pending').length;
  const unreadAnnouncementsCount = announcements.filter(
    (a) => !a.readBy.includes(currentUser.id)
  ).length;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'employees',
      label: 'Employees & Teams',
      icon: Users,
      badge: null,
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: Clock,
      badge: null,
    },
    {
      id: 'leaves',
      label: 'Leave Management',
      icon: CalendarDays,
      badge: pendingLeavesCount > 0 && currentUser.role !== 'employee' ? `${pendingLeavesCount}` : null,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
      badge: unreadAnnouncementsCount > 0 ? `${unreadAnnouncementsCount}` : null,
    },
    {
      id: 'training',
      label: 'Training Programs',
      icon: GraduationCap,
      badge: null,
    },
    {
      id: 'analytics',
      label: 'Reports & Analytics',
      icon: BarChart3,
      badge: null,
      hrOnly: true,
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static ${
          mobileOpen ? 'translate-x-0' : '-translate-x-0 max-lg:-translate-x-full'
        }`}
      >
        {/* Brand Lockup */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white shadow-sm">
              S
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">StaffSync</h1>
              <p className="text-[11px] text-slate-400 font-normal">Apex Dynamics Group</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`font-mono text-[10px] px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-blue-800 text-white' : 'bg-slate-800 text-blue-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Current Role Identity Card */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/60">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-full object-cover border border-slate-700 shrink-0"
            />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{currentUser.name}</p>
              <p className="text-[11px] text-slate-400 truncate">{currentUser.designation}</p>
              <div className="mt-1 flex items-center gap-1.5 text-[10px] text-blue-400 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                <span className="uppercase">{currentUser.role === 'hr' ? 'HR Personnel' : currentUser.role}</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
