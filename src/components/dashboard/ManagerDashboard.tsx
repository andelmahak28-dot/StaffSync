import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import {
  Users,
  CalendarDays,
  GraduationCap,
  Clock,
  CheckCircle2,
  XCircle,
  MessageSquare,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const ManagerDashboard: React.FC = () => {
  const {
    currentUser,
    employees,
    attendance,
    leaves,
    trainings,
    reviewLeave,
    setActiveTab,
  } = useHR();

  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Direct reports of Marcus Chen (or any manager)
  const directReports = employees.filter(
    (e) => e.managerId === currentUser.id || e.department === currentUser.department
  );

  const directReportIds = directReports.map((e) => e.id);

  // Today's attendance for team
  const todayDate = '2026-10-27';
  const teamTodayAttendance = attendance.filter(
    (a) => a.date === todayDate && directReportIds.includes(a.employeeId)
  );

  // Team pending leave requests
  const teamPendingLeaves = leaves.filter(
    (l) => directReportIds.includes(l.employeeId) && l.status === 'pending'
  );

  // Team training programs
  const teamTrainings = trainings.filter((t) =>
    t.enrolledEmployeeIds.some((id) => directReportIds.includes(id))
  );

  const handleAction = (leaveId: string, status: 'approved' | 'rejected') => {
    const comment = commentInputs[leaveId] || '';
    reviewLeave(leaveId, status, comment);
    setCommentInputs((prev) => {
      const next = { ...prev };
      delete next[leaveId];
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Manager Control Deck
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Direct Reports & Operational Oversight</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.department} Department</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('employees')}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Manage Team
          </button>
          <button
            onClick={() => setActiveTab('leaves')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
          >
            Review All Leaves
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Direct Team Size</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {directReports.length}
            </span>
            <span className="text-xs text-slate-500">engineers & leads</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">All reports actively reporting</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Presence Today</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {teamTodayAttendance.length}/{directReports.length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Logged in</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Remote & In-office sync active</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Leave Approvals</span>
            <CalendarDays className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {teamPendingLeaves.length}
            </span>
            {teamPendingLeaves.length > 0 ? (
              <span className="text-xs text-amber-600 font-medium">Action needed</span>
            ) : (
              <span className="text-xs text-emerald-600 font-medium">Up to date</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Direct report time-off requests</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Team Training Tracks</span>
            <GraduationCap className="w-4 h-4 text-violet-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {teamTrainings.length}
            </span>
            <span className="text-xs text-blue-600 font-medium">Active tracks</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Architecture & security tracks</p>
        </div>
      </div>

      {/* Team Leave Approval Queue */}
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Team Leave Requests Awaiting Your Sign-Off</h3>
            <p className="text-xs text-slate-500">Review schedule impact and provide manager feedback</p>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {teamPendingLeaves.length} pending
          </span>
        </div>

        <div className="mt-4 divide-y divide-slate-100">
          {teamPendingLeaves.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No pending leave requests from your team members.
            </div>
          ) : (
            teamPendingLeaves.map((leave) => (
              <div key={leave.id} className="py-4 first:pt-0 last:pb-0 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <img
                      src={leave.avatar}
                      alt={leave.employeeName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{leave.employeeName}</span>
                        <span className="text-xs text-slate-400 font-mono">·</span>
                        <span className="text-xs text-slate-500 capitalize">{leave.leaveType} Leave</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1">"{leave.reason}"</p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-mono tabular-nums mt-1.5">
                        <span>{leave.startDate} to {leave.endDate}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-900">{leave.daysCount} working days</span>
                        {leave.contactDuringLeave && (
                          <>
                            <span>·</span>
                            <span>Emerg: {leave.contactDuringLeave}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      onClick={() => handleAction(leave.id, 'rejected')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Decline
                    </button>
                    <button
                      onClick={() => handleAction(leave.id, 'approved')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve Request
                    </button>
                  </div>
                </div>

                {/* Optional manager note input */}
                <div className="pl-12">
                  <input
                    type="text"
                    placeholder="Add optional manager note or handover instructions..."
                    value={commentInputs[leave.id] || ''}
                    onChange={(e) =>
                      setCommentInputs({ ...commentInputs, [leave.id]: e.target.value })
                    }
                    className="w-full text-xs px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Direct Reports List & Status */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Direct Reports Roster</h3>
            <p className="text-xs text-slate-500">Live work status and performance rating</p>
          </div>
          <button
            onClick={() => setActiveTab('employees')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Detailed Directory &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Team Member</th>
                <th className="py-3 px-5">Designation</th>
                <th className="py-3 px-5">Today's Status</th>
                <th className="py-3 px-5">Working Mode</th>
                <th className="py-3 px-5">Performance Rating</th>
                <th className="py-3 px-5">Leave Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {directReports.map((member) => {
                const memberAttendance = attendance.find(
                  (a) => a.employeeId === member.id && a.date === todayDate
                );

                return (
                  <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={member.avatar}
                          alt={member.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{member.name}</p>
                          <p className="text-[11px] text-slate-400 font-mono">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-5 text-slate-700">{member.designation}</td>
                    <td className="py-3.5 px-5">
                      {memberAttendance ? (
                        <span className="text-emerald-700 font-medium">
                          Active ({memberAttendance.checkIn})
                        </span>
                      ) : (
                        <span className="text-slate-400">Not checked in</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 capitalize text-slate-600">
                      {memberAttendance ? memberAttendance.workMode : member.location.split(' - ')[0]}
                    </td>
                    <td className="py-3.5 px-5 font-mono tabular-nums">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-900">
                        <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                        {member.performanceRating.toFixed(1)} / 5.0
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600 tabular-nums">
                      {member.leaveBalances.casual + member.leaveBalances.paid} days total
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
