# Vault-doc Function and Backend Infrastructure

## Overview

This implementation provides comprehensive backend infrastructure for the G Putnam Music Catalog, including document management, compliance tracking, and collaborative review workflows.

## Features Implemented

### 1. Schema and Extensions

- **lb Schema**: New schema for Library/Licensing Backend operations
- **pgcrypto Extension**: Enabled for secure hashing operations

### 2. Document Management

#### SHA-256 Hashing Helper
```sql
lb.sha256_hex(data bytea) -> text
```
Computes SHA-256 hash of binary data for document verification.

#### Document Registration
```sql
lb.register_vault_doc(
  p_title text,
  p_storage_path text,
  p_file_hash text DEFAULT NULL,
  p_mime_type text DEFAULT 'application/pdf',
  p_metadata jsonb DEFAULT '{}'::jsonb
) -> uuid
```
Registers vault documents with metadata. Requires authentication and automatically assigns to user's organization.

#### Agreement Links
Table: `lb.agreement_links`
- Links agreements to supporting documents
- `ON DELETE CASCADE` for proper cleanup
- RLS policies ensure org-scoped access

### 3. Compliance System

#### Compliance Findings
Table: `lb.compliance_findings`
- Tracks compliance issues across works
- Finding types:
  - `splits_not_100`: Revenue splits don't sum to 100%
  - `expiring_rights`: Rights approaching expiration
  - `missing_docs`: Works without supporting documents
  - `invalid_dates`: Date validation issues
  - `other`: Custom findings

#### Compliance Sweep
```sql
lb.compliance_sweep() -> integer
```
Performs automated compliance checks:
- Validates split percentages sum to 100%
- Identifies works without linked documents
- Returns count of new findings

#### Compliance Summary
```sql
lb.compliance_summary_per_work() -> TABLE
```
Returns per-work compliance summary:
- `work_id`: Work identifier
- `work_title`: Work title
- `critical_count`: Critical findings
- `warning_count`: Warning findings
- `info_count`: Info findings
- `total_findings`: Total findings

Security: `SECURITY DEFINER` with org-scoped access

### 4. Tracks Table (GPMC Audio)

Table: `lb.tracks`

**Columns:**
- `id`: UUID primary key
- `title`: Track title
- `artist`: Artist name
- `filename`: Storage filename
- `owner_id`: Track owner (defaults to current user)
- `org_id`: Organization ID
- `status`: Workflow status
  - `draft`: Initial state
  - `pending_review`: Submitted for review
  - `approved`: Approved for publication
  - `rejected`: Rejected
- `brand_domain`: Brand classification (GPM/KLEIGH/SCHERER)
- `moods`: Array of mood tags
- `tempo`: Tempo classification
- `created_at`, `updated_at`: Timestamps

**RLS Policies:**
- **SELECT**: Org-scoped (`org_id = lb.get_org_id()`)
- **INSERT**: Owner must be current user
- **UPDATE**: Owner only, cannot modify approved tracks
- **DELETE**: Owner only, cannot delete approved tracks

**Indices:**
- `owner_id`, `org_id`, `status` for efficient queries

### 5. Storage Buckets

Three buckets with folder convention: `{org_id}/{user_id}/`

#### Tracks Bucket
- **ID**: `tracks`
- **Public**: false
- **Size Limit**: 50 MB
- **Mime Types**: audio/mpeg, audio/wav, audio/mp3, audio/x-m4a

#### Images Bucket
- **ID**: `images`
- **Public**: true
- **Size Limit**: 5 MB
- **Mime Types**: image/jpeg, image/png, image/gif, image/webp

#### Docs Bucket
- **ID**: `docs`
- **Public**: false
- **Size Limit**: 10 MB
- **Mime Types**: application/pdf, MS Word formats

**RLS Policies (all buckets):**
- **INSERT**: Users can only upload to their own folder
- **SELECT**: Org members can view all org files
- **DELETE**: Users can only delete their own files

### 6. Review Requests (Collaboration)

Table: `lb.review_requests`

