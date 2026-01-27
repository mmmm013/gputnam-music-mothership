export default function getAudioUrl(track?: any): string {
  if (!track) return '';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

  if (track.storage_path) {
    const path = String(track.storage_path).replace(/^\/+/, '');
    if (supabaseUrl) {
      return `${supabaseUrl}/storage/v1/object/public/public-audio/${encodeURIComponent(path)}`;
    }
    if (/^https?:\/\//.test(path)) return path;
    return `/public-audio/${path}`;
  }

  if (track.public_url) return track.public_url;
  if (track.stream_url) return track.stream_url;
  if (track.file_url) return track.file_url;
  if (track.url) return track.url;
  return '';
}
