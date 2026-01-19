import { Component, inject, signal, computed, OnInit, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SelectModule } from 'primeng/select';
import { TooltipModule } from 'primeng/tooltip';
import { AttendanceService, CalendarDay, CalendarResponse } from '../../../core/services/attendance.service';
import { EmployeeService } from '../../../core/services/employee.service';

export interface CalendarCell {
  date: Date;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  status: 'P' | 'PH' | 'WO' | 'CL' | 'SL' | 'A' | null;
}

export interface EmployeeOption {
  id: number;
  name: string;
  label: string;
}

@Component({
  selector: 'app-employee-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    CardModule,
    SelectModule,
    TooltipModule
  ],
  templateUrl: './employee-calendar.html',
  styleUrl: './employee-calendar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeCalendar implements OnInit {
  private attendanceService = inject(AttendanceService);
  private employeeService = inject(EmployeeService);

  // State signals
  private selectedEmployeeIdSignal = signal<number | null>(null);
  currentMonth = signal<Date>(new Date());
  calendarData = signal<CalendarDay[]>([]);
  employees = signal<EmployeeOption[]>([]);
  loading = signal(false);

  // Getter/setter for ngModel binding
  get selectedEmployeeId(): number | null {
    return this.selectedEmployeeIdSignal();
  }

  set selectedEmployeeId(value: number | null) {
    this.selectedEmployeeIdSignal.set(value);
  }

  // Computed properties
  currentMonthFormatted = computed(() => {
    const month = this.currentMonth();
    return this.formatMonthYear(month);
  });

  calendarCells = computed(() => {
    const month = this.currentMonth();
    return this.generateCalendarCells(month);
  });

  // Effect to reload calendar when employee or month changes
  private calendarReloadEffect = effect(() => {
    const employeeId = this.selectedEmployeeIdSignal();
    const month = this.currentMonth();
    
    if (employeeId !== null) {
      this.loadCalendar(employeeId, month);
    }
  });

  ngOnInit(): void {
    this.loadEmployees();
    const today = new Date();
    this.currentMonth.set(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  // Load employees for dropdown
  loadEmployees(): void {
    this.employeeService.getAll({ limit: 1000 }).subscribe({
      next: (response) => {
        const options: EmployeeOption[] = response.employees.map(emp => ({
          id: emp.id || emp.employee_id,
          name: emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown',
          label: `${emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim() || 'Unknown'} (${emp.id || emp.employee_id})`
        }));
        this.employees.set(options);
        
        // Auto-select first employee if available
        if (options.length > 0 && this.selectedEmployeeIdSignal() === null) {
          this.selectedEmployeeIdSignal.set(options[0].id);
        }
      },
      error: (error) => {
        console.error('Error loading employees:', error);
      }
    });
  }

  // Load calendar data from API
  loadCalendar(employeeId: number, month: Date): void {
    this.loading.set(true);
    const monthString = this.formatMonthForAPI(month);

    this.attendanceService.getCalendar(employeeId, monthString).subscribe({
      next: (response: CalendarResponse) => {
        if (response.success && response.data) {
          this.calendarData.set(response.data);
        } else {
          this.calendarData.set([]);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading calendar:', error);
        this.calendarData.set([]);
        this.loading.set(false);
      }
    });
  }

  // Generate calendar grid cells
  generateCalendarCells(month: Date): CalendarCell[] {
    const cells: CalendarCell[] = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const firstDayOfMonth = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDayOfMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    
    // Get Monday-first weekday (0 = Sunday, 1 = Monday, etc.)
    // Convert Sunday (0) to 7 for easier calculation
    let firstDayWeekday = firstDayOfMonth.getDay();
    firstDayWeekday = firstDayWeekday === 0 ? 7 : firstDayWeekday;
    
    // Days to show before month starts (to align with Monday)
    const daysBeforeMonth = firstDayWeekday - 1;
    
    // Add previous month's trailing days
    const prevMonth = new Date(month.getFullYear(), month.getMonth() - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = daysBeforeMonth - 1; i >= 0; i--) {
      const date = new Date(month.getFullYear(), month.getMonth() - 1, daysInPrevMonth - i);
      cells.push({
        date,
        dayNumber: date.getDate(),
        isCurrentMonth: false,
        isToday: this.isTodayDate(date, today),
        status: null
      });
    }

    // Add current month's days
    const daysInMonth = lastDayOfMonth.getDate();
    const calendarDataMap = this.getCalendarDataMap();
    
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(month.getFullYear(), month.getMonth(), day);
      const dateString = this.formatDateForAPI(date);
      const cell: CalendarCell = {
        date,
        dayNumber: day,
        isCurrentMonth: true,
        isToday: this.isTodayDate(date, today),
        status: calendarDataMap.get(dateString) || null
      };
      cells.push(cell);
    }

    // Add next month's leading days to complete the grid (6 rows = 42 cells total)
    const totalCells = cells.length;
    const remainingCells = 42 - totalCells;
    
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(month.getFullYear(), month.getMonth() + 1, day);
      cells.push({
        date,
        dayNumber: day,
        isCurrentMonth: false,
        isToday: this.isTodayDate(date, today),
        status: null
      });
    }

    return cells;
  }

  // Helper: Create map of date string to status from API data
  private getCalendarDataMap(): Map<string, 'P' | 'PH' | 'WO' | 'CL' | 'SL' | 'A'> {
    const map = new Map<string, 'P' | 'PH' | 'WO' | 'CL' | 'SL' | 'A'>();
    this.calendarData().forEach(day => {
      if (day.status) {
        map.set(day.date, day.status);
      }
    });
    return map;
  }

  // Helper: Check if date is today
  isTodayDate(date: Date, today: Date): boolean {
    return date.getTime() === today.getTime();
  }

  // Helper: Format month for API (YYYY-MM)
  formatMonthForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  }

  // Helper: Format date for API (YYYY-MM-DD)
  formatDateForAPI(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Helper: Format month year for display (e.g., "January 2025")
  formatMonthYear(date: Date): string {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  }

  // Navigation methods
  goToPreviousMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() - 1, 1));
  }

  goToNextMonth(): void {
    const current = this.currentMonth();
    this.currentMonth.set(new Date(current.getFullYear(), current.getMonth() + 1, 1));
  }

  goToToday(): void {
    const today = new Date();
    this.currentMonth.set(new Date(today.getFullYear(), today.getMonth(), 1));
  }

  // Get status class for styling
  getStatusClass(status: 'P' | 'PH' | 'WO' | 'CL' | 'SL' | 'A' | null): string {
    if (!status) return '';
    
    const statusClasses: Record<string, string> = {
      'P': 'status-present',
      'PH': 'status-public-holiday',
      'WO': 'status-weekly-off',
      'CL': 'status-leave',
      'SL': 'status-leave',
      'A': 'status-absent'
    };
    
    return statusClasses[status] || '';
  }

  // Get status label
  getStatusLabel(status: 'P' | 'PH' | 'WO' | 'CL' | 'SL' | 'A' | null): string {
    if (!status) return '';
    
    const labels: Record<string, string> = {
      'P': 'Present',
      'PH': 'Public Holiday',
      'WO': 'Weekly Off',
      'CL': 'Casual Leave',
      'SL': 'Sick Leave',
      'A': 'Absent'
    };
    
    return labels[status] || status;
  }

  // Week day headers (Monday to Sunday)
  readonly weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
}

