-- =====================================================
-- Vault-doc Function and Backend Infrastructure
-- G Putnam Music Catalog Implementation
-- =====================================================

-- =====================================================
-- 1. SCHEMA SETUP
-- =====================================================

-- Create lb schema for Library/Licensing Backend
CREATE SCHEMA IF NOT EXISTS lb;

-- Enable pgcrypto extension for hashing
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- =====================================================
-- 2. HASHING HELPER FUNCTION
-- =====================================================

-- SHA-256 computation helper for in-DB hashing
CREATE OR REPLACE FUNCTION lb.sha256_hex(data bytea)
RETURNS text
LANGUAGE sql
IMMUTABLE
PARALLEL SAFE
AS $$
  SELECT encode(digest(data, 'sha256'), 'hex');
$$;

-- =====================================================
-- 3. ORGANIZATION HELPER FUNCTION
-- =====================================================

-- Helper function to get organization ID for current user
-- This is a placeholder - adjust based on your org structure
CREATE OR REPLACE FUNCTION lb.get_org_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT raw_user_meta_data->>'org_id')::uuid 
    FROM auth.users 
    WHERE id = auth.uid()
  , auth.uid()); -- Fallback to user id if no org
$$;

-- =====================================================
-- 4. BASE TABLES (must be created before foreign keys)
-- =====================================================

-- Create agreements table if it doesn't exist
CREATE TABLE IF NOT EXISTS lb.agreements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL,
  title text NOT NULL,
  agreement_type text,
  status text DEFAULT 'draft',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lb.agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_agreements" ON lb.agreements
  FOR ALL
  USING (org_id = lb.get_org_id())
  WITH CHECK (org_id = lb.get_org_id());

-- Create documents table if it doesn't exist
CREATE TABLE IF NOT EXISTS lb.documents (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL,
  title text NOT NULL,
  storage_path text,
  file_hash text,
  mime_type text,
  created_at timestamptz DEFAULT now(),
  created_by uuid DEFAULT auth.uid()
);

ALTER TABLE lb.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_documents" ON lb.documents
  FOR ALL
  USING (org_id = lb.get_org_id())
  WITH CHECK (org_id = lb.get_org_id());

-- Create works table if it doesn't exist
CREATE TABLE IF NOT EXISTS lb.works (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  org_id uuid NOT NULL,
  title text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lb.works ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_works" ON lb.works
  FOR ALL
  USING (org_id = lb.get_org_id())
  WITH CHECK (org_id = lb.get_org_id());

-- =====================================================
-- 5. AGREEMENT LINKS TABLE (depends on agreements and documents)
-- =====================================================

-- Document linking model for agreements
CREATE TABLE IF NOT EXISTS lb.agreement_links (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  agreement_id uuid NOT NULL,
  document_id uuid NOT NULL,
  link_type text DEFAULT 'supporting_doc',
  created_at timestamptz DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  
  -- Ensure proper cleanup with CASCADE
  CONSTRAINT fk_agreement FOREIGN KEY (agreement_id) 
    REFERENCES lb.agreements(id) ON DELETE CASCADE,
  CONSTRAINT fk_document FOREIGN KEY (document_id) 
    REFERENCES lb.documents(id) ON DELETE CASCADE,
    
  -- Prevent duplicate links
  UNIQUE(agreement_id, document_id, link_type)
);

-- Enable RLS
ALTER TABLE lb.agreement_links ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view links in their org
CREATE POLICY "org_read_agreement_links" ON lb.agreement_links
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lb.agreements a
      WHERE a.id = agreement_id
      AND a.org_id = lb.get_org_id()
    )
  );

-- RLS Policy: Authenticated users can create links
CREATE POLICY "auth_insert_agreement_links" ON lb.agreement_links
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_agreement_links_agreement_id ON lb.agreement_links(agreement_id);
CREATE INDEX IF NOT EXISTS idx_agreement_links_document_id ON lb.agreement_links(document_id);

-- =====================================================
-- 6. REGISTER VAULT DOCUMENT RPC
-- =====================================================

