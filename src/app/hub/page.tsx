"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Layers, Settings, FileText, BarChart, PenTool, Loader2, LogOut, ShieldCheck, Plus } from "lucide-react";
import { addDoc, collection, query, orderBy, getDocs } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { format } from "date-fns";
import { HubAuthGate } from "@/components/HubAuthGate";
import type { HubRole } from "@/lib/hubRoles";

interface ResearchItem {
  id: string;
  title: string;
  type?: string;
  kind?: string;
  categoryLabel?: string;
  content?: string;
  editorial?: string | null;
  createdAt?: { toDate?: () => Date } | null;
  publishedAt?: string | Date | null;
  publishedAtMs?: number;
  status: string;
  createdBy?: string;
  slug?: string;
  source?: "firebase" | "lens-archive";
  sourceUrl?: string;
}

type ManualDraftType = "daily_brief" | "insight" | "research_export";

function plainText(value: string, maxLength?: number) {
  const text = value
    .replace(/!\[[^\]]*]\([^)]*\)/g, "")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#*_`>~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!maxLength || text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).replace(/\s+\S*$/, "").trim()}...`;
}

function firstWords(value: string, maxWords: number) {
  return plainText(value).split(/\s+/).filter(Boolean).slice(0, maxWords).join(" ");
}

export default function WriterHub() {
  return (
    <HubAuthGate>
      {(session) => <WriterHubContent {...session} />}
    </HubAuthGate>
  );
}

