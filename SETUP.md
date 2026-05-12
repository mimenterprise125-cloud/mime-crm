# MIM CRM - Setup Instructions

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or login
3. Create a new project
4. Copy your **Project URL** and **Anon Key** from Project Settings → API

## Step 2: Update Environment Variables

Edit `.env.local` in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Step 3: Create Database Tables

1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy-paste the entire contents of `database.sql`
4. Click **Run**

## Step 4: Set Up Authentication

1. Go to **Authentication → Providers**
2. Enable **Email** provider
3. Go to **Authentication → Templates**
4. Customize email templates if needed

## Step 5: Create Test Users

In Supabase **SQL Editor**, run:

```sql
SELECT auth.users();
```

Then create users via:

**Supabase Dashboard → Authentication → Users → Add User**

Or use the auth sign-up function in your app.

**Test Credentials:**
- Email: admin@mim.com | Password: password123
- Email: sales@mim.com | Password: password123
- Email: operations@mim.com | Password: password123
- Email: accounts@mim.com | Password: password123

## Step 6: Update User Profiles

After creating auth users, insert into the users table:

```sql
INSERT INTO users (id, email, full_name, phone, role) VALUES
('user-id-here', 'admin@mim.com', 'Admin User', '+91 98765 43210', 'admin');
```

Get the user IDs from **Authentication → Users**

## Step 7: Run the Application

```bash
npm run dev
```

Navigate to:
- **Home**: http://localhost:5173/
- **Login**: http://localhost:5173/login
- **Dashboard**: http://localhost:5173/dashboard

## Troubleshooting

### "Missing Supabase environment variables"
- Check `.env.local` has correct URL and key
- Restart the dev server after updating .env

### "Failed to sign in"
- Verify auth users exist in Supabase
- Check email/password combination

### "Row Level Security denied this operation"
- RLS policies might be too restrictive
- Check Supabase SQL Logs for details
- Temporarily disable RLS for testing

### Database Migration Issues
- Run `database.sql` in small chunks if it fails
- Check for syntax errors in Supabase SQL Editor

## Next Steps

1. ✅ Database configured
2. ✅ Authentication working
3. ⏳ Add Lead Management page
4. ⏳ Add Project Management page
5. ⏳ Add Payment Management page
6. ⏳ Add Employee Management page
7. ⏳ Add Dashboards (Sales, Operations, Accounts)
8. ⏳ WhatsApp Integration
9. ⏳ Customer Portal (My Works)
