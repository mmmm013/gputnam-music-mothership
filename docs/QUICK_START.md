# Quick Start Guide: Vault-doc Implementation

## Overview
This guide helps you get started with the new Vault-doc backend infrastructure.

## Prerequisites
- Supabase project set up
- Node.js and npm installed
- User metadata includes `org_id` field

## Step 1: Apply Database Migration

```bash
# If using Supabase CLI locally
supabase db reset

# Or apply the migration file directly
supabase db push
```

The migration file is located at:
`supabase/migrations/20260129000000_vault_doc_implementation.sql`

## Step 2: Configure Environment Variables

Ensure your `.env.local` has:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

## Step 3: Update Supabase Config (Already Done)

The `supabase/config.toml` has been updated to expose the `lb` schema.

## Step 4: Use the Client

```typescript
// Import the configured client
import { createClient } from '@/utils/supabase/lb-client';

// Create client instance
const supabase = createClient();

// Use it!
const { data: tracks } = await supabase
  .from('tracks')
  .select('*');
```

## Step 5: Common Operations

### Upload a Track
```typescript
import { uploadTrack } from '@/docs/USAGE_EXAMPLES';

const track = await uploadTrack(audioFile, {
  title: 'My Song',
  artist: 'Artist Name',
  brand_domain: 'GPM',
  moods: ['Happy', 'Energetic'],
  tempo: 'Fast'
});
```

### Submit for Review
```typescript
import { submitTrackForReview } from '@/docs/USAGE_EXAMPLES';

const review = await submitTrackForReview(
  trackId,
  reviewerId,
  'Please review this track'
);
```

### Run Compliance Check
```typescript
const supabase = createClient();
const { data: findingsCount } = await supabase.rpc('compliance_sweep');
console.log(`Found ${findingsCount} compliance issues`);
```

### Get Compliance Summary
```typescript
const { data: summary } = await supabase.rpc('compliance_summary_per_work');
// Returns array of { work_id, work_title, critical_count, warning_count, ... }
```

## Step 6: Subscribe to Realtime Updates

```typescript
import { subscribeToComplianceFindings } from '@/docs/USAGE_EXAMPLES';

const channel = subscribeToComplianceFindings((payload) => {
  console.log('Compliance update:', payload);
});

// Later: cleanup
channel.unsubscribe();
```

## Storage Buckets

Files must follow the folder convention: `{org_id}/{user_id}/filename`

### Upload to Tracks Bucket
```typescript
const orgId = user.user_metadata?.org_id || user.id;
const filePath = `${orgId}/${user.id}/my-track.mp3`;

const { data, error } = await supabase.storage
  .from('tracks')
  .upload(filePath, audioFile);
```

### Upload to Docs Bucket
```typescript
const filePath = `${orgId}/${user.id}/contract.pdf`;

const { data, error } = await supabase.storage
  .from('docs')
  .upload(filePath, pdfFile);
```

## User Setup

Users need an `org_id` in their metadata:

```typescript
// When creating/updating user
const { error } = await supabase.auth.updateUser({
  data: {
    org_id: 'your-organization-uuid'
  }
});
```

## Testing the Implementation

### 1. Check Tables Exist
```typescript
// Should return results
const { data: tracks } = await supabase.from('tracks').select('count');
const { data: works } = await supabase.from('works').select('count');
const { data: docs } = await supabase.from('documents').select('count');
```

### 2. Test RLS Policies
```typescript
// As authenticated user, try to insert
const { data, error } = await supabase
  .from('tracks')
  .insert({
    title: 'Test Track',
    filename: 'test.mp3',
    org_id: myOrgId // Should match your org_id
  });

// Should succeed if org_id matches
```

### 3. Test Compliance
```typescript
// Create a work with invalid splits
const { data: work } = await supabase.from('works').insert({
  org_id: myOrgId,
  title: 'Test Work'
}).select().single();

await supabase.from('splits').insert({
  work_id: work.id,
  party_name: 'Artist',
  percentage: 50 // Only 50%, not 100%
});

// Run sweep
const { data: count } = await supabase.rpc('compliance_sweep');
// Should find the issue

// Check findings
const { data: findings } = await supabase
  .from('compliance_findings')
  .select('*')
  .eq('work_id', work.id);
```

## Troubleshooting

### Error: "relation lb.tracks does not exist"
- Ensure migration has been applied
- Check Supabase logs for migration errors

### Error: "permission denied for schema lb"
- Ensure `config.toml` includes `lb` in schemas array
- Restart Supabase if running locally

### Error: "new row violates row-level security policy"
- Ensure user is authenticated
- Check that `org_id` matches user's organization
- Verify user has `org_id` in metadata

### Tables not visible in queries
- Use table name only: `from('tracks')` not `from('lb.tracks')`
- Use the configured client from `utils/supabase/lb-client.ts`

## Documentation

- **Feature Documentation**: `docs/VAULT_DOC_IMPLEMENTATION.md`
- **Usage Examples**: `docs/USAGE_EXAMPLES.ts`
- **Implementation Summary**: `docs/IMPLEMENTATION_SUMMARY.md`
- **Type Definitions**: `types/database.ts`
- **Client Configuration**: `utils/supabase/lb-client.ts`

## Next Steps

1. Set up user organizations in your auth flow
2. Build UI components for track management
3. Implement review workflow screens
4. Schedule periodic compliance sweeps
5. Set up realtime subscription listeners
6. Add email notifications for reviews

## Support

For issues or questions about this implementation, refer to:
1. The comprehensive documentation in the `docs/` folder
2. TypeScript types in `types/database.ts`
3. Working examples in `docs/USAGE_EXAMPLES.ts`
