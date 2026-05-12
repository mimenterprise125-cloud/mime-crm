# 🎯 MIM CRM - Setup Checklist

Complete these steps in order to get your CRM system running.

---

## ✅ STEP 1: Supabase Project Setup

- [ ] Go to https://supabase.com
- [ ] Sign up or login
- [ ] Create a new project
  - Project name: MIM CRM
  - Database password: (save securely)
  - Region: (closest to you)
- [ ] Wait for project to be ready
- [ ] Copy **Project URL** from Settings → API
- [ ] Copy **Anon Key** from Settings → API
- [ ] Copy **Service Role Key** from Settings → API

---

## ✅ STEP 2: Configure Environment Variables

- [ ] Open `.env.local` in project root
- [ ] Replace with your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

- [ ] Save the file
- [ ] Do NOT commit this file to git (already in .gitignore)

---

## ✅ STEP 3: Set Up Database Schema

In Supabase Dashboard:

- [ ] Go to **SQL Editor** (left sidebar)
- [ ] Click **New Query**
- [ ] Open `database.sql` from project root
- [ ] Copy ALL content
- [ ] Paste into SQL Editor
- [ ] Click **Run** button
- [ ] Wait for confirmation "SUCCESS"
- [ ] Check tables appear in **Table Editor**

**Verify**: You should see 10 tables in the left sidebar:
- users
- leads
- projects
- payments
- project_updates
- whatsapp_logs
- completed_projects
- employees
- attendance
- audit_logs

---

## ✅ STEP 4: Create Authentication Users

In Supabase Dashboard:

### For each test user below:

- [ ] Go to **Authentication → Users**
- [ ] Click **Add User** button
- [ ] Create user 1:
  ```
  Email: admin@mim.com
  Password: password123
  ✓ Auto confirm user
  ```
- [ ] Create user 2:
  ```
  Email: sales@mim.com
  Password: password123
  ✓ Auto confirm user
  ```
- [ ] Create user 3:
  ```
  Email: operations@mim.com
  Password: password123
  ✓ Auto confirm user
  ```
- [ ] Create user 4:
  ```
  Email: accounts@mim.com
  Password: password123
  ✓ Auto confirm user
  ```

After creating users:
- [ ] Note down each user's UUID (you'll need these in Step 5)

---

## ✅ STEP 5: Populate User Profiles

In Supabase Dashboard:

- [ ] Go to **SQL Editor**
- [ ] Click **New Query**
- [ ] Copy the template below (replace the IDs with real UUIDs from Step 4)

```sql
INSERT INTO users (id, email, full_name, phone, role) VALUES
('user-id-1-from-step-4', 'admin@mim.com', 'Admin User', '+91 98765 43210', 'admin'),
('user-id-2-from-step-4', 'sales@mim.com', 'Sales Manager', '+91 98765 43211', 'sales'),
('user-id-3-from-step-4', 'operations@mim.com', 'Operations Head', '+91 98765 43212', 'operations'),
('user-id-4-from-step-4', 'accounts@mim.com', 'Accounts Manager', '+91 98765 43213', 'accounts');
```

- [ ] Replace the UUIDs with actual IDs from Supabase
- [ ] Click **Run**
- [ ] Verify no errors appear

**Where to get UUIDs:**
- Go to **Authentication → Users** and copy the ID column for each user

---

## ✅ STEP 6: Restart Development Server

In your terminal:

- [ ] Stop current server (Ctrl+C)
- [ ] Run: `npm run dev`
- [ ] Wait for "Local: http://localhost:5173/" message
- [ ] Browser should auto-open

---

## ✅ STEP 7: Test Login Page

In browser:

- [ ] Navigate to http://localhost:5173/login
- [ ] You should see:
  - [ ] MIM Enterprises branding
  - [ ] Email input field
  - [ ] Password input field
  - [ ] "Sign In" button
  - [ ] Test credentials displayed

---

## ✅ STEP 8: Test Login with Admin Account

