import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  
  // Get asset ID from query params
  const { searchParams } = new URL(request.url);
  const assetId = searchParams.get('assetId');

  if (!assetId) {
    return NextResponse.json({ error: 'Asset ID required' }, { status: 400 });
  }

  // Check authentication
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Fetch the reward asset
  const { data: asset, error: assetError } = await supabase
    .from('reward_assets')
    .select('*')
    .eq('id', assetId)
    .single();

  if (assetError || !asset) {
    return NextResponse.json({ error: 'Asset not found' }, { status: 404 });
  }

  // Check if user has unlocked this reward
  const { data: unlock, error: unlockError } = await supabase
    .from('user_reward_unlocks')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('reward_asset_id', assetId)
    .single();

  if (unlockError || !unlock) {
    return NextResponse.json(
      { error: 'This reward is not unlocked for your account' },
      { status: 403 }
    );
  }

  // Check license status
  if (unlock.license_status !== 'active') {
    return NextResponse.json(
      { 
        error: 'License inactive',
        message: `Your license has been ${unlock.license_status}. An active GPMCC subscription is required.`
      },
      { status: 403 }
    );
  }

  // Get the file from Supabase storage
  const { data: fileData, error: downloadError } = await supabase
    .storage
    .from('tracks')
    .download(asset.file_path);

  if (downloadError || !fileData) {
    console.error('Download error:', downloadError);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }

  // Update download count and timestamp
  await supabase
    .from('user_reward_unlocks')
    .update({
      download_count: unlock.download_count + 1,
      last_downloaded_at: new Date().toISOString()
    })
    .eq('id', unlock.id);

  // Determine file name
  const fileName = asset.file_path.split('/').pop() || `${asset.title.replace(/\s+/g, '_')}.mp3`;

  // Return the file
  return new NextResponse(fileData, {
    headers: {
      'Content-Type': asset.mime_type || 'audio/mpeg',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Cache-Control': 'no-store, must-revalidate',
    },
  });
}
