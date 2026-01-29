-- 1. SETUP & EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create the dedicated schema
CREATE SCHEMA IF NOT EXISTS lb;

-- Helper Function: Get Org ID from JWT (Security Critical)
CREATE OR REPLACE FUNCTION lb.get_org_id()
RETURNS uuid LANGUAGE sql STABLE AS $$
  SELECT NULLIF(current_setting('request.jwt.claims', true)::jsonb ->> 'org_id', '')::uuid;
$$;

-- Helper Function: SHA256 Hex
CREATE OR REPLACE FUNCTION lb.sha256_hex(bytea) RETURNS text LANGUAGE sql IMMUTABLE AS $$
  SELECT encode(digest($1, 'sha256'), 'hex');
$$;

-- 2. CORE TABLES (METADATA ONLY)

-- Tracks Table (Legal Metadata - NO AUDIO FILES)
CREATE TABLE IF NOT EXISTS lb.tracks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL DEFAULT lb.get_org_id(),
    owner_id uuid NOT NULL DEFAULT auth.uid(),
    artist_id uuid, -- Link to artists table
    title text NOT NULL,
    duration_seconds integer,
    file_path text, -- REFERENCE ONLY (e.g. "gpmcc/audio/123.mp3")
    metadata jsonb DEFAULT '{}'::jsonb, -- Contracts, rights info
    status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Comments Table (Collaboration)
CREATE TABLE IF NOT EXISTS lb.track_comments (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL DEFAULT lb.get_org_id(),
    track_id uuid REFERENCES lb.tracks(id) ON DELETE CASCADE,
    body text NOT NULL,
    created_by uuid NOT NULL DEFAULT auth.uid(),
    created_at timestamptz DEFAULT now()
);

-- Review Requests (Approval Workflow)
CREATE TABLE IF NOT EXISTS lb.review_requests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL DEFAULT lb.get_org_id(),
    reviewer_id uuid, -- You (Admin)
    subject_type text NOT NULL, -- e.g. 'track'
    subject_id uuid NOT NULL,
    status text NOT NULL DEFAULT 'pending',
    requested_at timestamptz DEFAULT now()
);

-- Vault Docs (Legal Documents)
CREATE TABLE IF NOT EXISTS lb.vault_docs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL DEFAULT lb.get_org_id(),
    uploaded_by uuid DEFAULT auth.uid(),
    doc_type text,
    related_type text,
    related_id uuid,
    storage_path text,
    sha256 text,
    metadata jsonb DEFAULT '{}'::jsonb,
    created_at timestamptz DEFAULT now()
);

-- Compliance Findings (Automated Sweeps)
CREATE TABLE IF NOT EXISTS lb.compliance_findings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL DEFAULT lb.get_org_id(),
    finding_type text,
    subject_type text,
    subject_id uuid,
    severity text, -- 'critical', 'warning', 'info'
    message text,
    details jsonb,
    created_at timestamptz DEFAULT now()
);

-- 3. INDEXES (PERFORMANCE)
CREATE INDEX IF NOT EXISTS idx_tracks_org_owner_status ON lb.tracks(org_id, owner_id, status);
CREATE INDEX IF NOT EXISTS idx_comments_org_track ON lb.track_comments(org_id, track_id);
CREATE INDEX IF NOT EXISTS idx_compliance_org ON lb.compliance_findings(org_id, created_at DESC);

-- 4. ROW LEVEL SECURITY (RLS) - The "Gatekeeper"

-- Enable RLS
ALTER TABLE lb.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE lb.track_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lb.review_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE lb.vault_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lb.compliance_findings ENABLE ROW LEVEL SECURITY;

-- Policies: Tracks
-- READ: Org members can see all tracks in their org
CREATE POLICY IF NOT EXISTS "Org Read Tracks" ON lb.tracks FOR SELECT
    USING (org_id = lb.get_org_id());

-- WRITE: Owners can insert/edit their own Drafts. Admins can edit anything.
CREATE POLICY IF NOT EXISTS "Owner Edit Drafts" ON lb.tracks FOR ALL
    USING (
        (owner_id = auth.uid() AND status != 'approved') 
        OR 
        ((auth.jwt() ->> 'user_role') = 'admin')
    );

-- Policies: Comments
CREATE POLICY IF NOT EXISTS "Org Read Comments" ON lb.track_comments FOR SELECT
    USING (org_id = lb.get_org_id());

CREATE POLICY IF NOT EXISTS "User Write Comments" ON lb.track_comments FOR INSERT
    WITH CHECK (auth.uid() = created_by);

-- 5. FUNCTIONS & TRIGGERS

-- Function: Register Vault Doc (RPC)
CREATE OR REPLACE FUNCTION lb.register_vault_doc(
    p_doc_type text, p_related_type text, p_related_id uuid, 
    p_storage_path text, p_sha256 text, p_metadata jsonb DEFAULT '{}'::jsonb
) RETURNS lb.vault_docs LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
    v_new_doc lb.vault_docs;
BEGIN
    INSERT INTO lb.vault_docs (org_id, uploaded_by, doc_type, related_type, related_id, storage_path, sha256, metadata)
    VALUES (lb.get_org_id(), auth.uid(), p_doc_type, p_related_type, p_related_id, p_storage_path, p_sha256, p_metadata)
    RETURNING * INTO v_new_doc;
    RETURN v_new_doc;
END;
$$;
