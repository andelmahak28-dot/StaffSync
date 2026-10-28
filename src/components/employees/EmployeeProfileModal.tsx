import React, { useState } from 'react';
import { Employee } from '../../types';
import { useHR } from '../../context/HRContext';
import {
  X,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Shield,
  Edit2,
  Check,
} from 'lucide-react';

interface EmployeeProfileModalProps {
  employee: Employee | null;
  onClose: () => void;
  onEdit: (employee: Employee) => void;
}

export const EmployeeProfileModal: React.FC<EmployeeProfileModalProps> = ({
  employee,
  onClose,
  onEdit,
}) => {
  const { currentUser } = useHR();
  const [activeTab, setActiveTab] = useState<'overview' | 'employment' | 'leaves'>('overview');

  if (!employee) return null;

  const canEdit = currentUser.role === 'hr' || currentUser.id === employee.id;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Header Cover & Close */}
          <div className="h-28 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-900 relative p-4 flex justify-end">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-black/20 text-white/80 hover:text-white hover:bg-black/40 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Profile Identity Bar */}
          <div className="px-6 pb-4 relative -mt-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="flex items-end gap-4">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md bg-white shrink-0"
                />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    {employee.name}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    {employee.designation} · {employee.department}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    ID: {employee.employeeId} · Role: {employee.role.toUpperCase()}
                  </p>
                </div>
              </div>

              {canEdit && (
                <button
                  onClick={() => onEdit(employee)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-6 border-b border-slate-200 mt-6 text-xs font-medium">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'overview'
                    ? 'border-b-2 border-slate-900 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Overview & Contact
              </button>
              <button
                onClick={() => setActiveTab('employment')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'employment'
                    ? 'border-b-2 border-slate-900 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Job & Compensation
              </button>
              <button
                onClick={() => setActiveTab('leaves')}
                className={`pb-2.5 transition-colors ${
                  activeTab === 'leaves'
                    ? 'border-b-2 border-slate-900 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Leave Balances & Rating
              </button>
            </div>
          </div>

          {/* Modal Tab Content */}
          <div className="px-6 pb-6 pt-2 text-xs">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-400 block mb-1">Email Address</span>
                    <div className="flex items-center gap-2 font-mono text-slate-800 font-medium">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {employee.email}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-400 block mb-1">Phone Number</span>
                    <div className="flex items-center gap-2 font-mono text-slate-800 font-medium">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {employee.phone}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-400 block mb-1">Office Location</span>
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {employee.location}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-400 block mb-1">Reporting Manager</span>
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <Shield className="w-3.5 h-3.5 text-slate-400" />
                      {employee.managerName}
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400 block mb-1">Emergency Contact</span>
                  <div className="flex items-center justify-between text-slate-800">
                    <span className="font-semibold">
                      {employee.emergencyContact.name} ({employee.emergencyContact.relationship})
                    </span>
                    <span className="font-mono text-slate-600">{employee.emergencyContact.phone}</span>
                  </div>
                </div>

                <div>
                  <span className="text-[11px] text-slate-400 block mb-2">Core Skills & Competencies</span>
                  <div className="flex flex-wrap gap-1.5">
                    {employee.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded text-[11px] font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'employment' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-400 block mb-1">Date Joined</span>
                    <div className="flex items-center gap-2 font-mono text-slate-800 font-semibold tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {employee.joiningDate}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-400 block mb-1">Employment Type</span>
                    <div className="flex items-center gap-2 text-slate-800 font-semibold">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      {employee.employmentType}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-400 block mb-1">Base Annual Salary</span>
                    <div className="flex items-center gap-2 font-mono text-slate-800 font-bold tabular-nums">
                      <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                      ${employee.salary.toLocaleString()} USD
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="text-[11px] text-slate-400 block mb-1">Roster Status</span>
                    <span className="capitalize font-semibold text-emerald-700">
                      {employee.status}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'leaves' && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <span className="text-slate-600 font-medium">Performance Evaluation Rating</span>
                  <div className="flex items-center gap-1 font-mono font-bold text-slate-900 tabular-nums">
                    <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                    {employee.performanceRating.toFixed(1)} / 5.0 (Exceeds Expectations)
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 uppercase block">Casual</span>
                    <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                      {employee.leaveBalances.casual}
                    </span>
                    <span className="text-[10px] text-slate-400 block">days left</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 uppercase block">Sick</span>
                    <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                      {employee.leaveBalances.sick}
                    </span>
                    <span className="text-[10px] text-slate-400 block">days left</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 uppercase block">Paid</span>
                    <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                      {employee.leaveBalances.paid}
                    </span>
                    <span className="text-[10px] text-slate-400 block">days left</span>
                  </div>

                  <div className="p-3 rounded-lg border border-slate-200 text-center">
                    <span className="text-[10px] text-slate-500 uppercase block">Maternity/Pat</span>
                    <span className="font-mono text-base font-bold text-slate-900 tabular-nums">
                      {employee.leaveBalances.maternityPaternity}
                    </span>
                    <span className="text-[10px] text-slate-400 block">days left</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
