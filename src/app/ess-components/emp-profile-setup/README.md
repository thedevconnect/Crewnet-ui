# Employee Profile Setup Component

## Overview
A comprehensive multi-step form for employees to complete their profile on first login. This component uses PrimeNG Stepper to guide employees through 10 steps of profile completion.

## Component Details
- **Component Name**: `EmpProfileSetup`
- **Route**: `/ess/emp-profile-setup`
- **Tech Stack**: Angular Standalone, Reactive Forms, PrimeNG, Tailwind CSS

## Features

### ✅ 10-Step Profile Completion
1. **Personal Details** - Family info, emergency contacts
2. **Contact Details** - Personal email, alternate mobile
3. **Address Details** - Permanent and current address
4. **Identity & Statutory** - Aadhar, PAN, PF, ESIC
5. **Bank Details** - Banking information
6. **Qualifications** - Educational background (Add More)
7. **Experience** - Work experience (Add More)
8. **Family & Nominee** - Family members and nominee details
9. **Document Upload** - Required and optional documents
10. **Declaration** - Terms acceptance

### ✅ Key Functionalities
- ✓ **Step-by-step Navigation** with Previous/Next buttons
- ✓ **Form Validation** with inline error messages
- ✓ **Dynamic FormArrays** for qualifications, experience, family members
- ✓ **"Same as Permanent Address"** checkbox with auto-fill
- ✓ **File Upload** with success indicators
- ✓ **Save Draft** functionality
- ✓ **Submit Profile** with validation checks
- ✓ **Responsive Design** - Mobile friendly
- ✓ **Clean Corporate HRMS UI**

## Usage

### 1. Navigate to Profile Setup
```typescript
// From your navigation or dashboard
this.router.navigate(['/ess/emp-profile-setup']);
```

### 2. First Login Flow
Typically, this component is shown when:
- Employee logs in for the first time
- HR has completed basic onboarding
- Employee needs to complete remaining profile fields

### 3. API Integration (To Be Implemented)

#### Save Draft API Call
```typescript
// In saveDraft() method
this.profileService.saveDraft(formData, uploadedFiles).subscribe({
  next: (response) => {
    this.messageService.add({
      severity: 'success',
      summary: 'Draft Saved',
      detail: 'Your profile data has been saved'
    });
  },
  error: (error) => {
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: error.message
    });
  }
});
```

#### Submit Profile API Call
```typescript
// In submitProfile() method
this.profileService.submitProfile(formData, uploadedFiles).subscribe({
  next: (response) => {
    this.messageService.add({
      severity: 'success',
      summary: 'Profile Submitted',
      detail: 'Your profile has been submitted successfully!'
    });
    // Navigate to dashboard
    this.router.navigate(['/ess/dashboard']);
  },
  error: (error) => {
    this.messageService.add({
      severity: 'error',
      summary: 'Submission Failed',
      detail: error.message
    });
  }
});
```

## Form Structure

### Step 1: Personal Details
```typescript
personalDetails: FormGroup {
  fatherHusbandName: string (required, max 100)
  maritalStatus: string (required)
  bloodGroup: string (optional)
  religion: string (optional)
  emergencyContactName: string (required, max 100)
  emergencyContactNumber: string (required, 10 digits)
}
```

### Step 2: Contact Details
```typescript
contactDetails: FormGroup {
  personalEmail: string (email format)
  alternateMobile: string (10 digits)
}
```

### Step 3: Address Details
```typescript
addressDetails: FormGroup {
  permanentAddress: {
    state: string (required)
    city: string (required)
    pincode: string (required, 6 digits)
    fullAddress: string (required)
  }
  currentAddress: {
    state: string
    city: string
    pincode: string (6 digits)
    fullAddress: string
  }
}
```

### Step 4: Identity & Statutory
```typescript
identityDetails: FormGroup {
  aadharNumber: string (required, 12 digits)
  panNumber: string (required, format: ABCDE1234F)
  pfUanNumber: string (optional)
  esicNumber: string (optional)
}
```

### Step 5: Bank Details
```typescript
bankDetails: FormGroup {
  bankName: string (required)
  accountHolderName: string (required)
  accountNumber: string (required, 9-18 digits)
  ifscCode: string (required, format: ABCD0123456)
}
```

### Step 6: Qualifications (FormArray)
```typescript
qualifications: FormArray [{
  qualification: string
  instituteName: string
  yearOfPassing: string (YYYY format)
  percentageGrade: string
}]
```

### Step 7: Experience (FormArray)
```typescript
experiences: FormArray [{
  companyName: string
  designation: string
  fromDate: Date
  toDate: Date
  totalExperience: string
}]
```

### Step 8: Family & Nominee
```typescript
familyNominee: FormGroup {
  nominee: {
    nomineeName: string (required)
    relationship: string (required)
    nomineeDob: Date (required)
    nomineePercentage: number (required, 1-100)
  }
  familyMembers: FormArray [{
    memberName: string
    relationship: string
    dateOfBirth: Date
  }]
}
```

