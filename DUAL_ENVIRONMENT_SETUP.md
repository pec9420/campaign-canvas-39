# Dual Environment Setup: Lovable Cloud + Local Development

## 🎯 Overview

This project supports **both** Lovable Cloud and local development with Supabase:
- **Lovable Cloud**: Zero-config deployment
- **Local Dev**: Full Supabase stack running locally via Docker

The key: **Migrations = Single Source of Truth** ✨

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│  Same Codebase                              │
├─────────────────────────────────────────────┤
│  Environment Detection (via .env)           │
├──────────────────┬──────────────────────────┤
│  Lovable Cloud   │  Local Development       │
│  ─────────────   │  ──────────────────       │
│  Auto-injected   │  .env.local file         │
│  env vars        │  + supabase CLI          │
│                  │                           │
│  Production      │  Local Docker            │
│  Supabase        │  Containers              │
└──────────────────┴──────────────────────────┘

Both use identical:
- Migration files (supabase/migrations/*.sql)
- Edge functions (supabase/functions/)
- Storage config (supabase/config.toml)
```

---

## 🚀 Setup: Lovable Cloud (Production)

### 1. Enable Lovable Cloud
1. Open your project in Lovable.dev
2. Click **"Enable Cloud"** or go to Integrations
3. Click **"Connect Supabase"**
4. Lovable automatically:
   - ✅ Provisions Supabase project
   - ✅ Injects environment variables
   - ✅ Applies migrations from `supabase/migrations/`
   - ✅ Deploys edge functions from `supabase/functions/`

### 2. No Configuration Needed!
Lovable handles everything automatically when you push to GitHub.

---

## 💻 Setup: Local Development

### 1. Install Supabase CLI

**macOS (using Homebrew):**
```bash
brew install supabase/tap/supabase
```

**Linux/WSL:**
```bash
brew install supabase/tap/supabase
# or
curl -fsSL https://deb.supabase.com/supabase.gpg | sudo gpg --dearmor -o /usr/share/keyrings/supabase-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/supabase-archive-keyring.gpg] https://deb.supabase.com stable main" | sudo tee /etc/apt/sources.list.d/supabase.list
sudo apt update && sudo apt install supabase
```

**Verify:**
```bash
supabase --version
```

### 2. Start Docker
Make sure Docker Desktop is running (or Docker daemon on Linux).

### 3. Initialize Supabase in Project

**Already done** - You have `supabase/config.toml`, but let's verify:

```bash
# Check if supabase directory exists
ls supabase/

# If it doesn't exist, initialize:
supabase init
```

### 4. Start Local Supabase Stack

```bash
# This starts local Postgres, Storage, Edge Functions, etc.
supabase start
```

**First run takes ~2 minutes** (downloads Docker images).

You'll see output like:
```
Started supabase local development setup.

         API URL: http://127.0.0.1:54321
     GraphQL URL: http://127.0.0.1:54321/graphql/v1
          DB URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres
      Studio URL: http://127.0.0.1:54323
    Inbucket URL: http://127.0.0.1:54324
      JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
        anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Save these values!** You'll need the `anon key`.

### 5. Create Local Environment File

```bash
# Create .env.local
cat > .env.local << 'EOF'
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... # paste your anon key
EOF
```

### 6. Update Supabase Client for Environment Detection

Already created, but let's enhance it:

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Environment detection
const isLocal = import.meta.env.MODE === 'development';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL ||
  (isLocal ? 'http://127.0.0.1:54321' : '');

const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return Boolean(supabaseUrl && supabaseAnonKey);
};

// Debug helper (only in development)
if (isLocal) {
  console.log('🔧 Supabase Mode:', isLocal ? 'Local' : 'Cloud');
  console.log('🔗 Supabase URL:', supabaseUrl);
}
```

---

## 📁 Migration-Based Schema Management

### Why Migrations?
- ✅ **Version controlled** - All schema changes in Git
- ✅ **Reproducible** - Same schema in local/cloud
- ✅ **Reviewable** - Team can review DB changes
- ✅ **Rollback-able** - Can revert schema changes
- ✅ **No manual SQL** - Never touch Supabase dashboard for schema

### Create Your First Migration

```bash
# Create a new migration file
supabase migration new create_brand_hub_tables
```

This creates: `supabase/migrations/20250107123456_create_brand_hub_tables.sql`

**Edit the migration file:**

```sql
-- supabase/migrations/20250107001_create_brand_hub_tables.sql

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id TEXT UNIQUE NOT NULL,

  -- Business basics
  business_name TEXT NOT NULL,
  niche TEXT,
  owner_name TEXT,
  locations TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  programs JSONB DEFAULT '[]',

  -- Brand identity
  brand_identity JSONB DEFAULT '{}',
  voice JSONB DEFAULT '{}',
  content_rules JSONB DEFAULT '{}',
  business JSONB DEFAULT '{}',

  -- Target personas
  personas JSONB DEFAULT '[]',

  -- Audience
  audience JSONB DEFAULT '{}',

  -- File uploads
  uploaded_files JSONB DEFAULT '{}',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own profiles
CREATE POLICY "Users can manage their own profiles"
  ON profiles
  FOR ALL
  USING (auth.uid() = user_id);

-- Campaigns table
CREATE TABLE campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  goal TEXT NOT NULL,
  status TEXT DEFAULT 'draft',

  -- Campaign data
  strategy JSONB DEFAULT '{}',
  scripts JSONB DEFAULT '[]',
  visuals JSONB DEFAULT '[]',

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE campaigns ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own campaigns
CREATE POLICY "Users can manage their own campaigns"
  ON campaigns
  FOR ALL
  USING (auth.uid() = user_id);

-- Uploaded files table
CREATE TABLE uploaded_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  file_type TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,

  -- Extracted content
  extracted_text TEXT,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE uploaded_files ENABLE ROW LEVEL SECURITY;

-- Policy: Users can manage their own files
CREATE POLICY "Users can manage their own files"
  ON uploaded_files
  FOR ALL
  USING (auth.uid() = user_id);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### Apply Migration Locally

```bash
# Apply all pending migrations to local DB
supabase db reset

# Or just apply new ones:
supabase migration up
```

### Create Storage Bucket Migration

```bash
supabase migration new create_storage_buckets
```

```sql
-- supabase/migrations/20250107002_create_storage_buckets.sql

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-files', 'brand-files', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload their own files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'brand-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can read their own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'brand-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'brand-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

Apply:
```bash
supabase db reset
```

---

## ⚡ Edge Functions (Serverless Backend Logic)

### Create an Edge Function

```bash
supabase functions new process-brand-upload
```

This creates: `supabase/functions/process-brand-upload/index.ts`

**Example function:**

```typescript
// supabase/functions/process-brand-upload/index.ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get file from request
    const { fileUrl, profileId } = await req.json()

    // Download file from storage
    const { data: fileData } = await supabaseClient.storage
      .from('brand-files')
      .download(fileUrl)

    // TODO: Process file (extract text, parse PDF, etc.)
    // For now, just return success

    return new Response(
      JSON.stringify({
        success: true,
        message: 'File processed',
        extractedText: 'Sample extracted content'
      }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 400, headers: { "Content-Type": "application/json" } },
    )
  }
})
```

### Test Edge Function Locally

```bash
# Serve function locally
supabase functions serve process-brand-upload

# In another terminal, test it:
curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/process-brand-upload' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"fileUrl":"test.pdf","profileId":"stack_creamery"}'
```

### Deploy to Lovable Cloud

Just push to GitHub:
```bash
git add supabase/
git commit -m "feat: Add process-brand-upload edge function"
git push
```

Lovable auto-deploys it! ✨

---

## 🔄 Daily Workflow

### Local Development

```bash
# 1. Start Supabase (if not already running)
supabase start

# 2. Start dev server
npm run dev

# 3. Work on features...

# 4. Create new migration if needed
supabase migration new add_favorite_campaigns_column

# 5. Edit migration file, then apply:
supabase db reset

# 6. Test edge functions locally
supabase functions serve my-function

# 7. When done, stop Supabase (optional)
supabase stop
```

### Deploying to Lovable Cloud

```bash
# Commit your changes (migrations, functions, code)
git add .
git commit -m "feat: Add new feature"
git push

# Lovable automatically:
# - Applies migrations to cloud Supabase
# - Deploys edge functions
# - Rebuilds your app
```

---

## 🎯 Benefits of This Approach

| Feature | Benefit |
|---------|---------|
| **Same Codebase** | Works identically in both environments |
| **Fast Iteration** | Test locally without hitting production |
| **Version Control** | All DB changes tracked in Git |
| **Team Sync** | Everyone gets same schema via migrations |
| **Rollback Ready** | Can revert migrations if needed |
| **No Manual SQL** | Never touch Supabase dashboard for schema |
| **Zero Cloud Config** | Lovable handles everything in production |

---

## 🛠️ Useful Commands

### Supabase CLI

```bash
# Start local Supabase
supabase start

# Stop local Supabase
supabase stop

# Reset database (re-applies all migrations)
supabase db reset

# Create new migration
supabase migration new <name>

# Check migration status
supabase migration list

# Create new edge function
supabase functions new <function-name>

# Serve edge function locally
supabase functions serve <function-name>

# View local Supabase Studio (database GUI)
# Open http://127.0.0.1:54323

# Check Supabase status
supabase status
```

### Project Commands

```bash
# Development (uses local Supabase if running)
npm run dev

# Build (works with both environments)
npm run build

# Preview production build locally
npm run preview
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to Docker daemon"
**Solution:** Start Docker Desktop

### Issue: Migration fails
```bash
# Check migration syntax
supabase db reset --debug

# Or manually check migration file for SQL errors
```

### Issue: Edge function not working locally
```bash
# Check function logs
supabase functions serve --debug

# Or check for Deno errors in function code
```

### Issue: Wrong Supabase URL in local dev
```bash
# Verify .env.local exists and has correct URL
cat .env.local

# Should be: http://127.0.0.1:54321
```

### Issue: Can't access Supabase Studio
```bash
# Make sure Supabase is running
supabase status

# Open Studio at: http://127.0.0.1:54323
```

---

## 📚 Next Steps

1. ✅ **Enable Lovable Cloud** - One click in Lovable UI
2. ✅ **Install Supabase CLI** - `brew install supabase/tap/supabase`
3. ✅ **Start local Supabase** - `supabase start`
4. ✅ **Create migrations** - `supabase migration new <name>`
5. ✅ **Build features** - Use both environments seamlessly
6. ✅ **Push to GitHub** - Lovable auto-deploys everything

---

## 🎓 Resources

- **Supabase CLI Docs**: https://supabase.com/docs/guides/cli
- **Lovable Docs**: https://docs.lovable.dev/integrations/supabase
- **Migration Guide**: https://supabase.com/docs/guides/cli/local-development
- **Edge Functions**: https://supabase.com/docs/guides/functions

---

**You now have a professional dual-environment setup!** 🚀

Work fast locally, deploy confidently to Lovable Cloud, and keep everything in sync through Git.
