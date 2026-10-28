export type Role = 'hr' | 'manager' | 'employee';

export type WorkMode = 'office' | 'remote' | 'field';

export type AttendanceStatus = 'present' | 'late' | 'half_day' | 'absent' | 'remote' | 'on_leave';

export type LeaveType = 'casual' | 'sick' | 'paid' | 'maternity' | 'paternity' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
  department: string;
  designation: string;
  employeeId: string;
  phone?: string;
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  avatar: string;
  department: string;
  designation: string;
  managerId: string;
  managerName: string;
  joiningDate: string;
  salary: number;
  employmentType: 'Full-time' | 'Contract' | 'Part-time';
  status: 'active' | 'on_leave' | 'probation' | 'inactive';
  location: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills: string[];
  performanceRating: number; // 1 to 5
  leaveBalances: {
    casual: number;
    sick: number;
    paid: number;
    maternityPaternity: number;
  };
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  date: string; // YYYY-MM-DD
  checkIn: string; // HH:mm:ss
  checkOut?: string; // HH:mm:ss
  totalHours: number;
  status: AttendanceStatus;
  workMode: WorkMode;
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  avatar: string;
  leaveType: LeaveType;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  daysCount: number;
  reason: string;
  isHalfDay: boolean;
  status: LeaveStatus;
  appliedOn: string;
  reviewedBy?: string;
  reviewComment?: string;
  reviewedAt?: string;
  contactDuringLeave?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: 'Company News' | 'Policy Update' | 'Event' | 'Health & Safety' | 'Executive Message';
  priority: Priority;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  targetDepartment: string; // 'All' or specific department
  createdAt: string;
  isPinned: boolean;
  readBy: string[]; // employeeIds
}

export interface TrainingModule {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  summary: string;
}

export interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  category: 'Engineering' | 'Leadership' | 'Security & Compliance' | 'Product & Design' | 'Workplace Culture';
  instructor: string;
  dueDate: string;
  enrolledEmployeeIds: string[];
  modules: TrainingModule[];
  thumbnailColor: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'leave' | 'attendance' | 'announcement' | 'training' | 'system';
  linkTab?: string;
}