-- Function to register vault documents with metadata
CREATE OR REPLACE FUNCTION lb.register_vault_doc(
  p_title text,
  p_storage_path text,
  p_file_hash text DEFAULT NULL,
  p_mime_type text DEFAULT 'application/pdf',
  p_metadata jsonb DEFAULT '{}'::jsonb
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_doc_id uuid;
  v_org_id uuid;
BEGIN
  -- Must be authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;
  
  -- Get org ID
  v_org_id := lb.get_org_id();
  
  -- Insert document
  INSERT INTO lb.documents (
    org_id,
    title,
    storage_path,
    file_hash,
    mime_type,
    created_by
  ) VALUES (
    v_org_id,
    p_title,
    p_storage_path,
    p_file_hash,
    p_mime_type,
    auth.uid()
  )
  RETURNING id INTO v_doc_id;
  
  RETURN v_doc_id;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION lb.register_vault_doc TO authenticated;

-- =====================================================
-- 7. COMPLIANCE FINDINGS TABLE
-- =====================================================

-- Table to store compliance findings
CREATE TABLE IF NOT EXISTS lb.compliance_findings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id uuid,
  finding_type text NOT NULL CHECK (finding_type IN (
    'splits_not_100',
    'expiring_rights', 
    'missing_docs',
    'invalid_dates',
    'other'
  )),
  severity text NOT NULL DEFAULT 'warning' CHECK (severity IN (
    'critical',
    'warning',
    'info'
  )),
  description text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  resolved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE lb.compliance_findings ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view findings for their org's works
CREATE POLICY "org_compliance_findings" ON lb.compliance_findings
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM lb.works w
      WHERE w.id = work_id
      AND w.org_id = lb.get_org_id()
    )
    OR work_id IS NULL
  );

CREATE INDEX IF NOT EXISTS idx_compliance_findings_work_id ON lb.compliance_findings(work_id);
CREATE INDEX IF NOT EXISTS idx_compliance_findings_type ON lb.compliance_findings(finding_type);

-- =====================================================
-- 8. SPLITS TABLE (for compliance checking)
-- =====================================================

CREATE TABLE IF NOT EXISTS lb.splits (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  work_id uuid NOT NULL REFERENCES lb.works(id) ON DELETE CASCADE,
  party_name text NOT NULL,
  percentage numeric(5,2) NOT NULL CHECK (percentage >= 0 AND percentage <= 100),
  role text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE lb.splits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "org_splits" ON lb.splits
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM lb.works w
      WHERE w.id = work_id
      AND w.org_id = lb.get_org_id()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM lb.works w
      WHERE w.id = work_id
      AND w.org_id = lb.get_org_id()
    )
  );

-- =====================================================
-- 9. COMPLIANCE SWEEP FUNCTION
-- =====================================================

-- Function to perform compliance sweep
CREATE OR REPLACE FUNCTION lb.compliance_sweep()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_findings_count integer := 0;
  v_work record;
  v_count integer;
  v_org_id uuid;
BEGIN
  -- Get org ID for security context
  v_org_id := lb.get_org_id();
  
  -- Only allow org members to run sweep for their org
  IF v_org_id IS NULL THEN
    RAISE EXCEPTION 'Must be authenticated and have an organization';
  END IF;
  
  -- Clear previous findings for this org only
  DELETE FROM lb.compliance_findings 
  WHERE NOT resolved 
  AND work_id IN (SELECT id FROM lb.works WHERE org_id = v_org_id);
  
  -- Check 1: Splits not summing to 100%
  FOR v_work IN 
    SELECT w.id as work_id, w.title, COALESCE(SUM(s.percentage), 0) as total_pct
    FROM lb.works w
    LEFT JOIN lb.splits s ON s.work_id = w.id
    WHERE w.org_id = v_org_id
    GROUP BY w.id, w.title
    HAVING COALESCE(SUM(s.percentage), 0) != 100
  LOOP
    INSERT INTO lb.compliance_findings (
      work_id,
      finding_type,
      severity,
      description,
      metadata
    ) VALUES (
      v_work.work_id,
      'splits_not_100',
      'critical',
      format('Work "%s" has splits totaling %s%% (expected 100%%)', 
             v_work.title, v_work.total_pct),
      jsonb_build_object('total_percentage', v_work.total_pct)
    );
    v_findings_count := v_findings_count + 1;
  END LOOP;
  
  -- Check 2: Works without any agreements
  -- (Note: This is a simplified check - adjust based on actual work-agreement relationship)
  INSERT INTO lb.compliance_findings (
    work_id,
    finding_type,
    severity,
    description
  )
  SELECT 
    w.id,
    'missing_docs',
    'warning',
    format('Work "%s" needs review for document completeness', w.title)
  FROM lb.works w
  WHERE w.org_id = v_org_id;
  
  GET DIAGNOSTICS v_count = ROW_COUNT;
  v_findings_count := v_findings_count + v_count;
  
  RETURN v_findings_count;
END;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION lb.compliance_sweep TO authenticated;

-- =====================================================
-- 10. COMPLIANCE SUMMARY RPC
-- =====================================================

