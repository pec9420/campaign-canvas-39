# Campaign Canvas - Setup Guide

## Quick Start

Campaign Canvas is built with Vite + React + TypeScript and uses **Lovable Cloud** with integrated Supabase and Lovable AI.

### Prerequisites

- Node.js 18+
- Git
- Lovable Cloud account (for deployment)

### Local Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Visit http://localhost:8080
```

## Architecture Overview

**Frontend**: Vite + React + TypeScript + Shadcn/UI
**Backend**: Supabase (PostgreSQL + Edge Functions)
**AI**: Lovable AI Gateway (Gemini 2.5 Flash)
**Deployment**: Lovable Cloud

## Supabase Integration

This project uses **Lovable's native Supabase integration** - everything is auto-configured.

### Database Schema

- `brand_profiles` - Business profile data
- RLS policies automatically configured
- Migrations in `supabase/migrations/`

### Edge Functions

- `process-brand-upload` - AI-powered file processing using Lovable AI Gateway

### Environment Variables

Already configured in Lovable Cloud:
- `VITE_SUPABASE_URL` - Auto-provisioned
- `VITE_SUPABASE_PUBLISHABLE_KEY` - Auto-provisioned
- `LOVABLE_API_KEY` - Auto-provisioned for edge functions

## Lovable AI Integration

### How It Works

Edge functions call Lovable AI Gateway which routes to Google Gemini models:

```typescript
const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [/* your messages */]
  })
});
```

### Local Development

- Edge functions run locally via Supabase CLI
- API calls go to Lovable AI Gateway (internet connection required)
- Same behavior as production

### Free Tier

**Until Oct 13, 2025**: All Gemini model calls are FREE
**After**: Standard Lovable AI pricing applies

## Key Features

### Brand Hub
- Business profile management
- Target persona builder
- Voice & tone configuration
- File upload with AI extraction

### Campaign Generator
- AI-powered campaign creation
- Multi-platform content scripts
- Brand-aware content generation

## File Structure

```
src/
├── components/     # Reusable UI components
├── pages/          # Route pages
├── utils/          # Utility functions
├── data/           # Static data & profiles
└── integrations/   # Supabase client (auto-generated)

supabase/
├── migrations/     # Database schema changes
└── functions/      # Edge functions
```

## Deployment

Push to `main` branch → Auto-deploys to Lovable Cloud

```bash
git add .
git commit -m "Your changes"
git push origin main
```

## Common Commands

```bash
# Development
npm run dev

# Build
npm run build

# Type check
npx tsc --noEmit

# Supabase (local)
supabase start
supabase stop
```

## Troubleshooting

### Edge Function Not Working
- Check `LOVABLE_API_KEY` is set in Lovable Cloud settings
- Verify internet connection (AI Gateway requires network access)

### Database Errors
- Migrations are auto-applied by Lovable
- Check RLS policies if getting permission errors

### Build Errors
- Run `npm install` to ensure dependencies are up to date
- Check TypeScript errors with `npx tsc --noEmit`

## Resources

- [Lovable Docs](https://docs.lovable.dev)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn/UI](https://ui.shadcn.com)
