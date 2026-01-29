import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

interface RewardAsset {
  id: string;
  asset_type: string;
  variant: string | null;
  title: string;
  description: string | null;
  file_path: string;
  unlock_condition: { months_tenure: number };
  license_terms: any;
  duration_seconds: number | null;
  file_size_bytes: number | null;
}

interface UserRewardUnlock {
  id: string;
  reward_asset_id: string;
  unlocked_at: string;
  license_status: 'active' | 'revoked' | 'suspended';
  download_count: number;
  last_downloaded_at: string | null;
}

export default async function RewardsPage() {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    redirect('/join');
  }

  const supabase = createServerClient(supabaseUrl, supabaseServiceKey, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value;
      },
      set() {
        /* no-op for server component */
      },
      remove() {
        /* no-op */
      },
    },
  });

  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/join');
  }

  // Fetch all reward assets
  const { data: rewardAssets, error: assetsError } = await supabase
    .from('reward_assets')
    .select('*')
    .eq('is_active', true)
    .order('unlock_condition->months_tenure', { ascending: true });

  // Fetch user's unlocked rewards
  const { data: userUnlocks, error: unlocksError } = await supabase
    .from('user_reward_unlocks')
    .select('*')
    .eq('user_id', session.user.id);

  // Fetch user's subscription info to calculate tenure
  const { data: subscriptionLicense } = await supabase
    .from('subscription_reward_licenses')
    .select('granted_at, stripe_subscription_id')
    .eq('user_id', session.user.id)
    .order('granted_at', { ascending: false })
    .limit(1)
    .single();

  // Calculate months of tenure
  let monthsTenure = 0;
  if (subscriptionLicense?.granted_at) {
    const grantedDate = new Date(subscriptionLicense.granted_at);
    const now = new Date();
    monthsTenure = Math.floor((now.getTime() - grantedDate.getTime()) / (1000 * 60 * 60 * 24 * 30));
  }

  // Create a map of unlocked rewards
  const unlockedMap = new Map(
    (userUnlocks || []).map(unlock => [unlock.reward_asset_id, unlock])
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold mb-8">Your Rewards</h1>
        
        {/* Tenure Progress */}
        <div className="mb-12 bg-zinc-900 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">Subscription Progress</h2>
            <span className="text-lg">{monthsTenure} / 12 Months</span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-4 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-full transition-all duration-500"
              style={{ width: `${Math.min((monthsTenure / 12) * 100, 100)}%` }}
            />
          </div>
          <p className="mt-4 text-zinc-400">
            {monthsTenure >= 12 
              ? 'You\'ve unlocked all subscription rewards!' 
              : `${12 - monthsTenure} months until your exclusive Brand Stamp reward`}
          </p>
        </div>

        {/* Rewards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(rewardAssets || []).map((asset: RewardAsset) => {
            const unlock = unlockedMap.get(asset.id);
            const isUnlocked = !!unlock && unlock.license_status === 'active';
            const isRevoked = unlock?.license_status === 'revoked';
            const requiredMonths = asset.unlock_condition?.months_tenure || 12;
            const meetsRequirement = monthsTenure >= requiredMonths;

            return (
              <div 
                key={asset.id}
                className={`relative rounded-lg p-6 border-2 transition-all ${
                  isUnlocked 
                    ? 'bg-gradient-to-br from-zinc-900 to-zinc-800 border-purple-500' 
                    : 'bg-zinc-900 border-zinc-700'
                }`}
              >
                {/* Lock/Unlock Icon */}
                <div className="absolute top-4 right-4">
                  {isUnlocked ? (
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-zinc-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>

                {/* Asset Info */}
                <h3 className="text-xl font-bold mb-2 pr-8">{asset.title}</h3>
                {asset.variant && (
                  <p className="text-sm text-purple-400 mb-2 uppercase tracking-wide">
                    {asset.variant}
                  </p>
                )}
                <p className="text-zinc-400 mb-4">{asset.description}</p>

                {/* Status */}
                <div className="mb-4">
                  {isRevoked ? (
                    <div className="bg-red-900/50 border border-red-700 rounded px-3 py-2 text-sm">
                      <p className="text-red-400">License Revoked</p>
                      <p className="text-xs text-red-300 mt-1">Subscription required for access</p>
                    </div>
                  ) : isUnlocked ? (
                    <div className="bg-green-900/50 border border-green-700 rounded px-3 py-2 text-sm">
                      <p className="text-green-400">Unlocked & Active</p>
                      <p className="text-xs text-green-300 mt-1">
                        Downloaded {unlock.download_count} time{unlock.download_count !== 1 ? 's' : ''}
                      </p>
                    </div>
                  ) : meetsRequirement ? (
                    <div className="bg-yellow-900/50 border border-yellow-700 rounded px-3 py-2 text-sm">
                      <p className="text-yellow-400">Ready to Unlock</p>
                      <p className="text-xs text-yellow-300 mt-1">Contact support to activate</p>
                    </div>
                  ) : (
                    <div className="bg-zinc-800 border border-zinc-700 rounded px-3 py-2 text-sm">
                      <p className="text-zinc-400">Locked</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        Unlocks at {requiredMonths} months ({requiredMonths - monthsTenure} months remaining)
                      </p>
                    </div>
                  )}
                </div>

                {/* Download Button */}
                {isUnlocked && (
                  <a
                    href={`/api/rewards/download?assetId=${asset.id}`}
                    className="block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded text-center transition-colors"
                  >
                    Download {asset.file_size_bytes && `(${(asset.file_size_bytes / 1024 / 1024).toFixed(1)} MB)`}
                  </a>
                )}

                {/* License Terms */}
                {isUnlocked && (
                  <div className="mt-4 pt-4 border-t border-zinc-700">
                    <details className="text-xs text-zinc-500">
                      <summary className="cursor-pointer hover:text-zinc-300">License Terms</summary>
                      <div className="mt-2 space-y-1">
                        <p>• Licensed during active GPMCC subscription</p>
                        <p>• Revoked upon subscription cancellation</p>
                        <p>• Exclusive to your organization</p>
                        <p>• Non-exclusive territorial license</p>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {(!rewardAssets || rewardAssets.length === 0) && (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-500">No rewards available at this time.</p>
          </div>
        )}
      </div>
    </div>
  );
}