-- Function to get compliance summary per work
CREATE OR REPLACE FUNCTION lb.compliance_summary_per_work()
RETURNS TABLE (
  work_id uuid,
  work_title text,
  critical_count bigint,
  warning_count bigint,
  info_count bigint,
  total_findings bigint
)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT 
    w.id as work_id,
    w.title as work_title,
    COUNT(*) FILTER (WHERE cf.severity = 'critical') as critical_count,
    COUNT(*) FILTER (WHERE cf.severity = 'warning') as warning_count,
    COUNT(*) FILTER (WHERE cf.severity = 'info') as info_count,
    COUNT(*) as total_findings
  FROM lb.works w
  LEFT JOIN lb.compliance_findings cf ON cf.work_id = w.id AND NOT cf.resolved
  WHERE w.org_id = lb.get_org_id()
  GROUP BY w.id, w.title
  ORDER BY total_findings DESC, w.title;
$$;

-- Grant execute to authenticated users
GRANT EXECUTE ON FUNCTION lb.compliance_summary_per_work TO authenticated;

-- =====================================================
-- 11. REALTIME BROADCAST TRIGGER
-- =====================================================

-- Function to broadcast compliance findings
CREATE OR REPLACE FUNCTION lb.trg_compliance_findings_broadcast()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Broadcast to realtime
  PERFORM pg_notify(
    'compliance_findings',
    json_build_object(
      'type', TG_OP,
      'work_id', NEW.work_id,
      'finding_type', NEW.finding_type,
      'severity', NEW.severity,
      'id', NEW.id
    )::text
  );
  RETURN NEW;
END;
$$;

-- Create trigger on compliance_findings
CREATE TRIGGER trg_compliance_findings_broadcast
  AFTER INSERT OR UPDATE ON lb.compliance_findings
  FOR EACH ROW
  EXECUTE FUNCTION lb.trg_compliance_findings_broadcast();

-- =====================================================
-- 12. TRACKS TABLE (GPMC Audio)
-- =====================================================

-- Create lb.tracks table for GPMC audio management
CREATE TABLE IF NOT EXISTS lb.tracks (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  artist text,
  filename text NOT NULL,
  
  -- Ownership and organization
  owner_id uuid DEFAULT auth.uid() REFERENCES auth.users(id),
  org_id uuid,
  
  -- Status workflow
  status text NOT NULL DEFAULT 'draft' CHECK (status IN (
    'draft',
    'pending_review',
    'approved',
    'rejected'
  )),
  
  -- Metadata
  brand_domain text CHECK (brand_domain IN ('GPM', 'KLEIGH', 'SCHERER')) DEFAULT 'GPM',
  moods text[],
  tempo text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE lb.tracks ENABLE ROW LEVEL SECURITY;

-- Create indices
CREATE INDEX IF NOT EXISTS idx_tracks_owner_id ON lb.tracks(owner_id);
CREATE INDEX IF NOT EXISTS idx_tracks_org_id ON lb.tracks(org_id);
CREATE INDEX IF NOT EXISTS idx_tracks_status ON lb.tracks(status);

-- RLS Policy: SELECT - org-scoped
CREATE POLICY "org_select_tracks" ON lb.tracks
  FOR SELECT
  USING (org_id = lb.get_org_id());

-- RLS Policy: INSERT - owner must be current user and org must match
CREATE POLICY "owner_insert_tracks" ON lb.tracks
  FOR INSERT
  WITH CHECK (
    owner_id = auth.uid() 
    AND (org_id = lb.get_org_id() OR org_id IS NULL)
  );

-- RLS Policy: UPDATE - owner can update if not approved
CREATE POLICY "owner_update_tracks" ON lb.tracks
  FOR UPDATE
  USING (owner_id = auth.uid() AND status != 'approved')
  WITH CHECK (owner_id = auth.uid() AND status != 'approved');

-- RLS Policy: DELETE - owner can delete if not approved
CREATE POLICY "owner_delete_tracks" ON lb.tracks
  FOR DELETE
  USING (owner_id = auth.uid() AND status != 'approved');

-- =====================================================
-- 13. STORAGE BUCKETS
-- =====================================================

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('tracks', 'tracks', false, 52428800, ARRAY['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/x-m4a']),
  ('images', 'images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  ('docs', 'docs', false, 10485760, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- =====================================================
-- 14. STORAGE BUCKET RLS POLICIES
-- =====================================================

-- Helper function to extract org_id from storage path
CREATE OR REPLACE FUNCTION storage.get_org_id_from_path(path text)
RETURNS uuid
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  parts text[];
BEGIN
  parts := string_to_array(path, '/');
  IF array_length(parts, 1) < 1 THEN
    RETURN NULL;
  END IF;
  RETURN parts[1]::uuid;
EXCEPTION
  WHEN invalid_text_representation THEN
    RETURN NULL;
END;
$$;

-- Helper function to extract user_id from storage path
CREATE OR REPLACE FUNCTION storage.get_user_id_from_path(path text)
RETURNS uuid
LANGUAGE plpgsql
IMMUTABLE
AS $$
DECLARE
  parts text[];
BEGIN
  parts := string_to_array(path, '/');
  IF array_length(parts, 1) < 2 THEN
    RETURN NULL;
  END IF;
  RETURN parts[2]::uuid;
EXCEPTION
  WHEN invalid_text_representation THEN
    RETURN NULL;
END;
$$;

-- Tracks bucket policies
CREATE POLICY "tracks_insert_own_folder" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'tracks'
    AND storage.get_user_id_from_path(name) = auth.uid()
  );

CREATE POLICY "tracks_select_org" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'tracks'
    AND storage.get_org_id_from_path(name) = lb.get_org_id()
  );

