# Employee Onboarding - Backend & Database Setup Prompt

## 📋 Overview
Create a complete backend API and database schema for Employee Onboarding Management System with the following requirements.

---

## 🗄️ Database Schema

### Table: `employees`

```sql
CREATE TABLE employees (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active' NOT NULL,
    
    -- Personal Details
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    date_of_birth DATE NOT NULL,
    
    -- Contact Details
    email VARCHAR(200) UNIQUE NOT NULL,
    mobile_number VARCHAR(15) NOT NULL,
    
    -- Job Details
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    employment_type ENUM('Full Time', 'Intern') NOT NULL,
    joining_date DATE NOT NULL,
    
    -- System Access
    role ENUM('HRADMIN', 'ESS') NOT NULL,
    username VARCHAR(200) UNIQUE NOT NULL,
    first_login BOOLEAN DEFAULT TRUE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by BIGINT,
    updated_by BIGINT,
    
    INDEX idx_employee_code (employee_code),
    INDEX idx_email (email),
    INDEX idx_status (status),
    INDEX idx_department (department)
);
```

### Table: `employee_audit_log` (Optional - for tracking changes)

```sql
CREATE TABLE employee_audit_log (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    employee_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'CREATE', 'UPDATE', 'DELETE'
    old_values JSON,
    new_values JSON,
    changed_by BIGINT,
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);
```

---

## 🔌 API Endpoints

### Base URL: `/api/employees`

### 1. Create Employee (POST)
**Endpoint:** `POST /api/employees`

**Request Body:**
```json
{
  "status": "Active",
  "firstName": "John",
  "lastName": "Doe",
  "gender": "Male",
  "dateOfBirth": "1990-05-15",
  "email": "john.doe@example.com",
  "mobileNumber": "+1234567890",
  "department": "IT",
  "designation": "Senior Developer",
  "employmentType": "Full Time",
  "joiningDate": "2025-01-15",
  "role": "ESS",
  "firstLogin": true
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Employee created successfully",
  "data": {
    "id": 1,
    "employeeCode": "EMP20250115001",
    "status": "Active",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "dateOfBirth": "1990-05-15",
    "email": "john.doe@example.com",
    "mobileNumber": "+1234567890",
    "department": "IT",
    "designation": "Senior Developer",
    "employmentType": "Full Time",
    "joiningDate": "2025-01-15",
    "role": "ESS",
    "username": "john.doe",
    "firstLogin": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**Validation Rules:**
- All fields marked with `*` are required
- `email` must be unique and valid email format
- `mobileNumber` must be valid (10-15 digits)
- `dateOfBirth` must be a valid date (should be in the past)
- `joiningDate` must be a valid date (can be future date)
- `employeeCode` should be auto-generated in format: `EMP{YYYYMMDD}{3-digit-sequence}`
- `username` should be auto-generated from email (part before @)

---

### 2. Get All Employees (GET)
**Endpoint:** `GET /api/employees`

**Query Parameters:**
- `page` (optional, default: 1) - Page number
- `pageSize` (optional, default: 10) - Items per page
- `search` (optional) - Search by name, email, or employee code
- `status` (optional) - Filter by status (Active/Inactive)
- `department` (optional) - Filter by department
- `sortBy` (optional, default: 'createdAt') - Sort field
- `sortOrder` (optional, default: 'desc') - Sort order (asc/desc)

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "employees": [
      {
        "id": 1,
        "employeeCode": "EMP20250115001",
        "status": "Active",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "mobileNumber": "+1234567890",
        "department": "IT",
        "designation": "Senior Developer",
        "employmentType": "Full Time",
        "joiningDate": "2025-01-15",
        "role": "ESS",
        "createdAt": "2025-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "pageSize": 10,
      "totalCount": 50,
      "totalPages": 5
    }
  }
}
```

---

