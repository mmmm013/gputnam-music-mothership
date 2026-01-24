import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    const { trackId } = await req.json()

    if (!trackId) {
      return new Response(JSON.stringify({ error: 'trackId required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Initialize Supabase client with service role for storage access
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch track metadata
    const { data: track, error: trackError } = await supabase
      .from('tracks')
      .select('id, title, file_path, is_public')
      .eq('id', trackId)
      .single()

    if (trackError || !track) {
      return new Response(JSON.stringify({ error: 'Track not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Generate signed URL (60-second expiry)
    const { data: urlData, error: urlError } = await supabase.storage
      .from('tracks')
      .createSignedUrl(track.file_path, 60)

    if (urlError || !urlData) {
      return new Response(JSON.stringify({ error: 'Failed to generate stream URL' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Increment play count
    await supabase.rpc('increment_play_count', { track_id: trackId })

    return new Response(
      JSON.stringify({
        streamUrl: urlData.signedUrl,
        track: {
          id: track.id,
          title: track.title,
        },
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
