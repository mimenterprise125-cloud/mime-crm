# 🚀 Quick Start - Create Users (No UUID Needed!)

## ✅ Super Simple 3-Step Setup

### Step 1: Run the SQL Script (Database Profiles)

1. Go to **Supabase SQL Editor**
2. Copy ALL content from `create-users.sql`
3. Paste into the SQL editor
4. Click **RUN**

**Result**: You'll see 4 user profiles created:
```
email                | full_name           | role
admin@mim.com        | Admin User          | admin
sales@mim.com        | Sales Manager       | sales
operations@mim.com   | Operations Manager  | operations
accounts@mim.com     | Accounts Manager    | accounts
```

---

### Step 2: Create Auth Users in Supabase

Go to **Supabase Dashboard → Authentication → Users**

Click **"Add User"** button 4 times:

**User 1:**
```
Email: admin@mim.com
Password: password123
✓ Auto confirm user
```

**User 2:**
```
Email: sales@mim.com
Password: password123
✓ Auto confirm user
```

**User 3:**
```
Email: operations@mim.com
Password: password123
✓ Auto confirm user
```

**User 4:**
```
Email: accounts@mim.com
Password: password123
✓ Auto confirm user
```

---

### Step 3: Test Login

1. Run dev server: `npm run dev`
2. Go to http://localhost:5173/login
3. Try login with any account:
   - Email: `admin@mim.com`
   - Password: `password123`
4. Click **Login**
5. Should see success and redirect to dashboard! ✅

---

## 🎯 That's It! You're Done!

Your CRM is now fully functional with all 4 users:

| Email | Password | Role | Access |
|-------|----------|------|--------|
| admin@mim.com | password123 | Admin | Everything |
| sales@mim.com | password123 | Sales | Leads only |
| operations@mim.com | password123 | Operations | Projects only |
| accounts@mim.com | password123 | Accounts | Payments only |

---

## 🎉 Next: Start Using the CRM!

1. **Login as Sales**: `sales@mim.com`
2. **Create a Lead**: Go to Leads → Add Lead
3. **Update Status**: Change lead status to CONVERTED
4. **Login as Operations**: `operations@mim.com`
5. **Create Project**: Go to Projects → Add Project (from converted lead)
6. **Record Payment**: Login as Accounts → Record payment
7. **View Dashboard**: Login as Admin → See everything!

---

## 🔗 Complete Workflow

```
Sales              Operations         Accounts
  │                    │                  │
  ├─ Create Lead      │                  │
  │                   │                  │
  ├─ Convert to       │                  │
  │  CONVERTED        │                  │
  │                   │                  │
  │                ┌──┴──┐              │
  │                │      │              │
  │                └──────┼─ Create Project
  │                       │              │
  │                       ├─ Update Status
  │                       │              │
  │                       └──┬───────────┤
  │                          │          │
  │                          │    ┌─────┴─ Record Payment
  │                          │    │
  │                          │    └──── Mark as PAID
  │                          │
  │                    ┌─────┴──────────┐
  │                    │                │
  │              Update to        View Collection
  │              COMPLETED         Statistics
  │
  └─────────────────────────────────────┘
         (Complete Workflow!)
```

---

## 🐛 If Something Goes Wrong

### Login says "Invalid credentials"
- Make sure you created the auth user in Supabase Auth (step 2)
- Check email matches exactly (admin@mim.com)

### Dashboard shows blank
- Make sure you ran create-users.sql (step 1)
- Check that user profiles exist: `SELECT * FROM users;`

### "Role not found" error
- Verify role was set correctly in create-users.sql output
- Should show: admin, sales, operations, or accounts

---

## 📞 Test Credentials Summary

```
ADMIN (Full Access)
Email: admin@mim.com
Password: password123

SALES (Leads)
Email: sales@mim.com
Password: password123

OPERATIONS (Projects)
Email: operations@mim.com
Password: password123

ACCOUNTS (Payments)
Email: accounts@mim.com
Password: password123
```

**Done! Happy selling! 🎉**