### 3. Get Employee by ID (GET)
**Endpoint:** `GET /api/employees/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "employeeCode": "EMP20250115001",
    "status": "Active",
    "firstName": "John",
    "lastName": "Doe",
    "gender": "Male",
    "dateOfBirth": "1990-05-15",
    "email": "john.doe@example.com",
    "mobileNumber": "+1234567890",
    "department": "IT",
    "designation": "Senior Developer",
    "employmentType": "Full Time",
    "joiningDate": "2025-01-15",
    "role": "ESS",
    "username": "john.doe",
    "firstLogin": true,
    "createdAt": "2025-01-15T10:30:00Z",
    "updatedAt": "2025-01-15T10:30:00Z"
  }
}
```

**Error Response (404 Not Found):**
```json
{
  "success": false,
  "message": "Employee not found",
  "error": "EMPLOYEE_NOT_FOUND"
}
```

---

### 4. Update Employee (PUT)
**Endpoint:** `PUT /api/employees/:id`

**Request Body:** (Same as Create, all fields optional except id)

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee updated successfully",
  "data": {
    "id": 1,
    "employeeCode": "EMP20250115001",
    "status": "Active",
    "firstName": "John",
    "lastName": "Doe Updated",
    // ... all other fields
    "updatedAt": "2025-01-15T11:30:00Z"
  }
}
```

**Validation:**
- `employeeCode` should not be updatable (read-only)
- `email` uniqueness check (if changed)
- `username` should be updated if email changes

---

### 5. Delete Employee (DELETE)
**Endpoint:** `DELETE /api/employees/:id`

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Employee deleted successfully"
}
```

**Note:** Consider soft delete (update status to 'Inactive') instead of hard delete.

---

## 🔒 Validation Rules

### Field Validations:

1. **employeeCode**
   - Auto-generated, format: `EMP{YYYYMMDD}{3-digit-sequence}`
   - Example: `EMP20250115001`, `EMP20250115002`
   - Must be unique

2. **status**
   - Enum: 'Active' or 'Inactive'
   - Default: 'Active'

3. **firstName, lastName**
   - Required
   - Max length: 100 characters
   - Only letters, spaces, hyphens allowed

4. **gender**
   - Enum: 'Male', 'Female', 'Other'
   - Required

5. **dateOfBirth**
   - Required
   - Must be valid date
   - Should be in the past (not future date)
   - Age validation (e.g., minimum 18 years)

6. **email**
   - Required
   - Valid email format
   - Must be unique
   - Max length: 200 characters

7. **mobileNumber**
   - Required
   - 10-15 digits
   - Can include country code with +
   - Must be unique

8. **department**
   - Required
   - Should match predefined list: ['HR', 'IT', 'Finance', 'Sales', 'Marketing', 'Operations']

9. **designation**
   - Required
   - Should match predefined list: ['Manager', 'Senior Manager', 'Executive', 'Senior Executive', 'Associate', 'Intern']

10. **employmentType**
    - Enum: 'Full Time' or 'Intern'
    - Required

11. **joiningDate**
    - Required
    - Valid date
    - Can be future date (for scheduled joining)

12. **role**
    - Enum: 'HRADMIN' or 'ESS'
    - Required

13. **username**
    - Auto-generated from email (part before @)
    - Must be unique
    - Read-only (cannot be manually set)

14. **firstLogin**
    - Boolean
    - Default: true
    - Indicates if employee has logged in for the first time

---

## 🔐 Security Requirements

1. **Authentication:**
   - All endpoints require JWT authentication
   - Include `Authorization: Bearer <token>` header

2. **Authorization:**
   - Only HRADMIN role can create/update/delete employees
   - ESS role can only view their own profile

3. **Input Sanitization:**
   - Sanitize all string inputs to prevent XSS
   - Validate and sanitize email, phone numbers

4. **Rate Limiting:**
   - Implement rate limiting on create/update endpoints

---

## 📊 Additional Features

### 1. Employee Code Generation Logic
```javascript
// Pseudo-code
function generateEmployeeCode() {
  const date = new Date();
  const dateStr = date.toISOString().slice(0,10).replace(/-/g, '');
  const sequence = getNextSequenceForDate(dateStr); // Get next 3-digit number for today
  return `EMP${dateStr}${String(sequence).padStart(3, '0')}`;
}
```

### 2. Username Generation
```javascript
// Pseudo-code
function generateUsername(email) {
  return email.split('@')[0].toLowerCase();
}
```

