import React, { useState, useEffect } from 'react';
import { useHR } from '../../context/HRContext';
import { WorkMode } from '../../types';
import {
  Clock,
  CalendarDays,
  GraduationCap,
  Megaphone,
  CheckCircle2,
  Play,
  Square,
  Building,
  Home,
  MapPin,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface EmployeeDashboardProps {
  onOpenApplyLeave: () => void;
}

export const EmployeeDashboard: React.FC<EmployeeDashboardProps> = ({ onOpenApplyLeave }) => {
  const {
    currentUser,
    employees,
    isCheckedIn,
    workSessionSeconds,
    currentWorkMode,
    checkIn,
    checkOut,
    todayCheckInRecord,
    leaves,
    announcements,
    trainings,
    toggleModuleCompletion,
    markAnnouncementAsRead,
    setActiveTab,
  } = useHR();

  const [selectedWorkMode, setSelectedWorkMode] = useState<WorkMode>(currentWorkMode);
  const [dailyNote, setDailyNote] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const employeeRecord = employees.find((e) => e.id === currentUser.id);
  const myLeaves = leaves.filter((l) => l.employeeId === currentUser.id);
  const myTrainings = trainings.filter((t) => t.enrolledEmployeeIds.includes(currentUser.id));

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleAttendance = () => {
    if (isCheckedIn) {
      checkOut(dailyNote);
      setDailyNote('');
    } else {
      checkIn(selectedWorkMode, dailyNote);
      setDailyNote('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Welcome back, {currentUser.name}
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>{currentUser.designation}</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.department}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-700">ID: {currentUser.employeeId}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenApplyLeave}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Apply for Leave
          </button>
        </div>
      </div>

      {/* Attendance Check-in Widget & Leave Balances Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Attendance Interactive Clock-in Card (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className={`w-3 h-3 rounded-full ${isCheckedIn ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                <h3 className="text-sm font-bold text-slate-900">Daily Attendance Console</h3>
              </div>
              <div className="text-right">
                <span className="text-xs font-mono text-slate-500 font-semibold">{currentTime}</span>
                <p className="text-[10px] text-slate-400">Tuesday, Oct 27, 2026</p>
              </div>
            </div>

            {/* Live Timer and Mode Selection */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              <div>
                <span className="text-xs font-medium text-slate-500">Active Work Duration</span>
                <div className="mt-1 font-mono text-3xl font-extrabold text-slate-900 tabular-nums tracking-tight">
                  {formatTimer(workSessionSeconds)}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  {isCheckedIn ? (
                    <span className="text-emerald-700 font-medium">Session currently recorded</span>
                  ) : todayCheckInRecord ? (
                    <span>Clocked out today. Total: {todayCheckInRecord.totalHours} hrs</span>
                  ) : (
                    <span>Not checked in today yet</span>
                  )}
                </p>
              </div>

              {/* Work Mode Selector */}
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-2">
                  Operating Location / Mode:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    disabled={isCheckedIn}
                    onClick={() => setSelectedWorkMode('office')}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors flex flex-col items-center gap-1 ${
                      selectedWorkMode === 'office'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    } ${isCheckedIn ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>In-Office</span>
                  </button>

                  <button
                    type="button"
                    disabled={isCheckedIn}
                    onClick={() => setSelectedWorkMode('remote')}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors flex flex-col items-center gap-1 ${
                      selectedWorkMode === 'remote'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    } ${isCheckedIn ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    <Home className="w-3.5 h-3.5" />
                    <span>Remote</span>
                  </button>

                  <button
                    type="button"
                    disabled={isCheckedIn}
                    onClick={() => setSelectedWorkMode('field')}
                    className={`py-2 px-2 text-xs font-medium rounded-lg border text-center transition-colors flex flex-col items-center gap-1 ${
                      selectedWorkMode === 'field'
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    } ${isCheckedIn ? 'opacity-80 cursor-not-allowed' : ''}`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Field</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Note input */}
            <div className="mt-4">
              <input
                type="text"
                placeholder="Optional daily focus or milestone note (e.g. Sprint Review, Client presentation)..."
                value={dailyNote}
                onChange={(e) => setDailyNote(e.target.value)}
                className="w-full text-xs px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Shift: 09:00 - 18:00 (Standard Core Hours)
            </span>
            <button
              onClick={handleToggleAttendance}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isCheckedIn
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isCheckedIn ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  Clock Out For The Day
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Clock In Now
                </>
              )}
            </button>
          </div>
        </div>

        {/* Leave Balances Card */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">My Leave Quotas</h3>
              <span className="text-xs font-mono text-slate-500">Fiscal Year 2026</span>
            </div>

            <div className="mt-4 space-y-3.5">
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Casual Leave (CL)</span>
                  <span className="font-mono text-slate-900 font-bold tabular-nums">
                    {employeeRecord?.leaveBalances.casual ?? 8} / 12 days left
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-600 h-1.5 rounded-full"
                    style={{
                      width: `${((employeeRecord?.leaveBalances.casual ?? 8) / 12) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Sick & Medical Leave (SL)</span>
                  <span className="font-mono text-slate-900 font-bold tabular-nums">
                    {employeeRecord?.leaveBalances.sick ?? 6} / 10 days left
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-emerald-600 h-1.5 rounded-full"
                    style={{
                      width: `${((employeeRecord?.leaveBalances.sick ?? 6) / 10) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-medium text-slate-700">Earned / Paid Leave (PL)</span>
                  <span className="font-mono text-slate-900 font-bold tabular-nums">
                    {employeeRecord?.leaveBalances.paid ?? 14} / 18 days left
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <div
                    className="bg-indigo-600 h-1.5 rounded-full"
                    style={{
                      width: `${((employeeRecord?.leaveBalances.paid ?? 14) / 18) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('leaves')}
              className="w-full py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 text-center transition-colors block"
            >
              View Past Leave Requests & History &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Dual Column: My Enrolled Trainings & Company Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrolled Training Programs */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-violet-600" />
                <h3 className="text-sm font-bold text-slate-900">Enrolled Training Programs</h3>
              </div>
              <button
                onClick={() => setActiveTab('training')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                Browse Catalog &rarr;
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {myTrainings.map((prog) => {
                const completedCount = prog.modules.filter((m) => m.completed).length;
                const progressPct = Math.round((completedCount / prog.modules.length) * 100);

                return (
                  <div key={prog.id} className="p-3.5 rounded-lg border border-slate-200/80 bg-slate-50/50">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{prog.title}</h4>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                          <span>{prog.category}</span>
                          <span>·</span>
                          <span className="font-mono tabular-nums">Due {prog.dueDate}</span>
                        </div>
                      </div>
                      <span className="font-mono text-xs font-bold text-slate-900 tabular-nums">
                        {progressPct}%
                      </span>
                    </div>

                    <div className="mt-2.5 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-violet-600 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {prog.modules.map((mod) => (
                        <div
                          key={mod.id}
                          onClick={() => toggleModuleCompletion(prog.id, mod.id)}
                          className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-white cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[10px] ${
                                mod.completed
                                  ? 'bg-emerald-600 text-white'
                                  : 'border border-slate-300 text-transparent'
                              }`}
                            >
                              ✓
                            </span>
                            <span className={mod.completed ? 'text-slate-500 line-through' : 'text-slate-800'}>
                              {mod.title}
                            </span>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 tabular-nums">
                            {mod.durationMinutes}m
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Company Announcements Bulletin */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900">Latest Company Announcements</h3>
              </div>
              <button
                onClick={() => setActiveTab('announcements')}
                className="text-xs font-semibold text-blue-600 hover:underline"
              >
                View All &rarr;
              </button>
            </div>

            <div className="mt-4 space-y-3.5">
              {announcements.slice(0, 3).map((ann) => {
                const isRead = ann.readBy.includes(currentUser.id);

                return (
                  <div
                    key={ann.id}
                    className={`p-3.5 rounded-lg border transition-colors ${
                      isRead ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-slate-700">{ann.category}</span>
                        {ann.isPinned && (
                          <span className="text-[10px] font-mono font-medium text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded">
                            PINNED
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400 tabular-nums">
                        {ann.createdAt}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 mt-1 leading-snug">
                      {ann.title}
                    </h4>

                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {ann.content}
                    </p>

                    <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-100 text-[11px]">
                      <span className="text-slate-500">By {ann.authorName}</span>
                      {!isRead ? (
                        <button
                          onClick={() => markAnnouncementAsRead(ann.id)}
                          className="font-medium text-blue-600 hover:underline"
                        >
                          Mark as read
                        </button>
                      ) : (
                        <span className="text-slate-400">Read</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
