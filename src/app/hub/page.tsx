"use client";

import { useEffect, useState } from "react";
import { Layers, Settings, FileText, BarChart, PenTool, Loader2 } from "lucide-react";
import { collection, query, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { format } from "date-fns";

interface ResearchItem {
  id: string;
  title: string;
  type: string;
  content: string;
  editorial: string | null;
  createdAt: any;
  status: string;
  createdBy: string;
}

export default function WriterHub() {
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResearch() {
      try {
        const q = query(collection(db, "published_research"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as ResearchItem[];
        setItems(data);
      } catch (err) {
        console.error("Failed to fetch research from Firebase:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResearch();
  }, []);
  return (
    <div className="min-h-screen bg-slate-900 pt-20 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/50 border-r border-slate-800 p-6 flex flex-col hidden md:flex">
        <h2 className="text-xl font-bold text-white mb-8">Writer Hub</h2>
        <nav className="space-y-4">
          <a href="#" className="flex items-center text-red-400 font-medium">
            <FileText className="w-5 h-5 mr-3" /> Inbox (Raw AI)
          </a>
          <a href="#" className="flex items-center text-slate-400 hover:text-slate-200 transition">
            <PenTool className="w-5 h-5 mr-3" /> Drafts
          </a>
          <a href="#" className="flex items-center text-slate-400 hover:text-slate-200 transition">
            <Layers className="w-5 h-5 mr-3" /> Published
          </a>
          <a href="#" className="flex items-center text-slate-400 hover:text-slate-200 transition">
            <BarChart className="w-5 h-5 mr-3" /> Analytics
          </a>
        </nav>
        
        <div className="mt-auto">
          <a href="#" className="flex items-center text-slate-400 hover:text-slate-200 transition">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Inbox: Pending Reviews</h1>
            <p className="text-slate-400">Research exported from Greybrainer Engine waiting for human polish.</p>
          </div>
          <button className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-md font-semibold transition">
            Connect Medium API
          </button>
        </header>

        {/* List of imported Firebase items */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-900/50">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-300">Title</th>
                <th className="px-6 py-4 font-semibold text-slate-300">Type</th>
                <th className="px-6 py-4 font-semibold text-slate-300">Import Date</th>
                <th className="px-6 py-4 font-semibold text-slate-300 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
                    Fetching from Greybrainer Engine...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-slate-400">
                    No research found. Generate and export a ZIP from the engine first.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/20 transition group">
                    <td className="px-6 py-4 text-white font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <span className="bg-slate-700 text-xs px-2 py-1 rounded">
                        {item.type === 'research_export' ? 'Deep Review' : item.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {item.createdAt?.toDate ? format(item.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a") : 'Unknown Date'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-red-400 hover:text-red-300 font-medium text-sm opacity-0 group-hover:opacity-100 transition">
                        Edit & Publish →
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
