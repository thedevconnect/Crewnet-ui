import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

interface StatCard {
  title: string;
  value: number;
  icon: string;
  color: string;
  change: string;
}

interface RecentActivity {
  id: string;
  employee: string;
  action: string;
  time: string;
  type: 'check-in' | 'check-out' | 'leave' | 'approved';
}

@Component({
  selector: 'app-hr-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HrDashboard {
  protected readonly stats = signal<StatCard[]>([
    {
      title: 'Total Employees',
      value: 247,
      icon: '👥',
      color: '#2563eb',
      change: '+12% from last month',
    },
    {
      title: 'Present Today',
      value: 231,
      icon: '✅',
      color: '#10b981',
      change: '93.5% attendance',
    },
    {
      title: 'Absent Today',
      value: 8,
      icon: '❌',
      color: '#ef4444',
      change: '3.2% absent rate',
    },
    {
      title: 'On Leave',
      value: 8,
      icon: '🏖️',
      color: '#f59e0b',
      change: '3.2% on leave',
    },
    {
      title: 'Late Arrivals',
      value: 12,
      icon: '⏰',
      color: '#8b5cf6',
      change: '4.8% late today',
    },
    {
      title: 'Pending Leaves',
      value: 5,
      icon: '📋',
      color: '#ec4899',
      change: 'Needs approval',
    },
  ]);

  protected readonly recentActivities = signal<RecentActivity[]>([
    {
      id: '1',
      employee: 'Rahul Sharma',
      action: 'Checked in',
      time: '9:15 AM',
      type: 'check-in',
    },
    {
      id: '2',
      employee: 'Priya Singh',
      action: 'Applied for leave',
      time: '8:45 AM',
      type: 'leave',
    },
    {
      id: '3',
      employee: 'Amit Kumar',
      action: 'Checked out',
      time: '6:30 PM',
      type: 'check-out',
    },
    {
      id: '4',
      employee: 'Neha Patel',
      action: 'Leave approved',
      time: '10:20 AM',
      type: 'approved',
    },
    {
      id: '5',
      employee: 'Vikram Rao',
      action: 'Checked in',
      time: '9:00 AM',
      type: 'check-in',
    },
  ]);

  protected readonly upcomingBirthdays = signal([
    { name: 'Sanjay Gupta', date: 'Dec 2', avatar: 'https://ui-avatars.com/api/?name=Sanjay+Gupta&background=2563eb&color=fff' },
    { name: 'Anjali Verma', date: 'Dec 5', avatar: 'https://ui-avatars.com/api/?name=Anjali+Verma&background=10b981&color=fff' },
    { name: 'Rohit Mehta', date: 'Dec 8', avatar: 'https://ui-avatars.com/api/?name=Rohit+Mehta&background=f59e0b&color=fff' },
  ]);

  protected readonly departmentStats = signal([
    { name: 'Engineering', present: 45, total: 50, percentage: 90 },
    { name: 'Sales', present: 28, total: 30, percentage: 93 },
    { name: 'Marketing', present: 18, total: 20, percentage: 90 },
    { name: 'HR', present: 8, total: 10, percentage: 80 },
    { name: 'Finance', present: 12, total: 15, percentage: 80 },
  ]);
}
