"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { ArrowLeft, Save, Globe, Loader2, Eye, Copy, Check, LogOut, ShieldCheck } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HubAuthGate } from "@/components/HubAuthGate";
import type { HubRole } from "@/lib/hubRoles";

interface ResearchDoc {
  id: string;
  title: string;
  type: string;
  content: string;
  editorial: string | null;
  socials: { twitter?: string; linkedin?: string } | null;
  createdAt: { toDate?: () => Date } | null;
  status: string;
  createdBy: string;
  slug?: string;
  coverImageUrl?: string;
  publishedAt?: { toDate?: () => Date; seconds?: number } | Date | string | null;
  images?: { rings: string | null; morpho: string | null } | null;
  youtubeScript?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <HubAuthGate>
      {(session) => <ArticleEditor params={params} {...session} />}
    </HubAuthGate>
  );
}

function ArticleEditor({
  params,
  user,
  role,
  signOut,
}: {
  params: Promise<{ id: string }>;
  user: User;
  role: HubRole;
  signOut: () => Promise<void>;
}) {
  const { id } = use(params);
  const [article, setArticle] = useState<ResearchDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"article" | "social" | "assets">("article");
  const [previewMode, setPreviewMode] = useState(false);
  const [editedEditorial, setEditedEditorial] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedYoutubeScript, setEditedYoutubeScript] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [copiedTwitter, setCopiedTwitter] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");

  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) setGeminiKey(savedKey);
  }, []);

  const handleGeminiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGeminiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  useEffect(() => {
    async function fetchArticle() {
      try {
        const snap = await getDoc(doc(db, "published_research", id));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as ResearchDoc;
          setArticle(data);
          setEditedEditorial(data.editorial || "");
          setEditedContent(data.content || "");
          setEditedYoutubeScript(data.youtubeScript || "");
          setCoverImageUrl(data.coverImageUrl || "");
        }
      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const handleSave = async () => {
    if (!article) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await updateDoc(doc(db, "published_research", article.id), {
        editorial: editedEditorial,
        content: editedContent,
        youtubeScript: editedYoutubeScript,
        coverImageUrl: coverImageUrl,
        updatedAt: new Date(),
      });
      setSaveMsg("Saved!");
      setTimeout(() => setSaveMsg(""), 3000);
    } catch (err) {
      console.error("Save failed:", err);
      setSaveMsg("Save failed. Check console.");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!article) return;
    setPublishing(true);
    try {
      const slug = article.slug || slugify(article.title);
      await updateDoc(doc(db, "published_research", article.id), {
        status: "published",
        slug: slug,
        editorial: editedEditorial,
        content: editedContent,
        youtubeScript: editedYoutubeScript,
        coverImageUrl: coverImageUrl,
        publishedAt: new Date(),
        updatedAt: new Date(),
      });
      setArticle((prev) => prev ? { ...prev, status: "published", slug } : prev);
      setSaveMsg("Published! Live at /reviews/" + slug);
    } catch (err) {
      console.error("Publish failed:", err);
      setSaveMsg("Publish failed. Check console.");
    } finally {
      setPublishing(false);
    }
  };

  const copyToClipboard = async (text: string, type: "twitter" | "linkedin") => {
    await navigator.clipboard.writeText(text);
    if (type === "twitter") {
      setCopiedTwitter(true);
      setTimeout(() => setCopiedTwitter(false), 2000);
    } else {
      setCopiedLinkedIn(true);
      setTimeout(() => setCopiedLinkedIn(false), 2000);
    }
  };

  const handleGenerateScript = async () => {
    if (!editedContent) return;
    if (!geminiKey && !process.env.NEXT_PUBLIC_ALLOW_GLOBAL_GEMINI) {
      alert("Please enter your Gemini API Key below.");
      return;
    }
    setIsGeneratingScript(true);
    try {
      const response = await fetch('/api/generate-youtube-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editedContent, apiKey: geminiKey }),
      });
      if (!response.ok) throw new Error("Failed to generate script");
      const data = await response.json();
      setEditedYoutubeScript(data.script);
    } catch (err) {
      console.error(err);
      alert("Error generating script");
    } finally {
      setIsGeneratingScript(false);
    }
  };

  const handleDownloadAsset = (base64Url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = base64Url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-red-500" />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-slate-900 pt-24 px-8 text-center">
        <p className="text-slate-400 text-lg">Article not found.</p>
        <Link href="/hub" className="text-red-400 hover:text-red-300 mt-4 inline-block">← Back to Hub</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 pt-20">
      {/* Header Bar */}
      <div className="bg-slate-800 border-b border-slate-700 px-8 py-4 flex items-center justify-between sticky top-16 z-40">
        <div className="flex items-center space-x-4">
          <Link href="/hub" className="text-slate-400 hover:text-white transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-xl font-bold text-white">{article.title}</h1>
              <div className="flex items-center px-2 py-1 bg-slate-900 rounded border border-slate-700">
                <span className="text-xs text-slate-400 mr-2">Content ID:</span>
                <code className="text-indigo-400 font-mono text-xs">{article.id}</code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(article.id);
                    alert("Content ID copied!");
                  }}
                  className="ml-2 text-[10px] bg-slate-700 hover:bg-slate-600 px-1.5 py-0.5 rounded text-white transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-1">
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                article.status === "published"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-amber-500/20 text-amber-400"
              }`}>
                {article.status === "published" ? "Published" : "Draft"}
              </span>
              {article.status === "published" && article.slug && (
                <a href={`/reviews/${article.slug}`} target="_blank" className="text-xs text-slate-400 hover:text-white">
                  /reviews/{article.slug}
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden xl:block text-right">
            <div className="flex items-center justify-end text-xs font-semibold uppercase tracking-wider text-green-400">
              <ShieldCheck className="w-4 h-4 mr-1.5" />
              {role}
            </div>
            <p className="text-xs text-slate-400">{user.email}</p>
          </div>
          {saveMsg && (
            <span className="text-sm text-green-400 animate-pulse">{saveMsg}</span>
          )}
          <button
            onClick={signOut}
            className="hidden md:flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </button>
          <button
            onClick={() => setPreviewMode(!previewMode)}
            className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition"
          >
            <Eye className="w-4 h-4 mr-2" />
            {previewMode ? "Edit" : "Preview"}
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm rounded-md transition"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Draft"}
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center px-5 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-800 text-white text-sm font-semibold rounded-md transition"
          >
            <Globe className="w-4 h-4 mr-2" />
            {publishing ? "Publishing..." : "Publish to Site"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-8 pt-6">
        <div className="flex space-x-1 bg-slate-800 rounded-lg p-1 w-fit mb-6">
          {(["article", "social", "assets"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "article" ? "Article Editor" : tab === "social" ? "Social Posts" : "Assets & Images"}
            </button>
          ))}
        </div>

        {/* Cover Image URL */}
        <div className="mb-6">
          <label className="block text-sm text-slate-400 mb-2">Cover Image URL (for website hero)</label>
          <input
            type="text"
            value={coverImageUrl}
            onChange={(e) => setCoverImageUrl(e.target.value)}
            placeholder="https://images.unsplash.com/photo-..."
            className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {coverImageUrl && (
            <div className="mt-2 h-32 rounded-lg overflow-hidden">
              <img src={coverImageUrl} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        {/* Content Area */}
        {activeTab === "article" && (
          <div className="mb-12 flex flex-col xl:flex-row gap-6">
            {/* Publisher Editorial Half */}
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold mb-3 flex items-center gap-2">
                <span>Publisher Editorial (Viral Hooks)</span>
              </h3>
              {previewMode ? (
                <div className="prose prose-invert prose-lg max-w-none bg-slate-800 rounded-lg p-6 border border-slate-700 overflow-y-auto max-h-[70vh]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{editedEditorial}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={editedEditorial}
                  onChange={(e) => setEditedEditorial(e.target.value)}
                  className="w-full h-[70vh] bg-slate-800 border border-slate-700 rounded-lg p-6 text-slate-200 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Publisher editorial content will appear here..."
                />
              )}
            </div>

            {/* Raw Analysis Half */}
            <div className="flex-1 min-w-0">
              <h3 className="text-slate-300 font-bold mb-3 flex items-center gap-2">
                <span>Detailed Research (Raw Analysis)</span>
              </h3>
              {previewMode ? (
                <div className="prose prose-invert prose-sm max-w-none bg-slate-900 rounded-lg p-6 border border-slate-700 overflow-y-auto max-h-[70vh]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{editedContent}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="w-full h-[70vh] bg-slate-900 border border-slate-700 rounded-lg p-6 text-slate-400 text-xs font-mono resize-none focus:outline-none focus:ring-1 focus:ring-slate-500"
                  placeholder="Raw analysis markdown..."
                />
              )}
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="mb-12 space-y-8">
            {/* Twitter */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Twitter / X Post</h3>
                <button
                  onClick={() => article.socials?.twitter && copyToClipboard(article.socials.twitter, "twitter")}
                  className="flex items-center text-sm text-slate-400 hover:text-white transition"
                >
                  {copiedTwitter ? <Check className="w-4 h-4 mr-1 text-green-400" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copiedTwitter ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-slate-900 rounded-md p-4 text-slate-300 text-sm whitespace-pre-wrap">
                {article.socials?.twitter || "No Twitter post generated."}
              </div>
            </div>

            {/* LinkedIn */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">LinkedIn Post</h3>
                <button
                  onClick={() => article.socials?.linkedin && copyToClipboard(article.socials.linkedin, "linkedin")}
                  className="flex items-center text-sm text-slate-400 hover:text-white transition"
                >
                  {copiedLinkedIn ? <Check className="w-4 h-4 mr-1 text-green-400" /> : <Copy className="w-4 h-4 mr-1" />}
                  {copiedLinkedIn ? "Copied!" : "Copy"}
                </button>
              </div>
              <div className="bg-slate-900 rounded-md p-4 text-slate-300 text-sm whitespace-pre-wrap">
                {article.socials?.linkedin || "No LinkedIn post generated."}
              </div>
            </div>

            {/* YouTube Script Editable */}
            <div className="bg-slate-800 rounded-lg border border-red-500/30 p-6">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-300 mb-1">Your Gemini API Key (Saved Locally)</label>
                <input
                  type="password"
                  value={geminiKey}
                  onChange={handleGeminiKeyChange}
                  placeholder="AIzaSy..."
                  className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-red-500"
                />
              </div>
              <div className="flex items-center justify-between mb-4 mt-6">
                <h3 className="text-lg font-bold text-red-400">YouTube Voiceover Script</h3>
                <button
                  onClick={handleGenerateScript}
                  disabled={isGeneratingScript || !article?.content}
                  className="flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-sm font-semibold rounded transition"
                >
                  {isGeneratingScript ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                  ) : (
                    "Generate Script with Gemini"
                  )}
                </button>
              </div>
              {previewMode ? (
                <div className="prose prose-invert prose-sm max-w-none bg-slate-900 rounded-lg p-6 border border-slate-700 overflow-y-auto">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{editedYoutubeScript || "No script generated."}</ReactMarkdown>
                </div>
              ) : (
                <textarea
                  value={editedYoutubeScript}
                  onChange={(e) => setEditedYoutubeScript(e.target.value)}
                  className="w-full h-64 bg-slate-900 border border-slate-700 rounded-lg p-6 text-slate-300 text-sm font-mono resize-y focus:outline-none focus:ring-1 focus:ring-red-500"
                  placeholder="YouTube script..."
                />
              )}
              <p className="text-xs text-slate-500 mt-2">Edit the script here. Pranit's local video generator will pull exactly what you save here for the voiceover.</p>
            </div>
          </div>
        )}

        {activeTab === "assets" && (
          <div className="mb-12 space-y-8">
            {/* Concentric Rings Image */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Three-Layer Concentric Rings</h3>
                <button
                  onClick={() => article.images?.rings && handleDownloadAsset(article.images.rings, `${slugify(article.title)}_concentric_rings.png`)}
                  disabled={!article.images?.rings}
                  className="flex items-center text-sm text-slate-400 hover:text-white disabled:opacity-50 transition"
                >
                  Download PNG
                </button>
              </div>
              <div className="bg-slate-900 rounded-md p-4 flex items-center justify-center min-h-[300px]">
                {article.images?.rings ? (
                  <img src={article.images.rings} alt="Concentric Rings" className="max-w-full rounded-md shadow-lg" />
                ) : (
                  <p className="text-slate-500 italic">No image was captured by the Engine during export.</p>
                )}
              </div>
            </div>

            {/* Morphokinetics Image */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Morphokinetics Flow</h3>
                <button
                  onClick={() => article.images?.morpho && handleDownloadAsset(article.images.morpho, `${slugify(article.title)}_morphokinetics.png`)}
                  disabled={!article.images?.morpho}
                  className="flex items-center text-sm text-slate-400 hover:text-white disabled:opacity-50 transition"
                >
                  Download PNG
                </button>
              </div>
              <div className="bg-slate-900 rounded-md p-4 flex items-center justify-center min-h-[300px]">
                {article.images?.morpho ? (
                  <img src={article.images.morpho} alt="Morphokinetics" className="max-w-full rounded-md shadow-lg" />
                ) : (
                  <p className="text-slate-500 italic">No morphokinetics image was captured.</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
