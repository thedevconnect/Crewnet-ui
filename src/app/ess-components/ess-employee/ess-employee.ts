import {
  Component,
  ChangeDetectionStrategy,
  inject,
  signal,
  computed,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EmployeeService } from '../../core/services/employee.service';
import { Employee } from '../../features/employee/models/employee.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { Popover } from 'primeng/popover';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { SelectModule } from 'primeng/select';
import { MenuItem } from 'primeng/api';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TemplateRef, ViewChild } from '@angular/core';
import { TableTemplate, TableColumn } from '../../table-template/table-template';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-ess-employee',
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    TableModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    DrawerModule,
    ConfirmDialogModule,
    ToastModule,
    TooltipModule,
    Popover,
    BreadcrumbModule,
    SelectModule,
    TableTemplate,
  ],
  templateUrl: './ess-employee.html',
  styleUrl: './ess-employee.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService],
})
export class EssEmployee implements OnInit {
  private readonly svc = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmationService);
  private readonly toast = inject(MessageService);
  private readonly fb = inject(FormBuilder);

  @ViewChild('actionTemplateRef') actionTemplateRef!: TemplateRef<any>;
  @ViewChild(TableTemplate) tableTemplate!: TableTemplate;

  protected readonly selectedEmployee = signal<Employee | null>(null);
  protected readonly viewDialog = signal<boolean>(false);
  protected readonly drawerVisible = signal<boolean>(false);
  protected readonly drawerMode = signal<'add' | 'edit' | 'view'>('add');
  protected readonly employeeToEdit = signal<Employee | null>(null);
  protected readonly formLoading = signal<boolean>(false);

  // Table columns
  protected readonly columns: TableColumn[] = [
    { key: 'name', header: 'Name', isVisible: true, isSortable: true },
    { key: 'email', header: 'Email', isVisible: true, isSortable: true },
    { key: 'phone', header: 'Phone', isVisible: true },
    { key: 'department', header: 'Department', isVisible: true },
    { key: 'status', header: 'Status', isVisible: true, isCustom: true },
    { key: 'joiningDate', header: 'Joining Date', isVisible: true, isSortable: true },
    { key: 'actions', header: 'Actions', isVisible: true, isCustom: true },
  ];

  protected readonly breadcrumbItems = computed<MenuItem[]>(() => [
    { label: 'Home', routerLink: '/dashboard' },
    { label: 'Employees' }
  ]);

  protected readonly departments = [
    { label: 'HR', value: 'HR' },
    { label: 'Engineering', value: 'Engineering' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Sales', value: 'Sales' }
  ];

  protected readonly statuses = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' }
  ];

  protected employeeForm: FormGroup;

  constructor() {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      department: ['', [Validators.required]],
      status: ['Active', [Validators.required]],
      joiningDate: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    // Table will auto-load via fetchData
  }

  // Data fetch function for table-template
  fetchEmployeesData = async (params: any) => {
    return this.svc.getAll({
      page: params.page,
      limit: params.limit,
      search: params.search,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    }).pipe(
      map((response) => {
        if (response.employees && Array.isArray(response.employees)) {
          return {
            data: response.employees,
            total: response.total || response.employees.length
          };
        }
        return { data: [], total: 0 };
      }),
      catchError((error) => {
        console.error('Error loading employees:', error);
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: error.error?.message || error.message || 'Failed to load employees. Please try again.',
        });
        return of({ data: [], total: 0 });
      })
    );
  };

  refreshTableData(): void {
    if (this.tableTemplate) {
      this.tableTemplate.loadData();
    }
  }

  onAdd() {
    this.drawerMode.set('add');
    this.employeeToEdit.set(null);
    this.employeeForm.reset();
    this.employeeForm.enable(); // Ensure form is enabled for add mode
    this.employeeForm.patchValue({ status: 'Active' });
    this.drawerVisible.set(true);
  }

  onEdit(e: Employee) {
    this.drawerMode.set('edit');
    this.employeeToEdit.set(e);
    this.employeeForm.enable(); // Ensure form is enabled for edit mode
    this.employeeForm.patchValue({
      name: e.name,
      email: e.email,
      phone: e.phone,
      department: e.department,
      status: e.status,
      joiningDate: e.joiningDate
    });
    this.drawerVisible.set(true);
  }

  onView(e: Employee) {
    this.drawerMode.set('view');
    this.employeeToEdit.set(e);
    this.employeeForm.disable(); // Disable all form controls in view mode
    this.employeeForm.patchValue({
      name: e.name,
      email: e.email,
      phone: e.phone,
      department: e.department,
      status: e.status,
      joiningDate: e.joiningDate
    });
    this.drawerVisible.set(true);
  }

  onDrawerClose() {
    this.drawerVisible.set(false);
    this.employeeToEdit.set(null);
    this.employeeForm.reset();
    this.employeeForm.enable(); // Re-enable form when closing
  }

  onFormSubmit() {
    if (this.drawerMode() === 'view') {
      return;
    }

    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    this.formLoading.set(true);
    const formData = { ...this.employeeForm.value };

    if (this.drawerMode() === 'add') {
      this.svc.create(formData).subscribe({
        next: () => {
          this.toast.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Employee added successfully',
          });
          this.drawerVisible.set(false);
          this.employeeForm.reset();
          this.formLoading.set(false);
          this.refreshTableData();
        },
        error: (error) => {
          console.error('Error creating employee:', error);
          this.toast.add({
            severity: 'error',
            summary: 'Error',
            detail: error.error?.message || 'Failed to create employee. Please try again.',
          });
          this.formLoading.set(false);
        },
      });
    } else if (this.drawerMode() === 'edit') {
      const employee = this.employeeToEdit();
      if (employee) {
        this.svc.update(employee.id, formData).subscribe({
          next: () => {
            this.toast.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Employee updated successfully',
            });
            this.drawerVisible.set(false);
            this.employeeForm.reset();
            this.formLoading.set(false);
            this.refreshTableData();
          },
          error: (error) => {
            console.error('Error updating employee:', error);
            this.toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to update employee. Please try again.',
            });
            this.formLoading.set(false);
          },
        });
      }
    }
  }

  onDelete(e: Employee) {
    this.confirm.confirm({
      message: `Delete ${e.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.svc.delete(e.id).subscribe({
          next: (response) => {
            this.toast.add({
              severity: 'success',
              summary: 'Deleted',
              detail: response.message || `${e.name} removed`,
            });
            this.refreshTableData();
          },
          error: (error) => {
            console.error('Error deleting employee:', error);
            this.toast.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error?.message || 'Failed to delete employee. Please try again.',
            });
          },
        });
      },
    });
  }
}

