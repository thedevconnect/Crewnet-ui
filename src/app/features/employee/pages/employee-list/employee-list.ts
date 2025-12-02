import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../services/employee.service';
import { Employee } from '../../models/employee.model';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DrawerModule } from 'primeng/drawer';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EmployeeForm } from '../../components/employee-form/employee-form';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, TableModule, ButtonModule, InputTextModule, DialogModule, DrawerModule, ConfirmDialogModule, ToastModule, EmployeeForm],
  templateUrl: './employee-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService, MessageService]
})
export class EmployeeList {
  private readonly svc = inject(EmployeeService);
  private readonly router = inject(Router);
  private readonly confirm = inject(ConfirmationService);
  private readonly toast = inject(MessageService);

  protected readonly employees = signal<Employee[]>([]);
  protected readonly loading = signal<boolean>(false);
  protected readonly search = signal<string>('');
  protected readonly selectedEmployee = signal<Employee | null>(null);
  protected readonly viewDialog = signal<boolean>(false);
  protected readonly drawerVisible = signal<boolean>(false);
  protected readonly drawerMode = signal<'add' | 'edit'>('add');
  protected readonly employeeToEdit = signal<Employee | null>(null);

  readonly filtered = computed(() => {
    const q = this.search().toLowerCase();
    return this.employees().filter(e =>
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      e.department.toLowerCase().includes(q)
    );
  });

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.svc.getAll().subscribe(list => {
      this.employees.set(list);
      this.loading.set(false);
    });
  }

  onAdd() {
    this.drawerMode.set('add');
    this.employeeToEdit.set(null);
    this.drawerVisible.set(true);
  }

  onEdit(e: Employee) {
    this.drawerMode.set('edit');
    this.employeeToEdit.set(e);
    this.drawerVisible.set(true);
  }

  onDrawerClose() {
    this.drawerVisible.set(false);
    this.employeeToEdit.set(null);
  }

  onFormSubmit(formData: any) {
    if (this.drawerMode() === 'add') {
      this.svc.create(formData).subscribe(() => {
        this.toast.add({ severity: 'success', summary: 'Success', detail: 'Employee added successfully' });
        this.drawerVisible.set(false);
        this.load();
      });
    } else {
      const employee = this.employeeToEdit();
      if (employee) {
        this.svc.update(employee.id, formData).subscribe(() => {
          this.toast.add({ severity: 'success', summary: 'Success', detail: 'Employee updated successfully' });
          this.drawerVisible.set(false);
          this.load();
        });
      }
    }
  }

  onView(e: Employee) {
    this.selectedEmployee.set(e);
    this.viewDialog.set(true);
  }

  onDelete(e: Employee) {
    this.confirm.confirm({
      message: `Delete ${e.name}?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.svc.delete(e.id).subscribe((ok) => {
          if (ok) {
            this.toast.add({ severity: 'success', summary: 'Deleted', detail: `${e.name} removed` });
            this.load();
          } else {
            this.toast.add({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
          }
        });
      }
    });
  }
}