Facilitates "run through me" approval workflow:
- Links to content (tracks, documents, agreements, works)
- Tracks requestor and assigned reviewer
- Status tracking: pending, approved, rejected, changes_requested
- Request and review notes
- Timestamps for audit trail

**RLS Policies:**
- Users see their own requests and reviews assigned to them
- Only requestors can create requests
- Only assigned reviewers can update status

### 7. Realtime Features

Realtime broadcasts enabled for:
- `lb.compliance_findings`: Live compliance updates
- `lb.review_requests`: Real-time review notifications
- `lb.tracks`: Track status changes

**Compliance Broadcast Trigger:**
Automatically notifies subscribers when compliance findings are created or updated via `pg_notify` on the `compliance_findings` channel.

## Helper Functions

### Organization Context
```sql
lb.get_org_id() -> uuid
```
Returns current user's organization ID. Falls back to user ID if no org is set.

### Storage Path Helpers
```sql
storage.get_org_id_from_path(path text) -> uuid
storage.get_user_id_from_path(path text) -> uuid
```
Extract organization and user IDs from storage paths for RLS enforcement.

## Database Schema

All tables use:
- UUID primary keys
- RLS enabled for security
- Appropriate foreign key constraints
- Timestamps for audit trails
- Indices on frequently queried columns

## Security Model

1. **Row Level Security (RLS)**: Enabled on all tables
2. **Organization Scoping**: Data isolated by organization
3. **Owner-based Access**: Users control their own content
4. **SECURITY DEFINER**: RPCs run with elevated privileges but enforce org context
5. **Storage Policies**: Bucket access controlled by folder ownership

## Usage Examples

### Register a Document
```javascript
// Client-side example with hashing
async function registerDocumentWithHash(file: File, title: string) {
  // Generate file hash on client side
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  const orgId = await getOrgId();
  const userId = user.id;
  const filePath = `docs/${orgId}/${userId}/${file.name}`;
  
  // Upload file first
  await supabase.storage.from('docs').upload(filePath, file);
  
  // Register document
  const { data: docId } = await supabase.rpc('register_vault_doc', {
    p_title: title,
    p_storage_path: filePath,
    p_file_hash: hashHex,
    p_mime_type: file.type,
    p_metadata: { signed_date: "2024-01-15", parties: ["GPMC", "Artist"] }
  });
  
  return docId;
}
```

### Run Compliance Sweep
```sql
SELECT lb.compliance_sweep();
-- Returns: 5 (number of findings)
```

### Get Compliance Summary
```sql
SELECT * FROM lb.compliance_summary_per_work();
```

### Upload Track with Folder Convention
```javascript
// Client-side example
const orgId = await getOrgId();
const userId = user.id;
const filePath = `${orgId}/${userId}/my-track.mp3`;

const { data, error } = await supabase.storage
  .from('tracks')
  .upload(filePath, audioFile);
```

### Create Review Request
```sql
INSERT INTO lb.review_requests (
  content_type,
  content_id,
  reviewer_id,
  request_note
) VALUES (
  'track',
  'track-uuid',
  'reviewer-user-uuid',
  'Please review this track for approval'
);
```

## Migration File

Location: `supabase/migrations/20260129000000_vault_doc_implementation.sql`

This migration is idempotent and safe to run multiple times. It uses `IF NOT EXISTS` clauses and `ON CONFLICT` handling to prevent errors on re-runs.

## Configuration

The Supabase configuration (`supabase/config.toml`) has been updated to:
- Expose the `lb` schema in the API
- Add `lb` to the search path for queries

## Notes

- All AUDIO files must use the `tracks` bucket following GPMC conventions
- Organization ID should be set in user metadata as `org_id`
- Approved tracks cannot be modified or deleted
- Compliance sweep should be run periodically (consider using pg_cron)
- Realtime subscriptions require additional client-side setup

## Future Enhancements

Consider implementing:
- Automated compliance sweep via pg_cron
- Email notifications for review requests
- Document version control
- Advanced compliance rules engine
- Bulk operations for tracks and documents
