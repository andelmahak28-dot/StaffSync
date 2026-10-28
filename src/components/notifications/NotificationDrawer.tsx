import React from 'react';
import { useHR } from '../../context/HRContext';
import { X, Check, CalendarDays, Megaphone, GraduationCap, Clock, AlertCircle } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const {
    currentUser,
    notifications,
    markNotificationAsRead,
    clearAllNotifications,
    setActiveTab,
  } = useHR();

  if (!isOpen) return null;

  const userNotifications = notifications.filter(
    (n) => n.userId === currentUser.id || n.userId === 'all'
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <CalendarDays className="w-4 h-4 text-blue-600" />;
      case 'announcement':
        return <Megaphone className="w-4 h-4 text-amber-600" />;
      case 'training':
        return <GraduationCap className="w-4 h-4 text-violet-600" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-emerald-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Notifications</h2>
              <p className="text-xs text-slate-500">System updates and approval alerts</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllNotifications}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors px-2 py-1 rounded hover:bg-slate-100"
              >
                Mark all read
              </button>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Close notifications"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {userNotifications.length === 0 ? (
              <div className="py-16 text-center px-4">
                <p className="text-xs font-medium text-slate-600">No active notifications</p>
                <p className="text-xs text-slate-400 mt-1">
                  You are all caught up with leave requests, announcements, and training activities.
                </p>
              </div>
            ) : (
              userNotifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => {
                    markNotificationAsRead(notif.id);
                    if (notif.linkTab) {
                      setActiveTab(notif.linkTab);
                      onClose();
                    }
                  }}
                  className={`p-4 transition-colors cursor-pointer flex gap-3 ${
                    notif.read ? 'bg-white hover:bg-slate-50' : 'bg-blue-50/40 hover:bg-blue-50/70'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">{getIcon(notif.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`text-xs ${notif.read ? 'font-medium text-slate-800' : 'font-semibold text-slate-900'}`}>
                        {notif.title}
                      </p>
                      <span className="text-[11px] font-mono text-slate-400 shrink-0">
                        {notif.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                    {notif.linkTab && (
                      <span className="inline-block mt-2 text-[11px] font-medium text-blue-600 hover:underline">
                        View details &rarr;
                      </span>
                    )}
                  </div>
                  {!notif.read && (
                    <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 self-center" />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
