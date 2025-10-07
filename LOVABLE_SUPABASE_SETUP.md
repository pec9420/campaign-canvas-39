# Lovable Cloud + Supabase Integration Guide

## 🎯 Overview

Since you're using **Lovable.dev** for this project, you have two powerful options for working with Supabase:

1. **Lovable's Native Supabase Integration** (Recommended)
2. **Manual Supabase Connection** (More control)

---

## ✨ Option 1: Lovable's Native Integration (Recommended)

### Benefits
- ✅ **Automatic setup** - Lovable configures everything for you
- ✅ **Chat-driven development** - Create tables/functions via prompts
- ✅ **Auto-deploys** - Edge functions deploy automatically
- ✅ **Built-in key management** - No .env files needed
- ✅ **Reads your schema** - Lovable understands your database

### Setup Steps

#### 1. In Lovable.dev
1. Open your project in Lovable
2. Click the **"Integrations"** menu (or Settings)
3. Click **"Connect Supabase"**
4. Authorize Lovable to access your Supabase account
5. Select your Supabase project (or create new one)
6. Wait for automatic configuration ✨

#### 2. Lovable Will Automatically:
- Set up your Supabase project
- Configure authentication
- Create storage buckets
- Generate necessary tables
- Deploy edge functions

#### 3. Working with Lovable + Supabase

**Creating Tables via Chat:**
```
You: "Create a profiles table with columns for business_name, locations (array),
services (array), and personas (JSON). Add Row Level Security so users can only
access their own data."

Lovable: *Generates SQL, creates table, sets up RLS policies*
```

**Creating Edge Functions:**
```
You: "Create an edge function that processes uploaded brand PDFs and extracts
text content for the brand profile."

Lovable: *Creates function, deploys to Supabase, handles API keys*
```

**Authentication:**
```
You: "Add Supabase authentication with email/password and Google OAuth"

Lovable: *Sets up auth, creates login forms, configures providers*
```

### Best Practices with Lovable Integration

1. **Let Lovable Manage the Schema**
   - Don't manually create tables in Supabase dashboard
   - Use Lovable chat to modify database
   - Lovable keeps everything in sync

2. **Environment Variables**
   - Lovable handles Supabase keys automatically
   - No need to create `.env.local` files
   - Keys are securely managed in Lovable Cloud

3. **Edge Functions**
   - Create functions via Lovable chat
   - Lovable auto-deploys to Supabase
   - Check logs in Lovable for debugging

4. **GitHub Sync**
   - Enable two-way sync with GitHub
   - Your Supabase integration travels with your code
   - Team members get automatic access

---

## 🔧 Option 2: Manual Supabase Connection

### When to Use This
- You need more control over database structure
- You're working outside Lovable (like now with Claude Code)
- You want to manage multiple environments (dev/staging/prod)

### Setup Steps

1. **Create Supabase Project** (if not done via Lovable)
   - Go to https://supabase.com
   - Create new project
   - Note: URL and anon key

2. **In Lovable Settings**
   - Go to Integrations
   - Click "Enter Supabase Keys"
   - Paste your Project URL and anon key
   - This allows Lovable to read your schema

3. **In Your Local Project**
   - Create `.env.local` file (already done in previous setup)
   - Add your Supabase credentials
   - Use for local development

4. **Database Setup**
   - Run the SQL from `SUPABASE_SETUP.md`
   - This creates all necessary tables

---

## 🎨 Recommended Workflow for Your Project

Since you're using **both Lovable AND Claude Code**, here's the best approach:

### 1. Primary Development in Lovable
```
✅ Use Lovable's native integration
✅ Let Lovable manage Supabase connection
✅ Create tables/functions via Lovable chat
✅ Handle authentication through Lovable
```

### 2. Local Development with Claude Code
```
✅ Use the same Supabase project
✅ Add credentials to .env.local for testing
✅ Use src/lib/supabase.ts for local connections
✅ Test features locally before pushing to Lovable
```

