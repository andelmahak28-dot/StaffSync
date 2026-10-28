import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { Employee, Role } from '../../types';
import { EmployeeProfileModal } from './EmployeeProfileModal';
import {
  Users,
  Search,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  X,
  Check,
  Building,
  Mail,
  Phone,
  Shield,
} from 'lucide-react';

interface EmployeeDirectoryProps {
  isAddModalOpenInitially?: boolean;
  onCloseAddModal?: () => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  isAddModalOpenInitially = false,
  onCloseAddModal,
}) => {
  const { employees, addEmployee, updateEmployee, deleteEmployee, currentUser } = useHR();

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(isAddModalOpenInitially);

  // Form state for add / edit
  const [formData, setFormData] = useState<{
    name: string;
    email: string;
    phone: string;
    role: Role;
    department: string;
    designation: string;
    managerName: string;
    joiningDate: string;
    salary: number;
    employmentType: Employee['employmentType'];
    location: string;
    status: Employee['status'];
    skills: string;
    emergencyContactName: string;
    emergencyContactRel: string;
    emergencyContactPhone: string;
  }>({
    name: '',
    email: '',
    phone: '',
    role: 'employee',
    department: 'Engineering',
    designation: '',
    managerName: 'Marcus Chen',
    joiningDate: '2026-10-27',
    salary: 95000,
    employmentType: 'Full-time',
    location: 'Headquarters - New York',
    status: 'active',
    skills: 'React, TypeScript, Node.js',
    emergencyContactName: '',
    emergencyContactRel: '',
    emergencyContactPhone: '',
  });

  const departments = ['All', 'Engineering', 'Product & Design', 'Marketing', 'Human Resources', 'Finance', 'Operations'];

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    const matchesStatus = statusFilter === 'all' || emp.status === statusFilter;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenAdd = () => {
    setFormData({
      name: '',
      email: '',
      phone: '+1 (555) ',
      role: 'employee',
      department: 'Engineering',
      designation: '',
      managerName: 'Marcus Chen',
      joiningDate: '2026-10-27',
      salary: 105000,
      employmentType: 'Full-time',
      location: 'Headquarters - New York',
      status: 'active',
      skills: 'TypeScript, React, REST APIs',
      emergencyContactName: '',
      emergencyContactRel: 'Spouse',
      emergencyContactPhone: '+1 (555) ',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (emp: Employee) => {
    setEditingEmployee(emp);
    setFormData({
      name: emp.name,
      email: emp.email,
      phone: emp.phone,
      role: emp.role,
      department: emp.department,
      designation: emp.designation,
      managerName: emp.managerName,
      joiningDate: emp.joiningDate,
      salary: emp.salary,
      employmentType: emp.employmentType,
      location: emp.location,
      status: emp.status,
      skills: emp.skills.join(', '),
      emergencyContactName: emp.emergencyContact.name,
      emergencyContactRel: emp.emergencyContact.relationship,
      emergencyContactPhone: emp.emergencyContact.phone,
    });
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.designation) {
      alert('Please fill out all required fields.');
      return;
    }

    const newEmp: Omit<Employee, 'id'> = {
      employeeId: `EMP-${Math.floor(100 + Math.random() * 900)}`,
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '+1 (555) 000-0000',
      role: formData.role,
      avatar: '/src/assets/images/avatar_staff_dev_1793170445021.jpg',
      department: formData.department,
      designation: formData.designation,
      managerId: 'emp-002',
      managerName: formData.managerName,
      joiningDate: formData.joiningDate,
      salary: Number(formData.salary),
      employmentType: formData.employmentType,
      status: formData.status,
      location: formData.location,
      emergencyContact: {
        name: formData.emergencyContactName || 'Family Contact',
        relationship: formData.emergencyContactRel || 'Relative',
        phone: formData.emergencyContactPhone || formData.phone,
      },
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      performanceRating: 4.5,
      leaveBalances: {
        casual: 12,
        sick: 10,
        paid: 18,
        maternityPaternity: 30,
      },
    };

    addEmployee(newEmp);
    setIsAddModalOpen(false);
    if (onCloseAddModal) onCloseAddModal();
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEmployee) return;

    updateEmployee(editingEmployee.id, {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      department: formData.department,
      designation: formData.designation,
      managerName: formData.managerName,
      joiningDate: formData.joiningDate,
      salary: Number(formData.salary),
      employmentType: formData.employmentType,
      status: formData.status,
      location: formData.location,
      skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      emergencyContact: {
        name: formData.emergencyContactName,
        relationship: formData.emergencyContactRel,
        phone: formData.emergencyContactPhone,
      },
    });

    setEditingEmployee(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-slate-900">
            Workforce Directory & Staff Roster
          </h2>
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
            <span>Organizational Hierarchy & Records</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums">{employees.length} Active Personnel</span>
          </div>
        </div>

        {currentUser.role === 'hr' && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Employee
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by employee name, ID, role or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-900 placeholder-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs py-2 px-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="probation">Probation</option>
              <option value="on_leave">On Leave</option>
            </select>
          </div>
        </div>

        {/* Department Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-t border-slate-100 pt-3">
          {departments.map((dept) => {
            const count = dept === 'All' ? employees.length : employees.filter((e) => e.department === dept).length;
            const isActive = departmentFilter === dept;

            return (
              <button
                key={dept}
                onClick={() => setDepartmentFilter(dept)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{dept}</span>
                <span className={`font-mono text-[10px] ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* High-Density Data Grid */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-5">Department</th>
                <th className="py-3 px-5">Designation</th>
                <th className="py-3 px-5">Manager</th>
                <th className="py-3 px-5 text-right">Compensation</th>
                <th className="py-3 px-5">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No employees match your search query or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors">
                    {/* Employee Name & Avatar */}
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={emp.avatar}
                          alt={emp.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{emp.name}</p>
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                            <span>{emp.employeeId}</span>
                            <span>·</span>
                            <span>{emp.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-5 text-slate-700 font-medium">
                      {emp.department}
                    </td>

                    {/* Designation */}
                    <td className="py-3.5 px-5 text-slate-600">
                      {emp.designation}
                    </td>

                    {/* Manager */}
                    <td className="py-3.5 px-5 text-slate-600">
                      {emp.managerName}
                    </td>

                    {/* Salary (Right-aligned tabular) */}
                    <td className="py-3.5 px-5 text-right font-mono text-slate-900 font-semibold tabular-nums">
                      ${emp.salary.toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5">
                      <span
                        className={`capitalize font-medium ${
                          emp.status === 'active'
                            ? 'text-emerald-700'
                            : emp.status === 'probation'
                            ? 'text-amber-700'
                            : 'text-slate-500'
                        }`}
                      >
                        {emp.status}
                      </span>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                          title="View dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {(currentUser.role === 'hr' || currentUser.id === emp.id) && (
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Edit employee record"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {currentUser.role === 'hr' && emp.id !== currentUser.id && (
                          <button
                            onClick={() => {
                              if (confirm(`Remove ${emp.name} from roster?`)) {
                                deleteEmployee(emp.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition-colors"
                            title="Remove from roster"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employee Dossier Modal */}
      <EmployeeProfileModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onEdit={(emp) => {
          setSelectedEmployee(null);
          handleOpenEdit(emp);
        }}
      />

      {/* Add / Edit Employee Modal Form */}
      {(isAddModalOpen || editingEmployee) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => {
              setIsAddModalOpen(false);
              setEditingEmployee(null);
            }}
          />

          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-xl bg-white rounded-xl shadow-xl border border-slate-200 p-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200">
                <h3 className="text-base font-bold text-slate-900">
                  {editingEmployee ? `Edit Record: ${editingEmployee.name}` : 'Onboard New Employee'}
                </h3>
                <button
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setEditingEmployee(null);
                  }}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={editingEmployee ? handleSaveEdit : handleSaveAdd} className="mt-4 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Company Email *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Department</label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="Engineering">Engineering</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Human Resources">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="Operations">Operations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Designation / Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">System Role</label>
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="hr">HR Personnel (Admin)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Reporting Manager</label>
                    <input
                      type="text"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Base Salary (USD / yr)</label>
                    <input
                      type="number"
                      value={formData.salary}
                      onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Employment Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="probation">Probation</option>
                      <option value="on_leave">On Leave</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block font-medium text-slate-700 mb-1">Office Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium text-slate-700 mb-1">Skills (comma-separated)</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setEditingEmployee(null);
                    }}
                    className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors shadow-xs"
                  >
                    {editingEmployee ? 'Update Record' : 'Save & Onboard'}
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
