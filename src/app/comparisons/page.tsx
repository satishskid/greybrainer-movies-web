import { Layers } from "lucide-react";

export default function ComparisonsPage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white flex items-center mb-4">
            <Layers className="w-8 h-8 mr-4 text-purple-400" />
            Comparisons
          </h1>
          <p className="text-slate-400 text-lg">
            Side-by-side cinematic analysis. Compare films across all three Greybrainer layers.
          </p>
        </div>

        <div className="text-center py-20">
          <div className="bg-slate-800/50 rounded-xl border border-slate-700/30 inline-block px-12 py-10">
            <Layers className="w-16 h-16 text-purple-400/30 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-500 mb-2">Coming Soon</h2>
            <p className="text-slate-600 max-w-md">
              Head-to-head film analyses with interactive radar charts and morphokinetic
              overlays are currently in development.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
