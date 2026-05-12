# ✅ Users Created! Now Link to Supabase Auth

## What Just Happened

✅ You just created 4 database user profiles with auto-generated UUIDs:

```
id                                   | email               | full_name           | role
550e8400-e29b-41d4-a716-446655440000 | admin@mim.com       | Admin User          | admin
550e8400-e29b-41d4-a716-446655440001 | sales@mim.com       | Sales Manager       | sales
550e8400-e29b-41d4-a716-446655440002 | operations@mim.com  | Operations Manager  | operations
550e8400-e29b-41d4-a716-446655440003 | accounts@mim.com    | Accounts Manager    | accounts
```

---

## Step 1: Copy the UUIDs

From the SQL output above, **copy the 4 IDs**:

```
Admin ID:       550e8400-e29b-41d4-a716-446655440000
Sales ID:       550e8400-e29b-41d4-a716-446655440001
Operations ID:  550e8400-e29b-41d4-a716-446655440002
Accounts ID:    550e8400-e29b-41d4-a716-446655440003
```

---

## Step 2: Create Auth Users in Supabase

1. Go to **Supabase Dashboard**
2. Click your project
3. Go to **Authentication** (left sidebar)
4. Click **Users**
5. Click **Add User** button

### Create ADMIN Auth User

```
Email:          admin@mim.com
Password:       password123
User ID:        550e8400-e29b-41d4-a716-446655440000  (paste from Step 1)
Confirm email:  ✓ CHECK THIS
Auto send:      ✓ CHECK THIS
```

Click **Create User**

### Create SALES Auth User

```
Email:          sales@mim.com
Password:       password123
User ID:        550e8400-e29b-41d4-a716-446655440001  (paste from Step 1)
Confirm email:  ✓ CHECK THIS
Auto send:      ✓ CHECK THIS
```

Click **Create User**

### Create OPERATIONS Auth User

```
Email:          operations@mim.com
Password:       password123
User ID:        550e8400-e29b-41d4-a716-446655440002  (paste from Step 1)
Confirm email:  ✓ CHECK THIS
Auto send:      ✓ CHECK THIS
```

Click **Create User**

### Create ACCOUNTS Auth User

```
Email:          accounts@mim.com
Password:       password123
User ID:        550e8400-e29b-41d4-a716-446655440003  (paste from Step 1)
Confirm email:  ✓ CHECK THIS
Auto send:      ✓ CHECK THIS
```

Click **Create User**

---

## Step 3: Test Login

1. Run dev server: `npm run dev`
2. Open http://localhost:5173/login
3. Login with:
   ```
   Email:    admin@mim.com
   Password: password123
   ```
4. Click **Login**
5. Should redirect to dashboard ✅

---

## 🎉 All Done!

Your CRM is now fully functional!

### Test Credentials

| Email | Password | Role |
|-------|----------|------|
| admin@mim.com | password123 | Admin |
| sales@mim.com | password123 | Sales |
| operations@mim.com | password123 | Operations |
| accounts@mim.com | password123 | Accounts |

---

## 🚀 Start Using It!

1. **Login as Sales**: Create leads
2. **Convert to Project**: Update lead → CONVERTED
3. **Login as Operations**: Create projects from converted leads
4. **Record Payments**: Login as Accounts → track collection
5. **View Dashboard**: Login as Admin → see everything

**Happy selling! 🎉**
