# MIM CRM - Setup & Implementation Guide

## ✅ What's Been Set Up

### 1. **Database Schema** (`database.sql`)
- 10 core tables created for complete CRM workflow
- Includes: Users, Leads, Projects, Payments, Employees, Attendance, etc.
- RLS (Row Level Security) policies configured
- Indexes created for performance

### 2. **Authentication System** (`src/lib/auth-context.tsx`)
- React Context for global auth state management
- JWT token handling with Supabase
- User role support (Admin, Sales, Operations, Accounts)
- Session persistence across page reloads

### 3. **Login Page** (`src/routes/login.tsx`)
- Beautiful dark-themed login interface
- Test credentials displayed
- Form validation
- Success notification with redirect to dashboard

### 4. **Dashboard** (`src/routes/dashboard.tsx`)
- Protected route (redirects to login if not authenticated)
- Key metrics cards (Leads, Projects, Payments, Employees)
- Navigation to all CRM modules
- User info display
- Logout functionality

### 5. **Footer Update** (`src/components/site/Footer.tsx`)
- Added login button for unauthenticated users
- Dashboard link for authenticated users
- Logout button with session termination

---

## 🚀 Getting Started

### Step 1: Create Supabase Project

1. Visit [supabase.com](https://supabase.com)
2. Create new project
3. Go to **Project Settings → API**
4. Copy **Project URL** and **Anon Key**

### Step 2: Update Environment Variables

Edit `.env.local`:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 3: Set Up Database

1. In Supabase dashboard, open **SQL Editor**
2. Click **New Query**
3. Copy entire content of `database.sql`
4. Paste and click **Run**

### Step 4: Create Test Users

#### Via Supabase Dashboard:

1. Go to **Authentication → Users**
2. Click **Add User**
3. Create users with test credentials:

```
Email: admin@mim.com
Password: password123

Email: sales@mim.com
Password: password123

Email: operations@mim.com
Password: password123

Email: accounts@mim.com
Password: password123
```

#### Update User Profiles in Database:

After creating auth users, insert into `users` table:

```sql
INSERT INTO users (id, email, full_name, phone, role) VALUES
('user-id-1', 'admin@mim.com', 'Admin User', '+91 98765 43210', 'admin'),
('user-id-2', 'sales@mim.com', 'Sales Manager', '+91 98765 43211', 'sales'),
('user-id-3', 'operations@mim.com', 'Operations Head', '+91 98765 43212', 'operations'),
('user-id-4', 'accounts@mim.com', 'Accounts Manager', '+91 98765 43213', 'accounts');
```

**Get user IDs from Supabase Dashboard → Authentication → Users**

### Step 5: Run the Application

```bash
npm run dev
```

Access:
- **Home**: http://localhost:5173/
- **Login**: http://localhost:5173/login
- **Dashboard**: http://localhost:5173/dashboard (requires login)

---

## 📋 Complete Workflow Implementation Plan

### Phase 1: ✅ COMPLETED
- ✅ Database schema with 10 core tables
- ✅ Authentication system with JWT
- ✅ Login page with test credentials
- ✅ Dashboard homepage
- ✅ Role-based user structure
- ✅ Footer login button

### Phase 2: IN PROGRESS
- ⏳ Lead Management page
  - Create leads from contact form
  - View all leads with search/filter
  - Update lead status through pipeline
  - Send WhatsApp messages
  - Track conversion

### Phase 3: TO BUILD
- ⏳ Project Management
  - Create projects from converted leads
  - Track project progress
  - Update status and completion dates
  - Add photo documentation

- ⏳ Payment Management
  - Record payments by type (Advance/Partial/Final)
  - Track payment status
  - Generate receipts
  - Outstanding amount tracking

- ⏳ Employee Management
  - Add/edit/delete employees
  - Track attendance daily
  - Generate attendance reports

- ⏳ Dashboards
  - Sales Dashboard (lead metrics, conversion funnel)
  - Operations Dashboard (project timeline, delays)
  - Accounts Dashboard (payment collections)
  - Admin Dashboard (all metrics)

- ⏳ Customer Portal
  - `/my-works` - Track projects and payments
  - View project progress
  - Payment history

- ⏳ Integrations
  - WhatsApp API (send messages to customers)
  - Email notifications (automatic)
  - SMS reminders (optional)

---

## 📁 File Structure

```
src/
├── lib/
│   ├── supabase.ts              # Supabase client setup
│   └── auth-context.tsx         # Auth state management
├── routes/
│   ├── __root.tsx               # Root layout with AuthProvider
│   ├── login.tsx                # Login page
│   ├── dashboard.tsx            # Main dashboard
│   ├── index.tsx                # Home page
│   ├── contact.tsx              # Contact form
│   └── projects.tsx             # Projects showcase
├── components/
│   ├── site/
│   │   ├── Footer.tsx           # Updated with login button
│   │   ├── Header.tsx
│   │   └── ...
│   └── ui/                      # Shadcn components
└── database.sql                 # Database schema

```

---

## 🔑 Test Credentials

```
Admin Account:
Email: admin@mim.com
Password: password123

Sales Account:
Email: sales@mim.com
Password: password123

Operations Account:
Email: operations@mim.com
Password: password123

Accounts Account:
Email: accounts@mim.com
Password: password123
```

---

## 🛠️ Troubleshooting

### Issue: "Missing Supabase environment variables"
**Solution**: 
- Check `.env.local` has correct values
- Restart dev server: `npm run dev`

### Issue: "Failed to sign in"
**Solution**:
- Verify auth user exists in Supabase Dashboard
- Confirm email/password match
- Check user profile exists in `users` table

### Issue: Blank dashboard (keeps redirecting)
**Solution**:
- Ensure AuthProvider wraps app in __root.tsx
- Check browser console for errors
- Verify Supabase connection works

### Issue: Database tables not created
**Solution**:
- Check SQL errors in Supabase editor
- Run queries in smaller chunks if needed
- Verify project has PostgreSQL enabled

### Issue: Routes not working (404 error)
**Solution**:
- Routes auto-generate from file names
- Ensure files are in `src/routes/` folder
- Restart dev server for router update
- Check `routeTree.gen.ts` is updated

---

## 📱 UI Components Used

All components from Shadcn UI library:
- Button
- Card
- Input
- Alert
- Textarea
- Select
- Dialog
- etc.

Styling:
- Tailwind CSS for utilities
- Custom Tailwind theme with gold/ink colors
- Dark mode enabled by default

---

## 🔐 Security Notes

1. **JWT Tokens**: Stored in browser by Supabase
2. **RLS Policies**: Enabled for leads, projects, payments, employees
3. **Role-based Access**: Managed via user role in profiles
4. **Environment Variables**: Keep `.env.local` out of git
5. **Credentials**: Use Supabase's built-in auth, don't store passwords

---

## 📞 Next Steps

1. **Set up Supabase** (Steps 1-4 above)
2. **Test login** with test credentials
3. **Build Lead Management page** (Phase 2)
4. **Add Project Management**
5. **Implement Payment tracking**
6. **Create Employee module**
7. **Build role-specific dashboards**

---

## 💡 Architecture Overview

```
User Login
    ↓
JWT Token Generated
    ↓
AuthContext Stores User & Profile
    ↓
Protected Routes Check Auth
    ↓
Dashboard / CRM Modules
    ↓
Data Operations via Supabase
    ↓
RLS Policies Enforce Access Control
    ↓
Audit Logs Capture Actions
```

---

## 📊 Database Relationships

```
users (auth.users)
  ├─ leads (assigned_to, created_by)
  ├─ projects (created_by)
  ├─ payments (created_by)
  ├─ employees (created_by)
  └─ attendance (marked_by)

leads
  └─ projects (lead_id)
      └─ payments (project_id)
          └─ project_updates

employees
  └─ attendance (employee_id)
```

---

Ready to continue with Phase 2: Lead Management Implementation?

Contact: mimenterprise125@gmail.com
