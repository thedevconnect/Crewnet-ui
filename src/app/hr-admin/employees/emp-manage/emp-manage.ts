import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService, MenuItem } from 'primeng/api';

// Imports (Check your PrimeNG version: if v17/16, use SidebarModule, DropdownModule, CalendarModule)
import { ToastModule } from 'primeng/toast';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { DrawerModule } from 'primeng/drawer';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select'; // PrimeNG v18. use DropdownModule for older
import { DatePickerModule } from 'primeng/datepicker'; // PrimeNG v18. use CalendarModule for older
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-emp-manage',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ToastModule,
    BreadcrumbModule,
    ButtonModule,
    DrawerModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './emp-manage.html',
  styleUrls: ['./emp-manage.css'] // Ensure you have this file
})
export class EmpManage implements OnInit {

  // UI State Signals
  visible = signal(false);
  isSubmitting = signal(false);
  header = signal('Add New Employee');
  headerIcon = signal('pi pi-user-plus');

  // Toggle Signals
  showEmployeeIdentity = signal(true);
  showPersonalDetails = signal(true);
  showContactDetails = signal(true);
  showJobDetails = signal(true);
  showSystemAccess = signal(true);

  employeeForm!: FormGroup;
  breadcrumbItems: MenuItem[] | undefined;

  // Dropdown Data
  statusOptions = [{ label: 'Active', value: 'Active' }, { label: 'Inactive', value: 'Inactive' }];
  genderOptions = [{ label: 'Male', value: 'Male' }, { label: 'Female', value: 'Female' }, { label: 'Other', value: 'Other' }];
  departmentOptions = [{ label: 'IT', value: 'IT' }, { label: 'HR', value: 'HR' }, { label: 'Sales', value: 'Sales' }];
  designationOptions = [{ label: 'Developer', value: 'Developer' }, { label: 'Manager', value: 'Manager' }, { label: 'Analyst', value: 'Analyst' }];
  employmentTypeOptions = [{ label: 'Full Time', value: 'Full Time' }, { label: 'Contract', value: 'Contract' }, { label: 'Intern', value: 'Intern' }];
  roleOptions = [{ label: 'Admin', value: 'Admin' }, { label: 'User', value: 'User' }];

  constructor(private fb: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {
    this.breadcrumbItems = [{ label: 'Dashboard', icon: 'pi pi-home' }, { label: 'Employees', icon: 'pi pi-users' }];
    this.initForm();
  }

  initForm() {
    this.employeeForm = this.fb.group({
      employeeCode: [{ value: '', disabled: true }, Validators.required],
      status: ['Active', Validators.required],
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      gender: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10,15}$')]],
      department: [null, Validators.required],
      designation: [null, Validators.required],
      employmentType: [null, Validators.required],
      joiningDate: [new Date(), Validators.required],
      role: [null, Validators.required],
      username: [{ value: '', disabled: true }],
      firstLogin: [true]
    });

    // Auto-generate username from email
    this.employeeForm.get('email')?.valueChanges.subscribe(val => {
      if (val && val.includes('@')) this.employeeForm.patchValue({ username: val.split('@')[0] });
    });
  }

  showDialog() {
    this.visible.set(true);
    this.generateEmployeeCode();
  }

  closeDrawer() {
    this.visible.set(false);
  }

  onDrawerHide() {
    this.resetAllForms();
  }

  toggle(section: string) {
    switch (section) {
      case 'showEmployeeIdentity': this.showEmployeeIdentity.update(v => !v); break;
      case 'showPersonalDetails': this.showPersonalDetails.update(v => !v); break;
      case 'showContactDetails': this.showContactDetails.update(v => !v); break;
      case 'showJobDetails': this.showJobDetails.update(v => !v); break;
      case 'showSystemAccess': this.showSystemAccess.update(v => !v); break;
    }
  }

  generateEmployeeCode() {
    this.employeeForm.patchValue({ employeeCode: 'EMP-' + Math.floor(1000 + Math.random() * 9000) });
  }

  onEmailBlur() {
    this.employeeForm.get('email')?.markAsTouched();
  }

  isInvalid(controlName: string): boolean {
    const control = this.employeeForm.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  resetAllForms() {
    this.employeeForm.reset({ status: 'Active', joiningDate: new Date(), firstLogin: true });
    this.isSubmitting.set(false);
  }

  OnSubmitModal() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill all fields correctly.' });
      return;
    }

    this.isSubmitting.set(true);
    console.log(this.employeeForm.getRawValue());

    // Fake API simulation
    setTimeout(() => {
      this.isSubmitting.set(false);
      this.visible.set(false);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Employee added!' });
      this.resetAllForms();
    }, 1000);
  }
}