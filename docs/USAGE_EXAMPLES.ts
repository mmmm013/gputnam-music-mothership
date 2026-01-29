/**
 * Usage Examples for Vault-doc Implementation
 * 
 * This file demonstrates how to use the new lb schema features
 * in a Next.js application with Supabase.
 */

import { createClient } from '@/utils/supabase/client';
import type { 
  NewTrack, 
  NewDocument, 
  NewReviewRequest,
  TrackStatus,
  ReviewStatus,
} from '@/types/database';

// Initialize Supabase client
const supabase = createClient();

/**
 * Example 1: Upload and register a track
 */
export async function uploadTrack(file: File, metadata: {
  title: string;
  artist: string;
  brand_domain?: 'GPM' | 'KLEIGH' | 'SCHERER';
  moods?: string[];
  tempo?: string;
}) {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // Get org_id from user metadata
  const orgId = user.user_metadata?.org_id || user.id;
  
  // Upload file to storage with folder convention: {org_id}/{user_id}/
  const filePath = `${orgId}/${user.id}/${file.name}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('tracks')
    .upload(filePath, file);
    
  if (uploadError) throw uploadError;
  
  // Register track in database
  const trackData: NewTrack = {
    title: metadata.title,
    artist: metadata.artist,
    filename: filePath,
    owner_id: user.id,
    org_id: orgId,
    brand_domain: metadata.brand_domain || 'GPM',
    moods: metadata.moods,
    tempo: metadata.tempo,
    status: 'draft',
  };
  
  const { data: track, error: dbError } = await supabase
    .from('lb.tracks')
    .insert(trackData)
    .select()
    .single();
    
  if (dbError) throw dbError;
  
  return track;
}

/**
 * Example 2: Register a vault document
 */
export async function registerDocument(
  title: string,
  storagePath: string,
  fileHash?: string,
  mimeType: string = 'application/pdf'
) {
  const { data, error } = await supabase.rpc('register_vault_doc', {
    p_title: title,
    p_storage_path: storagePath,
    p_file_hash: fileHash,
    p_mime_type: mimeType,
    p_metadata: {
      uploaded_at: new Date().toISOString(),
    },
  });
  
  if (error) throw error;
  return data; // Returns document UUID
}

/**
 * Example 3: Submit track for review
 */
export async function submitTrackForReview(
  trackId: string,
  reviewerId: string,
  note?: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  // Update track status
  const { error: updateError } = await supabase
    .from('lb.tracks')
    .update({ status: 'pending_review' })
    .eq('id', trackId)
    .eq('owner_id', user.id);
    
  if (updateError) throw updateError;
  
  // Create review request
  const reviewRequest: NewReviewRequest = {
    content_type: 'track',
    content_id: trackId,
    requestor_id: user.id,
    reviewer_id: reviewerId,
    request_note: note,
    status: 'pending',
  };
  
  const { data, error } = await supabase
    .from('lb.review_requests')
    .insert(reviewRequest)
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

/**
 * Example 4: Approve or reject a review
 */
export async function reviewContent(
  reviewRequestId: string,
  approved: boolean,
  note?: string
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const status: ReviewStatus = approved ? 'approved' : 'rejected';
  
  const { data, error } = await supabase
    .from('lb.review_requests')
    .update({
      status,
      review_note: note,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', reviewRequestId)
    .eq('reviewer_id', user.id)
    .select()
    .single();
    
  if (error) throw error;
  
  // If approved, update the content status
  if (approved && data) {
    if (data.content_type === 'track') {
      await supabase
        .from('lb.tracks')
        .update({ status: 'approved' })
        .eq('id', data.content_id);
    }
  }
  
  return data;
}

/**
 * Example 5: Run compliance sweep
 */
export async function runComplianceSweep() {
  const { data, error } = await supabase.rpc('compliance_sweep');
  
  if (error) throw error;
  return data; // Returns number of findings
}

/**
 * Example 6: Get compliance summary
 */
export async function getComplianceSummary() {
  const { data, error } = await supabase.rpc('compliance_summary_per_work');
  
  if (error) throw error;
  return data;
}

/**
 * Example 7: Subscribe to realtime updates for compliance findings
 */
export function subscribeToComplianceFindings(
  callback: (payload: any) => void
) {
  const channel = supabase
    .channel('compliance-updates')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'lb',
        table: 'compliance_findings',
      },
      callback
    )
    .subscribe();
    
  return channel;
}

/**
 * Example 8: Subscribe to review requests
 */
export function subscribeToReviewRequests(
  userId: string,
  callback: (payload: any) => void
) {
  const channel = supabase
    .channel('review-requests')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'lb',
        table: 'review_requests',
        filter: `reviewer_id=eq.${userId}`,
      },
      callback
    )
    .subscribe();
    
  return channel;
}

/**
 * Example 9: Get tracks by status
 */
export async function getTracksByStatus(status: TrackStatus) {
  const { data, error } = await supabase
    .from('lb.tracks')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });
    
  if (error) throw error;
  return data;
}

/**
 * Example 10: Link a document to an agreement
 */
export async function linkDocumentToAgreement(
  agreementId: string,
  documentId: string,
  linkType: string = 'supporting_doc'
) {
  const { data, error } = await supabase
    .from('lb.agreement_links')
    .insert({
      agreement_id: agreementId,
      document_id: documentId,
      link_type: linkType,
    })
    .select()
    .single();
    
  if (error) throw error;
  return data;
}

/**
 * Example 11: Create a work with splits
 */
export async function createWorkWithSplits(
  workTitle: string,
  splits: Array<{ party_name: string; percentage: number; role?: string }>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const orgId = user.user_metadata?.org_id || user.id;
  
  // Create work
  const { data: work, error: workError } = await supabase
    .from('lb.works')
    .insert({
      org_id: orgId,
      title: workTitle,
    })
    .select()
    .single();
    
  if (workError) throw workError;
  
  // Create splits
  const splitsData = splits.map(split => ({
    work_id: work.id,
    ...split,
  }));
  
  const { data: splitsResult, error: splitsError } = await supabase
    .from('lb.splits')
    .insert(splitsData)
    .select();
    
  if (splitsError) throw splitsError;
  
  return { work, splits: splitsResult };
}

/**
 * Example 12: Upload file to docs bucket with hash
 */
export async function uploadDocument(file: File, title: string) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  
  const orgId = user.user_metadata?.org_id || user.id;
  
  // Generate file hash (in production, use a proper hashing library)
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  // Upload to storage
  const filePath = `${orgId}/${user.id}/${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('docs')
    .upload(filePath, file);
    
  if (uploadError) throw uploadError;
  
  // Register document
  const docId = await registerDocument(
    title,
    filePath,
    hashHex,
    file.type
  );
  
  return docId;
}
