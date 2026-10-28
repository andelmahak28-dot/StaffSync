import React from 'react';
import { useHR } from '../../context/HRContext';
import {
  Users,
  Clock,
  CalendarDays,
  GraduationCap,
  ArrowUpRight,
  CheckCircle2,
  XCircle,
  Plus,
  Megaphone,
  Download,
  AlertTriangle,
} from 'lucide-react';

interface HRDashboardProps {
  onOpenAddEmployee: () => void;
  onOpenNewAnnouncement: () => void;
}

export const HRDashboard: React.FC<HRDashboardProps> = ({
  onOpenAddEmployee,
  onOpenNewAnnouncement,
}) => {
  const {
    employees,
    attendance,
    leaves,
    trainings,
    reviewLeave,
    setActiveTab,
  } = useHR();

  const todayDate = '2026-10-27';
  const todayAttendance = attendance.filter((a) => a.date === todayDate);
  const presentCount = todayAttendance.filter((a) => a.status === 'present' || a.status === 'remote').length;
  const lateCount = todayAttendance.filter((a) => a.status === 'late').length;
  const attendanceRate = employees.length > 0
    ? Math.round((todayAttendance.length / employees.length) * 100)
    : 0;

  const pendingLeaves = leaves.filter((l) => l.status === 'pending');

  const departments = ['Engineering', 'Product & Design', 'Marketing', 'Human Resources', 'Finance', 'Operations'];

  return (
    <div className="space-y-6">
      {/* Page Header with Action Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            HR Command & Operational Overview
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Enterprise Headcount Administration</span>
            <span aria-hidden="true">·</span>
            <span>Policy Compliance & Staff Workflows</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenNewAnnouncement}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap"
          >
            <Megaphone className="w-3.5 h-3.5 text-slate-500" />
            Post Announcement
          </button>
          <button
            onClick={onOpenAddEmployee}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Employee
          </button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Workforce */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Workforce</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {employees.length}
            </span>
            <span className="text-xs text-emerald-600 font-medium">100% active roster</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Across 6 operational divisions</p>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Today's Presence</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {attendanceRate}%
            </span>
            <span className="text-xs text-slate-500 font-mono tabular-nums">
              ({todayAttendance.length}/{employees.length})
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            {presentCount} on-duty · {lateCount} late arrival
          </p>
        </div>

        {/* Pending Leave Requests */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Pending Leave Requests</span>
            <CalendarDays className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {pendingLeaves.length}
            </span>
            {pendingLeaves.length > 0 ? (
              <span className="text-xs text-amber-600 font-medium">Requires sign-off</span>
            ) : (
              <span className="text-xs text-emerald-600 font-medium">All cleared</span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Annual, sick & personal allocations</p>
        </div>

        {/* Training Programs */}
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Active Trainings</span>
            <GraduationCap className="w-4 h-4 text-violet-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {trainings.length}
            </span>
            <span className="text-xs text-blue-600 font-medium">SOC2 compliance focus</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">Skill enablement & compliance</p>
        </div>
      </div>

      {/* Main Dual Grid: Pending Actions & Today's Attendance Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Pending Leave Applications */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 flex flex-col">
          <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Leave Approval Queue</h3>
              <p className="text-xs text-slate-500">Review, approve or reject leave requests</p>
            </div>
            <button
              onClick={() => setActiveTab('leaves')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
            >
              View all ({leaves.length}) <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 flex-1">
            {pendingLeaves.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-xs font-medium text-slate-600">No pending leave requests</p>
                <p className="text-xs text-slate-400 mt-1">All employee leave applications are currently processed.</p>
              </div>
            ) : (
              pendingLeaves.map((leave) => (
                <div key={leave.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-start gap-3">
                    <img
                      src={leave.avatar}
                      alt={leave.employeeName}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-slate-900">{leave.employeeName}</span>
                        <span className="text-xs text-slate-400 font-mono">·</span>
                        <span className="text-xs text-slate-500">{leave.department}</span>
                      </div>
                      <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                        <strong className="capitalize">{leave.leaveType} Leave:</strong> {leave.reason}
                      </p>
                      <div className="mt-2 flex items-center gap-3 text-xs text-slate-500 font-mono tabular-nums">
                        <span>{leave.startDate} to {leave.endDate}</span>
                        <span>·</span>
                        <span className="font-semibold text-slate-900">{leave.daysCount} working days</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => reviewLeave(leave.id, 'rejected')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200 transition-colors"
                      title="Decline request"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                    <button
                      onClick={() => reviewLeave(leave.id, 'approved')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                      title="Approve request"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Department Headcount Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Workforce by Department</h3>
              <span className="text-xs text-slate-500 font-mono tabular-nums">{employees.length} Total</span>
            </div>

            <div className="mt-4 space-y-3.5">
              {departments.map((dept) => {
                const count = employees.filter((e) => e.department === dept).length;
                const percentage = employees.length > 0 ? Math.round((count / employees.length) * 100) : 0;
                return (
                  <div key={dept}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{dept}</span>
                      <span className="font-mono text-slate-500 tabular-nums">
                        {count} ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100">
            <button
              onClick={() => setActiveTab('analytics')}
              className="w-full py-2 px-3 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              View Full Analytics Report &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Today's Attendance Snapshot Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Today's Attendance Roster (Oct 27, 2026)</h3>
            <p className="text-xs text-slate-500">Live check-in times and work locations</p>
          </div>
          <button
            onClick={() => setActiveTab('attendance')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors inline-flex items-center gap-1"
          >
            Attendance Console &rarr;
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Check-In Time</th>
                <th className="py-3 px-5">Work Mode</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Total Hours</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {todayAttendance.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 px-5 font-semibold text-slate-900">
                    {rec.employeeName}
                  </td>
                  <td className="py-3 px-5 text-slate-600">{rec.department}</td>
                  <td className="py-3 px-5 font-mono text-slate-700 tabular-nums">{rec.checkIn}</td>
                  <td className="py-3 px-5 text-slate-600 capitalize">
                    {rec.workMode === 'office' ? 'In-Office (HQ)' : rec.workMode === 'remote' ? 'Remote' : 'Field'}
                  </td>
                  <td className="py-3 px-5">
                    <span
                      className={`inline-flex items-center font-medium ${
                        rec.status === 'present'
                          ? 'text-emerald-700'
                          : rec.status === 'late'
                          ? 'text-amber-700'
                          : rec.status === 'half_day'
                          ? 'text-blue-700'
                          : 'text-slate-600'
                      }`}
                    >
                      {rec.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-5 font-mono text-slate-900 font-semibold tabular-nums">
                    {rec.totalHours.toFixed(1)} hrs
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
