# 🔧 Fix: Configure Supabase Environment Variables

## Error Explanation

The error `Failed to fetch` + `net::ERR_NAME_NOT_RESOLVED` means:
- Your app can't connect to Supabase
- Environment variables aren't set correctly
- The app is trying to reach `your-project.supabase.co` (placeholder URL)

---

## ✅ Fix: Get Your Supabase Credentials

### Step 1: Go to Supabase Dashboard

1. Open https://supabase.com
2. Login to your account
3. Select your project

### Step 2: Get Your Connection Details

Click **Settings** (left sidebar) → **API**

You'll see:

```
Project URL:     https://your-actual-project.supabase.co
Anon Public Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Service Role Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Copy these 3 values** (they're different for every project)

---

## Step 3: Update .env.local

Open the file: `.env.local`

Replace the placeholder values:

### BEFORE (Wrong - Placeholders):
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### AFTER (Correct - Your Values):
```env
VITE_SUPABASE_URL=https://your-actual-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Save the file** (Ctrl+S)

---

## Step 4: Restart Dev Server

Stop the current server:
- Press `Ctrl+C` in the terminal

Restart it:
```bash
npm run dev
```

---

## Step 5: Test Login Again

1. Go to http://localhost:5173/login
2. Try login with: `admin@mim.com` / `password123`
3. Should now connect to Supabase ✅

---

## 🔍 Verify Configuration

If you see this error still:
```
Missing Supabase environment variables
```

It means:
- .env.local file wasn't saved
- Dev server wasn't restarted
- Check that VITE_ prefix is present

**Solution:**
1. Check .env.local has 3 lines starting with `VITE_`
2. Make sure values aren't placeholders (`your-project`, `your-anon-key`)
3. Restart dev server
4. Clear browser cache (Ctrl+Shift+Delete)

---

## 📋 Complete Setup Checklist

- [ ] Got Project URL from Supabase Settings → API
- [ ] Got Anon Public Key
- [ ] Got Service Role Key
- [ ] Updated .env.local with real values
- [ ] Saved .env.local file
- [ ] Restarted dev server (`npm run dev`)
- [ ] Cleared browser cache
- [ ] Tried login again
- [ ] Connected successfully ✅

---

## 🚀 Now Continue With User Setup

Once Supabase connects:

1. **Create auth users in Supabase** (via dashboard)
   - admin@mim.com / password123
   - sales@mim.com / password123
   - operations@mim.com / password123
   - accounts@mim.com / password123

2. **Get their UUIDs** (copy from Users table)

3. **Update create-users.sql** with actual UUIDs

4. **Run the SQL script** to create database profiles

5. **Test login** at http://localhost:5173/login

---

## 💡 Common Issues

### "Your project URL looks invalid"
- URL must be: `https://xxxxxxxxxxxx.supabase.co` (with `.co`)
- Check you copied the full URL

### "Invalid API Key"
- Make sure you copied from Settings → API
- Not from somewhere else
- Anon Key starts with `eyJ...`

### "Still getting hydration mismatch warning"
- This is just a warning in development
- It will go away once Supabase connects
- Not a critical error

---

## 📞 Reference

Your .env.local should look like:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxx-xxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwcXlyd2lwdHJ3eW9seWRsIiwiYXV1ZCI6InN1cGFiYXNlIn0.WXXXXXXXXXXXXXXXXXXXXXXXX
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhwcXlyd2lwdHJ3eW9seWRsIiwiYXV1ZCI6InN1cGFiYXNlIn0.XXXXXXXXXXXXXXXXXXXXXXXXX
```

(Your actual keys will be different - these are just examples)

---

**Once configured, the app will work perfectly! ✅**
