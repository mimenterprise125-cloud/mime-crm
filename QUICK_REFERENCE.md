# MIM CRM - Quick Reference Guide

## 🔑 Access URLs

| URL | Purpose | Access |
|-----|---------|--------|
| http://localhost:5173/ | Home Page | Public |
| http://localhost:5173/login | Login Page | Public |
| http://localhost:5173/dashboard | Dashboard | Requires Login |
| http://localhost:5173/contact | Contact Form | Public |
| http://localhost:5173/projects | Projects Gallery | Public |

---

## 👤 Test Users

### Admin Account
```
Email: admin@mim.com
Password: password123
Role: Admin (Full Access)
```

### Sales Account
```
Email: sales@mim.com
Password: password123
Role: Sales (Leads Management)
```

### Operations Account
```
Email: operations@mim.com
Password: password123
Role: Operations (Projects Management)
```

### Accounts Account
```
Email: accounts@mim.com
Password: password123
Role: Accounts (Payments & Collections)
```

---

## 🗂️ Database Tables

### 1. users
- User profiles linked to Supabase auth
- Stores: email, full_name, phone, role
- Used for: authentication & authorization

### 2. leads
- Customer inquiries from contact form
- Stores: name, phone, location, project_type, status, source
- Status flow: NEW → CONTACTED → FOLLOW_UP → SITE_VISIT → QUOTATION_SENT → NEGOTIATION → CONVERTED or LOST

### 3. projects
- Active projects created from converted leads
- Stores: lead_id, total_sqft, rate_per_sqft, final_amount, completion_date, status
- Status: ACTIVE, DELAYED, COMPLETED, ON_HOLD, CANCELLED

### 4. payments
- Payment records for projects
- Stores: project_id, amount, type (ADVANCE/PARTIAL/FINAL), status, payment_date
- Status: PENDING, DUE, PAID, OVERDUE

### 5. project_updates
- Progress tracking for projects
- Stores: project_id, type (PROGRESS/DELAY), description, images
- Used for: photo documentation & timeline updates

### 6. employees
- Staff directory
- Stores: full_name, email, phone, role
- Status: ACTIVE, INACTIVE, ON_LEAVE

### 7. attendance
- Daily attendance records
- Stores: employee_id, date, status (PRESENT/ABSENT/LEAVE), notes
- Unique: One record per employee per day

### 8. whatsapp_logs
- WhatsApp message history
- Stores: lead_id, phone_number, message, sent_by, sent_at
- Used for: message tracking & audit

### 9. completed_projects
- Portfolio projects showcase
- Stores: name, location, sqft, description, image_url
- Used for: displaying on home page

### 10. audit_logs
- Activity tracking for compliance
- Stores: user_id, entity_type, action, old_values, new_values
- Used for: audit trail & debugging

---

## 🔄 User Role Permissions

### Admin
- ✅ Full system access
- ✅ All CRUD operations
- ✅ User management
- ✅ All reports & analytics
- ✅ System settings

### Sales
- ✅ Create & manage leads
- ✅ Update lead status
- ✅ Send WhatsApp messages
- ✅ View converted projects
- ❌ Cannot delete leads
- ❌ Cannot access payments/operations

### Operations
- ✅ View all projects
- ✅ Update project status
- ✅ Add progress updates
- ✅ Upload photos
- ✅ Track delays
- ❌ Cannot modify payments
- ❌ Cannot manage employees

### Accounts
- ✅ Record payments
- ✅ Track collections
- ✅ Generate receipts
- ✅ View payment reports
- ✅ Send payment reminders
- ❌ Cannot create projects
- ❌ Cannot modify leads

---

## 🔧 Configuration Files

### .env.local
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### database.sql
Contains complete schema - run in Supabase SQL Editor

### SETUP.md
Step-by-step setup instructions

### CRM_SETUP.md
Detailed guide with troubleshooting

---

## 🎯 Lead Lifecycle

