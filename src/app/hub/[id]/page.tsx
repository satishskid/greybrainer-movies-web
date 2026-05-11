"use client";

import { useEffect, useState, use } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ArrowLeft, Save, Globe, Loader2, Eye, Copy, Check } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ResearchDoc {
  id: string;
  title: string;
  type: string;
  content: string;
  editorial: string | null;
  socials: { twitter?: string; linkedin?: string } | null;
  createdAt: any;
  status: string;
  createdBy: string;
  slug?: string;
  coverImageUrl?: string;
  publishedAt?: any;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export default function ArticleEditor({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [article, setArticle] = useState<ResearchDoc | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [activeTab, setActiveTab] = useState<"editorial" | "raw" | "social">("editorial");
  const [previewMode, setPreviewMode] = useState(false);
  const [editedEditorial, setEditedEditorial] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [copiedTwitter, setCopiedTwitter] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  useEffect(() => {
    async function fetchArticle() {
      try {
        const snap = await getDoc(doc(db, "published_research", id));
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as ResearchDoc;
          setArticle(data);
          setEditedEditorial(data.editorial || "");
          setEditedContent(data.content || "");
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
            <h1 className="text-xl font-bold text-white">{article.title}</h1>
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
          {saveMsg && (
            <span className="text-sm text-green-400 animate-pulse">{saveMsg}</span>
          )}
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
          {(["editorial", "raw", "social"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "editorial" ? "Publisher Editorial" : tab === "raw" ? "Raw Analysis" : "Social Posts"}
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
        {activeTab === "editorial" && (
          <div className="mb-12">
            {previewMode ? (
              <div className="prose prose-invert prose-lg max-w-none bg-slate-800 rounded-lg p-8 border border-slate-700">
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
        )}

        {activeTab === "raw" && (
          <div className="mb-12">
            {previewMode ? (
              <div className="prose prose-invert prose-lg max-w-none bg-slate-800 rounded-lg p-8 border border-slate-700">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{editedContent}</ReactMarkdown>
              </div>
            ) : (
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full h-[70vh] bg-slate-800 border border-slate-700 rounded-lg p-6 text-slate-200 text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Raw analysis markdown..."
              />
            )}
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
          </div>
        )}
      </div>
    </div>
  );
}
