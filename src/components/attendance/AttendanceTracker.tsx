import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { WorkMode, AttendanceStatus } from '../../types';
import {
  Clock,
  Calendar,
  Building,
  Home,
  MapPin,
  Play,
  Square,
  Download,
  Filter,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const AttendanceTracker: React.FC = () => {
  const {
    currentUser,
    attendance,
    employees,
    isCheckedIn,
    workSessionSeconds,
    currentWorkMode,
    checkIn,
    checkOut,
    todayCheckInRecord,
  } = useHR();

  const [dateFilter, setDateFilter] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMode, setSelectedMode] = useState<WorkMode>(currentWorkMode);
  const [workNotes, setWorkNotes] = useState('');

  const departments = ['All', 'Engineering', 'Product & Design', 'Marketing', 'Human Resources', 'Finance', 'Operations'];

  const formatTimer = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleToggleCheck = () => {
    if (isCheckedIn) {
      checkOut(workNotes);
      setWorkNotes('');
    } else {
      checkIn(selectedMode, workNotes);
      setWorkNotes('');
    }
  };

  // Scope records based on role:
  // - Employee only sees their own attendance
  // - Manager sees direct reports & own
  // - HR sees all
  const filteredRecords = attendance.filter((rec) => {
    if (currentUser.role === 'employee' && rec.employeeId !== currentUser.id) {
      return false;
    }
    if (currentUser.role === 'manager') {
      const isDirectReport = employees.some(
        (e) => (e.managerId === currentUser.id || e.id === currentUser.id) && e.id === rec.employeeId
      );
      if (!isDirectReport) return false;
    }

    const matchesDate = !dateFilter || rec.date === dateFilter;
    const matchesDept = departmentFilter === 'All' || rec.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || rec.status === statusFilter;

    return matchesDate && matchesDept && matchesStatus;
  });

  const exportCSV = () => {
    const headers = ['Date', 'Employee ID', 'Name', 'Department', 'Check-In', 'Check-Out', 'Total Hours', 'Work Mode', 'Status', 'Notes'];
    const rows = filteredRecords.map((r) => [
      r.date,
      r.employeeId,
      `"${r.employeeName}"`,
      `"${r.department}"`,
      r.checkIn,
      r.checkOut || 'Active',
      r.totalHours,
      r.workMode,
      r.status,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StaffSync_Attendance_Export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Attendance Registry & Operational Time Logs
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Biometric & Digital Timestamp Verification</span>
            <span aria-hidden="true">·</span>
            <span>Policy: 40 hrs/wk baseline</span>
          </div>
        </div>

        <button
          onClick={exportCSV}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shadow-xs"
        >
          <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
          Export Attendance (CSV)
        </button>
      </div>

      {/* Clock-in Module for Active User */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
              isCheckedIn ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500'
            }`}>
              <Clock className="w-7 h-7" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">Your Current Session</span>
                <span className="text-xs text-slate-300">·</span>
                <span className={`text-xs font-bold ${isCheckedIn ? 'text-emerald-600' : 'text-slate-400'}`}>
                  {isCheckedIn ? 'CHECKED IN (LOGGING HOURS)' : 'CURRENTLY OFF DUTY'}
                </span>
              </div>
              <div className="text-2xl font-mono font-bold text-slate-900 tabular-nums mt-0.5">
                {formatTimer(workSessionSeconds)}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Mode selection if not checked in */}
            {!isCheckedIn && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setSelectedMode('office')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    selectedMode === 'office' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Building className="w-3.5 h-3.5" />
                  Office
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('remote')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    selectedMode === 'remote' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <Home className="w-3.5 h-3.5" />
                  Remote
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedMode('field')}
                  className={`px-3 py-1.5 rounded-md transition-colors flex items-center gap-1.5 ${
                    selectedMode === 'field' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  Field
                </button>
              </div>
            )}

            <button
              onClick={handleToggleCheck}
              className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-xs ${
                isCheckedIn
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isCheckedIn ? (
                <>
                  <Square className="w-4 h-4 fill-current" />
                  Check Out Now
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  Check In Now
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          {/* Department Filter */}
          {currentUser.role !== 'employee' && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">Department:</span>
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="present">Present</option>
              <option value="late">Late Arrival</option>
              <option value="half_day">Half Day</option>
              <option value="remote">Remote</option>
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Filter Date:</span>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <span className="text-slate-500 font-mono tabular-nums">
          Showing {filteredRecords.length} records
        </span>
      </div>

      {/* Attendance Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Date</th>
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Check In</th>
                <th className="py-3 px-5">Check Out</th>
                <th className="py-3 px-5">Work Mode</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5">Total Hours</th>
                <th className="py-3 px-5">Daily Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    No attendance records match the selected date or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredRecords.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-slate-700 font-medium tabular-nums">
                      {r.date}
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-900">
                      {r.employeeName}
                    </td>
                    <td className="py-3.5 px-5 text-slate-600">{r.department}</td>
                    <td className="py-3.5 px-5 font-mono text-slate-800 font-medium tabular-nums">
                      {r.checkIn}
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-600 tabular-nums">
                      {r.checkOut || (
                        <span className="text-emerald-700 font-semibold font-mono text-[11px]">
                          In Progress
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 capitalize text-slate-600">
                      {r.workMode === 'office' ? 'In-Office (HQ)' : r.workMode === 'remote' ? 'Remote' : 'Field'}
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`capitalize font-medium ${
                          r.status === 'present'
                            ? 'text-emerald-700'
                            : r.status === 'late'
                            ? 'text-amber-700'
                            : r.status === 'half_day'
                            ? 'text-blue-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {r.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-mono text-slate-900 font-bold tabular-nums">
                      {r.totalHours.toFixed(1)} hrs
                    </td>
                    <td className="py-3.5 px-5 text-slate-500 max-w-xs truncate">
                      {r.notes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