### 3. Email Notification (Optional)
- Send welcome email to new employee
- Include login credentials
- Include employee code

### 4. Audit Logging
- Log all create/update/delete operations
- Store old and new values
- Track who made the change and when

---

## 🧪 Error Responses

### Standard Error Format:
```json
{
  "success": false,
  "message": "Error message",
  "error": "ERROR_CODE",
  "errors": {
    "fieldName": ["Validation error message"]
  }
}
```

### Common Error Codes:
- `VALIDATION_ERROR` - Validation failed
- `EMPLOYEE_NOT_FOUND` - Employee ID not found
- `DUPLICATE_EMAIL` - Email already exists
- `DUPLICATE_MOBILE` - Mobile number already exists
- `DUPLICATE_EMPLOYEE_CODE` - Employee code already exists
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `INTERNAL_SERVER_ERROR` - Server error

---

## 📝 Sample Data

### Dropdown Options (Return as separate endpoint or include in employee form):

**GET /api/employees/dropdown-options**

```json
{
  "success": true,
  "data": {
    "departments": [
      { "label": "HR", "value": "HR" },
      { "label": "IT", "value": "IT" },
      { "label": "Finance", "value": "Finance" },
      { "label": "Sales", "value": "Sales" },
      { "label": "Marketing", "value": "Marketing" },
      { "label": "Operations", "value": "Operations" }
    ],
    "designations": [
      { "label": "Manager", "value": "Manager" },
      { "label": "Senior Manager", "value": "Senior Manager" },
      { "label": "Executive", "value": "Executive" },
      { "label": "Senior Executive", "value": "Senior Executive" },
      { "label": "Associate", "value": "Associate" },
      { "label": "Intern", "value": "Intern" }
    ],
    "genders": [
      { "label": "Male", "value": "Male" },
      { "label": "Female", "value": "Female" },
      { "label": "Other", "value": "Other" }
    ],
    "employmentTypes": [
      { "label": "Full Time", "value": "Full Time" },
      { "label": "Intern", "value": "Intern" }
    ],
    "roles": [
      { "label": "HRADMIN", "value": "HRADMIN" },
      { "label": "ESS", "value": "ESS" }
    ],
    "statuses": [
      { "label": "Active", "value": "Active" },
      { "label": "Inactive", "value": "Inactive" }
    ]
  }
}
```

---

## 🚀 Implementation Notes

1. **Database:**
   - Use transactions for create/update operations
   - Implement proper indexing for performance
   - Consider soft deletes instead of hard deletes

2. **API:**
   - Use RESTful conventions
   - Implement proper HTTP status codes
   - Add request/response logging

3. **Performance:**
   - Implement pagination for list endpoints
   - Add database query optimization
   - Use caching for dropdown options

4. **Testing:**
   - Unit tests for validation logic
   - Integration tests for API endpoints
   - Test edge cases (duplicate email, invalid dates, etc.)

---

## 📋 Checklist

- [ ] Database schema created
- [ ] All API endpoints implemented
- [ ] Validation rules implemented
- [ ] Authentication/Authorization added
- [ ] Error handling implemented
- [ ] Employee code auto-generation working
- [ ] Username auto-generation from email working
- [ ] Pagination implemented for list endpoint
- [ ] Search and filter functionality
- [ ] Audit logging (optional)
- [ ] Email notifications (optional)
- [ ] Unit tests written
- [ ] Integration tests written
- [ ] API documentation (Swagger/OpenAPI)

---

## 🔗 Frontend Integration

The frontend expects these endpoints and will send requests in the format specified above. Ensure the backend matches these specifications exactly for seamless integration.

**Base URL Configuration:**
- Development: `http://localhost:3000/api`
- Production: `https://your-api-domain.com/api`

**CORS Configuration:**
- Allow frontend origin
- Allow credentials
- Allow methods: GET, POST, PUT, DELETE
- Allow headers: Content-Type, Authorization

---

**Note:** This prompt provides a complete specification for backend implementation. Adjust based on your specific technology stack (Node.js/Express, Python/Django, Java/Spring Boot, etc.).

