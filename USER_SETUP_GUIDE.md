# 🔐 MIM CRM - Complete User Setup Guide

## Step-by-Step Authentication Setup

### ⚠️ IMPORTANT: Two-Part Process

User creation requires **TWO** steps:
1. **Step 1**: Create authentication users in Supabase (email/password)
2. **Step 2**: Create user profiles in database (roles, names, etc.)

---

## 📋 STEP 1: Create Authentication Users in Supabase

### Go to Supabase Dashboard

1. Open https://supabase.com
2. Click your project
3. Go to **Authentication → Users** (left sidebar)
4. Click **Add User** button

### Add User 1: ADMIN

```
Email: admin@mim.com
Password: password123
Auto confirm user: ✓ (check this)
```
- Click **Create User**
- **COPY THE UUID** that appears (you'll need this!)
- UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`

### Add User 2: SALES

```
Email: sales@mim.com
Password: password123
Auto confirm user: ✓
```
- Click **Create User**
- **COPY THE UUID**

### Add User 3: OPERATIONS

```
Email: operations@mim.com
Password: password123
Auto confirm user: ✓
```
- Click **Create User**
- **COPY THE UUID**

### Add User 4: ACCOUNTS

```
Email: accounts@mim.com
Password: password123
Auto confirm user: ✓
```
- Click **Create User**
- **COPY THE UUID**

---

## 📝 STEP 2: Create User Profiles in Database

### Your UUIDs from Step 1

Write down these UUIDs (you just copied them):

```
Admin UUID:       ______________________________________
Sales UUID:       ______________________________________
Operations UUID:  ______________________________________
Accounts UUID:    ______________________________________
```

### Update create-users.sql

1. Open file: `create-users.sql`
2. Replace the placeholder UUIDs with the actual UUIDs you copied:

```sql
-- BEFORE (template):
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  'admin-uuid-123456789', -- REPLACE with actual UUID
  'admin@mim.com',
  'Admin User',
  '+91 98765 43210',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- AFTER (example - use YOUR UUIDs):
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000', -- Your actual admin UUID
  'admin@mim.com',
  'Admin User',
  '+91 98765 43210',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
```

### Run the SQL Script

1. Go to Supabase Dashboard
2. Click **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy entire content of `create-users.sql`
5. Paste into the SQL editor
6. Click **Run** (blue button)

### Expected Output

You should see:
```
id                                   | email               | full_name           | role
550e8400-e29b-41d4-a716-446655440000 | admin@mim.com       | Admin User          | admin
550e8400-e29b-41d4-a716-446655440001 | sales@mim.com       | Sales Manager       | sales
550e8400-e29b-41d4-a716-446655440002 | operations@mim.com  | Operations Manager  | operations
550e8400-e29b-41d4-a716-446655440003 | accounts@mim.com    | Accounts Manager    | accounts
```

---

## ✅ Test the Login

### Start Dev Server

```bash
npm run dev
```

Expected output:
```
  VITE v5.0.0  ready in 123 ms

  ➜  Local:   http://localhost:5173/
  ➜  Press h + enter to show help
```

### Test Login

1. Open http://localhost:5173/login
2. You should see login page with test credentials displayed
3. Enter:
   - Email: `admin@mim.com`
   - Password: `password123`
4. Click **Login**
5. Should see "Success!" message
6. Should redirect to http://localhost:5173/dashboard

---

## 🎯 User Credentials for Testing

### Admin Account (Full Access)
```
Email:    admin@mim.com
Password: password123
Role:     admin
Access:   Everything (all modules, all data)
```

### Sales Account (Leads Only)
```
Email:    sales@mim.com
Password: password123
Role:     sales
Access:   • Create/edit leads
           • Update lead status
           • Send WhatsApp messages
           ✗ Cannot access projects
           ✗ Cannot access payments
           ✗ Cannot access employees
```

### Operations Account (Projects Only)
```
Email:    operations@mim.com
Password: password123
Role:     operations
Access:   • View converted leads (for project creation)
           • Create/edit projects
           • Update project status
           • Add project updates & photos
           • Mark attendance
           ✗ Cannot modify leads
           ✗ Cannot access payments
```

### Accounts Account (Payments Only)
```
Email:    accounts@mim.com
Password: password123
Role:     accounts
Access:   • View projects (for payment linking)
           • Create/record payments
           • Update payment status
           • Generate receipts
           • View collection statistics
           ✗ Cannot create leads
           ✗ Cannot create projects
           ✗ Cannot manage employees
```

---

## 🔄 Module Access by Role

```
                    Admin   Sales   Operations   Accounts
─────────────────────────────────────────────────────────
Leads              ✓        ✓          ✗            ✗
Projects           ✓        ✗          ✓            ✗
Payments           ✓        ✗          ✗            ✓
Employees          ✓        ✗          ✓            ✗
Attendance         ✓        ✗          ✓            ✗
Dashboard          ✓        ✓          ✓            ✓
Reports            ✓        ✗          ✗            ✗
Settings           ✓        ✗          ✗            ✗
```

---

## 🧪 Complete Testing Workflow

### Test 1: Admin Login
```
1. Go to http://localhost:5173/login
2. Email: admin@mim.com
3. Password: password123
4. Click Login
5. Should see Dashboard with all modules visible
```

### Test 2: Create a Lead (Sales)
```
1. Log out
2. Login with sales@mim.com / password123
3. Click "Leads" on dashboard
4. Click "Add Lead"
5. Fill form:
   - Name: Test Customer
   - Phone: +91 98765 43210
   - Email: customer@example.com
   - Location: Mumbai
   - Project Type: Windows
6. Click Create
7. Lead should appear in list
```

### Test 3: Convert Lead to Project (Operations)
```
1. Log out
2. Login with operations@mim.com / password123
3. Go to Leads (visible to ops too)
4. Update lead status to CONVERTED
5. Go to Projects
6. Click "Add Project"
7. Select the CONVERTED lead
8. Fill project details
9. Amount should auto-calculate with GST
```

### Test 4: Record Payment (Accounts)
```
1. Log out
2. Login with accounts@mim.com / password123
3. Go to Payments
4. Click "Add Payment"
5. Select project
6. Enter amount and type (ADVANCE/PARTIAL/FINAL)
7. Click Create
8. Payment should appear in list
```

### Test 5: Employee Attendance (Operations)
```
1. Login with operations@mim.com / password123
2. Go to Employees
3. Click "Attendance" tab
4. Mark attendance for today
5. Should see stats update
```

---

## 🐛 Troubleshooting

### Issue: "Invalid login credentials"
**Cause**: User not created in Supabase Auth
**Solution**:
1. Check if user exists in Supabase → Authentication → Users
2. If not, create the user via UI
3. Copy the UUID
4. Add to users table with create-users.sql

### Issue: "Email not found"
**Cause**: User exists in Auth but not in users table
**Solution**:
1. Run create-users.sql with correct UUID
2. Verify with query: `SELECT * FROM users WHERE email = 'admin@mim.com';`

### Issue: Login works but Dashboard shows blank/error
**Cause**: User profile not in users table
**Solution**:
1. Check users table: Go to Supabase SQL Editor
2. Run: `SELECT * FROM users;`
3. If user is missing, run create-users.sql with correct UUID

### Issue: "Role is null" error
**Cause**: User inserted without role field
**Solution**:
1. Update user with correct role:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@mim.com';
```

### Issue: Can't see all modules
**Cause**: Logged in with wrong role account
**Solution**:
- Admin sees everything
- Sales sees only Leads
- Operations sees Leads & Projects & Employees
- Accounts sees only Payments
- This is by design for security

---

## 📊 Verify Setup

### Check All Users Created

Go to Supabase SQL Editor and run:
```sql
SELECT id, email, full_name, role, created_at FROM users ORDER BY role;
```

Should show 4 rows:
- admin@mim.com | admin
- sales@mim.com | sales
- operations@mim.com | operations
- accounts@mim.com | accounts

### Check Authentication Users

Go to Supabase → Authentication → Users
Should show 4 users with ✓ confirmation status

### Test Database Connection

Run this query:
```sql
SELECT COUNT(*) FROM leads;
SELECT COUNT(*) FROM projects;
SELECT COUNT(*) FROM payments;
SELECT COUNT(*) FROM employees;
```

Should return 0 for each (empty tables, ready for data)

---

## 🎯 Next Steps After Setup

1. ✅ All users created
2. ✅ Authentication working
3. ✅ Dashboard accessible
4. Now: Start using the CRM!

### Create Your First Lead

1. Login with sales@mim.com
2. Go to Leads
3. Click "Add Lead"
4. Enter customer details
5. Track through the workflow

### Complete Workflow Demo

1. **Sales**: Create lead → Update status to CONVERTED
2. **Operations**: Convert to project → Add project details
3. **Operations**: Track progress → Update status
4. **Accounts**: Record payments → Mark as paid
5. **Admin**: View reports & analytics

---

## 📞 Quick Reference

| Account | Email | Password | Purpose |
|---------|-------|----------|---------|
| Admin | admin@mim.com | password123 | Full system access |
| Sales | sales@mim.com | password123 | Lead management |
| Operations | operations@mim.com | password123 | Project management |
| Accounts | accounts@mim.com | password123 | Payment tracking |

---

## 🚀 You're Ready!

All users are set up. The complete CRM workflow is now functional with:
- ✅ Authentication system
- ✅ Role-based access control
- ✅ Lead management
- ✅ Project tracking
- ✅ Payment collection
- ✅ Employee management
- ✅ Real-time data sync

Start with the Sales account and create your first lead!

Happy selling! 🎉
