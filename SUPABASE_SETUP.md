# Supabase Setup Guide

## ✅ What's Installed

- **Supabase CLI**: Already installed globally on your system
- **@supabase/supabase-js**: JavaScript client (v2.74.0) - Just installed
- **Configuration files**: Created in this setup

## 🚀 Next Steps to Connect Supabase

### 1. Create a Supabase Project (if you haven't already)

Visit https://supabase.com and:
1. Sign in or create an account
2. Click "New Project"
3. Choose organization and fill in:
   - Project name: `campaign-canvas`
   - Database password: (generate a strong one)
   - Region: Choose closest to you
4. Wait for project to provision (~2 minutes)

### 2. Get Your Project Credentials

Once your project is ready:
1. Go to **Project Settings** (gear icon in sidebar)
2. Click **API** tab
3. Copy these values:
   - **Project URL** (looks like: `https://abcdefgh.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 3. Configure Your Local Environment

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.local.example .env.local

# Then edit .env.local with your actual credentials:
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

### 4. Create Database Tables

Run these SQL commands in your Supabase project (SQL Editor):

```sql
-- Profiles table (enhanced business profiles)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  profile_id TEXT UNIQUE NOT NULL, -- e.g., "stack_creamery"
  business_name TEXT NOT NULL,
  niche TEXT,
  owner_name TEXT,

  -- Business basics
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

-- Policy: Users can only read/write their own profiles
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
  status TEXT DEFAULT 'draft', -- draft, in_progress, completed

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

  file_type TEXT NOT NULL, -- 'logo', 'brand_guide', 'persona_research', 'image'
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,

  -- Extracted content (for AI processing)
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

-- Create storage bucket for brand files
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-files', 'brand-files', false);

-- Storage policy: Users can upload their own files
CREATE POLICY "Users can upload their own files"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'brand-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policy: Users can read their own files
CREATE POLICY "Users can read their own files"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'brand-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policy: Users can delete their own files
CREATE POLICY "Users can delete their own files"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'brand-files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON campaigns
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
```

### 5. Update Storage Utils to Use Supabase

The current `src/utils/storage.ts` uses localStorage. You'll want to create a new file:

**Create `src/utils/supabaseStorage.ts`:**

```typescript
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { BusinessProfile } from '@/data/profiles';

// Save profile to Supabase
export const saveProfileToSupabase = async (profile: BusinessProfile) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      profile_id: profile.id,
      user_id: user.id,
      business_name: profile.business_name,
      niche: profile.niche,
      owner_name: profile.owner_name,
      locations: profile.locations,
      services: profile.services,
      programs: profile.programs,
      brand_identity: profile.brand_identity,
      voice: profile.voice,
      content_rules: profile.content_rules,
      business: profile.business,
      personas: profile.personas,
      audience: profile.audience,
      uploaded_files: profile.uploaded_files
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

// Get profile from Supabase
export const getProfileFromSupabase = async (profileId: string): Promise<BusinessProfile | null> => {
  if (!isSupabaseConfigured()) return null;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('profile_id', profileId)
    .eq('user_id', user.id)
    .single();

  if (error) return null;

  // Map database columns to BusinessProfile interface
  return {
    id: data.profile_id,
    business_name: data.business_name,
    niche: data.niche,
    owner_name: data.owner_name,
    locations: data.locations,
    services: data.services,
    programs: data.programs,
    brand_identity: data.brand_identity,
    voice: data.voice,
    content_rules: data.content_rules,
    business: data.business,
    personas: data.personas,
    audience: data.audience,
    uploaded_files: data.uploaded_files
  };
};

// Upload file to Supabase Storage
export const uploadFileToSupabase = async (
  profileId: string,
  file: File,
  fileType: 'logo' | 'brand_guide' | 'persona_research' | 'image'
) => {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase not configured');
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  // Upload to storage
  const filePath = `${user.id}/${profileId}/${fileType}/${Date.now()}_${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('brand-files')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Get public URL
  const { data: { publicUrl } } = supabase.storage
    .from('brand-files')
    .getPublicUrl(filePath);

  // Save metadata to database
  const { data: fileData, error: fileError } = await supabase
    .from('uploaded_files')
    .insert({
      profile_id: profileId,
      user_id: user.id,
      file_type: fileType,
      file_name: file.name,
      file_url: publicUrl,
      file_size: file.size,
      mime_type: file.type
    })
    .select()
    .single();

  if (fileError) throw fileError;

  return {
    url: publicUrl,
    name: file.name,
    id: fileData.id
  };
};
```

## 🧪 Testing Your Setup

1. **Restart your dev server** after adding `.env.local`:
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test the connection** in your browser console:
   ```javascript
   // Open DevTools console and run:
   import { supabase } from './src/lib/supabase';
   const { data, error } = await supabase.from('profiles').select('count');
   console.log('Connected!', data);
   ```

## 📚 Next Steps

1. **Add Authentication**: Implement Supabase Auth for user login
2. **Migrate localStorage to Supabase**: Update components to use Supabase
3. **Implement File Uploads**: Add file upload functionality to Brand Hub
4. **Add Real-time Updates**: Use Supabase realtime for live collaboration

## 🔒 Security Notes

- ✅ `.env.local` is in `.gitignore` - never commit credentials
- ✅ Row Level Security (RLS) is enabled - users can only access their own data
- ✅ Storage policies ensure file privacy
- ⚠️ The anon key is public-safe but RLS policies protect data

## 🆘 Troubleshooting

**Problem**: "Supabase not configured" error
- **Solution**: Make sure `.env.local` exists with correct values

**Problem**: Database errors
- **Solution**: Run the SQL commands in Supabase SQL Editor

**Problem**: File upload fails
- **Solution**: Check storage bucket exists and policies are set up

---

## 📁 Files Created in This Setup

- ✅ `src/lib/supabase.ts` - Supabase client configuration
- ✅ `.env.local.example` - Environment variables template
- ✅ `.gitignore` - Updated to ignore .env files
- ✅ `SUPABASE_SETUP.md` - This guide

Ready to go! 🚀
