import Link from 'next/link';
import { Film, TrendingUp, BookOpen, Layers } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex-1 pb-20">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&q=80")' }}
        />
        <div className="relative z-20 h-full flex flex-col justify-end px-8 pb-24 max-w-7xl mx-auto">
          <div className="flex items-center space-x-2 mb-4">
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">Latest Deep Review</span>
            <span className="text-yellow-400 font-bold">★ 8.5/10</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
            Legends 2026
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-8 line-clamp-3">
            A gripping six-part British crime drama exploring the psychological toll of undercover work. Read the full Greybrainer analysis mapping the emotional valence and script layers of this untold true story.
          </p>
          <div className="flex space-x-4">
            <Link 
              href="/reviews/legends-2026"
              className="bg-white text-slate-900 px-8 py-3 rounded-md font-semibold hover:bg-slate-200 transition flex items-center"
            >
              <Film className="w-5 h-5 mr-2" />
              Read Analysis
            </Link>
            <Link 
              href="/hub"
              className="bg-slate-600/60 backdrop-blur-md text-white px-8 py-3 rounded-md font-semibold hover:bg-slate-600/80 transition"
            >
              Writer Hub
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 -mt-8 relative z-30 space-y-16">
        
        {/* Daily Newsletter Row */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <TrendingUp className="w-6 h-6 mr-3 text-red-500" />
              Daily Briefings
            </h2>
            <Link href="/newsletter" className="text-sm text-slate-400 hover:text-white transition">View All</Link>
          </div>
          <div className="flex space-x-6 overflow-x-auto pb-4 scrollbar-hide">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="min-w-[300px] h-48 bg-slate-800 rounded-lg border border-slate-700/50 hover:border-slate-500 transition cursor-pointer flex flex-col justify-end p-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent z-10" />
                <div className="relative z-20">
                  <span className="text-xs text-slate-400 mb-2 block">May 11, 2026</span>
                  <h3 className="text-lg font-semibold text-white group-hover:text-red-400 transition">Industry Shift: AI in Scripting</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Deep Reviews Row */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <BookOpen className="w-6 h-6 mr-3 text-indigo-400" />
              Deep Reviews
            </h2>
            <Link href="/reviews" className="text-sm text-slate-400 hover:text-white transition">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-video bg-slate-800 rounded-lg border border-slate-700 hover:scale-105 transition duration-300 cursor-pointer overflow-hidden relative">
                 <div className="absolute inset-0 bg-slate-700/50 animate-pulse" /> {/* Placeholder image */}
                 <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent">
                    <h3 className="font-bold text-white">Movie Title {i}</h3>
                    <p className="text-sm text-yellow-400">★ 8.{i}/10</p>
                 </div>
              </div>
            ))}
          </div>
        </section>

        {/* Insights & Research Row */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Layers className="w-6 h-6 mr-3 text-teal-400" />
              Insights & Morphokinetics
            </h2>
            <Link href="/insights" className="text-sm text-slate-400 hover:text-white transition">View All</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-slate-800 rounded-lg border border-slate-700 p-6 flex flex-col cursor-pointer hover:bg-slate-800/80 transition">
                <span className="text-xs font-semibold text-teal-400 uppercase tracking-wider mb-2">Research</span>
                <h3 className="text-xl font-bold text-white mb-2">Analyzing Pacing Shifts</h3>
                <p className="text-slate-400 text-sm mb-4 line-clamp-3">How modern editors are using rapid pacing shifts to maintain attention in the TikTok era, measured via emotional valence charts.</p>
                <div className="mt-auto text-sm text-slate-500">Read Research →</div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
