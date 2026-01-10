import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { LeaveService, Leave } from '../../core/services/leave.service';

@Component({
  selector: 'app-leaves',
  imports: [
    SelectModule, ButtonModule, DrawerModule, InputTextModule,
    TextareaModule, PanelModule, ReactiveFormsModule, ToastModule,
    CommonModule, DatePickerModule, TableModule,
  ],
  providers: [MessageService],
  templateUrl: './leaves.html',
  styleUrls: ['./leaves.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Leaves implements OnInit {
  private fb = inject(FormBuilder);
  private leaveService = inject(LeaveService);
  private messageService = inject(MessageService);

  leaveDrawerVisible = signal(false);
  isSubmitting = signal(false);
  header = signal('Add New Leave');
  headerIcon = signal('pi pi-calendar-plus');
  editingLeaveId = signal<number | null>(null);
  leaves = signal<Leave[]>([]);
  loading = signal(false);

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
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error || 'Failed to load leaves'
        });
      },
      complete: () => {
        this.loading.set(false);
      }
    });
  }

  openLeaveDrawer() {
    this.editingLeaveId.set(null);
    this.header.set('Add New Leave');
    this.headerIcon.set('pi pi-calendar-plus');
    this.leaveForm.reset();
    this.leaveDrawerVisible.set(true);
  }

  editLeave(leave: Leave) {
    this.editingLeaveId.set(leave.id!);
    this.header.set('Edit Leave');
    this.headerIcon.set('pi pi-pencil');
    const fromDate = new Date(leave.fromDate);
    const toDate = new Date(leave.toDate);
    this.leaveForm.patchValue({
      fromDate: fromDate,
      toDate: toDate,
      sessionFrom: leave.sessionFrom,
      sessionTo: leave.sessionTo,
      leaveType: leave.leaveType,
      reason: leave.reason,
      ccTo: leave.ccTo || ''
    });
    this.leaveDrawerVisible.set(true);
  }

  closeLeaveDrawer() {
    this.leaveDrawerVisible.set(false);
    this.leaveForm.reset();
    this.editingLeaveId.set(null);
  }

  resetLeaveForm() {
    this.leaveForm.reset();
  }

  onSubmitLeaveForm() {
    if (this.leaveForm.invalid) {
      Object.keys(this.leaveForm.controls).forEach(key => {
        this.leaveForm.get(key)?.markAsTouched();
      });
      this.messageService.add({
        severity: 'warn',
        summary: 'Validation Error',
        detail: 'Please fill all required fields'
      });
      return;
    }

    this.isSubmitting.set(true);
    const formValue = this.leaveForm.value;
    const leaveData: Leave = {
      fromDate: this.formatDate(new Date(formValue.fromDate!)),
      toDate: this.formatDate(new Date(formValue.toDate!)),
      sessionFrom: formValue.sessionFrom!,
      sessionTo: formValue.sessionTo!,
      leaveType: formValue.leaveType!,
      reason: formValue.reason!,
      ccTo: formValue.ccTo || undefined
    };

    const id = this.editingLeaveId();
    const request = id 
      ? this.leaveService.update(id, leaveData)
      : this.leaveService.create(leaveData);

    request.subscribe({
      next: (response) => {
        if (response.success) {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: id ? 'Leave updated successfully' : 'Leave created successfully'
          });
          this.closeLeaveDrawer();
          this.loadLeaves();
        }
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error || (id ? 'Failed to update leave' : 'Failed to create leave')
        });
      },
      complete: () => {
        this.isSubmitting.set(false);
      }
    });
  }

  deleteLeave(id: number) {
    if (confirm('Are you sure you want to delete this leave?')) {
      this.leaveService.delete(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Leave deleted successfully'
            });
            this.loadLeaves();
          }
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error || 'Failed to delete leave'
          });
        }
      });
    }
  }

  formatDisplayDate(dateString?: string): string {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  private formatDate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
}
