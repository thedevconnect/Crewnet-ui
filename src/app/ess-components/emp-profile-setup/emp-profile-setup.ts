import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { DatePickerModule } from 'primeng/datepicker';
import { TextareaModule } from 'primeng/textarea';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PanelModule } from 'primeng/panel';
import { DrawerModule } from 'primeng/drawer';

@Component({
  selector: 'app-emp-profile-setup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    SelectModule,
    CheckboxModule,
    DatePickerModule,
    TextareaModule,
    FileUploadModule,
    ToastModule,
    PanelModule,
    DrawerModule,
  ],
  providers: [MessageService],
  templateUrl: './emp-profile-setup.html',
  styleUrl: './emp-profile-setup.scss',
})
export class EmpProfileSetup implements OnInit {
  private fb = inject(FormBuilder);
  private messageService = inject(MessageService);

  profileForm!: FormGroup;
  drawerVisible = signal(false);
  isSubmitting = signal(false);
  isSavingDraft = signal(false);
  sameAsPermanent = signal(false);

  // Dropdown Options
  maritalStatusOptions = [
    { label: 'Single', value: 'Single' },
    { label: 'Married', value: 'Married' },
    { label: 'Divorced', value: 'Divorced' },
    { label: 'Widowed', value: 'Widowed' },
  ];

