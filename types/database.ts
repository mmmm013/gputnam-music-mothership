/**
 * TypeScript type definitions for the lb (Library/Licensing Backend) schema
 * Generated for Vault-doc Implementation
 */

export interface Database {
  lb: {
    Tables: {
      agreements: {
        Row: {
          id: string;
          org_id: string;
          title: string;
          agreement_type: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          title: string;
          agreement_type?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          title?: string;
          agreement_type?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          org_id: string;
          title: string;
          storage_path: string | null;
          file_hash: string | null;
          mime_type: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          org_id: string;
          title: string;
          storage_path?: string | null;
          file_hash?: string | null;
          mime_type?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          org_id?: string;
          title?: string;
          storage_path?: string | null;
          file_hash?: string | null;
          mime_type?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
      };
      agreement_links: {
        Row: {
          id: string;
          agreement_id: string;
          document_id: string;
          link_type: string;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          agreement_id: string;
          document_id: string;
          link_type?: string;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          agreement_id?: string;
          document_id?: string;
          link_type?: string;
          created_at?: string;
          created_by?: string | null;
        };
      };
      works: {
        Row: {
          id: string;
          org_id: string;
          title: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          org_id: string;
          title: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          org_id?: string;
          title?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      splits: {
        Row: {
          id: string;
          work_id: string;
          party_name: string;
          percentage: number;
          role: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          work_id: string;
          party_name: string;
          percentage: number;
          role?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          work_id?: string;
          party_name?: string;
          percentage?: number;
          role?: string | null;
          created_at?: string;
        };
      };
      compliance_findings: {
        Row: {
          id: string;
          work_id: string | null;
          finding_type: 'splits_not_100' | 'expiring_rights' | 'missing_docs' | 'invalid_dates' | 'other';
          severity: 'critical' | 'warning' | 'info';
          description: string;
          metadata: Record<string, any>;
          resolved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          work_id?: string | null;
          finding_type: 'splits_not_100' | 'expiring_rights' | 'missing_docs' | 'invalid_dates' | 'other';
          severity?: 'critical' | 'warning' | 'info';
          description: string;
          metadata?: Record<string, any>;
          resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          work_id?: string | null;
          finding_type?: 'splits_not_100' | 'expiring_rights' | 'missing_docs' | 'invalid_dates' | 'other';
          severity?: 'critical' | 'warning' | 'info';
          description?: string;
          metadata?: Record<string, any>;
          resolved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      tracks: {
        Row: {
          id: string;
          title: string;
          artist: string | null;
          filename: string;
          owner_id: string | null;
          org_id: string | null;
          status: 'draft' | 'pending_review' | 'approved' | 'rejected';
          brand_domain: 'GPM' | 'KLEIGH' | 'SCHERER' | null;
          moods: string[] | null;
          tempo: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          artist?: string | null;
          filename: string;
          owner_id?: string | null;
          org_id?: string | null;
          status?: 'draft' | 'pending_review' | 'approved' | 'rejected';
          brand_domain?: 'GPM' | 'KLEIGH' | 'SCHERER' | null;
          moods?: string[] | null;
          tempo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          artist?: string | null;
          filename?: string;
          owner_id?: string | null;
          org_id?: string | null;
          status?: 'draft' | 'pending_review' | 'approved' | 'rejected';
          brand_domain?: 'GPM' | 'KLEIGH' | 'SCHERER' | null;
          moods?: string[] | null;
          tempo?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      review_requests: {
        Row: {
          id: string;
          content_type: 'track' | 'document' | 'agreement' | 'work';
          content_id: string;
          requestor_id: string | null;
          reviewer_id: string | null;
          status: 'pending' | 'approved' | 'rejected' | 'changes_requested';
          request_note: string | null;
          review_note: string | null;
          created_at: string;
          updated_at: string;
          reviewed_at: string | null;
        };
        Insert: {
          id?: string;
          content_type: 'track' | 'document' | 'agreement' | 'work';
          content_id: string;
          requestor_id?: string | null;
          reviewer_id?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'changes_requested';
          request_note?: string | null;
          review_note?: string | null;
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string | null;
        };
        Update: {
          id?: string;
          content_type?: 'track' | 'document' | 'agreement' | 'work';
          content_id?: string;
          requestor_id?: string | null;
          reviewer_id?: string | null;
          status?: 'pending' | 'approved' | 'rejected' | 'changes_requested';
          request_note?: string | null;
          review_note?: string | null;
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string | null;
        };
      };
    };
    Functions: {
      sha256_hex: {
        Args: { data: string };
        Returns: string;
      };
      get_org_id: {
        Args: Record<string, never>;
        Returns: string;
      };
      register_vault_doc: {
        Args: {
          p_title: string;
          p_storage_path: string;
          p_file_hash?: string | null;
          p_mime_type?: string;
          p_metadata?: Record<string, any>;
        };
        Returns: string;
      };
      compliance_sweep: {
        Args: Record<string, never>;
        Returns: number;
      };
      compliance_summary_per_work: {
        Args: Record<string, never>;
        Returns: Array<{
          work_id: string;
          work_title: string;
          critical_count: number;
          warning_count: number;
          info_count: number;
          total_findings: number;
        }>;
      };
    };
  };
}

// Helper types for easier usage
export type Agreement = Database['lb']['Tables']['agreements']['Row'];
export type Document = Database['lb']['Tables']['documents']['Row'];
export type AgreementLink = Database['lb']['Tables']['agreement_links']['Row'];
export type Work = Database['lb']['Tables']['works']['Row'];
export type Split = Database['lb']['Tables']['splits']['Row'];
export type ComplianceFinding = Database['lb']['Tables']['compliance_findings']['Row'];
export type Track = Database['lb']['Tables']['tracks']['Row'];
export type ReviewRequest = Database['lb']['Tables']['review_requests']['Row'];

export type NewAgreement = Database['lb']['Tables']['agreements']['Insert'];
export type NewDocument = Database['lb']['Tables']['documents']['Insert'];
export type NewAgreementLink = Database['lb']['Tables']['agreement_links']['Insert'];
export type NewWork = Database['lb']['Tables']['works']['Insert'];
export type NewSplit = Database['lb']['Tables']['splits']['Insert'];
export type NewComplianceFinding = Database['lb']['Tables']['compliance_findings']['Insert'];
export type NewTrack = Database['lb']['Tables']['tracks']['Insert'];
export type NewReviewRequest = Database['lb']['Tables']['review_requests']['Insert'];

// Status enums for easy reference
export enum TrackStatus {
  Draft = 'draft',
  PendingReview = 'pending_review',
  Approved = 'approved',
  Rejected = 'rejected',
}

export enum ReviewStatus {
  Pending = 'pending',
  Approved = 'approved',
  Rejected = 'rejected',
  ChangesRequested = 'changes_requested',
}

export enum ComplianceSeverity {
  Critical = 'critical',
  Warning = 'warning',
  Info = 'info',
}

export enum FindingType {
  SplitsNot100 = 'splits_not_100',
  ExpiringRights = 'expiring_rights',
  MissingDocs = 'missing_docs',
  InvalidDates = 'invalid_dates',
  Other = 'other',
}

export enum BrandDomain {
  GPM = 'GPM',
  KLEIGH = 'KLEIGH',
  SCHERER = 'SCHERER',
}
