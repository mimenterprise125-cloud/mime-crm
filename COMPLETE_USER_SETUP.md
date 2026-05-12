# 🔐 Complete User Setup - Step by Step

## ⚠️ IMPORTANT: Correct Order

Users MUST be created in this order:

1. **FIRST**: Create auth users in Supabase (email/password) 
2. **SECOND**: Get their UUIDs
3. **THIRD**: Update create-users.sql with UUIDs
4. **FOURTH**: Run SQL to create database profiles

---

## Step 1: Create Auth Users in Supabase

### 1.1 Go to Supabase Dashboard

- Open https://supabase.com
- Select your project
- Click **Authentication** (left sidebar)
- Click **Users**

### 1.2 Add First User (ADMIN)

Click **Add User** button

```
Email:          admin@mim.com
Password:       password123
Confirm email:  ✓ CHECKED
Auto send:      ✓ CHECKED
```

Click **Create User**

✅ **COPY the UUID** that appears in the ID column

### 1.3 Add Second User (SALES)

Click **Add User** button

```
Email:          sales@mim.com
Password:       password123
Confirm email:  ✓ CHECKED
Auto send:      ✓ CHECKED
```

Click **Create User**

✅ **COPY the UUID**

### 1.4 Add Third User (OPERATIONS)

Click **Add User** button

```
Email:          operations@mim.com
Password:       password123
Confirm email:  ✓ CHECKED
Auto send:      ✓ CHECKED
```

Click **Create User**

✅ **COPY the UUID**

### 1.5 Add Fourth User (ACCOUNTS)

Click **Add User** button

```
Email:          accounts@mim.com
Password:       password123
Confirm email:  ✓ CHECKED
Auto send:      ✓ CHECKED
```

Click **Create User**

✅ **COPY the UUID**

---

## Step 2: Record the UUIDs

From Supabase Authentication → Users table, copy these UUIDs:

```
Admin UUID:       ________________________________
Sales UUID:       ________________________________
Operations UUID:  ________________________________
Accounts UUID:    ________________________________
```

---

## Step 3: Update create-users.sql

Open the file `create-users.sql` in VS Code

**Find these lines:**

```sql
INSERT INTO users (id, email, full_name, phone, role, status, created_at, updated_at)
VALUES (
  'YOUR-ADMIN-UUID-HERE'::uuid,
  'admin@mim.com',
  ...
```

**Replace 'YOUR-ADMIN-UUID-HERE' with your actual admin UUID:**

```sql
INSERT INTO users (id, email, full_name, phone, role, status, created_at, updated_at)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,  -- Your actual admin UUID
  'admin@mim.com',
  ...
```

**Do the same for all 4 users:**

```sql
-- ADMIN
'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid,

-- SALES
'f47ac10b-58cc-4372-a567-0e02b2c3d480'::uuid,

-- OPERATIONS
'f47ac10b-58cc-4372-a567-0e02b2c3d481'::uuid,

-- ACCOUNTS
'f47ac10b-58cc-4372-a567-0e02b2c3d482'::uuid,
```

---

## Step 4: Run the SQL Script

1. Go to Supabase **SQL Editor**
2. Click **New Query**
3. Copy ALL content from `create-users.sql`
4. Paste into the editor
5. Click **RUN** (blue button)

**Expected Result:**

```
id                                   | email               | full_name           | role      | status
f47ac10b-58cc-4372-a567-0e02b2c3d479 | admin@mim.com       | Admin User          | admin     | ACTIVE
f47ac10b-58cc-4372-a567-0e02b2c3d480 | sales@mim.com       | Sales Manager       | sales     | ACTIVE
f47ac10b-58cc-4372-a567-0e02b2c3d481 | operations@mim.com  | Operations Manager  | operations| ACTIVE
f47ac10b-58cc-4372-a567-0e02b2c3d482 | accounts@mim.com    | Accounts Manager    | accounts  | ACTIVE
```

✅ **Success!**

---

## Step 5: Test Login

1. Start dev server: `npm run dev`
2. Open http://localhost:5173/login
3. Try login:
   ```
   Email:    admin@mim.com
   Password: password123
   ```
4. Click **Login**
5. Should redirect to dashboard ✅

---

## 🎉 All Users Are Ready!

### Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@mim.com | password123 | Admin (Full Access) |
| sales@mim.com | password123 | Sales (Leads Only) |
| operations@mim.com | password123 | Operations (Projects) |
| accounts@mim.com | password123 | Accounts (Payments) |

---

## 🚀 Complete Workflow Demo

### Day 1: Sales Team
1. Login: `sales@mim.com`
2. Go to Leads
3. Create new lead: "Rajesh Kumar, Mumbai"
4. Follow up and convert to CONVERTED

### Day 2: Operations Team
1. Login: `operations@mim.com`
2. Go to Projects
3. Create project from converted lead
4. Enter: 1000 sqft @ ₹500/sqft = ₹5,00,000 (+ ₹90,000 GST)
5. Update status

### Day 3: Accounts Team
1. Login: `accounts@mim.com`
2. Go to Payments
3. Record ADVANCE payment: ₹1,50,000 → PAID
4. Record PARTIAL payment: ₹2,50,000 → PAID
5. Record FINAL payment: ₹1,40,000 → PAID

### Day 4: Admin View
1. Login: `admin@mim.com`
2. Go to Dashboard
3. See all metrics:
   - 1 lead (CONVERTED)
   - 1 project (ACTIVE)
   - 3 payments (all PAID)
   - Total collected: ₹5,40,000

---

## 🐛 Troubleshooting

### Issue: "Email not found" on login
**Cause**: Auth user not created in Supabase
**Fix**:
1. Go to Supabase → Authentication → Users
2. Check if admin@mim.com exists
3. If not, create it manually

### Issue: "Invalid UUID" error when running SQL
**Cause**: UUID format is wrong
**Fix**:
- UUID format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`
- Example: `f47ac10b-58cc-4372-a567-0e02b2c3d479`
- Check you copied the full UUID from Supabase

### Issue: "Foreign key constraint" error
**Cause**: Database user profile not created
**Fix**:
1. Run create-users.sql successfully
2. Verify with: `SELECT * FROM users WHERE email = 'admin@mim.com';`
3. Should see 1 row with role='admin'

### Issue: Login works but Dashboard is blank
**Cause**: User profile not found in database
**Fix**:
1. Verify user exists: `SELECT * FROM users WHERE email = 'admin@mim.com';`
2. If not, run create-users.sql with correct UUID
3. Check UUID matches between Auth and database

---

## ✅ Verification Checklist

- [ ] Created 4 auth users in Supabase Authentication
- [ ] Copied all 4 UUIDs
- [ ] Updated create-users.sql with actual UUIDs
- [ ] Ran create-users.sql successfully
- [ ] Query shows 4 users created
- [ ] Tested login with admin@mim.com
- [ ] Dashboard loads after login
- [ ] Can see Leads, Projects, Payments modules
- [ ] Tested with other user accounts
- [ ] All users can login successfully

---

## 📞 Quick Reference

**Your Auth User UUIDs:**

Admin:       `___________________________________`
Sales:       `___________________________________`
Operations:  `___________________________________`
Accounts:    `___________________________________`

**Database Check:**
```sql
SELECT email, role FROM users ORDER BY role;
```

Should show:
- accounts@mim.com (accounts)
- admin@mim.com (admin)
- operations@mim.com (operations)
- sales@mim.com (sales)

---

**You're all set! Start using the CRM now! 🎉**