```
Contact Form Submission
        ↓
Lead Created (Status: NEW)
        ↓
Sales Rep Contacts (Status: CONTACTED)
        ↓
Follow-up Call (Status: FOLLOW_UP)
        ↓
Site Visit (Status: SITE_VISIT)
        ↓
Send Quotation (Status: QUOTATION_SENT)
        ↓
Negotiate Price (Status: NEGOTIATION)
        ↓
Deal Closed (Status: CONVERTED)
        ↓
Create Project
        ↓
Start Execution
```

Alternative:
```
Lead Lost (Status: LOST) - Exit at any stage
```

---

## 💰 Payment Types

### Advance Payment
- Paid when project starts
- Usually 20-30% of total
- Type: ADVANCE
- Status: PAID

### Partial Payment
- Interim payments during project
- Can be multiple
- Type: PARTIAL
- Status: PAID/PENDING

### Final Payment
- Paid upon completion
- Remaining balance
- Type: FINAL
- Status: PAID/OVERDUE

---

## 📊 Project Statuses

| Status | Meaning | Action |
|--------|---------|--------|
| ACTIVE | On track | Continue execution |
| DELAYED | Behind schedule | Update date, notify client |
| COMPLETED | Finished | Mark for portfolio, request feedback |
| ON_HOLD | Temporarily paused | Reason required, resume date needed |
| CANCELLED | Cancelled | Reason required, process return |

---

## 🎨 Color Scheme

| Color | Hex | Usage |
|-------|-----|-------|
| Gold | #D7C5A3 | Accent, highlights, primary CTA |
| Ink (Dark) | #0D0D0D | Background, text |
| White | #F5F5F5 | Primary text |
| Error Red | #EF4444 | Errors, overdue payments |
| Success Green | #22C55E | Completed, paid |
| Warning Orange | #F97316 | Pending, due soon |

---

## 🚀 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Lint code
npm run lint

# Format code
npm run format
```

---

## 🔐 Security Checklist

- ✅ JWT tokens via Supabase Auth
- ✅ RLS policies on all sensitive tables
- ✅ Role-based access control
- ✅ Encrypted passwords
- ✅ Audit logging enabled
- ✅ HTTPS enforced (production)
- ✅ Session timeout (configurable)
- ✅ Input validation on all forms
- ✅ CORS configured for Supabase
- ✅ Environment variables secured

---

## 📱 Responsive Breakpoints

- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

All dashboards are fully responsive.

---

## 🎭 Component Structure

```
__root (AuthProvider wrapper)
  ├── Header (Public nav, auth status)
  ├── Main Outlet
  │   ├── / (Home page - public)
  │   ├── /login (Login - public)
  │   ├── /dashboard (Protected)
  │   ├── /contact (Contact form - public)
  │   ├── /products (Products - public)
  │   └── /projects (Projects - public)
  ├── Footer (With login button)
  └── WhatsAppFab (FAB)
```

---

## 🐛 Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Missing env vars" | Check .env.local, restart dev server |
| "Failed to sign in" | Verify user exists in Supabase, check credentials |
| "Blank dashboard" | Check AuthProvider in __root.tsx, browser console |
| "404 on new route" | Routes auto-generate from files, restart dev server |
| "Database connection error" | Verify Supabase URL & key in env vars |
| "RLS denied operation" | Check RLS policies in Supabase, admin can bypass |

---

## 📚 Documentation Files

1. **SETUP.md** - Quick start setup
2. **CRM_SETUP.md** - Detailed implementation guide
3. **IMPLEMENTATION_SUMMARY.md** - Project overview
4. **QUICK_REFERENCE.md** - This file
5. **database.sql** - Database schema

---

## 🔄 Next Steps (Phase 2)

1. Build Lead Management page (`src/routes/leads.tsx`)
2. Add lead creation form
3. Implement search & filter
4. Add WhatsApp integration
5. Create status update workflow

**Estimated time**: 1-2 days

---

## 📞 Support Resources

- Supabase Docs: https://supabase.com/docs
- TanStack Router: https://tanstack.com/router
- Tailwind CSS: https://tailwindcss.com
- Shadcn UI: https://ui.shadcn.com

---

**Last Updated**: May 6, 2026
**Version**: 1.0
**Status**: Phase 1 Complete ✅
