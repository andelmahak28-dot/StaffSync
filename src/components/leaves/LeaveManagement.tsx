import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { LeaveType, LeaveStatus } from '../../types';
import {
  CalendarDays,
  Plus,
  CheckCircle2,
  XCircle,
  Clock,
  Check,
  X,
  FileText,
  Filter,
} from 'lucide-react';

interface LeaveManagementProps {
  isApplyModalOpenInitially?: boolean;
  onCloseApplyModal?: () => void;
}

export const LeaveManagement: React.FC<LeaveManagementProps> = ({
  isApplyModalOpenInitially = false,
  onCloseApplyModal,
}) => {
  const {
    currentUser,
    leaves,
    employees,
    applyLeave,
    reviewLeave,
  } = useHR();

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(isApplyModalOpenInitially);
  const [reviewingLeaveId, setReviewingLeaveId] = useState<string | null>(null);
  const [managerComment, setManagerComment] = useState('');

  // Form state
  const [leaveType, setLeaveType] = useState<LeaveType>('casual');
  const [startDate, setStartDate] = useState('2026-11-02');
  const [endDate, setEndDate] = useState('2026-11-04');
  const [isHalfDay, setIsHalfDay] = useState(false);
  const [reason, setReason] = useState('');
  const [emergencyContact, setEmergencyContact] = useState(currentUser.phone || '+1 (555) 000-0000');

  const employeeRecord = employees.find((e) => e.id === currentUser.id);

  // Calculate day difference
  const calculateDays = (start: string, end: string, half: boolean) => {
    if (half) return 0.5;
    const s = new Date(start);
    const e = new Date(end);
    const diffTime = e.getTime() - s.getTime();
    if (diffTime < 0) return 0;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, diffDays);
  };

  const calculatedDays = calculateDays(startDate, endDate, isHalfDay);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      alert('Please provide a reason for the leave request.');
      return;
    }

    applyLeave({
      employeeId: currentUser.id,
      leaveType,
      startDate,
      endDate,
      daysCount: calculatedDays,
      reason,
      isHalfDay,
      contactDuringLeave: emergencyContact,
    });

    setReason('');
    setIsApplyModalOpen(false);
    if (onCloseApplyModal) onCloseApplyModal();
  };

  // Scope:
  // - Employee only sees their own requests
  // - Manager sees team + own
  // - HR sees all
  const filteredLeaves = leaves.filter((leave) => {
    if (currentUser.role === 'employee' && leave.employeeId !== currentUser.id) {
      return false;
    }
    if (currentUser.role === 'manager') {
      const isDirectReport = employees.some(
        (e) => (e.managerId === currentUser.id || e.id === currentUser.id) && e.id === leave.employeeId
      );
      if (!isDirectReport) return false;
    }

    if (activeTab === 'all') return true;
    return leave.status === activeTab;
  });

  const canApprove = currentUser.role === 'hr' || currentUser.role === 'manager';

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Leave Administration & Time-Off Workflows
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Quota Management & Supervisor Review</span>
            <span aria-hidden="true">·</span>
            <span>Accrual Cycle: Jan - Dec 2026</span>
          </div>
        </div>

        <button
          onClick={() => setIsApplyModalOpen(true)}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          Apply For Leave
        </button>
      </div>

      {/* Quota Balances Card Grid (for current user or employee) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Casual Leave (CL)</span>
            <span className="font-mono text-slate-400">12 / yr</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {employeeRecord?.leaveBalances.casual ?? 8}
            </span>
            <span className="text-xs text-slate-500">days available</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Sick Leave (SL)</span>
            <span className="font-mono text-slate-400">10 / yr</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {employeeRecord?.leaveBalances.sick ?? 6}
            </span>
            <span className="text-xs text-slate-500">days available</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Earned / Paid (PL)</span>
            <span className="font-mono text-slate-400">18 / yr</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {employeeRecord?.leaveBalances.paid ?? 14}
            </span>
            <span className="text-xs text-slate-500">days available</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Maternity/Paternity</span>
            <span className="font-mono text-slate-400">30 / yr</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900 font-mono tabular-nums">
              {employeeRecord?.leaveBalances.maternityPaternity ?? 30}
            </span>
            <span className="text-xs text-slate-500">days available</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => {
            const isActive = activeTab === tab;
            const count = leaves.filter((l) => (tab === 'all' ? true : l.status === tab)).length;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-xs font-mono text-slate-400 tabular-nums">
          {filteredLeaves.length} requests
        </span>
      </div>

      {/* Leave Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Applicant</th>
                <th className="py-3 px-5">Leave Type</th>
                <th className="py-3 px-5">Duration / Dates</th>
                <th className="py-3 px-5">Days</th>
                <th className="py-3 px-5">Reason</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Review Note</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    No leave requests match the selected tab filter.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map((l) => (
                  <tr key={l.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={l.avatar}
                          alt={l.employeeName}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{l.employeeName}</p>
                          <p className="text-[11px] text-slate-400">{l.department}</p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 capitalize font-medium text-slate-800">
                      {l.leaveType}
                    </td>

                    <td className="py-3.5 px-5 font-mono text-slate-700 tabular-nums">
                      {l.startDate} &rarr; {l.endDate}
                    </td>

                    <td className="py-3.5 px-5 font-mono font-bold text-slate-900 tabular-nums">
                      {l.daysCount} {l.isHalfDay ? '(Half)' : 'd'}
                    </td>

                    <td className="py-3.5 px-5 text-slate-600 max-w-xs truncate" title={l.reason}>
                      {l.reason}
                    </td>

                    <td className="py-3.5 px-5">
                      <span
                        className={`capitalize font-semibold ${
                          l.status === 'approved'
                            ? 'text-emerald-700'
                            : l.status === 'rejected'
                            ? 'text-rose-700'
                            : 'text-amber-700'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-slate-500 max-w-xs truncate">
                      {l.reviewComment ? (
                        <span>
                          {l.reviewComment} {l.reviewedBy ? `(by ${l.reviewedBy})` : ''}
                        </span>
                      ) : (
                        <span className="text-slate-400 font-mono">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      {canApprove && l.status === 'pending' && l.employeeId !== currentUser.id ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => reviewLeave(l.id, 'rejected')}
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Decline"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => reviewLeave(l.id, 'approved')}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                            title="Approve"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-400">
                          {l.status === 'pending' ? 'Under Review' : 'Closed'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Leave Modal */}
      {isApplyModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setIsApplyModalOpen(false);
              if (onCloseApplyModal) onCloseApplyModal();
            }}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">Apply for Time Off</h3>
                <button
                  onClick={() => {
                    setIsApplyModalOpen(false);
                    if (onCloseApplyModal) onCloseApplyModal();
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleApply} className="mt-4 space-y-4 text-xs">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Leave Classification *</label>
                  <select
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value as LeaveType)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="casual">Casual Leave (Personal, family obligations)</option>
                    <option value="sick">Sick Leave (Medical, doctor prescriptions)</option>
                    <option value="paid">Earned / Paid Vacation</option>
                    <option value="maternity">Maternity Leave</option>
                    <option value="paternity">Paternity Leave</option>
                    <option value="unpaid">Unpaid Sabbatical</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Start Date *</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">End Date *</label>
                    <input
                      type="date"
                      required
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="halfDay"
                      checked={isHalfDay}
                      onChange={(e) => setIsHalfDay(e.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="halfDay" className="text-slate-700 font-medium cursor-pointer">
                      Half-day allocation only
                    </label>
                  </div>
                  <span className="font-mono text-slate-900 font-bold tabular-nums">
                    Total: {calculatedDays} day(s)
                  </span>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Detailed Reason *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide context for manager review and workload coverage..."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Contact Phone During Leave</label>
                  <input
                    type="text"
                    value={emergencyContact}
                    onChange={(e) => setEmergencyContact(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsApplyModalOpen(false);
                      if (onCloseApplyModal) onCloseApplyModal();
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                  >
                    Submit Leave Application
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
