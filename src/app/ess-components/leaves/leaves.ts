import { Component, ChangeDetectionStrategy, signal, inject, OnInit, computed, TemplateRef, ViewChild } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService, MenuItem, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { LeaveService, Leave } from '../../core/services/leave.service';
import { TableTemplate, TableColumn } from '../../table-template/table-template';

@Component({
  selector: 'app-leaves',
  imports: [
    CommonModule,
    SelectModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    TextareaModule,
    PanelModule,
    ReactiveFormsModule,
    ToastModule,
    DatePickerModule,
    BreadcrumbModule,
    DialogModule,
    ConfirmDialogModule,
    TooltipModule,
    MenuModule,
    TableTemplate,
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './leaves.html',
  styleUrls: ['./leaves.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Leaves implements OnInit {
  breadcrumbItems = computed<MenuItem[]>(() => [
    { label: 'Dashboard', routerLink: '/dashboard' },
    { label: 'Leaves', title: 'Leaves' },
  ]);

  private fb = inject(FormBuilder);
  private leaveService = inject(LeaveService);
  private messageService = inject(MessageService);
  private confirmationService = inject(ConfirmationService);

  @ViewChild('actionTemplate') actionTemplate!: TemplateRef<any>;

  leaveDrawerVisible = signal(false);
  viewDialogVisible = signal(false);
  isSubmitting = signal(false);
  header = signal('Add New Leave');
  headerIcon = signal('pi pi-calendar-plus');
  editingLeaveId = signal<number | null>(null);
  leaves = signal<Leave[]>([]);
  loading = signal(false);
  selectedLeave = signal<Leave | null>(null);
  drawerMode = signal<'add' | 'edit'>('add');

  // Table state
  first = signal(0);
  rows = signal(10);
  totalRecords = signal(0);
  globalFilter = signal('');
  sortField = signal('');
  sortOrder = signal<number>(0);

  // Table columns
  columns: TableColumn[] = [
    { field: 'id', header: 'ID', sortable: true, width: '80px' },
    { field: 'fromDate', header: 'From Date', sortable: true, width: '120px' },
    { field: 'toDate', header: 'To Date', sortable: true, width: '120px' },
    { field: 'sessionFrom', header: 'Session From', sortable: true, width: '130px' },
    { field: 'sessionTo', header: 'Session To', sortable: true, width: '130px' },
    { field: 'leaveType', header: 'Leave Type', sortable: true, width: '150px' },
    { field: 'reason', header: 'Reason', sortable: false, width: '200px' },
    { field: 'ccTo', header: 'Cc To', sortable: false, width: '150px' },
    { field: 'createdAt', header: 'Created At', sortable: true, width: '120px' },
  ];

  leaveTypes = [
    { label: 'Loss of Pay(LoP)', value: 'LoP' },
    { label: 'Outdoor Duty(OD)', value: 'OD' },
    { label: 'Casual Leave-1.00(CL)', value: 'CL' },
    { label: 'Earned Leave-3.61(EL)', value: 'EL' },
    { label: 'Restricted Holiday-2.00(RH)', value: 'RH' },
  ];

  sessionOptions = [
    { label: 'First Half', value: 'First Half' },
    { label: 'Second Half', value: 'Second Half' },
  ];

  leaveForm = this.fb.group({
    fromDate: [null as Date | null, [Validators.required]],
    toDate: [null as Date | null, [Validators.required]],
    sessionFrom: ['', [Validators.required]],
    sessionTo: ['', [Validators.required]],
    leaveType: ['', [Validators.required]],
    reason: ['', [Validators.required]],
    ccTo: [''],
  });

  ngOnInit() {
    this.loadLeaves();
  }

  loadLeaves() {
    this.loading.set(true);
    this.leaveService.getAll().subscribe({
      next: (response) => {
        if (response.success && response.data.leaves) {
          const mappedLeaves = response.data.leaves.map(apiLeave =>
            this.leaveService.mapApiResponseToLeave(apiLeave)
          );
          this.leaves.set(mappedLeaves);
          this.totalRecords.set(mappedLeaves.length);
        } else {
          this.leaves.set([]);
          this.totalRecords.set(0);
        }
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading leaves:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || 'Failed to load leaves',
        });
        this.loading.set(false);
        this.leaves.set([]);
        this.totalRecords.set(0);
      },
    });
  }

  onPageChange(event: any): void {
    this.first.set(event.first);
    this.rows.set(event.rows);
    // Handle pagination if needed
  }

  onSortChange(event: { field: string; order: 1 | -1 }): void {
    this.sortField.set(event.field);
    this.sortOrder.set(event.order);
    // Handle sorting if needed
  }

  onGlobalFilterChange(filter: string): void {
    this.globalFilter.set(filter);
    // Handle filtering if needed
  }

  openLeaveDrawer() {
    this.drawerMode.set('add');
    this.editingLeaveId.set(null);
    this.header.set('Add New Leave');
    this.headerIcon.set('pi pi-calendar-plus');
    this.leaveForm.reset();
    this.leaveDrawerVisible.set(true);
  }

  viewLeave(leave: Leave) {
    this.selectedLeave.set(leave);
    this.viewDialogVisible.set(true);
  }

  editLeave(leave: Leave) {
    this.drawerMode.set('edit');
    this.editingLeaveId.set(leave.id!);
    this.header.set('Edit Leave');
    this.headerIcon.set('pi pi-pencil');
    this.selectedLeave.set(leave);
    const fromDate = new Date(leave.fromDate);
    const toDate = new Date(leave.toDate);
    this.leaveForm.patchValue({
      fromDate: fromDate,
      toDate: toDate,
      sessionFrom: leave.sessionFrom,
      sessionTo: leave.sessionTo,
      leaveType: leave.leaveType,
      reason: leave.reason,
      ccTo: leave.ccTo || '',
    });
    this.leaveDrawerVisible.set(true);
  }

  closeLeaveDrawer() {
    this.leaveDrawerVisible.set(false);
    this.leaveForm.reset();
    this.editingLeaveId.set(null);
    this.selectedLeave.set(null);
  }

  resetLeaveForm() {
    this.leaveForm.reset();
  }

  onSubmitLeaveForm() {
    if (this.leaveForm.invalid) {
      this.leaveForm.markAllAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please fill all required fields correctly.',
      });
      return;
    }

    const formValue = this.leaveForm.value;
    const isAddMode = this.drawerMode() === 'add';
    const selectedLeave = this.selectedLeave();
    const leaveType = this.leaveTypes.find(lt => lt.value === formValue.leaveType)?.label || formValue.leaveType;

    // Show confirmation dialog
    this.confirmationService.confirm({
      message: isAddMode
        ? `Are you sure you want to add leave "${leaveType}"?`
        : `Are you sure you want to update leave "${leaveType}"?`,
      header: isAddMode ? 'Confirm Add Leave' : 'Confirm Update Leave',
      icon: isAddMode ? 'pi pi-calendar-plus' : 'pi pi-pencil',
      acceptButtonStyleClass: 'p-button-primary',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => {
        this.submitLeaveForm(formValue);
      },
      reject: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Cancelled',
          detail: isAddMode ? 'Leave addition cancelled.' : 'Leave update cancelled.',
        });
      },
    });
  }

  private submitLeaveForm(formValue: any) {
    this.isSubmitting.set(true);
    const leaveData: Leave = {
      fromDate: this.formatDate(new Date(formValue.fromDate!)),
      toDate: this.formatDate(new Date(formValue.toDate!)),
      sessionFrom: formValue.sessionFrom!,
      sessionTo: formValue.sessionTo!,
      leaveType: formValue.leaveType!,
      reason: formValue.reason!,
      ccTo: formValue.ccTo || undefined,
    };

    const id = this.editingLeaveId();
    const request = id
      ? this.leaveService.update(id, leaveData)
      : this.leaveService.create(leaveData);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.isSubmitting.set(false);
          this.leaveDrawerVisible.set(false);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: id ? 'Leave updated successfully!' : 'Leave created successfully!',
            life: 3000,
          });
          this.closeLeaveDrawer();
          this.loadLeaves();
        }
      },
      error: (error) => {
        console.error('Error saving leave:', error);
        this.isSubmitting.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.error || error.error?.message || (id ? 'Failed to update leave' : 'Failed to create leave'),
          life: 5000,
        });
      },
    });
  }

  deleteLeave(leave: Leave) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete leave "${this.leaveTypes.find(lt => lt.value === leave.leaveType)?.label || leave.leaveType}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (leave.id) {
          this.leaveService.delete(leave.id).subscribe({
            next: (response) => {
              if (response.success) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Leave deleted successfully',
                });
                this.loadLeaves();
              }
            },
            error: (error) => {
              console.error('Error deleting leave:', error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: error.error?.error || error.error?.message || 'Failed to delete leave',
              });
            },
          });
        }
      },
    });
  }

  formatDisplayDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }

  getLeaveTypeLabel(value: string): string {
    return this.leaveTypes.find(lt => lt.value === value)?.label || value;
  }

  getStatusClass(status?: string): string {
    if (!status) return 'bg-gray-100 text-gray-700';
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') return 'bg-green-100 text-green-700';
    if (statusLower === 'rejected') return 'bg-red-100 text-red-700';
    if (statusLower === 'pending') return 'bg-yellow-100 text-yellow-700';
    return 'bg-gray-100 text-gray-700';
  }

  // Computed property for table data with formatted fields
  tableData = computed(() => {
    return this.leaves().map(leave => {
      // Create a new object with formatted display fields but keep original for actions
      const formatted = {
        id: leave.id,
        fromDate: this.formatDisplayDate(leave.fromDate),
        toDate: this.formatDisplayDate(leave.toDate),
        sessionFrom: leave.sessionFrom,
        sessionTo: leave.sessionTo,
        leaveType: this.getLeaveTypeLabel(leave.leaveType),
        reason: leave.reason,
        ccTo: leave.ccTo || '-',
        createdAt: this.formatDisplayDate(leave.createdAt),
        // Store original leave object for action handlers
        _originalLeave: leave,
      };
      return formatted;
    });
  });
}