- [ ] Email: `admin@mim.com`
- [ ] Password: `password123`
- [ ] Click **Sign In**
- [ ] You should see success message
- [ ] Page redirects to Dashboard
- [ ] Dashboard shows:
  - [ ] User name: "Admin User"
  - [ ] User email: admin@mim.com
  - [ ] User role: admin
  - [ ] Statistics cards
  - [ ] Module navigation cards

---

## ✅ STEP 9: Test Logout

- [ ] Click **Logout** button
- [ ] You should be redirected to home page
- [ ] Footer should show **Admin Login** button again

---

## ✅ STEP 10: Test Other Accounts

- [ ] Go to http://localhost:5173/login
- [ ] Try login with each account:
  - [ ] Sales account (sales@mim.com)
  - [ ] Operations account (operations@mim.com)
  - [ ] Accounts account (accounts@mim.com)
- [ ] Each should show different role in dashboard

---

## ✅ STEP 11: Test Home Page Integration

- [ ] Go to http://localhost:5173/
- [ ] Scroll to footer
- [ ] When logged out:
  - [ ] Footer shows **Admin Login** button
- [ ] When logged in:
  - [ ] Footer shows **Dashboard** link
  - [ ] Footer shows **Logout** button
- [ ] Click **Admin Login** button
- [ ] Should redirect to login page
- [ ] Click **Dashboard** link
- [ ] Should redirect to dashboard

---

## ✅ STEP 12: Verify Database Integration

In Supabase Dashboard:

- [ ] Go to **Table Editor**
- [ ] Click on **users** table
- [ ] You should see all 4 users with:
  - [ ] Correct email
  - [ ] Full name populated
  - [ ] Role assigned (admin/sales/operations/accounts)
  - [ ] created_at timestamp

---

## ✅ Congratulations! 🎉

All setup is complete. Your MIM CRM system is now:
- ✅ Authenticated with Supabase
- ✅ Database tables created
- ✅ Test users configured
- ✅ Login page working
- ✅ Dashboard accessible
- ✅ Footer integration complete

---

## 🚀 Next Phase: Lead Management (Phase 2)

Ready to proceed with:
- [ ] Lead Management page
- [ ] Lead creation form
- [ ] Lead tracking workflow
- [ ] WhatsApp integration

---

## ⚠️ Troubleshooting

### Can't see users in auth dashboard
- [ ] Wait 10-15 seconds after creation
- [ ] Refresh browser (F5)
- [ ] Check email for confirmation link

### Login fails with "Invalid credentials"
- [ ] Verify email exactly matches: admin@mim.com
- [ ] Verify password exactly: password123
- [ ] Check "Auto confirm user" was checked when creating user
- [ ] Try creating user again

### Dashboard shows "Redirecting to login"
- [ ] Verify user profile in `users` table exists
- [ ] Check Supabase connection in browser console
- [ ] Restart dev server

### .env.local values not working
- [ ] Restart dev server after updating .env.local
- [ ] Check no spaces around = in env var
- [ ] Verify values are correct (check Supabase dashboard)

### Database queries fail in SQL Editor
- [ ] Copy `database.sql` in smaller chunks (500 lines each)
- [ ] Check for syntax errors in error message
- [ ] Verify PostgreSQL is enabled in project

---

## 📞 Getting Help

If stuck:
1. Check the error message carefully
2. Refer to **CRM_SETUP.md** for detailed guide
3. Check **QUICK_REFERENCE.md** for common issues
4. Review Supabase documentation: https://supabase.com/docs

---

## 📊 Progress Tracking

Keep track of what you've completed:

```
Database Setup: ████████████████░░░░░░ 60%
Authentication: ████████████████░░░░░░ 60%
Testing: ████████████████░░░░░░ 60%
Overall: ████████████████░░░░░░ 60%

Next: Lead Management Module (Phase 2)
```

---

**Last Updated**: May 6, 2026
**Status**: Ready for Phase 2 Implementation ✅
