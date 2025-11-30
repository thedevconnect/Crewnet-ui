export interface Employee {
  id: string;
  employeeCode: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  joiningDate: Date;
  status: 'active' | 'inactive' | 'on-leave';
  avatar?: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  hodName?: string;
  employeeCount: number;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  date: Date;
  punchIn: string;
  punchOut?: string;
  status: 'present' | 'absent' | 'late' | 'half-day' | 'leave';
  workHours?: number;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'casual' | 'sick' | 'earned' | 'comp-off';
  fromDate: Date;
  toDate: Date;
  days: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedOn: Date;
}
