"use client";

import { useEffect, useState, use, type ReactNode } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { ArrowLeft, Save, Globe, Loader2, Eye, Copy, Check, LogOut, ShieldCheck, Upload, Wand2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { HubAuthGate } from "@/components/HubAuthGate";
import type { HubRole } from "@/lib/hubRoles";

interface ArticleFaq {
  question: string;
  answer: string;
}

interface ResearchDoc {
  id: string;
  title: string;
  type: string;
  content: string;
  editorial: string | null;
  socials: { twitter?: string; linkedin?: string; instagram?: string; facebook?: string; medium?: string } | null;
  createdAt: { toDate?: () => Date } | null;
  status: string;
  createdBy: string;
  slug?: string;
  coverImageUrl?: string;
  publishedAt?: { toDate?: () => Date; seconds?: number } | Date | string | null;
  images?: { rings: string | null; morpho: string | null } | null;
  youtubeScript?: string;
  seoTitle?: string;
  seoDescription?: string;
  searchHeadline?: string;
  verdict?: string;
  whoShouldWatch?: string;
  storyScore?: string;
  conceptScore?: string;
  executionScore?: string;
  overallScore?: string;
  morphokineticsTeaser?: string;
  producerInsight?: string;
  faqs?: ArticleFaq[];
  relatedSlugs?: string[];
  inlineImageUrls?: string[];
}

const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://greybrainer-movies.netlify.app").replace(/\/$/, "");

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

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

function linesToArray(value: string) {
  return value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function normalizeSlug(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  try {
    const parsed = new URL(trimmed);
    return slugify(parsed.pathname.split("/").filter(Boolean).at(-1) || trimmed);
  } catch {
    return slugify(trimmed.replace(/^\/?reviews\//, ""));
  }
}

function cleanFaqs(faqs: ArticleFaq[]) {
  return faqs.filter((faq) => faq.question.trim() && faq.answer.trim());
}

export default function ArticleEditorPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <HubAuthGate>
      {(session) => <ArticleEditor params={params} {...session} />}
    </HubAuthGate>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-800/60 p-4">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </span>
      {children}
    </div>
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
  const [uploadingAsset, setUploadingAsset] = useState(false);
  const [activeTab, setActiveTab] = useState<"article" | "seo" | "social" | "assets">("article");
  const [previewMode, setPreviewMode] = useState(false);
  const [editedEditorial, setEditedEditorial] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const [editedYoutubeScript, setEditedYoutubeScript] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [searchHeadline, setSearchHeadline] = useState("");
  const [verdict, setVerdict] = useState("");
  const [whoShouldWatch, setWhoShouldWatch] = useState("");
  const [storyScore, setStoryScore] = useState("");
  const [conceptScore, setConceptScore] = useState("");
  const [executionScore, setExecutionScore] = useState("");
  const [overallScore, setOverallScore] = useState("");
  const [morphokineticsTeaser, setMorphokineticsTeaser] = useState("");
  const [producerInsight, setProducerInsight] = useState("");
  const [faqs, setFaqs] = useState<ArticleFaq[]>([{ question: "", answer: "" }]);
  const [inlineImageUrls, setInlineImageUrls] = useState("");
  const [relatedSlugs, setRelatedSlugs] = useState("");
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [geminiKey, setGeminiKey] = useState("");

  useEffect(() => {
    window.setTimeout(() => {
      const savedKey = localStorage.getItem("gemini_api_key");
      if (savedKey) setGeminiKey(savedKey);
    }, 0);
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
          const sourceText = data.editorial || data.content || "";
          setSearchHeadline(data.searchHeadline || data.title);
          setSeoTitle(data.seoTitle || `${data.title} Review: Greybrainer Three-Layer Analysis`);
          setSeoDescription(data.seoDescription || plainText(sourceText, 155));
          setVerdict(data.verdict || firstWords(sourceText, 50));
          setWhoShouldWatch(data.whoShouldWatch || "");
          setStoryScore(data.storyScore || "");
          setConceptScore(data.conceptScore || "");
          setExecutionScore(data.executionScore || "");
          setOverallScore(data.overallScore || "");
          setMorphokineticsTeaser(data.morphokineticsTeaser || "");
          setProducerInsight(data.producerInsight || "");
          setFaqs(data.faqs?.length ? data.faqs : [{ question: "", answer: "" }]);
          setInlineImageUrls((data.inlineImageUrls || []).join("\n"));
          setRelatedSlugs((data.relatedSlugs || []).join("\n"));
        }
      } catch (err) {
        console.error("Failed to load article:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [id]);

  const buildPublishPayload = () => ({
    editorial: editedEditorial,
    content: editedContent,
    youtubeScript: editedYoutubeScript,
    coverImageUrl,
    seoTitle,
    seoDescription,
    searchHeadline,
    verdict,
    whoShouldWatch,
    storyScore,
    conceptScore,
    executionScore,
    overallScore,
    morphokineticsTeaser,
    producerInsight,
    faqs: cleanFaqs(faqs),
    inlineImageUrls: linesToArray(inlineImageUrls),
    relatedSlugs: linesToArray(relatedSlugs).map(normalizeSlug).filter(Boolean),
    updatedAt: new Date(),
  });

  const handleSave = async () => {
    if (!article) return;
    setSaving(true);
    setSaveMsg("");
    try {
      await updateDoc(doc(db, "published_research", article.id), {
        ...buildPublishPayload(),
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
      const slug = article.slug || slugify(searchHeadline || article.title);
      await updateDoc(doc(db, "published_research", article.id), {
        ...buildPublishPayload(),
        status: "published",
        publishedAt: new Date(),
        slug,
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

  const handlePrepareSeoFrame = () => {
    if (!article) return;
    const sourceText = editedEditorial || editedContent || article.title;
    setSearchHeadline((current) => current || article.title);
    setSeoTitle((current) => current || `${article.title} Review: Greybrainer Three-Layer Analysis`);
    setSeoDescription((current) => current || plainText(sourceText, 155));
    setVerdict((current) => current || firstWords(sourceText, 50));
    setWhoShouldWatch((current) => current || "For viewers who want more than a thumbs-up verdict: story signal, craft reading, audience movement, and a clean sense of whether the film will stay with them.");
    setMorphokineticsTeaser((current) => current || "The Morphokinetics pass reads how attention, tension, release, and emotional momentum move through the film without exposing the full internal scoring model.");
    setProducerInsight((current) => current || "For producers and directors, this review highlights the public-facing signals: where the film's intent lands, where craft choices amplify it, and where audience energy may shift.");
    setFaqs((current) =>
      cleanFaqs(current).length
        ? current
        : [
            { question: `Is ${article.title} worth watching?`, answer: "Yes, if the film's core promise matches what you want from the genre and viewing mood described in this review." },
            { question: "What does Greybrainer analyze?", answer: "Greybrainer reads story/script, conceptualization, performance/execution, audience pulse, and Morphokinetics as connected signals." },
          ],
    );
  };

  const handleUploadImage = async (file: File, target: "cover" | "inline") => {
    if (!article) return;
    setUploadingAsset(true);
    setSaveMsg("");
    try {
      const formData = new FormData();
      formData.append("draftId", article.id);
      formData.append("kind", target);
      formData.append("file", file);

      const token = await user.getIdToken();
      const response = await fetch("/api/r2-upload", {
        method: "POST",
        headers: { authorization: `Bearer ${token}` },
        body: formData,
      });
      const payload = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !payload.url) {
        throw new Error(payload.error || "R2 upload failed.");
      }

      const url = payload.url;
      if (target === "cover") {
        setCoverImageUrl(url);
      } else {
        setInlineImageUrls((current) => (current ? `${current}\n${url}` : url));
      }
      setSaveMsg("Image uploaded to R2. Save draft to keep it.");
    } catch (error) {
      console.error("Image upload failed:", error);
      setSaveMsg(error instanceof Error ? error.message : "Image upload failed.");
    } finally {
      setUploadingAsset(false);
    }
  };

  const copyToClipboard = async (text: string, channel: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedChannel(channel);
    setTimeout(() => setCopiedChannel(null), 2000);
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

  const liveSlug = article.slug || slugify(searchHeadline || article.title);
  const liveUrl = `${PUBLIC_SITE_URL}/reviews/${liveSlug}`;
  const socialDrafts = {
    linkedin:
      article.socials?.linkedin ||
      `${searchHeadline || article.title}\n\n${verdict || plainText(editedEditorial || editedContent, 220)}\n\nGreybrainer reads the film through story signal, craft execution, audience pulse, and Morphokinetics.\n\nRead the full review: ${liveUrl}`,
    twitter:
      article.socials?.twitter ||
      `${searchHeadline || article.title}\n\n${verdict || plainText(editedEditorial || editedContent, 170)}\n\nFull Greybrainer review: ${liveUrl}`,
    instagram:
      article.socials?.instagram ||
      `${searchHeadline || article.title}\n\n${verdict || plainText(editedEditorial || editedContent, 220)}\n\nGreybrainer Lens: story, craft, audience pulse, Morphokinetics.\n\nLink in bio / full review: ${liveUrl}\n\n#Greybrainer #MovieReview #Cinema`,
    facebook:
      article.socials?.facebook ||
      `${searchHeadline || article.title}\n\n${verdict || plainText(editedEditorial || editedContent, 240)}\n\nRead the complete Greybrainer review: ${liveUrl}`,
    medium:
      article.socials?.medium ||
      `${searchHeadline || article.title}\n\n${verdict || plainText(editedEditorial || editedContent, 260)}\n\nOriginally published on Greybrainer Movies: ${liveUrl}`,
  };

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
          {(["article", "seo", "social", "assets"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                activeTab === tab
                  ? "bg-slate-700 text-white"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              {tab === "article"
                ? "Article Editor"
                : tab === "seo"
                  ? "Website SEO"
                  : tab === "social"
                    ? "Social Posts"
                    : "Assets & Images"}
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
          <label className="mt-3 inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition cursor-pointer">
            {uploadingAsset ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
            Upload Cover
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingAsset}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void handleUploadImage(file, "cover");
                event.currentTarget.value = "";
              }}
            />
          </label>
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

        {activeTab === "seo" && (
          <div className="mb-12 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-white">Website Publish Pack</h2>
                <p className="text-sm text-slate-400 mt-1">
                  These fields become the owned-site article, metadata, schema, FAQ, and social source.
                </p>
              </div>
              <button
                onClick={handlePrepareSeoFrame}
                className="inline-flex items-center w-fit rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-600 transition"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                Prepare Frame
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Field label="Search Headline">
                <input
                  value={searchHeadline}
                  onChange={(e) => setSearchHeadline(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
              <Field label="SEO Title">
                <input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
            </div>

            <Field label="Meta Description">
              <textarea
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
                rows={2}
                className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </Field>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Field label="50-Word Verdict">
                <textarea
                  value={verdict}
                  onChange={(e) => setVerdict(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
              <Field label="Who Should Watch">
                <textarea
                  value={whoShouldWatch}
                  onChange={(e) => setWhoShouldWatch(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Field label="Story/Script Score">
                <input
                  value={storyScore}
                  onChange={(e) => setStoryScore(e.target.value)}
                  placeholder="8.2/10"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
              <Field label="Concept Score">
                <input
                  value={conceptScore}
                  onChange={(e) => setConceptScore(e.target.value)}
                  placeholder="8.0/10"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
              <Field label="Execution Score">
                <input
                  value={executionScore}
                  onChange={(e) => setExecutionScore(e.target.value)}
                  placeholder="7.8/10"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
              <Field label="Overall Score">
                <input
                  value={overallScore}
                  onChange={(e) => setOverallScore(e.target.value)}
                  placeholder="8.0/10"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Field label="Morphokinetics Teaser">
                <textarea
                  value={morphokineticsTeaser}
                  onChange={(e) => setMorphokineticsTeaser(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
              <Field label="Producer / Director Insight">
                <textarea
                  value={producerInsight}
                  onChange={(e) => setProducerInsight(e.target.value)}
                  rows={5}
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <Field label="Inline Image URLs">
                <textarea
                  value={inlineImageUrls}
                  onChange={(e) => setInlineImageUrls(e.target.value)}
                  rows={5}
                  placeholder="One image URL per line"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <label className="mt-3 inline-flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-md transition cursor-pointer">
                  {uploadingAsset ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
                  Upload Inline Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={uploadingAsset}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleUploadImage(file, "inline");
                      event.currentTarget.value = "";
                    }}
                  />
                </label>
              </Field>

              <Field label="Related Article Slugs or URLs">
                <textarea
                  value={relatedSlugs}
                  onChange={(e) => setRelatedSlugs(e.target.value)}
                  rows={5}
                  placeholder="one-related-article-slug"
                  className="w-full bg-slate-900 border border-slate-700 rounded-md px-4 py-3 text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </Field>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">FAQ</h3>
                <button
                  onClick={() => setFaqs((current) => [...current, { question: "", answer: "" }])}
                  className="inline-flex items-center rounded-md bg-slate-700 px-3 py-2 text-sm text-white hover:bg-slate-600 transition"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add FAQ
                </button>
              </div>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="rounded-md border border-slate-700 bg-slate-900 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-300">Question {index + 1}</span>
                      <button
                        onClick={() => setFaqs((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                        className="text-slate-500 hover:text-red-300 transition"
                        aria-label="Remove FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      value={faq.question}
                      onChange={(e) =>
                        setFaqs((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, question: e.target.value } : item,
                          ),
                        )
                      }
                      placeholder="Question"
                      className="mb-3 w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <textarea
                      value={faq.answer}
                      onChange={(e) =>
                        setFaqs((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index ? { ...item, answer: e.target.value } : item,
                          ),
                        )
                      }
                      rows={3}
                      placeholder="Answer"
                      className="w-full bg-slate-800 border border-slate-700 rounded-md px-4 py-3 text-white text-sm resize-y focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="mb-12 space-y-8">
            {[
              ["linkedin", "LinkedIn Post", socialDrafts.linkedin],
              ["twitter", "X / Twitter Post", socialDrafts.twitter],
              ["instagram", "Instagram Caption", socialDrafts.instagram],
              ["facebook", "Facebook Post", socialDrafts.facebook],
              ["medium", "Medium Syndication Note", socialDrafts.medium],
            ].map(([channel, label, text]) => (
              <div key={channel} className="bg-slate-800 rounded-lg border border-slate-700 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-white">{label}</h3>
                  <button
                    onClick={() => copyToClipboard(text, channel)}
                    className="flex items-center text-sm text-slate-400 hover:text-white transition"
                  >
                    {copiedChannel === channel ? <Check className="w-4 h-4 mr-1 text-green-400" /> : <Copy className="w-4 h-4 mr-1" />}
                    {copiedChannel === channel ? "Copied!" : "Copy"}
                  </button>
                </div>
                <div className="bg-slate-900 rounded-md p-4 text-slate-300 text-sm whitespace-pre-wrap">
                  {text}
                </div>
              </div>
            ))}

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
              <p className="text-xs text-slate-500 mt-2">Edit the script here. Pranit&apos;s local video generator will pull exactly what you save here for the voiceover.</p>
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
