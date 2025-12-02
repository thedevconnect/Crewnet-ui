export interface Employee {
  id: number;
  name: string;
  email: string;
  phone: string;
  department: string;
  status: 'Active' | 'Inactive';
  joiningDate: string; // ISO date string
}
