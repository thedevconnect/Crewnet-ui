import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { DrawerModule } from 'primeng/drawer';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CheckboxModule } from 'primeng/checkbox';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-emp-manage',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    DatePickerModule,
    DrawerModule,
    BreadcrumbModule,
    ConfirmDialogModule,
    ToastModule,
    CheckboxModule,
  ],
  templateUrl: './emp-manage.html',
  styleUrl: './emp-manage.css',
})
export class EmpManage implements OnInit {
  private fb = inject(FormBuilder);

  // Drawer state
  visible = signal<boolean>(false);
  postType = signal<'add' | 'update' | 'view'>('add');
  header = signal<string>('Add Employee');
  headerIcon = signal<string>('pi pi-user-plus');

  // Section toggles
  showEmployeeIdentity = signal<boolean>(true);
  showPersonalDetails = signal<boolean>(true);
  showContactDetails = signal<boolean>(true);
  showJobDetails = signal<boolean>(true);
  showSystemAccess = signal<boolean>(true);

  // Breadcrumb
  breadcrumbItems: MenuItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'HR Admin' },
    { label: 'Employee Management' },
  ];

  // Dropdown options
  statusOptions = [
    { label: 'Active', value: 'Active' },
    { label: 'Inactive', value: 'Inactive' },
  ];

  genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  employmentTypeOptions = [
    { label: 'Full Time', value: 'Full Time' },
    { label: 'Intern', value: 'Intern' },
    { label: 'Part Time', value: 'Part Time' },
    { label: 'Contract', value: 'Contract' },
    { label: 'Freelance', value: 'Freelance' },
    { label: 'Temporary', value: 'Temporary' },
    { label: 'Seasonal', value: 'Seasonal' },
    { label: 'Project Based', value: 'Project Based' },
    { label: 'Other', value: 'Other' },
  ];

  roleOptions = [
    { label: 'HRADMIN', value: 'HRADMIN' },
    { label: 'ESS', value: 'ESS' },
  ];

  departmentOptions = [
    { label: 'HR', value: 'HR' },
    { label: 'IT', value: 'IT' },
    { label: 'Finance', value: 'Finance' },
    { label: 'Sales', value: 'Sales' },
    { label: 'Marketing', value: 'Marketing' },
    { label: 'Operations', value: 'Operations' },
  ];

  designationOptions = [
    { label: 'Manager', value: 'Manager' },
    { label: 'Senior Manager', value: 'Senior Manager' },
    { label: 'Executive', value: 'Executive' },
    { label: 'Senior Executive', value: 'Senior Executive' },
    { label: 'Associate', value: 'Associate' },
    { label: 'Intern', value: 'Intern' },
  ];

  // Form group
  employeeForm: FormGroup;

  constructor() {
    this.employeeForm = this.fb.group({
      // Employee Identity
      employeeCode: [{ value: '', disabled: true }, Validators.required],
      status: ['Active', Validators.required],

      // Personal Details
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      gender: ['', Validators.required],
      dateOfBirth: ['', Validators.required],

      // Contact Details
      email: ['', [Validators.required, Validators.email, Validators.maxLength(200)]],
      mobileNumber: ['', [Validators.required, Validators.maxLength(15)]],

      // Job Details
      department: ['', Validators.required],
      designation: ['', Validators.required],
      employmentType: ['', Validators.required],
      joiningDate: ['', Validators.required],

      // System Access
      role: ['', Validators.required],
      username: [{ value: '', disabled: true }],
      firstLogin: [true],
    });
  }

  ngOnInit() {
    this.generateEmployeeCode();
  }

  // Toggle section visibility
  toggle(section: string) {
    switch (section) {
      case 'showEmployeeIdentity':
        this.showEmployeeIdentity.set(!this.showEmployeeIdentity());
        break;
      case 'showPersonalDetails':
        this.showPersonalDetails.set(!this.showPersonalDetails());
        break;
      case 'showContactDetails':
        this.showContactDetails.set(!this.showContactDetails());
        break;
      case 'showJobDetails':
        this.showJobDetails.set(!this.showJobDetails());
        break;
      case 'showSystemAccess':
        this.showSystemAccess.set(!this.showSystemAccess());
        break;
    }
  }

  // Generate employee code (auto-generated)
  generateEmployeeCode() {
    // Generate a unique employee code (you can modify this logic as per your requirements)
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, '0');
    const employeeCode = `EMP${timestamp}${random}`;
    this.employeeForm.patchValue({ employeeCode });
  }

  // Derive username from email
  onEmailBlur() {
    const email = this.employeeForm.get('email')?.value;
    if (email) {
      const username = email.split('@')[0];
      this.employeeForm.patchValue({ username });
    }
  }

  // Show dialog/drawer
  showDialog(type: 'add' | 'update' | 'view', item?: any) {
    this.postType.set(type);

    if (type === 'add') {
      this.header.set('Add Employee');
      this.headerIcon.set('pi pi-user-plus');
      this.resetAllForms();
      this.generateEmployeeCode();
    } else if (type === 'update') {
      this.header.set('Update Employee');
      this.headerIcon.set('pi pi-user-edit');
      if (item) {
        this.populateForm(item);
      }
    } else if (type === 'view') {
      this.header.set('View Employee');
      this.headerIcon.set('pi pi-eye');
      if (item) {
        this.populateForm(item);
        this.employeeForm.disable();
      }
    }

    this.visible.set(true);
  }

  // Populate form with data
  populateForm(data: any) {
    this.employeeForm.patchValue({
      employeeCode: data.employeeCode || '',
      status: data.status || 'Active',
      firstName: data.firstName || '',
      lastName: data.lastName || '',
      gender: data.gender || '',
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : '',
      email: data.email || '',
      mobileNumber: data.mobileNumber || '',
      department: data.department || '',
      designation: data.designation || '',
      employmentType: data.employmentType || '',
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : '',
      role: data.role || '',
      username: data.username || '',
      firstLogin: data.firstLogin !== undefined ? data.firstLogin : true,
    });
  }

  // Form validation helper
  isInvalid(controlName: string, formGroup: FormGroup = this.employeeForm): boolean {
    const control = formGroup.get(controlName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  // Reset all forms
  resetAllForms() {
    this.employeeForm.reset();
    this.employeeForm.patchValue({
      status: 'Active',
      firstLogin: true,
    });
    this.generateEmployeeCode();
    this.employeeForm.enable();
    this.employeeForm.get('employeeCode')?.disable();
    this.employeeForm.get('username')?.disable();
  }

  // Close drawer
  closeDrawer() {
    this.visible.set(false);
    this.employeeForm.enable();
    this.employeeForm.get('employeeCode')?.disable();
    this.employeeForm.get('username')?.disable();
  }

  // On drawer hide
  onDrawerHide() {
    this.closeDrawer();
  }

  // Submit form
  OnSubmitModal() {
    if (this.employeeForm.invalid) {
      this.employeeForm.markAllAsTouched();
      return;
    }

    const formValue = this.employeeForm.getRawValue();

    // Convert dates to ISO string format
    if (formValue.dateOfBirth instanceof Date) {
      formValue.dateOfBirth = formValue.dateOfBirth.toISOString().split('T')[0];
    }
    if (formValue.joiningDate instanceof Date) {
      formValue.joiningDate = formValue.joiningDate.toISOString().split('T')[0];
    }

    console.log('Form submitted:', formValue);

    // TODO: Implement API call to save employee data
    // Example:
    // if (this.postType() === 'add') {
    //   this.employeeService.createEmployee(formValue).subscribe(...);
    // } else if (this.postType() === 'update') {
    //   this.employeeService.updateEmployee(formValue).subscribe(...);
    // }

    // Close drawer after successful submission
    this.closeDrawer();
  }
}