function WriterHubContent({
  user,
  role,
  signOut,
}: {
  user: User;
  role: HubRole;
  signOut: () => Promise<void>;
}) {
  const router = useRouter();
  const [items, setItems] = useState<ResearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewDraft, setShowNewDraft] = useState(false);
  const [newDraftType, setNewDraftType] = useState<ManualDraftType>("daily_brief");
  const [newDraftTitle, setNewDraftTitle] = useState("");
  const [newDraftContent, setNewDraftContent] = useState("");
  const [creatingDraft, setCreatingDraft] = useState(false);
  const [createError, setCreateError] = useState("");

  useEffect(() => {
    async function fetchResearch() {
      try {
        const q = query(collection(db, "published_research"), orderBy("createdAt", "desc"));
        const snapshot = await getDocs(q);
        const firestoreItems = snapshot.docs.map(doc => ({
          id: doc.id,
          source: "firebase" as const,
          ...doc.data()
        })) as ResearchItem[];

        const archiveResponse = await fetch("/api/articles?limit=220");
        const archiveJson = archiveResponse.ok ? await archiveResponse.json() : { articles: [] };
        const archiveItems = (archiveJson.articles || []).map((article: ResearchItem) => ({
          ...article,
          source: article.source || "lens-archive",
        })) as ResearchItem[];

        const byId = new Map<string, ResearchItem>();
        for (const item of [...firestoreItems, ...archiveItems]) {
          if (!item.id || byId.has(item.id)) continue;
          byId.set(item.id, item);
        }

        setItems([...byId.values()]);
      } catch (err) {
        console.error("Failed to fetch research from Firebase:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchResearch();
  }, []);

  function formatItemDate(item: ResearchItem) {
    if (item.createdAt?.toDate) {
      return format(item.createdAt.toDate(), "MMM d, yyyy 'at' h:mm a");
    }

    if (item.publishedAtMs) {
      return format(new Date(item.publishedAtMs), "MMM d, yyyy");
    }

    if (item.publishedAt) {
      const date = new Date(item.publishedAt);
      if (!Number.isNaN(date.getTime())) {
        return format(date, "MMM d, yyyy");
      }
    }

    return "Unknown Date";
  }

  function itemLabel(item: ResearchItem) {
    if (item.categoryLabel) return item.categoryLabel;
    if (item.type === "daily_brief") return "Daily Briefing";
    if (item.type === "research_export") return "Deep Review";
    if (item.type === "insight") return "Insight";
    if (item.kind) return item.kind;
    return item.type || "Article";
  }

  async function handleCreateManualDraft(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const title = newDraftTitle.trim();
    const content = newDraftContent.trim();

    if (!title || !content) {
      setCreateError("Add a title and the article body.");
      return;
    }

    setCreatingDraft(true);
    setCreateError("");
    try {
      const isBrief = newDraftType === "daily_brief";
      const docRef = await addDoc(collection(db, "published_research"), {
        title,
        type: newDraftType,
        content,
        editorial: content,
        createdAt: new Date(),
        status: "draft",
        createdBy: user.email || "Greybrainer editor",
        source: "writer_hub",
        tags: isBrief ? ["daily brief", "greybrainer lens"] : ["greybrainer"],
        searchHeadline: title,
        seoTitle: isBrief ? `${title} | Greybrainer Lens Brief` : `${title} | Greybrainer`,
        seoDescription: plainText(content, 155),
        verdict: firstWords(content, 50),
        whoShouldWatch: isBrief
          ? "For readers tracking the movie and OTT conversation through a sharper Greybrainer lens."
          : "",
        morphokineticsTeaser: isBrief
          ? "This briefing reads the cultural movement around titles and audience energy without exposing the internal scoring model."
          : "",
        producerInsight: isBrief
          ? "For producers and directors, this brief surfaces audience appetite, tonal shifts, and emerging story signals worth watching."
          : "",
        faqs: [],
        inlineImageUrls: [],
        relatedSlugs: [],
      });

      router.push(`/hub/${docRef.id}`);
    } catch (error) {
      console.error("Manual draft creation failed:", error);
      setCreateError("Draft creation failed. Check console.");
    } finally {
      setCreatingDraft(false);
    }
  }

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
        
        <div className="mt-auto space-y-4">
          <div className="rounded-md border border-slate-800 bg-slate-950/60 p-3">
            <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-green-400">
              <ShieldCheck className="w-4 h-4 mr-2" />
              {role}
            </div>
            <p className="mt-2 truncate text-xs text-slate-400">{user.email}</p>
          </div>
          <a href="#" className="flex items-center text-slate-400 hover:text-slate-200 transition">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </a>
          <button
            onClick={signOut}
            className="flex items-center text-slate-400 hover:text-slate-200 transition"
          >
            <LogOut className="w-5 h-5 mr-3" /> Sign out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Content Library</h1>
            <p className="text-slate-400">Engine drafts, writer-uploaded articles, and Medium archive posts currently powering Greybrainer Movies.</p>
          </div>
          <div className="flex flex-col items-start gap-3 md:items-end">
            <button
              onClick={() => setShowNewDraft(true)}
              className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Draft
            </button>
            <div className="hidden md:block text-right">
              <p className="text-xs uppercase tracking-wider text-slate-500">Signed in</p>
              <p className="text-sm font-semibold text-white">{user.email}</p>
            </div>
          </div>
        </header>

        {showNewDraft && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4">
            <form
              onSubmit={handleCreateManualDraft}
              className="w-full max-w-3xl rounded-lg border border-slate-700 bg-slate-900 p-6 shadow-2xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create Writer Draft</h2>
                  <p className="mt-1 text-sm text-slate-400">Paste the final researched article or daily brief, then refine SEO and images in the editor.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowNewDraft(false)}
                  className="rounded-md border border-slate-700 px-3 py-1.5 text-sm text-slate-300 hover:border-slate-500 hover:text-white"
                >
                  Close
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-[180px_1fr]">
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Type</span>
                  <select
                    value={newDraftType}
                    onChange={(event) => setNewDraftType(event.target.value as ManualDraftType)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="daily_brief">Daily Briefing</option>
                    <option value="insight">Insight</option>
                    <option value="research_export">Deep Review</option>
                  </select>
                </label>
                <label className="block">
                  <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Title</span>
                  <input
                    value={newDraftTitle}
                    onChange={(event) => setNewDraftTitle(event.target.value)}
                    className="w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="The Tuesday Brief: The Rise of the Authenticity Premium"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">Article Body</span>
                <textarea
                  value={newDraftContent}
                  onChange={(event) => setNewDraftContent(event.target.value)}
                  rows={14}
                  className="w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Paste the writer-approved markdown or plain text here."
                />
              </label>

              {createError && <p className="mt-3 text-sm text-red-300">{createError}</p>}

              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowNewDraft(false)}
                  className="rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-300 hover:border-slate-500 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creatingDraft}
                  className="inline-flex items-center rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:bg-red-900"
                >
                  {creatingDraft && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Draft
                </button>
              </div>
            </form>
          </div>
        )}

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
                    No content found. Generate a report in the engine or import Medium posts first.
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-700/20 transition group">
                    <td className="px-6 py-4 text-white font-medium">{item.title}</td>
                    <td className="px-6 py-4 text-slate-400">
                      <span className="bg-slate-700 text-xs px-2 py-1 rounded">
                        {itemLabel(item)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {formatItemDate(item)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.source === "lens-archive" ? (
                        <Link
                          href={item.slug ? `/reviews/${item.slug}` : item.sourceUrl || "/reviews"}
                          className="text-slate-300 hover:text-white font-medium text-sm opacity-0 group-hover:opacity-100 transition"
                        >
                          View live →
                        </Link>
                      ) : (
                        <Link
                          href={`/hub/${item.id}`}
                          className="text-red-400 hover:text-red-300 font-medium text-sm opacity-0 group-hover:opacity-100 transition"
                        >
                          Edit &amp; Publish →
                        </Link>
                      )}
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