### Step 9: Document Upload
```typescript
uploadedFiles = {
  profilePhoto: File (required, max 1MB, image)
  signature: File (required, max 1MB, image)
  aadharCopy: File (required, max 2MB, pdf/image)
  panCopy: File (required, max 2MB, pdf/image)
  cancelledCheque: File (required, max 2MB, pdf/image)
  educationCert: File (optional, max 2MB, pdf/image)
  experienceLetter: File (optional, max 2MB, pdf/image)
}
```

### Step 10: Declaration
```typescript
declaration: FormGroup {
  agreed: boolean (requiredTrue)
}
```

## Validation Rules

### Required Fields
All fields marked with red asterisk (*) are required:
- Personal: Father/Husband Name, Marital Status, Emergency Contact Name & Number
- Address: Permanent Address (all fields)
- Identity: Aadhar Number, PAN Number
- Bank: All fields
- Nominee: All fields
- Documents: Profile Photo, Signature, Aadhar, PAN, Cancelled Cheque
- Declaration: Must be checked

### Pattern Validations
- **Mobile Numbers**: 10 digits only
- **Pincode**: 6 digits only
- **Aadhar**: 12 digits only
- **PAN**: Format ABCDE1234F (5 letters, 4 digits, 1 letter)
- **Account Number**: 9-18 digits
- **IFSC Code**: Format ABCD0123456 (4 letters, 0, 6 alphanumeric)
- **Email**: Valid email format
- **Year**: 4 digits (YYYY)

## Backend API Endpoints (To Be Created)

### 1. Save Draft
```
POST /api/employee/profile/draft
Body: {
  formData: {...},
  files: {...}
}
Response: {
  success: true,
  message: "Draft saved successfully"
}
```

### 2. Submit Profile
```
POST /api/employee/profile/submit
Body: {
  formData: {...},
  files: {...}
}
Response: {
  success: true,
  message: "Profile submitted successfully",
  data: {...}
}
```

### 3. Get Draft (if exists)
```
GET /api/employee/profile/draft/{employeeId}
Response: {
  success: true,
  data: {...}
}
```

## File Upload Handling

Files are stored temporarily in component state:
```typescript
uploadedFiles = {
  profilePhoto: File | null,
  signature: File | null,
  // ... other files
}
```

**Backend Implementation Options:**
1. Use FormData to send files with JSON
2. Upload files separately and send URLs
3. Use multipart/form-data for combined submission

**Example with FormData:**
```typescript
const formData = new FormData();
formData.append('profileData', JSON.stringify(this.profileForm.getRawValue()));
Object.keys(this.uploadedFiles).forEach(key => {
  const file = this.uploadedFiles[key];
  if (file) {
    formData.append(key, file);
  }
});

this.http.post('/api/employee/profile/submit', formData).subscribe(...);
```

## Customization

### Adding More Dropdown Options
```typescript
// In component.ts
religionOptions = [
  { label: 'Hindu', value: 'Hindu' },
  { label: 'Muslim', value: 'Muslim' },
  // Add more options
];
```

### Adding More States
```typescript
stateOptions = [
  { label: 'Maharashtra', value: 'Maharashtra' },
  { label: 'Gujarat', value: 'Gujarat' },
  // Add all Indian states
];
```

### Customizing File Upload Limits
```typescript
// In HTML template
<p-fileUpload
  [maxFileSize]="5000000"  // Change to 5MB
  accept="image/*,.pdf"    // Modify accepted formats
/>
```

## Styling

### CSS Classes Used
- Tailwind utility classes for spacing, colors, typography
- Custom SCSS for form grids and responsive layout
- PrimeNG component styling overrides

### Responsive Breakpoints
- **Desktop**: Grid layout (2-3 columns)
- **Tablet**: 2 columns
- **Mobile** (< 768px): Single column layout

## Testing Checklist

- [ ] All validations work correctly
- [ ] FormArray add/remove functions work
- [ ] "Same as Permanent Address" checkbox works
- [ ] File upload and remove work
- [ ] Navigation buttons enable/disable correctly
- [ ] Save Draft functionality
- [ ] Submit only when all required fields are filled
- [ ] Declaration checkbox validation
- [ ] Responsive design on mobile/tablet
- [ ] Error messages display properly

## Next Steps

1. **Create Profile Service**
   ```bash
   ng generate service core/services/profile
   ```

2. **Implement API calls** in the service

3. **Add loading states** during API calls

4. **Implement draft loading** on component init

5. **Add confirmation dialog** before submission

6. **Navigate to dashboard** after successful submission

7. **Add first login check** in auth guard

8. **Create HR approval workflow** for submitted profiles

## Demo Data for Testing

```typescript
// Use this in ngOnInit for testing
this.profileForm.patchValue({
  personalDetails: {
    fatherHusbandName: 'John Doe Sr.',
    maritalStatus: 'Married',
    bloodGroup: 'O+',
    religion: 'Hindu',
    emergencyContactName: 'Jane Doe',
    emergencyContactNumber: '9876543210'
  },
  // ... add more test data
});
```

## Support

For issues or feature requests, please contact the development team.

