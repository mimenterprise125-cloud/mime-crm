# 🔐 How to Get Actual UUIDs from Supabase

## Why UUIDs Matter

The UUIDs (Universally Unique Identifiers) link your authentication users with their database profiles. They must match exactly.

---

## Method 1: Get UUIDs from Supabase Dashboard (EASIEST)

### Step 1: Create Authentication Users in Supabase

1. Go to https://supabase.com
2. Select your project
3. Click **Authentication** → **Users** (left sidebar)
4. Click **Add User** button
5. Fill in:
   ```
   Email: admin@mim.com
   Password: password123
   Auto confirm user: ✓ (CHECK THIS!)
   ```
6. Click **Create User**

### Step 2: Copy the UUID

After creating the user, you'll see a table with the new user:

```
ID (this is the UUID!)          | Email              | Status
550e8400-e29b-41d4-a716-4466...| admin@mim.com      | Confirmed
```

**Click on the ID field** to copy the full UUID:
```
550e8400-e29b-41d4-a716-446655440000
```

### Step 3: Repeat for All 4 Users

Create and copy UUIDs for:
1. admin@mim.com → UUID: ___________________________
2. sales@mim.com → UUID: ___________________________
3. operations@mim.com → UUID: ___________________________
4. accounts@mim.com → UUID: ___________________________

---

## Method 2: Query UUIDs from Supabase Auth

If you've already created the users, get their UUIDs directly:

### Using Supabase CLI

```bash
supabase auth admin export users
```

This will show all auth users with their UUIDs.

### Using PostgreSQL Query

Go to **SQL Editor** in Supabase and run:

```sql
-- This query the auth.users table (requires admin access)
SELECT id, email FROM auth.users ORDER BY created_at DESC;
```

This will show all UUIDs.

---

## Update create-users.sql with Real UUIDs

Once you have the 4 UUIDs, update the file:

### Find these lines in create-users.sql:

```sql
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  '550e8400-e29b-41d4-a716-446655440000'::uuid, -- Replace this
  'admin@mim.com',
  ...
```

### Replace with Your Actual UUID:

```sql
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  '12345678-90ab-cdef-1234-567890abcdef'::uuid, -- Your actual admin UUID
  'admin@mim.com',
  ...
```

### Example with Real UUIDs:

```sql
-- ADMIN USER PROFILE
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d479'::uuid, -- Replace with admin UUID
  'admin@mim.com',
  'Admin User',
  '+91 98765 43210',
  'admin',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- SALES USER PROFILE
INSERT INTO users (id, email, full_name, phone, role, created_at, updated_at)
VALUES (
  'f47ac10b-58cc-4372-a567-0e02b2c3d480'::uuid, -- Replace with sales UUID
  'sales@mim.com',
  'Sales Manager',
  '+91 98765 43211',
  'sales',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;
```

---

## ✅ Verify UUIDs are Valid

### UUID Format Check

Valid UUID format looks like:
```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
550e8400-e29b-41d4-a716-446655440000
f47ac10b-58cc-4372-a567-0e02b2c3d479
```

### Test Query

After updating create-users.sql with real UUIDs, run this in SQL Editor:

```sql
-- This will show if users were created successfully
SELECT id, email, full_name, role FROM users ORDER BY created_at DESC;
```

Should show:
```
id                                   | email               | full_name          | role
f47ac10b-58cc-4372-a567-0e02b2c3d479 | admin@mim.com       | Admin User         | admin
f47ac10b-58cc-4372-a567-0e02b2c3d480 | sales@mim.com       | Sales Manager      | sales
f47ac10b-58cc-4372-a567-0e02b2c3d481 | operations@mim.com  | Operations Manager | operations
f47ac10b-58cc-4372-a567-0e02b2c3d482 | accounts@mim.com    | Accounts Manager   | accounts
```

---

## 🚀 Quick Start (Using Demo UUIDs)

If you just want to test quickly with demo data:

### Current create-users.sql already has demo UUIDs:

```sql
'550e8400-e29b-41d4-a716-446655440000'::uuid, -- Admin
'550e8400-e29b-41d4-a716-446655440001'::uuid, -- Sales
'550e8400-e29b-41d4-a716-446655440002'::uuid, -- Operations
'550e8400-e29b-41d4-a716-446655440003'::uuid, -- Accounts
```

### To use demo UUIDs:

1. **Create auth users in Supabase** (email/password only)
2. Run the current create-users.sql
3. Login will work with the demo UUIDs

⚠️ **NOTE**: This only works if you also create matching auth users in Supabase with the same emails (admin@mim.com, sales@mim.com, etc.)

---

## 🔗 Linking Auth to Database

### How It Works

```
┌─────────────────────────────────┐
│  Supabase Authentication        │
│  (email/password login)         │
│                                 │
│  admin@mim.com    ──UUID──┐    │
│  password123               │    │
└─────────────────────────────────┘
                             │
                             │ (Must Match!)
                             ▼
                    ┌──────────────────┐
                    │  Database        │
                    │  users table     │
                    │                  │
                    │  id: UUID ◄──────┘
                    │  email: email
                    │  role: admin
                    │  full_name: name
                    └──────────────────┘
```

**Important**: The UUID in the database MUST match the UUID in Supabase Auth!

---

## 🆘 If Login Fails

### Check 1: Auth User Exists?
Go to Supabase → Authentication → Users
- Should see admin@mim.com, sales@mim.com, etc.
- Should have ✓ Confirmed status

### Check 2: Database User Exists?
Go to SQL Editor and run:
```sql
SELECT * FROM users WHERE email = 'admin@mim.com';
```
- Should return 1 row with UUID and role='admin'

### Check 3: UUIDs Match?
```sql
-- Get UUID from database
SELECT id FROM users WHERE email = 'admin@mim.com';

-- Compare with UUID shown in Supabase Auth
-- They MUST be identical!
```

### Check 4: Is RLS Policy Correct?
```sql
-- This shows RLS policies
SELECT * FROM pg_policies WHERE tablename = 'users';
```

---

## 📊 Complete Setup Checklist

- [ ] Created 4 auth users in Supabase (admin, sales, operations, accounts)
- [ ] Copied 4 UUIDs from Supabase Auth
- [ ] Updated create-users.sql with actual UUIDs
- [ ] Ran create-users.sql in SQL Editor
- [ ] Verified 4 users created in database (SELECT * FROM users;)
- [ ] Tested login with admin@mim.com
- [ ] Tested with sales@mim.com
- [ ] Tested with operations@mim.com
- [ ] Tested with accounts@mim.com

---

## ✨ You're All Set!

Once UUIDs match between Auth and Database, login will work perfectly and all CRM modules will be accessible.

Questions? Check USER_SETUP_GUIDE.md for more details!