CREATE POLICY "tracks_delete_own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'tracks'
    AND storage.get_user_id_from_path(name) = auth.uid()
  );

-- Images bucket policies
CREATE POLICY "images_insert_own_folder" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'images'
    AND storage.get_user_id_from_path(name) = auth.uid()
  );

CREATE POLICY "images_select_org" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'images'
    AND storage.get_org_id_from_path(name) = lb.get_org_id()
  );

CREATE POLICY "images_delete_own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'images'
    AND storage.get_user_id_from_path(name) = auth.uid()
  );

-- Docs bucket policies
CREATE POLICY "docs_insert_own_folder" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'docs'
    AND storage.get_user_id_from_path(name) = auth.uid()
  );

CREATE POLICY "docs_select_org" ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'docs'
    AND storage.get_org_id_from_path(name) = lb.get_org_id()
  );

CREATE POLICY "docs_delete_own" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'docs'
    AND storage.get_user_id_from_path(name) = auth.uid()
  );

-- =====================================================
-- 15. REVIEW REQUESTS TABLE
-- =====================================================

-- Table for collaboration and approval flow
CREATE TABLE IF NOT EXISTS lb.review_requests (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Content reference
  content_type text NOT NULL CHECK (content_type IN (
    'track',
    'document',
    'agreement',
    'work'
  )),
  content_id uuid NOT NULL,
  
  -- Request details
  requestor_id uuid DEFAULT auth.uid() REFERENCES auth.users(id),
  reviewer_id uuid REFERENCES auth.users(id),
  
  -- Status
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending',
    'approved',
    'rejected',
    'changes_requested'
  )),
  
  -- Notes
  request_note text,
  review_note text,
  
  -- Timestamps
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  reviewed_at timestamptz
);

ALTER TABLE lb.review_requests ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own requests and requests assigned to them
CREATE POLICY "own_review_requests" ON lb.review_requests
  FOR SELECT
  USING (
    requestor_id = auth.uid() 
    OR reviewer_id = auth.uid()
  );

-- RLS: Authenticated users can create review requests
CREATE POLICY "create_review_requests" ON lb.review_requests
  FOR INSERT
  WITH CHECK (
    auth.uid() IS NOT NULL
    AND requestor_id = auth.uid()
  );

-- RLS: Reviewers can update their assigned reviews
CREATE POLICY "update_review_requests" ON lb.review_requests
  FOR UPDATE
  USING (reviewer_id = auth.uid())
  WITH CHECK (reviewer_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_review_requests_requestor ON lb.review_requests(requestor_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_reviewer ON lb.review_requests(reviewer_id);
CREATE INDEX IF NOT EXISTS idx_review_requests_status ON lb.review_requests(status);
CREATE INDEX IF NOT EXISTS idx_review_requests_content ON lb.review_requests(content_type, content_id);

-- =====================================================
-- 16. REALTIME CONFIGURATION
-- =====================================================

-- Enable realtime for compliance_findings (if publication exists)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE lb.compliance_findings;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Enable realtime for review_requests
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE lb.review_requests;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- Enable realtime for tracks
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE lb.tracks;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- =====================================================
-- 17. GRANT PERMISSIONS
-- =====================================================

-- Grant usage on lb schema to authenticated users
GRANT USAGE ON SCHEMA lb TO authenticated;

-- Grant select on all tables in lb schema
GRANT SELECT ON ALL TABLES IN SCHEMA lb TO authenticated;

-- Grant execute on all functions in lb schema
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA lb TO authenticated;

-- =====================================================
-- END OF MIGRATION
-- =====================================================
