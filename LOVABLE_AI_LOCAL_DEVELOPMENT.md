# Lovable AI Local Development Guide

## Overview

Lovable AI works seamlessly in local development environments. Your edge functions that call Lovable AI run locally via the Supabase CLI while still connecting to the Lovable AI Gateway over the internet.

## How It Works

### Edge Functions Run Locally

When you run your development server:
- Supabase edge functions run locally through the Supabase CLI (via Deno)
- The `LOVABLE_API_KEY` secret is automatically available in your local environment
- Edge function calls to `https://ai.gateway.lovable.dev/v1/chat/completions` work the same locally and in production

### Current Setup

Your project's `process-brand-upload` edge function is already configured correctly:

```typescript
// supabase/functions/process-brand-upload/index.ts
const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${lovableApiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [/* your messages */]
  })
});
```

## What You Need

### Prerequisites

1. **Supabase CLI installed** - Already available in your project
   ```bash
   supabase --version
   ```

2. **Environment secrets configured** - The `LOVABLE_API_KEY` is automatically provisioned when Lovable Cloud is enabled

3. **Local Supabase running** - Start with:
   ```bash
   supabase start
   # or it starts automatically with your dev server
   ```

## Testing Locally

When you test features that use Lovable AI locally (like uploading files to Brand Hub):

1. **Edge function runs locally** - Executes on your local machine via Deno
2. **Calls Lovable AI Gateway** - Makes HTTPS request over the internet to `ai.gateway.lovable.dev`
3. **Returns results** - Works exactly like production

### Example Flow

```
User uploads file → Local React App → Local Supabase Edge Function
                                            ↓
                                    (Internet call)
                                            ↓
                              Lovable AI Gateway (Cloud)
                                            ↓
                                    Gemini 2.5 Flash Model
                                            ↓
                              AI-processed suggestions
                                            ↓
                              Local Edge Function → Local App
```

## Models Available

Your project currently uses:
- **google/gemini-2.5-flash** - Fast, efficient model for file processing

Other available models through Lovable AI Gateway:
- `google/gemini-2.0-flash-exp`
- `google/gemini-exp-1206`
- `anthropic/claude-3.5-sonnet`
- And more...

## Rate Limits & Credits

- **Local development uses the same rate limits and credits as production**
- **Free Gemini period**: Until October 13, 2025, all Gemini model calls are free
- **Monitor usage**: Check your Lovable workspace settings for usage statistics
- **No separate billing**: Local and production usage share the same quota

## No Special Configuration Needed

The Lovable AI integration is designed to work out of the box in both environments:

✅ **Local Development**
- Edge functions run via Supabase CLI
- API key automatically available
- Calls go to Lovable AI Gateway
- Same features as production

✅ **Production (Lovable Cloud)**
- Edge functions run on Supabase Edge Runtime
- API key automatically injected
- Same Lovable AI Gateway endpoint
- Seamless deployment

## Testing Your Setup

To verify Lovable AI is working locally:

1. **Start your dev server**:
   ```bash
   npm run dev
   ```

2. **Test the file upload feature**:
   - Navigate to Brand Hub
   - Click "Upload File" button
   - Upload a sample brand document
   - Check console for edge function logs

3. **Check edge function logs**:
   ```bash
   supabase functions logs process-brand-upload --local
   ```

## Troubleshooting

### API Key Not Found
```
Error: LOVABLE_API_KEY not found
```
**Solution**: Ensure Lovable Cloud integration is enabled in your project settings

### Edge Function Not Starting
```
Error: Failed to start edge function
```
**Solution**:
```bash
# Restart Supabase
supabase stop
supabase start
```

### Network Errors
```
Error: Failed to connect to ai.gateway.lovable.dev
```
**Solution**: Check your internet connection - the AI Gateway requires internet access even in local dev

## Best Practices

1. **Use appropriate models** - `gemini-2.5-flash` is great for fast processing
2. **Handle errors gracefully** - Always implement error handling for AI calls
3. **Test locally first** - Verify AI responses before deploying to production
4. **Monitor usage** - Keep track of API calls to stay within rate limits
5. **Use streaming for long responses** - Consider streaming for better UX with longer AI responses

## Additional Resources

- [Lovable AI Gateway Documentation](https://docs.lovable.dev/ai-gateway)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Lovable Cloud Integration](https://docs.lovable.dev/integrations/supabase)

## Summary

**Lovable AI works perfectly in local development with zero additional configuration!** Your edge functions call the Lovable AI Gateway over the internet while running locally, giving you the same AI capabilities in development as in production.
