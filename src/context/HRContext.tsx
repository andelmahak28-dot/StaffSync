import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Employee,
  AttendanceRecord,
  LeaveRequest,
  Announcement,
  TrainingProgram,
  NotificationItem,
  Role,
  WorkMode,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_TRAININGS,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

interface HRContextType {
  currentUser: User;
  allUsers: User[];
  setCurrentUser: (user: User) => void;
  switchRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Employees
  employees: Employee[];
  addEmployee: (emp: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  
  // Attendance
  attendance: AttendanceRecord[];
  isCheckedIn: boolean;
  todayCheckInRecord: AttendanceRecord | null;
  workSessionSeconds: number;
  currentWorkMode: WorkMode;
  checkIn: (mode: WorkMode, notes?: string) => void;
  checkOut: (notes?: string) => void;
  
  // Leaves
  leaves: LeaveRequest[];
  applyLeave: (leave: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'department' | 'employeeName' | 'avatar'>) => void;
  reviewLeave: (leaveId: string, status: 'approved' | 'rejected', comment?: string) => void;
  
  // Announcements
  announcements: Announcement[];
  createAnnouncement: (ann: Omit<Announcement, 'id' | 'createdAt' | 'readBy' | 'authorName' | 'authorRole' | 'authorAvatar'>) => void;
  markAnnouncementAsRead: (id: string) => void;
  
  // Trainings
  trainings: TrainingProgram[];
  createTraining: (prog: Omit<TrainingProgram, 'id'>) => void;
  toggleModuleCompletion: (programId: string, moduleId: string) => void;
  enrollEmployee: (programId: string, employeeId: string) => void;
  
  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Reset Data
  resetToDefaults: () => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

const STORAGE_KEYS = {
  CURRENT_USER: 'staffsync_current_user_v1',
  EMPLOYEES: 'staffsync_employees_v1',
  ATTENDANCE: 'staffsync_attendance_v1',
  LEAVES: 'staffsync_leaves_v1',
  ANNOUNCEMENTS: 'staffsync_announcements_v1',
  TRAININGS: 'staffsync_trainings_v1',
  NOTIFICATIONS: 'staffsync_notifications_v1',
  SESSION: 'staffsync_active_session_v1',
};

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_USERS[0]; // Dr. Evelyn Reed (HR)
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');

  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EMPLOYEES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_EMPLOYEES;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ATTENDANCE;
  });

  const [leaves, setLeaves] = useState<LeaveRequest[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LEAVES);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_LEAVES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ANNOUNCEMENTS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  const [trainings, setTrainings] = useState<TrainingProgram[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRAININGS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_TRAININGS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* ignore */ }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Today's attendance tracking
  const todayDateString = '2026-10-27';
  const todayRecord = attendance.find(
    (a) => a.employeeId === currentUser.id && a.date === todayDateString
  ) || null;

  const [isCheckedIn, setIsCheckedIn] = useState<boolean>(
    Boolean(todayRecord && !todayRecord.checkOut)
  );
  const [currentWorkMode, setCurrentWorkMode] = useState<WorkMode>(
    todayRecord ? todayRecord.workMode : 'office'
  );
  const [workSessionSeconds, setWorkSessionSeconds] = useState<number>(() => {
    if (todayRecord) {
      return Math.round(todayRecord.totalHours * 3600);
    }
    return 0;
  });

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ANNOUNCEMENTS, JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRAININGS, JSON.stringify(trainings));
  }, [trainings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Real-time second counter when checked in
  useEffect(() => {
    if (!isCheckedIn) return;
    const timer = setInterval(() => {
      setWorkSessionSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isCheckedIn]);

  // When switching user, update attendance status
  useEffect(() => {
    const userTodayRecord = attendance.find(
      (a) => a.employeeId === currentUser.id && a.date === todayDateString
    );
    if (userTodayRecord && !userTodayRecord.checkOut) {
      setIsCheckedIn(true);
      setCurrentWorkMode(userTodayRecord.workMode);
      setWorkSessionSeconds(Math.round(userTodayRecord.totalHours * 3600));
    } else {
      setIsCheckedIn(false);
      setWorkSessionSeconds(userTodayRecord ? Math.round(userTodayRecord.totalHours * 3600) : 0);
    }
  }, [currentUser.id, attendance]);

  const switchRole = (role: Role) => {
    const target = INITIAL_USERS.find((u) => u.role === role);
    if (target) {
      setCurrentUser(target);
    }
  };

  const checkIn = (mode: WorkMode, notes?: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    
    // Check if record exists for today
    const existingIndex = attendance.findIndex(
      (a) => a.employeeId === currentUser.id && a.date === todayDateString
    );

    let updatedAttendance = [...attendance];
    if (existingIndex >= 0) {
      updatedAttendance[existingIndex] = {
        ...updatedAttendance[existingIndex],
        checkIn: timeStr,
        checkOut: undefined,
        workMode: mode,
        notes: notes || updatedAttendance[existingIndex].notes,
      };
    } else {
      const newRecord: AttendanceRecord = {
        id: `att-${Date.now()}`,
        employeeId: currentUser.id,
        employeeName: currentUser.name,
        department: currentUser.department,
        date: todayDateString,
        checkIn: timeStr,
        totalHours: 0.1,
        status: mode === 'remote' ? 'remote' : 'present',
        workMode: mode,
        notes: notes || 'Standard check-in via portal',
      };
      updatedAttendance = [newRecord, ...updatedAttendance];
    }

    setAttendance(updatedAttendance);
    setIsCheckedIn(true);
    setCurrentWorkMode(mode);

    // Notify
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Clocked In Successfully',
      message: `Checked in at ${timeStr} (${mode === 'office' ? 'In-Office' : mode === 'remote' ? 'Remote' : 'Field'}). Session is active.`,
      timestamp: 'Just now',
      read: false,
      type: 'attendance',
      linkTab: 'attendance',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const checkOut = (notes?: string) => {
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const hours = Math.max(0.5, Number((workSessionSeconds / 3600).toFixed(2)));

    const updated = attendance.map((a) => {
      if (a.employeeId === currentUser.id && a.date === todayDateString) {
        return {
          ...a,
          checkOut: timeStr,
          totalHours: hours,
          notes: notes ? `${a.notes ? a.notes + ' | ' : ''}${notes}` : a.notes,
        };
      }
      return a;
    });

    setAttendance(updated);
    setIsCheckedIn(false);

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Clocked Out Successfully',
      message: `Checked out at ${timeStr}. Total time logged today: ${hours} hours.`,
      timestamp: 'Just now',
      read: false,
      type: 'attendance',
      linkTab: 'attendance',
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const applyLeave = (leaveData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn' | 'department' | 'employeeName' | 'avatar'>) => {
    const newLeave: LeaveRequest = {
      ...leaveData,
      id: `lv-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: currentUser.department,
      avatar: currentUser.avatar,
      status: 'pending',
      appliedOn: '2026-10-27',
    };

    setLeaves((prev) => [newLeave, ...prev]);

    // Create notifications for managers and HR
    const notifsToAdd: NotificationItem[] = [
      {
        id: `notif-${Date.now()}-emp`,
        userId: currentUser.id,
        title: 'Leave Request Submitted',
        message: `Your request for ${newLeave.daysCount} day(s) of ${newLeave.leaveType} leave has been submitted.`,
        timestamp: 'Just now',
        read: false,
        type: 'leave',
        linkTab: 'leaves',
      },
      {
        id: `notif-${Date.now()}-mgr`,
        userId: 'emp-002', // Marcus Chen
        title: `New Leave Request: ${currentUser.name}`,
        message: `${currentUser.name} requested ${newLeave.daysCount} days leave starting ${newLeave.startDate}.`,
        timestamp: 'Just now',
        read: false,
        type: 'leave',
        linkTab: 'leaves',
      },
      {
        id: `notif-${Date.now()}-hr`,
        userId: 'emp-001', // Dr. Evelyn Reed
        title: `Leave Application: ${currentUser.name}`,
        message: `${currentUser.name} (${currentUser.department}) applied for ${newLeave.leaveType} leave.`,
        timestamp: 'Just now',
        read: false,
        type: 'leave',
        linkTab: 'leaves',
      },
    ];

    setNotifications((prev) => [...notifsToAdd, ...prev]);
  };

  const reviewLeave = (leaveId: string, status: 'approved' | 'rejected', comment?: string) => {
    const target = leaves.find((l) => l.id === leaveId);
    if (!target) return;

    const updated = leaves.map((l) => {
      if (l.id === leaveId) {
        return {
          ...l,
          status,
          reviewedBy: currentUser.name,
          reviewedAt: '2026-10-27',
          reviewComment: comment || (status === 'approved' ? 'Request approved.' : 'Request could not be accommodated at this time.'),
        };
      }
      return l;
    });

    // If approved, deduct leave balance for employee
    if (status === 'approved') {
      setEmployees((prev) =>
        prev.map((emp) => {
          if (emp.id === target.employeeId) {
            const currentBalances = { ...emp.leaveBalances };
            if (target.leaveType === 'casual') {
              currentBalances.casual = Math.max(0, currentBalances.casual - target.daysCount);
            } else if (target.leaveType === 'sick') {
              currentBalances.sick = Math.max(0, currentBalances.sick - target.daysCount);
            } else if (target.leaveType === 'paid') {
              currentBalances.paid = Math.max(0, currentBalances.paid - target.daysCount);
            }
            return { ...emp, leaveBalances: currentBalances };
          }
          return emp;
        })
      );
    }

    setLeaves(updated);

    // Notify employee of decision
    const decisionNotif: NotificationItem = {
      id: `notif-${Date.now()}-dec`,
      userId: target.employeeId,
      title: `Leave Request ${status === 'approved' ? 'Approved' : 'Declined'}`,
      message: `${currentUser.name} has ${status} your leave request for ${target.startDate} to ${target.endDate}.${comment ? ` Note: "${comment}"` : ''}`,
      timestamp: 'Just now',
      read: false,
      type: 'leave',
      linkTab: 'leaves',
    };

    setNotifications((prev) => [decisionNotif, ...prev]);
  };

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newId = `emp-${Date.now().toString().slice(-4)}`;
    const newEmployee: Employee = {
      ...empData,
      id: newId,
    };
    setEmployees((prev) => [newEmployee, ...prev]);

    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Employee Onboarded',
      message: `${newEmployee.name} has been added to ${newEmployee.department} as ${newEmployee.designation}.`,
      timestamp: 'Just now',
      read: false,
      type: 'system',
      linkTab: 'employees',
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const updateEmployee = (id: string, updates: Partial<Employee>) => {
    setEmployees((prev) =>
      prev.map((emp) => (emp.id === id ? { ...emp, ...updates } : emp))
    );
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({
        ...prev,
        name: updates.name || prev.name,
        email: updates.email || prev.email,
        phone: updates.phone || prev.phone,
        department: updates.department || prev.department,
        designation: updates.designation || prev.designation,
      }));
    }
  };

  const deleteEmployee = (id: string) => {
    setEmployees((prev) => prev.filter((emp) => emp.id !== id));
  };

  const createAnnouncement = (
    annData: Omit<Announcement, 'id' | 'createdAt' | 'readBy' | 'authorName' | 'authorRole' | 'authorAvatar'>
  ) => {
    const newAnn: Announcement = {
      ...annData,
      id: `ann-${Date.now()}`,
      createdAt: '2026-10-27',
      authorName: currentUser.name,
      authorRole: currentUser.designation,
      authorAvatar: currentUser.avatar,
      readBy: [currentUser.id],
    };

    setAnnouncements((prev) => [newAnn, ...prev]);

    // Broadcast notification to all users
    const broadcastNotifs: NotificationItem[] = INITIAL_USERS.map((u) => ({
      id: `notif-${Date.now()}-${u.id}`,
      userId: u.id,
      title: `Announcement: ${newAnn.title}`,
      message: `Posted by ${newAnn.authorName} for ${newAnn.targetDepartment} department(s).`,
      timestamp: 'Just now',
      read: u.id === currentUser.id,
      type: 'announcement',
      linkTab: 'announcements',
    }));

    setNotifications((prev) => [...broadcastNotifs, ...prev]);
  };

  const markAnnouncementAsRead = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((ann) => {
        if (ann.id === id && !ann.readBy.includes(currentUser.id)) {
          return { ...ann, readBy: [...ann.readBy, currentUser.id] };
        }
        return ann;
      })
    );
  };

  const createTraining = (progData: Omit<TrainingProgram, 'id'>) => {
    const newProg: TrainingProgram = {
      ...progData,
      id: `tr-${Date.now()}`,
    };
    setTrainings((prev) => [newProg, ...prev]);

    // Notify enrolled employees
    const enrolledNotifs: NotificationItem[] = newProg.enrolledEmployeeIds.map((empId) => ({
      id: `notif-${Date.now()}-${empId}`,
      userId: empId,
      title: 'Enrolled in New Training Program',
      message: `You have been enrolled in "${newProg.title}". Due date: ${newProg.dueDate}.`,
      timestamp: 'Just now',
      read: false,
      type: 'training',
      linkTab: 'training',
    }));

    setNotifications((prev) => [...enrolledNotifs, ...prev]);
  };

  const toggleModuleCompletion = (programId: string, moduleId: string) => {
    setTrainings((prev) =>
      prev.map((prog) => {
        if (prog.id === programId) {
          const updatedModules = prog.modules.map((m) =>
            m.id === moduleId ? { ...m, completed: !m.completed } : m
          );
          return { ...prog, modules: updatedModules };
        }
        return prog;
      })
    );
  };

  const enrollEmployee = (programId: string, employeeId: string) => {
    setTrainings((prev) =>
      prev.map((prog) => {
        if (prog.id === programId && !prog.enrolledEmployeeIds.includes(employeeId)) {
          return { ...prog, enrolledEmployeeIds: [...prog.enrolledEmployeeIds, employeeId] };
        }
        return prog;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearAllNotifications = () => {
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, read: true } : n))
    );
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setCurrentUser(INITIAL_USERS[0]);
    setEmployees(INITIAL_EMPLOYEES);
    setAttendance(INITIAL_ATTENDANCE);
    setLeaves(INITIAL_LEAVES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setTrainings(INITIAL_TRAININGS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsCheckedIn(false);
    setWorkSessionSeconds(0);
  };

  return (
    <HRContext.Provider
      value={{
        currentUser,
        allUsers: INITIAL_USERS,
        setCurrentUser,
        switchRole,
        activeTab,
        setActiveTab,
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        attendance,
        isCheckedIn,
        todayCheckInRecord: todayRecord,
        workSessionSeconds,
        currentWorkMode,
        checkIn,
        checkOut,
        leaves,
        applyLeave,
        reviewLeave,
        announcements,
        createAnnouncement,
        markAnnouncementAsRead,
        trainings,
        createTraining,
        toggleModuleCompletion,
        enrollEmployee,
        notifications,
        markNotificationAsRead,
        clearAllNotifications,
        resetToDefaults,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = (): HRContextType => {
  const context = useContext(HRContext);
  if (!context) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};
