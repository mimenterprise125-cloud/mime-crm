-- ============================================================================
-- MIM CRM - CREATE TEST USERS AND PROFILES
-- ============================================================================
-- IMPORTANT: Users must be created in Supabase Auth FIRST!
-- Then run this script to create their database profiles
-- ============================================================================

-- ============================================================================
-- STEP 1: GET AUTH USER IDs FROM SUPABASE
-- ============================================================================
-- Go to Supabase Dashboard → Authentication → Users
-- Copy the UUID (ID column) for each user you created
-- Then use those IDs below in the VALUES

-- ============================================================================
-- STEP 2: INSERT USER PROFILES (with actual auth user IDs)
-- ============================================================================

-- ADMIN USER PROFILE
-- Replace 'YOUR-ADMIN-UUID-HERE' with actual UUID from Supabase Auth
INSERT INTO users (id, email, full_name, phone, role, status, created_at, updated_at)
VALUES (
  'YOUR-ADMIN-UUID-HERE'::uuid,
  'admin@mim.com',
  'Admin User',
  '+91 98765 43210',
  'admin',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- SALES USER PROFILE
-- Replace 'YOUR-SALES-UUID-HERE' with actual UUID from Supabase Auth
INSERT INTO users (id, email, full_name, phone, role, status, created_at, updated_at)
VALUES (
  'YOUR-SALES-UUID-HERE'::uuid,
  'sales@mim.com',
  'Sales Manager',
  '+91 98765 43211',
  'sales',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- OPERATIONS USER PROFILE
-- Replace 'YOUR-OPERATIONS-UUID-HERE' with actual UUID from Supabase Auth
INSERT INTO users (id, email, full_name, phone, role, status, created_at, updated_at)
VALUES (
  'YOUR-OPERATIONS-UUID-HERE'::uuid,
  'operations@mim.com',
  'Operations Manager',
  '+91 98765 43212',
  'operations',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ACCOUNTS USER PROFILE
-- Replace 'YOUR-ACCOUNTS-UUID-HERE' with actual UUID from Supabase Auth
INSERT INTO users (id, email, full_name, phone, role, status, created_at, updated_at)
VALUES (
  'YOUR-ACCOUNTS-UUID-HERE'::uuid,
  'accounts@mim.com',
  'Accounts Manager',
  '+91 98765 43213',
  'accounts',
  'ACTIVE',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- VERIFY USERS WERE CREATED
-- ============================================================================
SELECT id, email, full_name, role, status FROM users WHERE email IN ('admin@mim.com', 'sales@mim.com', 'operations@mim.com', 'accounts@mim.com') ORDER BY created_at;

-- ============================================================================
-- COMPLETE! NEXT STEPS:
-- ============================================================================
-- 1. Create auth users in Supabase FIRST (email/password)
-- 2. Copy their UUIDs from Supabase → Authentication → Users
-- 3. Replace 'YOUR-ADMIN-UUID-HERE' etc above with actual UUIDs
-- 4. Run this script again with the real UUIDs
-- 5. Verify users appear in the query result above
-- 6. Test login: http://localhost:5173/login

-- ============================================================================
-- HELPFUL QUERIES
-- ============================================================================

-- View all users and their roles:
-- SELECT email, full_name, role, created_at FROM users ORDER BY role;

-- Update a user's phone number:
-- UPDATE users SET phone = '+91 NEW_NUMBER' WHERE email = 'admin@mim.com';

-- Change a user's role:
-- UPDATE users SET role = 'sales' WHERE email = 'admin@mim.com';

-- View users by role:
-- SELECT * FROM users WHERE role = 'admin';
-- SELECT * FROM users WHERE role = 'sales';
-- SELECT * FROM users WHERE role = 'operations';
-- SELECT * FROM users WHERE role = 'accounts';