### 3. Workflow
```
1. In Lovable: "Connect to Supabase" → Auto-setup
2. In Lovable: Create your database schema via chat
3. Locally (Claude Code): Get the Supabase URL/key from Lovable settings
4. Locally: Add to .env.local for testing
5. Push to GitHub → Lovable syncs automatically
```

---

## 🔐 For Your Campaign Canvas Project

### Recommended Database Schema (via Lovable Chat)

Tell Lovable:
```
"Create a Supabase database with these tables:

1. profiles table:
   - Store business profiles with locations, services, programs, personas
   - Include brand identity, voice/tone, content rules
   - Add RLS so users only see their own profiles

2. campaigns table:
   - Store generated campaigns with strategy, scripts, visuals
   - Link to profile_id
   - Include status (draft, in_progress, completed)
   - Add RLS for user privacy

3. uploaded_files table:
   - Store brand assets (logos, guides, images)
   - Track file type, URL, extracted text
   - Add RLS policies

4. Create a storage bucket called 'brand-files' for file uploads

5. Set up email/password authentication"
```

Lovable will:
- ✅ Generate proper SQL with all columns
- ✅ Create RLS policies automatically
- ✅ Set up storage bucket with proper permissions
- ✅ Configure authentication
- ✅ Create necessary indexes

---

## 💡 Pro Tips

### 1. Schema Changes
**In Lovable:**
```
"Add a new column 'favorite_campaigns' (text array) to the profiles table"
```
Lovable handles migrations automatically!

### 2. Edge Functions
**In Lovable:**
```
"Create an edge function that:
1. Takes an uploaded brand guide PDF
2. Extracts text using PDF parsing
3. Uses AI to extract brand colors, voice tone, and key phrases
4. Updates the profile with extracted data"
```

### 3. Real-time Updates
**In Lovable:**
```
"Add real-time subscriptions so when a profile is updated,
the UI automatically refreshes"
```

### 4. File Uploads
**In Lovable:**
```
"Add a file upload component that:
1. Accepts PDF/TXT/DOCX files
2. Uploads to Supabase storage
3. Shows progress indicator
4. Saves metadata to uploaded_files table"
```

---

## 🚨 Important Notes

### If You've Already Set Up Supabase Manually
1. **Option A:** Delete your manual setup and let Lovable recreate everything
2. **Option B:** Keep your setup and just add keys to Lovable for schema reading
   - Lovable Settings → Integrations → "Enter Supabase Keys"
   - Paste URL and anon key
   - Lovable can now read your schema but won't modify it

### Disconnecting Supabase
- You can disconnect in Lovable settings
- This stops edge function deploys and schema reading
- Doesn't delete your data or modify existing code
- Can reconnect anytime

### Working with Team
- When team members clone the repo, they need to:
  1. Connect their Lovable account to same Supabase project
  2. Or: Get Supabase keys for their own .env.local

---

## 📚 Next Steps

### Immediate (In Lovable):
1. ✅ Go to Lovable Integrations
2. ✅ Click "Connect Supabase"
3. ✅ Let Lovable set everything up
4. ✅ Use chat to create your database schema

### For Local Development:
1. ✅ Get Supabase URL/key from Lovable settings
2. ✅ Add to `.env.local` (file already created)
3. ✅ Test locally with Claude Code
4. ✅ Push changes → Lovable auto-syncs

### For Brand Hub Features:
Ask Lovable:
```
"Integrate Supabase with the Brand Hub page:
1. Save profiles to Supabase instead of localStorage
2. Add user authentication
3. Implement file uploads for logos and brand guides
4. Add real-time auto-save to database"
```

---

## 🎓 Resources

- **Lovable Docs**: https://docs.lovable.dev/integrations/supabase
- **Supabase Docs**: https://supabase.com/docs
- **Your Local Setup**: See `SUPABASE_SETUP.md` for manual integration details

---

## ✨ The Magic of Lovable + Supabase

The beauty of Lovable's integration is that you can:
1. **Design UI** via chat with Lovable
2. **Build backend** via chat with Lovable
3. **Deploy everything** automatically
4. **Test locally** with Claude Code
5. **Push to production** seamlessly

All while Lovable manages the complex Supabase configuration for you! 🚀