  bloodGroupOptions = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
  ];

  religionOptions = [
    { label: 'Hindu', value: 'Hindu' },
    { label: 'Muslim', value: 'Muslim' },
    { label: 'Christian', value: 'Christian' },
    { label: 'Sikh', value: 'Sikh' },
    { label: 'Buddhist', value: 'Buddhist' },
    { label: 'Jain', value: 'Jain' },
    { label: 'Other', value: 'Other' },
  ];

  relationshipOptions = [
    { label: 'Father', value: 'Father' },
    { label: 'Mother', value: 'Mother' },
    { label: 'Spouse', value: 'Spouse' },
    { label: 'Son', value: 'Son' },
    { label: 'Daughter', value: 'Daughter' },
    { label: 'Brother', value: 'Brother' },
    { label: 'Sister', value: 'Sister' },
    { label: 'Other', value: 'Other' },
  ];

  qualificationOptions = [
    { label: '10th', value: '10th' },
    { label: '12th', value: '12th' },
    { label: 'Diploma', value: 'Diploma' },
    { label: 'Graduation', value: 'Graduation' },
    { label: 'Post Graduation', value: 'Post Graduation' },
    { label: 'PhD', value: 'PhD' },
  ];

  stateOptions = [
    { label: 'Andhra Pradesh', value: 'Andhra Pradesh' },
    { label: 'Delhi', value: 'Delhi' },
    { label: 'Gujarat', value: 'Gujarat' },
    { label: 'Karnataka', value: 'Karnataka' },
    { label: 'Kerala', value: 'Kerala' },
    { label: 'Maharashtra', value: 'Maharashtra' },
    { label: 'Tamil Nadu', value: 'Tamil Nadu' },
    { label: 'Telangana', value: 'Telangana' },
    { label: 'Uttar Pradesh', value: 'Uttar Pradesh' },
    { label: 'West Bengal', value: 'West Bengal' },
    // Add more states as needed
  ];

  // Uploaded Files Storage
  uploadedFiles = {
    profilePhoto: null as File | null,
    signature: null as File | null,
    aadharCopy: null as File | null,
    panCopy: null as File | null,
    cancelledCheque: null as File | null,
    educationCert: null as File | null,
    experienceLetter: null as File | null,
  };

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.profileForm = this.fb.group({
      // Step 1: Personal Details
      personalDetails: this.fb.group({
        fatherHusbandName: ['', [Validators.required, Validators.maxLength(100)]],
        maritalStatus: ['', Validators.required],
        bloodGroup: [''],
        religion: [''],
        emergencyContactName: ['', [Validators.required, Validators.maxLength(100)]],
        emergencyContactNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      }),

      // Step 2: Contact Details
      contactDetails: this.fb.group({
        personalEmail: ['', [Validators.email]],
        alternateMobile: ['', [Validators.pattern(/^[0-9]{10}$/)]],
      }),

      // Step 3: Address Details
      addressDetails: this.fb.group({
        permanentAddress: this.fb.group({
          state: ['', Validators.required],
          city: ['', Validators.required],
          pincode: ['', [Validators.required, Validators.pattern(/^[0-9]{6}$/)]],
          fullAddress: ['', Validators.required],
        }),
        currentAddress: this.fb.group({
          state: [''],
          city: [''],
          pincode: ['', [Validators.pattern(/^[0-9]{6}$/)]],
          fullAddress: [''],
        }),
      }),

      // Step 4: Identity & Statutory
      identityDetails: this.fb.group({
        aadharNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{12}$/)]],
        panNumber: ['', [Validators.required, Validators.pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/)]],
        pfUanNumber: [''],
        esicNumber: [''],
      }),

      // Step 5: Bank Details
      bankDetails: this.fb.group({
        bankName: ['', Validators.required],
        accountHolderName: ['', Validators.required],
        accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
        ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      }),

      // Step 6: Qualification Details
      qualifications: this.fb.array([this.createQualificationGroup()]),

      // Step 7: Experience Details
      experiences: this.fb.array([this.createExperienceGroup()]),

      // Step 8: Family & Nominee
      familyNominee: this.fb.group({
        nominee: this.fb.group({
          nomineeName: ['', Validators.required],
          relationship: ['', Validators.required],
          nomineeDob: [null, Validators.required],
          nomineePercentage: ['', [Validators.required, Validators.min(1), Validators.max(100)]],
        }),
        familyMembers: this.fb.array([this.createFamilyMemberGroup()]),
      }),

      // Step 9: Documents (handled separately via file upload)

      // Step 10: Declaration
      declaration: this.fb.group({
        agreed: [false, Validators.requiredTrue],
      }),
    });

    // Watch for "Same as Permanent Address" checkbox changes
    this.sameAsPermanent.set(false);
  }

  // FormArray Getters
  get qualifications(): FormArray {
    return this.profileForm.get('qualifications') as FormArray;
  }

  get experiences(): FormArray {
    return this.profileForm.get('experiences') as FormArray;
  }

  get familyMembers(): FormArray {
    return (this.profileForm.get('familyNominee') as FormGroup).get('familyMembers') as FormArray;
  }

  // Create FormGroups for FormArrays
  private createQualificationGroup(): FormGroup {
    return this.fb.group({
      qualification: [''],
      instituteName: [''],
      yearOfPassing: ['', [Validators.pattern(/^[0-9]{4}$/)]],
      percentageGrade: [''],
    });
  }

  private createExperienceGroup(): FormGroup {
    return this.fb.group({
      companyName: [''],
      designation: [''],
      fromDate: [null],
      toDate: [null],
      totalExperience: [''],
    });
  }

  private createFamilyMemberGroup(): FormGroup {
    return this.fb.group({
      memberName: [''],
      relationship: [''],
      dateOfBirth: [null],
    });
  }

  // Add More Handlers
  addQualification(): void {
    this.qualifications.push(this.createQualificationGroup());
  }

  removeQualification(index: number): void {
    if (this.qualifications.length > 1) {
      this.qualifications.removeAt(index);
    }
  }

  addExperience(): void {
    this.experiences.push(this.createExperienceGroup());
  }

  removeExperience(index: number): void {
    if (this.experiences.length > 1) {
      this.experiences.removeAt(index);
    }
  }

  addFamilyMember(): void {
    this.familyMembers.push(this.createFamilyMemberGroup());
  }

  removeFamilyMember(index: number): void {
    if (this.familyMembers.length > 1) {
      this.familyMembers.removeAt(index);
    }
  }

  // Same as Permanent Address Toggle
  toggleSameAsPermanent(event: any): void {
    const checked = event.checked;
    this.sameAsPermanent.set(checked);

    const permanentAddr = this.profileForm.get('addressDetails.permanentAddress')?.value;
    const currentAddrGroup = this.profileForm.get('addressDetails.currentAddress') as FormGroup;

    if (checked && permanentAddr) {
      currentAddrGroup.patchValue(permanentAddr);
      currentAddrGroup.disable();
    } else {
      currentAddrGroup.enable();
    }
  }

  // File Upload Handlers
  onFileSelect(event: any, fieldName: keyof typeof this.uploadedFiles): void {
    const file = event.files?.[0];
    if (file) {
      this.uploadedFiles[fieldName] = file;
      this.messageService.add({
        severity: 'success',
        summary: 'File Selected',
        detail: `${file.name} selected successfully`,
      });
    }
  }

  removeFile(fieldName: keyof typeof this.uploadedFiles): void {
    this.uploadedFiles[fieldName] = null;
    this.messageService.add({
      severity: 'info',
      summary: 'File Removed',
      detail: 'File removed',
    });
  }

  // Drawer Methods
  openDrawer(): void {
    this.drawerVisible.set(true);
  }

  closeDrawer(): void {
    this.drawerVisible.set(false);
  }

  isFieldInvalid(fieldPath: string): boolean {
    const field = this.profileForm.get(fieldPath);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldPath: string): string {
    const field = this.profileForm.get(fieldPath);
    if (field?.errors) {
      if (field.errors['required']) return 'This field is required';
      if (field.errors['email']) return 'Invalid email format';
      if (field.errors['pattern']) return 'Invalid format';
      if (field.errors['min']) return `Minimum value is ${field.errors['min'].min}`;
      if (field.errors['max']) return `Maximum value is ${field.errors['max'].max}`;
    }
    return '';
  }

  areRequiredDocumentsUploaded(): boolean {
    return !!(
      this.uploadedFiles.profilePhoto &&
      this.uploadedFiles.signature &&
      this.uploadedFiles.aadharCopy &&
      this.uploadedFiles.panCopy &&
      this.uploadedFiles.cancelledCheque
    );
  }


  // Submit Actions
  saveDraft(): void {
    this.isSavingDraft.set(true);
    const formData = this.profileForm.getRawValue();

    // TODO: Call API to save draft
    console.log('Saving Draft:', formData);
    console.log('Uploaded Files:', this.uploadedFiles);

    setTimeout(() => {
      this.isSavingDraft.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Draft Saved',
        detail: 'Your profile data has been saved as draft',
      });
    }, 1000);
  }

  submitProfile(): void {
    if (!this.profileForm.valid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please complete all required fields',
      });
      return;
    }

    if (!this.areRequiredDocumentsUploaded()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Missing Documents',
        detail: 'Please upload all required documents',
      });
      return;
    }

    this.isSubmitting.set(true);
    const formData = this.profileForm.getRawValue();

    // TODO: Call API to submit profile
    console.log('Submitting Profile:', formData);
    console.log('Uploaded Files:', this.uploadedFiles);

    setTimeout(() => {
      this.isSubmitting.set(false);
      this.messageService.add({
        severity: 'success',
        summary: 'Profile Submitted',
        detail: 'Your profile has been submitted successfully!',
      });
      // TODO: Navigate to dashboard or next screen
    }, 2000);
  }
}
