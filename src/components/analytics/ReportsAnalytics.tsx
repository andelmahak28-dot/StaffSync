import React from 'react';
import { useHR } from '../../context/HRContext';
import {
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CalendarDays,
  FileSpreadsheet,
  Download,
  Building,
  DollarSign,
  Award,
} from 'lucide-react';

export const ReportsAnalytics: React.FC = () => {
  const { employees, attendance, leaves, trainings } = useHR();

  // Metrics
  const totalEmployees = employees.length;
  const totalPayroll = employees.reduce((acc, curr) => acc + curr.salary, 0);
  const avgSalary = totalEmployees > 0 ? Math.round(totalPayroll / totalEmployees) : 0;
  
  const todayAttendance = attendance.filter((a) => a.date === '2026-10-27');
  const attendanceRate = totalEmployees > 0
    ? Math.round((todayAttendance.length / totalEmployees) * 100)
    : 0;

  const approvedLeaves = leaves.filter((l) => l.status === 'approved');
  const totalDaysOffApproved = approvedLeaves.reduce((acc, curr) => acc + curr.daysCount, 0);

  const avgRating = totalEmployees > 0
    ? (employees.reduce((acc, curr) => acc + curr.performanceRating, 0) / totalEmployees).toFixed(2)
    : '0.0';

  const departments = ['Engineering', 'Product & Design', 'Marketing', 'Human Resources', 'Finance', 'Operations'];

  const deptMetrics = departments.map((dept) => {
    const deptEmps = employees.filter((e) => e.department === dept);
    const count = deptEmps.length;
    const deptPayroll = deptEmps.reduce((acc, curr) => acc + curr.salary, 0);
    const deptAvg = count > 0 ? Math.round(deptPayroll / count) : 0;
    const deptLeaves = leaves.filter((l) => l.department === dept && l.status === 'approved').length;
    return {
      department: dept,
      count,
      percentage: totalEmployees > 0 ? Math.round((count / totalEmployees) * 100) : 0,
      payroll: deptPayroll,
      avgSalary: deptAvg,
      approvedLeaves: deptLeaves,
    };
  });

  const exportEmployeesCSV = () => {
    const headers = ['Employee ID', 'Name', 'Email', 'Role', 'Department', 'Designation', 'Manager', 'Salary', 'Joining Date', 'Status', 'Performance'];
    const rows = employees.map((e) => [
      e.employeeId,
      `"${e.name}"`,
      e.email,
      e.role,
      `"${e.department}"`,
      `"${e.designation}"`,
      `"${e.managerName}"`,
      e.salary,
      e.joiningDate,
      e.status,
      e.performanceRating,
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csv);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `StaffSync_Employees_Roster_${Date.now()}.csv`;
    a.click();
  };

  const exportLeavesCSV = () => {
    const headers = ['Leave ID', 'Employee Name', 'Department', 'Leave Type', 'Start Date', 'End Date', 'Days', 'Status', 'Reason', 'Reviewed By'];
    const rows = leaves.map((l) => [
      l.id,
      `"${l.employeeName}"`,
      `"${l.department}"`,
      l.leaveType,
      l.startDate,
      l.endDate,
      l.daysCount,
      l.status,
      `"${(l.reason || '').replace(/"/g, '""')}"`,
      `"${l.reviewedBy || 'Pending'}"`,
    ]);

    const csv = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encoded = encodeURI(csv);
    const a = document.createElement('a');
    a.href = encoded;
    a.download = `StaffSync_Leaves_Report_${Date.now()}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Workforce Intelligence & Executive Analytics
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Organizational Metrics, Compensation & Compliance</span>
            <span aria-hidden="true">·</span>
            <span>Q4 2026 Audit Period</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={exportEmployeesCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shadow-xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            Export Staff Roster
          </button>
          <button
            onClick={exportLeavesCSV}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors whitespace-nowrap shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-emerald-600" />
            Export Leaves Audit
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Annual Run-Rate Payroll</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            ${(totalPayroll / 1000).toFixed(0)}k USD
          </div>
          <p className="text-[11px] text-slate-400 mt-2 font-mono tabular-nums">
            Average: ${avgSalary.toLocaleString()} / headcount
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Today's Attendance Compliance</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {attendanceRate}%
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Target SLA: 90% benchmark
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Approved Days Off (Q4)</span>
            <CalendarDays className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {totalDaysOffApproved} Days
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Utilization within healthy range
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Mean Performance Rating</span>
            <Award className="w-4 h-4 text-violet-600" />
          </div>
          <div className="mt-2 text-2xl font-bold text-slate-900 font-mono tabular-nums">
            {avgRating} / 5.0
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            Across 100% evaluated personnel
          </p>
        </div>
      </div>

      {/* Department Breakdown Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Department Operational Breakdown</h3>
            <p className="text-xs text-slate-500">Headcount distribution, average compensation & approved time-off</p>
          </div>
          <span className="text-xs font-mono text-slate-500 tabular-nums">
            {departments.length} Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Headcount</th>
                <th className="py-3 px-5">Workforce Share</th>
                <th className="py-3 px-5 text-right">Avg Salary</th>
                <th className="py-3 px-5 text-right">Total Payroll</th>
                <th className="py-3 px-5 text-center">Approved Leaves</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deptMetrics.map((d) => (
                <tr key={d.department} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-5 font-semibold text-slate-900">
                    {d.department}
                  </td>
                  <td className="py-3.5 px-5 font-mono text-slate-800 font-bold tabular-nums">
                    {d.count}
                  </td>
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full"
                          style={{ width: `${d.percentage}%` }}
                        />
                      </div>
                      <span className="font-mono text-slate-500 tabular-nums text-[11px]">
                        {d.percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-slate-700 tabular-nums">
                    ${d.avgSalary.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono text-slate-900 font-bold tabular-nums">
                    ${d.payroll.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-5 text-center font-mono text-slate-600 tabular-nums">
                    {d.approvedLeaves}
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
