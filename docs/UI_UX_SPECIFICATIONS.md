# UI/UX Specifications - ExpenseFlow Authentication

## 🎨 Design System Overview

### Brand Identity
- **Platform Name**: ExpenseFlow
- **Tagline**: Intelligent Expense Management System
- **Target Audience**: Enterprise companies, finance teams, employees

### Visual Design
- **Primary Color**: #3A7AFE (Professional Blue)
- **Accent Color**: #2ECC71 (Success Green)
- **Background**: #F5F6FA (Light Gray)
- **Typography**: Inter/Poppins/Roboto (Modern Sans-serif)
- **Border Radius**: 8px (Cards), 6px (Buttons), 4px (Inputs)
- **Shadows**: Subtle box-shadow for depth

### UI Principles
- Clean, minimal design
- Generous white space
- Consistent spacing (8px grid system)
- High contrast for accessibility
- Mobile-first responsive design

## 🔐 Admin (Company) Signup Page

### Page Structure
```
┌─────────────────────────────────────┐
│         ExpenseFlow Logo            │
│                                     │
│    Admin (company) Signup Page      │
│                                     │
│    ⚠️ 1 admin user per company      │
│                                     │
│    ┌─────────────────────────────┐  │
│    │ Name                        │  │
│    └─────────────────────────────┘  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │ Email                       │  │
│    └─────────────────────────────┘  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │ Password     👁️            │  │
│    │ ●●●●●●●●     [Weak]        │  │
│    └─────────────────────────────┘  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │ Confirm Password            │  │
│    └─────────────────────────────┘  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │ Country ▼        ℹ️         │  │
│    │ United States (USD)         │  │
│    └─────────────────────────────┘  │
│    ℹ️ Base currency for company     │
│                                     │
│    ┌─────────────────────────────┐  │
│    │         Signup              │  │
│    └─────────────────────────────┘  │
│                                     │
│    Already have an account? Login   │
└─────────────────────────────────────┘
```

### Form Specifications

#### Input Fields
1. **Name**
   - Type: Text input
   - Placeholder: "Enter your full name"
   - Validation: Required, 2-50 characters
   - Error: "Name is required"

2. **Email**
   - Type: Email input
   - Placeholder: "Enter your email"
   - Validation: Required, valid email format
   - Error: "Please enter a valid email address"

3. **Password**
   - Type: Password input
   - Placeholder: "Create a password"
   - Show/Hide toggle (👁️ icon)
   - Real-time strength indicator
   - Validation: Min 8 chars, uppercase, lowercase, number, special char
   - Strength Levels: Weak (red), Medium (orange), Strong (green)

4. **Confirm Password**
   - Type: Password input
   - Placeholder: "Confirm your password"
   - Validation: Must match password field
   - Error: "Passwords do not match"

5. **Country Selection**
   - Type: Dropdown with search
   - Shows: Country Name (Currency Code)
   - Default: Auto-detect from IP or "Select Country"
   - **CRITICAL**: Sets company's base currency permanently
   - Info icon with tooltip: "This will set your company's base currency"

#### Business Logic
- **Company Creation**: Signup auto-creates company
- **Admin Role**: User becomes company admin
- **Currency Setting**: Immutable after creation
- **Unique Constraint**: One admin per company

#### Actions
- **Signup Button**: Primary blue, full width, loading state
- **Login Link**: Secondary text link at bottom

## 🚪 Login Page

### Page Structure
```
┌─────────────────────────────────────┐
│         ExpenseFlow Logo            │
│                                     │
│         Signin Page                │
│                                     │
│    ┌─────────────────────────────┐  │
│    │ Email                       │  │
│    └─────────────────────────────┘  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │ Password     👁️            │  │
│    └─────────────────────────────┘  │
│                                     │
│    ┌─────────────────────────────┐  │
│    │          Login              │  │
│    └─────────────────────────────┘  │
│                                     │
│    Don't have an account? Signup    │
│    Forgot password?                 │
└─────────────────────────────────────┘
```

### Form Specifications

#### Input Fields
1. **Email**
   - Type: Email input
   - Placeholder: "Enter your email"
   - Auto-focus on page load
   - Validation: Required, valid email

2. **Password**
   - Type: Password input
   - Placeholder: "Enter your password"
   - Show/Hide toggle

#### Actions
- **Login Button**: Primary blue, full width, loading state
- **Signup Link**: "Don't have an account? Signup"
- **Forgot Password Link**: "Forgot password?"

## ⚠️ Error Handling & Validation

### Form Validation States
- **Default**: Neutral border, placeholder text
- **Focus**: Blue border, no error message
- **Error**: Red border, error message below field
- **Success**: Green border (for password confirmation)

### Error Messages
- **Required Fields**: "This field is required"
- **Email Format**: "Please enter a valid email address"
- **Password Match**: "Passwords do not match"
- **Password Strength**: "Password must contain uppercase, lowercase, number, and special character"
- **Server Errors**: "Invalid credentials" / "Account not found" / "Too many attempts"

### Loading States
- Button shows spinner + "Signing up..." / "Logging in..."
- Form fields disabled during submission
- Prevent double-submission

## 📱 Responsive Design

### Desktop (>1024px)
- Centered card layout (400px width)
- Logo at top, form in middle, links at bottom

### Tablet (768px-1024px)
- Same layout, adjusted spacing
- Touch-friendly button sizes

### Mobile (<768px)
- Full width layout
- Stacked form elements
- Larger touch targets (44px minimum)
- Adjusted typography sizes

## ♿ Accessibility

### Keyboard Navigation
- Tab order: Email → Password → Button → Links
- Enter key submits form
- Escape clears focused field

### Screen Reader Support
- Proper ARIA labels on all inputs
- Error messages announced
- Form landmarks and headings

### Color Contrast
- WCAG AA compliance (4.5:1 ratio)
- Error states use red (#E74C3C) with high contrast

## 🔄 User Flows

### Successful Signup
1. Fill form → Validate → Submit
2. Show loading → Success message
3. Auto-login → Redirect to dashboard
4. Send welcome email (if enabled)

### Successful Login
1. Fill form → Validate → Submit
2. Show loading → Check credentials
3. Set JWT token → Redirect to role-based dashboard

### Failed Login/Signup
1. Show field errors immediately
2. Show server errors with clear messaging
3. Maintain form data (except password)
4. Focus on first error field

## 🧩 Component Architecture

### Shared Components
- `Input.jsx`: Reusable input with validation
- `Button.jsx`: CTA button with loading states
- `Select.jsx`: Dropdown with search
- `PasswordStrength.jsx`: Visual strength indicator

### Page Components
- `Signup.jsx`: Admin signup form
- `Login.jsx`: Authentication form

### Custom Hooks
- `useAuth.js`: Authentication logic
- `useForm.js`: Form validation and submission
- `usePasswordStrength.js`: Password validation

## 🎯 Implementation Notes

### Critical Business Logic
1. **Country → Currency**: Selection permanently sets company currency
2. **Admin Creation**: Auto-creates company and assigns admin role
3. **Unique Email**: Prevent duplicate accounts
4. **Password Security**: Enforce strong passwords

### Performance Considerations
- Debounced validation (300ms delay)
- Lazy loading of country list
- Optimistic UI updates
- Error boundary protection

### Security Considerations
- CSRF protection
- Rate limiting on auth endpoints
- Secure password storage
- JWT token management
- Input sanitization

This specification ensures a professional, secure, and user-friendly authentication experience that aligns with ExpenseFlow's enterprise-grade requirements.</content>
<parameter name="filePath">e:\Expense-Tracker\docs\UI_UX_SPECIFICATIONS.md