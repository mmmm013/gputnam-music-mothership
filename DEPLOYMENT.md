# Deployment Guide for G Putnam Music

## Required Environment Variables

This application requires the following environment variables to be set in your Vercel deployment:

### Supabase Configuration (Required)

```bash
# Supabase URL - Find this in your Supabase project settings
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key - Find this in your Supabase project settings under API
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key - Find this in your Supabase project settings under API
# IMPORTANT: Keep this secret! Only use on the server side
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### Stripe Configuration (Optional)

```bash
# Stripe Publishable Key - Find this in your Stripe dashboard
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_or_test_key

# Stripe Secret Key - Find this in your Stripe dashboard
# IMPORTANT: Keep this secret!
STRIPE_SECRET_KEY=sk_live_or_test_key
```

### Deployment URL (Optional)

```bash
# Your Vercel deployment URL
NEXT_PUBLIC_VERCEL_URL=your-app.vercel.app
```

## Setting Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add each variable with the appropriate value
4. Select the environments where each variable should be available (Production, Preview, Development)
5. Click "Save"
6. Redeploy your application for changes to take effect

## What Happens Without Environment Variables?

The application is designed to gracefully handle missing environment variables:

- **Missing Supabase credentials**: 
  - Client-side pages will show no database data but won't crash
  - API routes will return error messages indicating missing configuration
  - The FeaturedPlaylists component will display: "SYSTEM: CRITICAL FAILURE - MISSING API KEYS"

- **Missing Stripe credentials**: 
  - Payment features will not work but the rest of the app will function

## Database Setup

### Storage Buckets

Ensure the following storage buckets are created in your Supabase project:

1. **tracks** - Public bucket for audio files
2. **videos** - Public bucket for video files  
3. **audio** - Public bucket (created by migration)

### Required Tables

The application expects these tables to exist:

- `featured_playlists_config` - Configuration for featured playlists
- `tracks` - Audio track metadata
- `featured_rotation` - Playlist rotation state
- `playlist_tracks` - Many-to-many relationship between playlists and tracks

### Applying Migrations

To apply migrations to your Supabase database:

```bash
# Using Supabase CLI
supabase db push

# Or apply manually via SQL Editor in Supabase dashboard
```

## Troubleshooting

### "SYSTEM: DB ERROR" or "MISSING API KEYS" Messages

1. Verify all Supabase environment variables are set correctly in Vercel
2. Ensure the values don't have extra spaces or quotes
3. Redeploy the application after setting variables
4. Check Vercel deployment logs for any error messages

### Audio Not Playing / "Failed to fetch" Errors

1. Verify Supabase storage buckets are set to public
2. Check that audio files are uploaded to the correct bucket
3. Ensure CORS is properly configured in Supabase storage settings
4. Verify the `tracks` bucket URL matches the one in FeaturedPlaylists.tsx

### Logo Not Showing

- Ensure `gpm_logo.jpg` exists in the `public/` directory
- Clear browser cache and hard reload (Ctrl+Shift+R / Cmd+Shift+R)
- Check Next.js build logs for any image optimization errors

## Local Development

For local development, copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
# Edit .env.local with your credentials
npm install
npm run dev
```

## Build Verification

Before deploying, verify the build succeeds:

```bash
npm run build
```

The build should complete without errors even if environment variables are not set.
