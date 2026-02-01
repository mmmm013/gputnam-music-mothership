// FILE: src/app/page.tsx (The Home Page)
// ────────────────────────────────────────────────────────────────────────────────────────
// This is the root / route for the entire site.
// It is a *server component* that:
//  1) Fetches "The 38 Videos" from the Supabase `videos` table.
//  2) Displays the Mothership hero (The featured video or placeholder).
//  3) Showcases the TWO real Heroes stories (Champaign + Okinawa).
//  4) Renders the video inventory in a flex grid below.
//  5) Includes a footer with legal, FEIN, and LB archive acknowledgment.
// ────────────────────────────────────────────────────────────────────────────────────────

import { createClient } from '@/utils/supabase/server';
import BraveTrigger from '@/components/BraveTrigger';
import Link from 'next/link';

export default async function Index() {
  // 1) Create the server-side Supabase client
  const supabase = await createClient();

  // 2) Fetch "The 38 Videos" from the `videos` table, most recent first
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  // 3) Select the "featuredVideo" (later: 3h 33m rule). For now, the first.
  const featuredVideo = videos?.[0];

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-black text-white">
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION: THE MOTHERSHIP                                                 */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <section
        className="relative z-10 flex min-h-[75vh] flex-col items-center justify-center px-4"
        style={{
          background:
            'linear-gradient(to-t, #000 0%, #1a0f00 40%, #2d1a00 70%, #3d2200 100%)',
        }}
      >
        {/* Featured Video Background (if available) */}
        {featuredVideo?.video_url && (
          <div className="absolute inset-0 z-0 opacity-20">
            <video
              className="h-full w-full object-cover"
              src={featuredVideo.video_url}
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        )}

        <div className="relative z-10 text-center">
          <h1
            className="mb-4 text-6xl font-black uppercase tracking-tight drop-shadow-2xl"
            style={{
              background:
                'linear-gradient(to-r, #f59e0b, #fbbf24, #fcd34d)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            G PUTNAM MUSIC
          </h1>

          <p className="text-xl font-light uppercase tracking-widest text-amber-100/80">
            The Mothership
          </p>
        </div>

        {/* Featured Video Player (optional inline display) */}
        {featuredVideo?.video_url && (
          <div className="relative z-10 mt-8 w-full max-w-3xl overflow-hidden rounded-lg shadow-2xl">
            <video
              className="h-auto w-full"
              src={featuredVideo.video_url}
              controls
              playsInline
            />
          </div>
        )}
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* HEROES SECTION                                                               */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-gradient-to-b from-black/90 to-black px-4 py-16">
        <h2 className="mb-12 text-center text-5xl font-black uppercase tracking-tight text-amber-400">
          Heroes
        </h2>

        {/* Story 1: Champaign I-57 */}
        <div className="mx-auto mb-16 max-w-4xl">
          <h3 className="mb-4 text-3xl font-bold text-amber-300">
            / BECAUSE THEY COULD
          </h3>
          <blockquote className="mb-4 text-xl italic text-amber-100">
            &ldquo;Heroism is a swarm.&rdquo;
          </blockquote>
          <p className="text-base leading-relaxed text-gray-300">
            Years ago, on I-57 near Champaign, Illinois, I learned the weight of a
            collective refusal to let a stranger die. Trapped in a Camaro that had
            disintegrated against a bridge abutment at 72mph, I was saved not by one
            person, but by an army…
          </p>
        </div>

        {/* Story 2: Okinawa Medic + BraveTrigger */}
        <div className="mx-auto max-w-4xl">
          <h3 className="mb-4 text-3xl font-bold text-amber-300">
            / THE MEDIC FROM OKINAWA
          </h3>
          <p className="mb-6 text-base leading-relaxed text-gray-300">
            A medic who served in Okinawa, whose hands were steady under fire and
            whose courage became a blueprint for others. This is the kind of bravery
            that reshapes the definition of what is possible…
          </p>
          {/* BraveTrigger: "Summon Brave" */}
          <div className="mt-6 flex justify-center">
            <BraveTrigger
              heroTrack="Believe It"
              mood="Heroic"
              label="Summon Brave"
            />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* LATEST TRANSMISSIONS (The 38 Videos Inventory)                               */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <section className="relative z-10 bg-black px-4 py-16">
        <h2 className="mb-12 text-center text-5xl font-black uppercase tracking-tight text-amber-400">
          Latest Transmissions
        </h2>
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {videos?.map((video) => (
            <Link
              key={video.id}
              href={`/video/${video.id}`}
              className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-amber-900/20 to-black shadow-lg transition-transform hover:scale-105"
            >
              {/* Hover-play or thumbnail */}
              <div className="relative aspect-video w-full overflow-hidden bg-black">
                {video.video_url ? (
                  <video
                    className="h-full w-full object-cover opacity-80 group-hover:opacity-100"
                    src={video.video_url}
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-amber-500">
                    No Preview
                  </div>
                )}
              </div>

              {/* Video Metadata */}
              <div className="p-4">
                <p className="mb-1 text-xs uppercase tracking-wider text-amber-400">
                  {video.category || 'Uncategorized'}
                </p>
                <p className="text-sm text-gray-300">
                  {video.id.substring(0, 16)}…
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      {/* FOOTER                                                                       */}
      {/* ═══════════════════════════════════════════════════════════════════════════ */}
      <footer className="relative z-10 bg-black px-4 py-8 text-center text-xs text-gray-500">
        <p className="mb-2">
          &copy; {new Date().getFullYear()} G PUTNAM MUSIC, LLC. All Rights Reserved.
        </p>
        <p>
          FEIN: 86-2542152 | <span className="text-amber-500">LB ARCHIVE ACTIVE</span>
        </p>
      </footer>
    </main>
  );
}
