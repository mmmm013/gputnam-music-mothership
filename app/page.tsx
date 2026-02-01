import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import BraveTrigger from '@/components/BraveTrigger'; // The "Rise" Component

export default async function Index() {
  const supabase = createClient();

  // 1. FETCH INVENTORY (The 38 Videos)
  const { data: videos } = await supabase || []
    .from('videos')
    .select('*')
    .order('created_at', { ascending: false });

  // 2. HERO ROTATION LOGIC (Server-Side Calculation or Client Component)
  // Selecting a "Featured" video from the top 10 based on our 3h 33m rule
  const featuredVideo = videos ? videos[0] : null; 

  return (
    <main className="flex-1 flex flex-col gap-6 items-center min-h-screen bg-black text-slate-200 font-sans">
      
      {/* --- HERO SECTION (MOTHERSHIP) --- */}
      <section className="w-full max-w-6xl p-6 mt-12 text-center animate-in fade-in zoom-in duration-1000">
        <h1 className="text-6xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent mb-4">
          G PUTNAM MUSIC
        </h1>
        <p className="text-xl text-slate-400 tracking-widest uppercase mb-8">
          The Mothership
        </p>

        {/* FEATURED PLAYER */}
        {featuredVideo && (
            <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-amber-900/50 shadow-2xl shadow-amber-900/20">
              <video 
                src={featuredVideo.public_url} 
                controls 
                className="w-full h-full object-cover"
                poster="/images/gpm-poster.jpg"
              />
              <div className="absolute top-4 left-4 bg-black/80 px-4 py-1 text-amber-500 text-xs font-bold uppercase tracking-widest border border-amber-500/30">
                Now Playing: {featuredVideo.title}
              </div>
            </div>
        )}
      </section>


      {/* --- HEROES SECTION (THE STORIES) --- */}
      <section id="heroes" className="w-full max-w-4xl p-8 my-12 bg-slate-900/50 rounded-lg border-l-4 border-amber-600">
        <div className="flex items-center gap-4 mb-6">
            <h2 className="text-3xl font-bold text-white">HEROES</h2>
            <span className="text-amber-500 text-sm tracking-widest uppercase">/ Because They Could</span>
        </div>

        {/* STORY 1: CHAMPAIGN (GREG) */}
        <article className="mb-12 prose prose-invert">
            <h3 className="text-xl text-amber-400 font-serif italic">&quot;Heroism is a swarm.&quot;</h3>
            <p className="text-slate-300">
                Years ago, on I-57 near Champaign, Illinois, I learned the weight of a collective refusal to let a stranger die. 
                Trapped in a Camaro that had disintegrated against a bridge abutment at 72mph, I was saved not by one person, 
                but by an army... 
                <span className="text-slate-500 text-sm"> [Read Full Story]</span>
            </p>
        </article>

        {/* STORY 2: OKINAWA (LEE) - The New Addition */}
        <article className="mb-8 prose prose-invert border-t border-slate-800 pt-8">
            <h3 className="text-2xl font-bold text-white mb-2">OKINAWA: THE DISTANT GAZE</h3>
            <h4 className="text-sm text-slate-400 uppercase tracking-widest mb-4">The Medic from Bushnell</h4>
            
            <p className="text-slate-300 leading-relaxed">
                Great-Grandpa Lee was just 19—a kid from Bushnell, Illinois, hanging in the balance between high school and college. 
                But history has a way of interrupting plans. He stood in a line at Camp Lejeune and became a Medic, destined for 
                one of the fiercest engagements of the Pacific War: <strong>Okinawa</strong>.
            </p>
            <p className="text-slate-300 leading-relaxed mt-4">
                To us, he is remembered by three things: The Scar, The Look, and The Flag. 
                He didn&apos;t ask to be a hero. He was a kid who stood in a line and did a job that saved lives while the world burned around him.
            </p>
            
            {/* BRAVE RISING TRIGGER */}
            <div className="mt-8 flex justify-center">
                <BraveTrigger 
                    heroTrack="Believe It" 
                    mood="Heroic"
                    label="Summon Brave"
                />
            </div>
        </article>
      </section>


      {/* --- INVENTORY GRID (THE 38 VIDEOS) --- */}
      <section className="w-full max-w-6xl p-6">
        <h3 className="text-xl text-slate-500 font-bold mb-6 border-b border-slate-800 pb-2">LATEST TRANSMISSIONS</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos?.map((video) => (
            <div key={video.id} className="group relative bg-slate-900 border border-slate-800 hover:border-amber-600 transition-all duration-300 rounded-lg overflow-hidden">
              <div className="aspect-video w-full bg-black relative">
                 <video src={video.public_url} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                 {/* Play Button Overlay */}
                 <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center">
                        <svg className="w-6 h-6 text-black fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                 </div>
              </div>
              <div className="p-4">
                <h4 className="font-bold text-slate-200 truncate">{video.title}</h4>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-slate-500 uppercase">{video.category || 'Music Video'}</span>
                    <span className="text-xs text-amber-600 font-mono">GPM-ID: {video.id.slice(0,4)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="w-full p-8 text-center text-slate-600 text-sm border-t border-slate-900 mt-12">
        <p>&copy; {new Date().getFullYear()} G PUTNAM MUSIC, LLC. All Rights Reserved.</p>
        <p className="text-xs mt-2">FEIN: 86-2542152 | LB ARCHIVE ACTIVE</p>
      </footer>

    </main>
  );
}
