"use client";

import { useEffect, useState, use, type ReactNode } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import type { User } from "firebase/auth";
import { db } from "@/lib/firebase";
import { ArrowLeft, Save, Globe, Loader2, Eye, Copy, Check, LogOut, ShieldCheck, Upload, Wand2, Plus, Trash2, Image as ImageIcon, Download, ExternalLink, Send, CheckCircle2, AlertTriangle, Settings, Smartphone } from "lucide-react";
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
  gbCardImageUrl?: string;
  gbCardUrls?: Record<string, string>;
}

const PUBLIC_SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://movies.greybrain.in").replace(/\/$/, "");

type GbCardType = "hero" | "rings" | "morpho" | "verdict";
type SocialPreviewKey = "linkedin" | "instagram" | "facebook" | "twitter";

interface SocialPreviewChannel {
  channel: SocialPreviewKey;
  label: string;
  profileLabel: string;
  profileUrl: string;
  text: string;
  assetUrl?: string;
  assetLabel: string;
  trackedUrl: string;
  format: string;
}

const GB_CARD_DEFS: Array<{
  type: GbCardType;
  label: string;
  description: string;
}> = [
  {
    type: "hero",
    label: "Hero Review Card",
    description: "Main post image with title, Greybrainer brand, and overall score.",
  },
  {
    type: "rings",
    label: "Three-Layer Score Card",
    description: "Uses the engine ring visual and the review layer scores.",
  },
  {
    type: "morpho",
    label: "Morphokinetics Card",
    description: "Uses the engine Morphokinetics visual and public teaser.",
  },
  {
    type: "verdict",
    label: "Verdict Card",
    description: "Uses the 50-word verdict, who-should-watch, and maker insight.",
  },
];

const SOCIAL_PROFILE_URLS: Record<SocialPreviewKey, string> = {
  linkedin: "https://www.linkedin.com/company/greybrainer/",
  instagram: "https://www.instagram.com/greybrainlens/",
  facebook: "https://www.facebook.com/share/1DmapQ7Hw3/",
  twitter: "https://x.com/Greybrainlens",
};

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

function isBriefType(type: string) {
  return type === "daily_brief" || type === "daily-brief" || type.includes("brief");
}

function isReferenceOnlyType(type?: string) {
  return type === "creator_insights";
}

function baseTitle(title: string) {
  return title.replace(/\s*-\s*Creator'?s Blueprint\s*$/i, "").trim();
}

function getDiagnosticImageUrls(article: Pick<ResearchDoc, "images">) {
  return [article.images?.rings, article.images?.morpho]
    .filter((url): url is string => typeof url === "string" && url.trim().length > 0);
}

function trackedUrl(baseUrl: string, source: string, campaign: string) {
  const url = new URL(baseUrl);
  url.searchParams.set("utm_source", source);
  url.searchParams.set("utm_medium", "social");
  url.searchParams.set("utm_campaign", campaign);
  return url.toString();
}

function fallbackText(value: string, fallback: string, maxLength?: number) {
  return plainText(value, maxLength) || fallback;
}

function bulletLines(lines: string[]) {
  return lines.filter(Boolean).map((line) => `- ${line}`).join("\n");
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
  const [activeTab, setActiveTab] = useState<"article" | "seo" | "cards" | "social" | "assets">("article");
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
  const [gbCardImageUrl, setGbCardImageUrl] = useState("");
  const [gbCardUrls, setGbCardUrls] = useState<Record<string, string>>({});
  const [copiedChannel, setCopiedChannel] = useState<string | null>(null);
  const [saveMsg, setSaveMsg] = useState("");
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatingGbCard, setGeneratingGbCard] = useState<GbCardType | "all" | null>(null);
  const [geminiKey, setGeminiKey] = useState("");
  const [approvedSocialChannels, setApprovedSocialChannels] = useState<Record<string, boolean>>({});
  const [publishingSocial, setPublishingSocial] = useState(false);
  const [publisherUrl, setPublisherUrl] = useState("");
  const [publisherToken, setPublisherToken] = useState("");
  const [showPublisherSettings, setShowPublisherSettings] = useState(false);

  useEffect(() => {
    window.setTimeout(() => {
      const savedKey = localStorage.getItem("gemini_api_key");
      if (savedKey) setGeminiKey(savedKey);
      const savedPublisherUrl = localStorage.getItem("social_publisher_url");
      if (savedPublisherUrl) setPublisherUrl(savedPublisherUrl);
      const savedPublisherToken = localStorage.getItem("social_publisher_token");
      if (savedPublisherToken) setPublisherToken(savedPublisherToken);
    }, 0);
  }, []);

  const handleGeminiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setGeminiKey(val);
    localStorage.setItem("gemini_api_key", val);
  };

  const handlePublisherUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPublisherUrl(val);
    localStorage.setItem("social_publisher_url", val);
  };

  const handlePublisherTokenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPublisherToken(val);
    localStorage.setItem("social_publisher_token", val);
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
          setSeoTitle(data.seoTitle || (isBriefType(data.type) ? `${data.title} | Greybrainer Lens Brief` : `${data.title} Review: Greybrainer Three-Layer Analysis`));
          setSeoDescription(data.seoDescription || plainText(sourceText, 155));
          setVerdict(data.verdict || firstWords(sourceText, 50));
          setWhoShouldWatch(data.whoShouldWatch || (isBriefType(data.type) ? "For readers tracking the movie and OTT conversation through a sharper Greybrainer lens." : ""));
          setStoryScore(data.storyScore || "");
          setConceptScore(data.conceptScore || "");
          setExecutionScore(data.executionScore || "");
          setOverallScore(data.overallScore || "");
          setMorphokineticsTeaser(data.morphokineticsTeaser || "");
          setProducerInsight(data.producerInsight || "");
          setFaqs(data.faqs?.length ? data.faqs : [{ question: "", answer: "" }]);
          const storedInlineUrls = data.inlineImageUrls || [];
          const diagnosticUrls = getDiagnosticImageUrls(data);
          const mergedInlineUrls = [
            ...storedInlineUrls,
            ...diagnosticUrls.filter((url) => !storedInlineUrls.includes(url)),
          ];
          setInlineImageUrls(mergedInlineUrls.join("\n"));
          setRelatedSlugs((data.relatedSlugs || []).join("\n"));
          setGbCardImageUrl(data.gbCardImageUrl || "");
          setGbCardUrls(data.gbCardUrls || {});
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
    gbCardImageUrl,
    gbCardUrls,
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
    if (isReferenceOnlyType(article.type)) {
      setSaveMsg("Reference only. Open the row marked PUBLISH THIS.");
      return;
    }
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
    const isBrief = isBriefType(article.type);
    const sourceText = editedEditorial || editedContent || article.title;
    setSearchHeadline((current) => current || article.title);
    setSeoTitle((current) => current || (isBrief ? `${article.title} | Greybrainer Lens Brief` : `${article.title} Review: Greybrainer Three-Layer Analysis`));
    setSeoDescription((current) => current || plainText(sourceText, 155));
    setVerdict((current) => current || firstWords(sourceText, 50));
    setWhoShouldWatch((current) => current || (isBrief
      ? "For readers tracking the movie and OTT conversation through a sharper Greybrainer lens."
      : "For viewers who want more than a thumbs-up verdict: story signal, craft reading, audience movement, and a clean sense of whether the film will stay with them."));
    setMorphokineticsTeaser((current) => current || (isBrief
      ? "This briefing reads audience attention, cultural momentum, and tonal shifts without exposing the internal scoring model."
      : "The Morphokinetics pass reads how attention, tension, release, and emotional momentum move through the film without exposing the full internal scoring model."));
    setProducerInsight((current) => current || (isBrief
      ? "For producers and directors, this brief surfaces audience appetite, tonal shifts, and emerging story signals worth watching."
      : "For producers and directors, this review highlights the public-facing signals: where the film's intent lands, where craft choices amplify it, and where audience energy may shift."));
    setFaqs((current) =>
      cleanFaqs(current).length
        ? current
        : [
            ...(isBrief
              ? [{ question: `What is ${article.title} about?`, answer: "It is a Greybrainer Lens briefing on the current movie and OTT conversation, written for quick but thoughtful reading." }]
              : [{ question: `Is ${article.title} worth watching?`, answer: "Yes, if the film's core promise matches what you want from the genre and viewing mood described in this review." }]),
            { question: "What does Greybrainer analyze?", answer: "Greybrainer reads story/script, conceptualization, performance/execution, audience pulse, and Morphokinetics as connected signals." },
          ],
    );
  };

  const handleUploadImage = async (file: File, target: "cover" | "inline" | "gb-card-context") => {
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
      } else if (target === "gb-card-context") {
        setGbCardImageUrl(url);
        await updateDoc(doc(db, "published_research", article.id), {
          gbCardImageUrl: url,
          updatedAt: new Date(),
        });
      } else {
        setInlineImageUrls((current) => (current ? `${current}\n${url}` : url));
      }
      setSaveMsg(target === "gb-card-context" ? "Movie card image uploaded." : "Image uploaded to R2. Save draft to keep it.");
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

  const addAssetToInlineImages = (url: string) => {
    setInlineImageUrls((current) => {
      const existing = linesToArray(current);
      if (existing.includes(url)) return current;
      return [...existing, url].join("\n");
    });
    setSaveMsg("Added to article visuals. Save draft to keep it.");
  };

  const uploadGeneratedGbCard = async (cardType: GbCardType, blob: Blob) => {
    if (!article) throw new Error("Article is not loaded.");

    const formData = new FormData();
    formData.append("draftId", article.id);
    formData.append("kind", `gb-card-${cardType}`);
    formData.append("file", new File([blob], `${slugify(article.title)}-${cardType}-gb-card.png`, { type: "image/png" }));

    const token = await user.getIdToken();
    const response = await fetch("/api/r2-upload", {
      method: "POST",
      headers: { authorization: `Bearer ${token}` },
      body: formData,
    });
    const payload = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !payload.url) {
      throw new Error(payload.error || "Card upload failed.");
    }

    return payload.url;
  };

  const buildGbCardPayload = (cardType: GbCardType) => {
    if (!article) return null;

    const currentScoreRows = [
      storyScore.trim() ? `Story/Script: ${storyScore.trim()}` : "",
      conceptScore.trim() ? `Concept: ${conceptScore.trim()}` : "",
      executionScore.trim() ? `Execution: ${executionScore.trim()}` : "",
      overallScore.trim() ? `Overall: ${overallScore.trim()}` : "",
    ].filter(Boolean);

    return {
      cardType,
      title: searchHeadline || article.title,
      subtitle: isBriefType(article.type) ? "Greybrainer Lens Brief" : "Three-Layer Movie Analysis",
      verdict: verdict || firstWords(editedEditorial || editedContent || article.content || article.title, 50),
      whoShouldWatch,
      overallScore: overallScore || "GB",
      scoreRows: currentScoreRows,
      morphoLine: morphokineticsTeaser,
      producerLine: producerInsight,
      liveUrl: `${PUBLIC_SITE_URL}/reviews/${article.slug || slugify(searchHeadline || article.title)}`,
      backgroundUrl: gbCardImageUrl || coverImageUrl,
      ringsUrl: article.images?.rings || "",
      morphoUrl: article.images?.morpho || "",
    };
  };

  const handleGenerateGbCard = async (cardType: GbCardType, manageSpinner = true) => {
    if (!article) return;
    const payload = buildGbCardPayload(cardType);
    if (!payload) return;

    if (manageSpinner) setGeneratingGbCard(cardType);
    setSaveMsg("");
    try {
      const renderResponse = await fetch("/api/gb-card-render", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify(payload),
      });

      if (!renderResponse.ok) {
        const error = await renderResponse.json().catch(() => ({ error: "Card render failed." }));
        throw new Error(error.error || "Card render failed.");
      }

      const blob = await renderResponse.blob();
      const url = await uploadGeneratedGbCard(cardType, blob);
      const nextUrls = { ...gbCardUrls, [cardType]: url };
      setGbCardUrls(nextUrls);
      await updateDoc(doc(db, "published_research", article.id), {
        gbCardUrls: nextUrls,
        updatedAt: new Date(),
      });
      setSaveMsg(`${GB_CARD_DEFS.find((card) => card.type === cardType)?.label || "GB card"} generated.`);
    } catch (error) {
      console.error("GB card generation failed:", error);
      setSaveMsg(error instanceof Error ? error.message : "GB card generation failed.");
    } finally {
      if (manageSpinner) setGeneratingGbCard(null);
    }
  };

  const handleGenerateAllGbCards = async () => {
    setGeneratingGbCard("all");
    try {
      for (const card of GB_CARD_DEFS) {
        await handleGenerateGbCard(card.type, false);
      }
      setSaveMsg("GB template card pack generated.");
    } finally {
      setGeneratingGbCard(null);
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

  const liveSlug = article.slug || slugify(searchHeadline || article.title);
  const liveUrl = `${PUBLIC_SITE_URL}/reviews/${liveSlug}`;
  const campaign = liveSlug || slugify(article.title);
  const titleForSocial = searchHeadline || article.title;
  const sourceText = editedEditorial || editedContent || article.content || article.title;
  const isBrief = isBriefType(article.type);
  const referenceOnly = isReferenceOnlyType(article.type);
  const displayTitle = referenceOnly ? `Reference Notes: ${baseTitle(article.title)}` : article.title;
  const socialVerdict = fallbackText(
    verdict,
    firstWords(sourceText, 50) || `A Greybrainer reading of ${article.title}.`,
    320,
  );
  const compactVerdict = plainText(socialVerdict, 170);
  const watchLine = fallbackText(
    whoShouldWatch,
    isBrief
      ? "For readers tracking the movie and OTT conversation through a sharper Greybrainer lens."
      : "For viewers who want a sharper read on story signal, craft, and audience energy.",
    220,
  );
  const producerLine = fallbackText(
    producerInsight,
    isBrief
      ? "The useful signal for makers is audience appetite, tonal movement, and where the conversation may move next."
      : "The useful signal for makers is where the film's intent lands, where craft amplifies it, and where audience energy may shift.",
    260,
  );
  const morphoLine = fallbackText(
    morphokineticsTeaser,
    "Morphokinetics reads attention, tension, release, and emotional momentum without exposing the internal scoring model.",
    260,
  );
  const scoreRows = [
    storyScore.trim() ? `Story/Script: ${storyScore.trim()}` : "",
    conceptScore.trim() ? `Concept: ${conceptScore.trim()}` : "",
    executionScore.trim() ? `Execution: ${executionScore.trim()}` : "",
    overallScore.trim() ? `Overall: ${overallScore.trim()}` : "",
  ].filter(Boolean);
  const scoreBlock = scoreRows.length
    ? bulletLines(scoreRows)
    : "- Three-layer score: fill Story/Script, Concept, Execution, and Overall before posting.";
  const hashtags = isBrief
    ? "#Greybrainer #OTT #Cinema #FilmIndustry #AudienceInsights"
    : "#Greybrainer #MovieReview #Cinema #FilmIndustry #AudienceInsights";
  const channelLinks = {
    linkedin: trackedUrl(liveUrl, "linkedin", campaign),
    instagram: trackedUrl(liveUrl, "instagram", campaign),
    facebook: trackedUrl(liveUrl, "facebook", campaign),
    twitter: trackedUrl(liveUrl, "x", campaign),
    medium: trackedUrl(liveUrl, "medium", campaign),
  };
  const gbCardLinkText = GB_CARD_DEFS
    .map((card) => `${card.label}\n${gbCardUrls[card.type] || "Generate this card in the GB Cards tab."}`)
    .join("\n\n");
  const socialDefaults = {
    linkedin:
      `Most reviews ask whether ${article.title} is good.\nGreybrainer asks what kind of audience energy it creates.\n\n${socialVerdict}\n\nThree signals:\n${scoreBlock}\n\nProducer/director signal:\n${producerLine}\n\nWhat would you rather know before watching: the rating, or where attention starts shifting?\n\nRead the full review: ${channelLinks.linkedin}\n\n${hashtags}`,
    linkedinCarousel:
      `Slide 1\n${titleForSocial}\nNot just a rating. A reading of audience signal.\n\nSlide 2\n50-word verdict\n${socialVerdict}\n\nSlide 3\nWho should watch\n${watchLine}\n\nSlide 4\nThree-layer Greybrainer score\n${scoreBlock}\n\nSlide 5\nMorphokinetics teaser\n${morphoLine}\n\nSlide 6\nProducer/director insight\n${producerLine}\n\nSlide 7\nRead the full review\n${channelLinks.linkedin}`,
    twitter:
      `${plainText(article.title, 60)}: most reviews stop at good or bad. Greybrainer reads the audience signal.\n\n${compactVerdict}\n\nFull review: ${channelLinks.twitter}\n\n#Greybrainer`,
    instagram:
      `Are you watching ${article.title} for story, sensation, or aftertaste?\n\n${socialVerdict}\n\nCarousel slides:\n1. ${plainText(titleForSocial, 80)}\n2. The 50-word verdict\n3. Who should watch this\n4. Three-layer score\n5. Morphokinetics teaser\n6. Producer/director signal\n\nSave this for your watchlist. Link in bio/story: ${channelLinks.instagram}\n\n${hashtags}`,
    instagramReel:
      `0-3 sec\nMost reviews ask if ${article.title} is good. Greybrainer asks what it does to attention.\n\n3-12 sec\n${compactVerdict}\n\n12-22 sec\nThree-layer signal:\n${scoreBlock}\n\n22-30 sec\n${morphoLine}\n\nCaption\n${plainText(titleForSocial, 90)}\n${hashtags}\nLink in bio/story: ${channelLinks.instagram}`,
    facebook:
      `What did ${article.title} leave behind: emotion, adrenaline, thought, or silence?\n\n${socialVerdict}\n\nGreybrainer reads the film through story signal, craft execution, audience pulse, and Morphokinetics.\n\nQuestion for viewers: did the film hold your attention all the way through, or did it dip somewhere?\n\nRead the complete review: ${channelLinks.facebook}`,
    medium:
      `${titleForSocial}\n\n${socialVerdict}\n\nThis is the canonical Greybrainer Movies version, with SEO metadata, FAQ, three-layer scoring, Morphokinetics teaser, and producer/director insight.\n\nCanonical review: ${channelLinks.medium}`,
    hashtags,
    altText:
      `Cover image alt text\n${article.title} cover image for a Greybrainer movie analysis.\n\nThree-layer image alt text\n${article.title} Greybrainer three-layer score visualization covering story/script, concept, execution, and overall signal.\n\nMorphokinetics image alt text\n${article.title} Morphokinetics visualization showing attention, emotional momentum, tension, and release patterns.`,
    trackedLinks:
      `LinkedIn\n${channelLinks.linkedin}\n\nInstagram bio/story\n${channelLinks.instagram}\n\nFacebook\n${channelLinks.facebook}\n\nX\n${channelLinks.twitter}\n\nMedium canonical note\n${channelLinks.medium}`,
    gbCardLinks: gbCardLinkText,
  };
  const socialOutputs = [
    { channel: "linkedin", label: "LinkedIn Insight Post", text: article.socials?.linkedin || socialDefaults.linkedin },
    { channel: "linkedin-carousel", label: "LinkedIn Carousel / PDF Slides", text: socialDefaults.linkedinCarousel },
    { channel: "twitter", label: "X / Twitter Post", text: article.socials?.twitter || socialDefaults.twitter },
    { channel: "instagram", label: "Instagram Carousel Caption", text: article.socials?.instagram || socialDefaults.instagram },
    { channel: "instagram-reel", label: "Instagram Reel Script", text: socialDefaults.instagramReel },
    { channel: "facebook", label: "Facebook Discussion Post", text: article.socials?.facebook || socialDefaults.facebook },
    { channel: "medium", label: "Medium Syndication Note", text: article.socials?.medium || socialDefaults.medium },
    { channel: "hashtags", label: "Hashtag Set", text: socialDefaults.hashtags },
    { channel: "alt-text", label: "Image Alt Text", text: socialDefaults.altText },
    { channel: "gb-card-links", label: "GB Template Card URLs", text: socialDefaults.gbCardLinks },
    { channel: "tracked-links", label: "Tracked Links", text: socialDefaults.trackedLinks },
  ];
  const primaryFeedAsset = gbCardUrls.hero || coverImageUrl || gbCardImageUrl;
  const verdictAsset = gbCardUrls.verdict || primaryFeedAsset;
  const carouselAsset = gbCardUrls.rings || gbCardUrls.morpho || primaryFeedAsset;
  const socialPreviewChannels: SocialPreviewChannel[] = [
    {
      channel: "linkedin",
      label: "LinkedIn",
      profileLabel: "Greybrainer company page",
      profileUrl: SOCIAL_PROFILE_URLS.linkedin,
      text: article.socials?.linkedin || socialDefaults.linkedin,
      assetUrl: primaryFeedAsset,
      assetLabel: primaryFeedAsset ? "Hero Review Card" : "No image selected",
      trackedUrl: channelLinks.linkedin,
      format: "Professional insight post + 4:5 feed image",
    },
    {
      channel: "instagram",
      label: "Instagram",
      profileLabel: "@greybrainlens",
      profileUrl: SOCIAL_PROFILE_URLS.instagram,
      text: article.socials?.instagram || socialDefaults.instagram,
      assetUrl: carouselAsset,
      assetLabel: carouselAsset ? "Carousel cover / GB Card" : "No image selected",
      trackedUrl: channelLinks.instagram,
      format: "Carousel caption + 4:5 image",
    },
    {
      channel: "facebook",
      label: "Facebook",
      profileLabel: "Greybrainer page",
      profileUrl: SOCIAL_PROFILE_URLS.facebook,
      text: article.socials?.facebook || socialDefaults.facebook,
      assetUrl: verdictAsset,
      assetLabel: verdictAsset ? "Verdict Card" : "No image selected",
      trackedUrl: channelLinks.facebook,
      format: "Discussion post + 4:5 feed image",
    },
    {
      channel: "twitter",
      label: "X",
      profileLabel: "@Greybrainlens",
      profileUrl: SOCIAL_PROFILE_URLS.twitter,
      text: article.socials?.twitter || socialDefaults.twitter,
      assetUrl: verdictAsset,
      assetLabel: verdictAsset ? "Verdict/Hero Card" : "No image selected",
      trackedUrl: channelLinks.twitter,
      format: "Short post + image",
    },
  ];
  const inlineUrlSet = new Set(linesToArray(inlineImageUrls));
  const diagnosticAssets = [
    { key: "rings", label: "Three-Layer Ring Image", url: article.images?.rings },
    { key: "morpho", label: "Morphokinetics Graph", url: article.images?.morpho },
  ].filter((asset): asset is { key: string; label: string; url: string } => Boolean(asset.url));
  const gbCardImageSource = gbCardImageUrl || coverImageUrl;
  const generatedCardCount = GB_CARD_DEFS.filter((card) => gbCardUrls[card.type]).length;
  const approvedSocialCount = socialPreviewChannels.filter((preview) => approvedSocialChannels[preview.channel]).length;

  const setAllSocialApprovals = (approved: boolean) => {
    setApprovedSocialChannels(
      Object.fromEntries(socialPreviewChannels.map((preview) => [preview.channel, approved])),
    );
  };

  const toggleSocialApproval = (channel: SocialPreviewKey) => {
    setApprovedSocialChannels((current) => ({ ...current, [channel]: !current[channel] }));
  };

  const handlePublishApprovedSocial = async () => {
    if (!article) return;

    if (article.status !== "published") {
      setSaveMsg("Publish to Site first so social links do not 404.");
      return;
    }

    const approvedChannels = socialPreviewChannels.filter((preview) => approvedSocialChannels[preview.channel]);
    if (!approvedChannels.length) {
      setSaveMsg("Approve at least one social channel first.");
      return;
    }

    if (!publisherUrl.trim()) {
      setShowPublisherSettings(true);
      setSaveMsg("Connect a publisher endpoint first. Manual copy pack is ready below.");
      return;
    }

    setPublishingSocial(true);
    setSaveMsg("");
    try {
      const response = await fetch("/api/social-publish", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${await user.getIdToken()}`,
        },
        body: JSON.stringify({
          articleId: article.id,
          title: titleForSocial,
          liveUrl,
          publisherUrl: publisherUrl.trim(),
          publisherToken: publisherToken.trim(),
          channels: approvedChannels.map((preview) => ({
            channel: preview.channel,
            label: preview.label,
            text: preview.text,
            assetUrl: preview.assetUrl || "",
            trackedUrl: preview.trackedUrl,
            format: preview.format,
          })),
        }),
      });
      const payload = (await response.json().catch(() => ({}))) as { error?: string; accepted?: boolean };
      if (!response.ok || payload.error) {
        throw new Error(payload.error || "Social publisher rejected the request.");
      }
      setSaveMsg(`Publisher accepted ${approvedChannels.length} approved channel${approvedChannels.length === 1 ? "" : "s"}.`);
    } catch (error) {
      console.error("Social publishing failed:", error);
      setSaveMsg(error instanceof Error ? error.message : "Social publishing failed.");
    } finally {
      setPublishingSocial(false);
    }
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
              <h1 className="text-xl font-bold text-white">{displayTitle}</h1>
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
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                referenceOnly
                  ? "bg-slate-700 text-slate-300"
                  : "bg-green-500/15 text-green-300"
              }`}>
                {referenceOnly ? "Reference Only" : "Publishable Article"}
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
            disabled={publishing || referenceOnly}
            className={`flex items-center px-5 py-2 text-white text-sm font-semibold rounded-md transition ${
              referenceOnly
                ? "bg-slate-700 text-slate-300 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-500 disabled:bg-red-800"
            }`}
          >
            <Globe className="w-4 h-4 mr-2" />
            {referenceOnly ? "Reference Only" : publishing ? "Publishing..." : "Publish to Site"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-6xl mx-auto px-8 pt-6">
        <div className="flex space-x-1 bg-slate-800 rounded-lg p-1 w-fit mb-6">
          {(["article", "seo", "cards", "social", "assets"] as const).map((tab) => (
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
                  : tab === "cards"
                    ? "GB Cards"
                    : tab === "social"
                      ? "Social Posts"
                      : "Assets & Images"}
            </button>
          ))}
        </div>

        {referenceOnly && (
          <div className="mb-6 rounded-lg border border-slate-700 bg-slate-800 p-5">
            <p className="text-sm font-bold uppercase tracking-wider text-slate-300">Reference only</p>
            <p className="mt-2 text-sm text-slate-400">
              Use this for background notes. To publish, go back to Content Library and open the row marked PUBLISH THIS.
            </p>
          </div>
        )}

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

        {diagnosticAssets.length > 0 && (
          <div className="mb-6 rounded-lg border border-teal-500/30 bg-slate-800/80 p-4">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="flex items-center text-lg font-bold text-white">
                <ImageIcon className="mr-2 h-5 w-5 text-teal-300" />
                Engine Diagnostic Visuals
              </h2>
              <span className="w-fit rounded-full border border-teal-500/40 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-teal-200">
                {diagnosticAssets.length} Ready
              </span>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {diagnosticAssets.map((asset) => {
                const isIncluded = inlineUrlSet.has(asset.url);
                return (
                  <div key={asset.key} className="rounded-md border border-slate-700 bg-slate-900 p-3">
                    <div className="mb-3 h-44 overflow-hidden rounded-md bg-slate-950">
                      <img src={asset.url} alt={`${article.title} ${asset.label}`} className="h-full w-full object-contain" />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm font-semibold text-slate-200">{asset.label}</span>
                      <button
                        onClick={() => addAssetToInlineImages(asset.url)}
                        disabled={isIncluded}
                        className="inline-flex items-center rounded-md bg-slate-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-600 disabled:cursor-not-allowed disabled:bg-emerald-700/50 disabled:text-emerald-100"
                      >
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        {isIncluded ? "Included" : "Add"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

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

        {activeTab === "cards" && (
          <div className="mb-12 space-y-8">
            <div className="rounded-lg border border-red-500/30 bg-slate-800 p-6">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-2xl">
                  <h2 className="text-2xl font-bold text-white">Greybrainer Template Cards</h2>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Upload one contextual movie image. The card pack then uses the review headline, 50-word verdict,
                    layer scores, three-ring visual, Morphokinetics graph, and public website URL.
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3">
                    <label className="inline-flex cursor-pointer items-center rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600">
                      {uploadingAsset ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      Upload Movie Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        disabled={uploadingAsset}
                        onChange={(event) => {
                          const file = event.target.files?.[0];
                          if (file) void handleUploadImage(file, "gb-card-context");
                          event.currentTarget.value = "";
                        }}
                      />
                    </label>
                    <button
                      onClick={handleGenerateAllGbCards}
                      disabled={generatingGbCard !== null}
                      className="inline-flex items-center rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-500 disabled:bg-red-900"
                    >
                      {generatingGbCard ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                      Make Draft in GB Template
                    </button>
                  </div>
                </div>

                <div className="w-full max-w-sm rounded-lg border border-slate-700 bg-slate-900 p-3">
                  <div className="aspect-[4/5] overflow-hidden rounded-md bg-slate-950">
                    {gbCardImageSource ? (
                      <img src={gbCardImageSource} alt="Movie card source" className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full items-center justify-center px-6 text-center text-sm text-slate-500">
                        Upload a movie screenshot, poster crop, or contextual still.
                      </div>
                    )}
                  </div>
                  <p className="mt-3 text-xs text-slate-500">
                    Generated cards ready: {generatedCardCount}/{GB_CARD_DEFS.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {GB_CARD_DEFS.map((card) => {
                const generatedUrl = gbCardUrls[card.type];
                const isGenerating = generatingGbCard === card.type || generatingGbCard === "all";
                return (
                  <div key={card.type} className="rounded-lg border border-slate-700 bg-slate-800 p-5">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{card.label}</h3>
                        <p className="mt-1 text-sm text-slate-400">{card.description}</p>
                      </div>
                      <button
                        onClick={() => void handleGenerateGbCard(card.type)}
                        disabled={generatingGbCard !== null}
                        className="inline-flex shrink-0 items-center rounded-md bg-slate-700 px-3 py-2 text-xs font-semibold text-white transition hover:bg-slate-600 disabled:opacity-60"
                      >
                        {isGenerating ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <Wand2 className="mr-1.5 h-3.5 w-3.5" />}
                        Generate
                      </button>
                    </div>

                    <div className="overflow-hidden rounded-md border border-slate-700 bg-slate-950">
                      {generatedUrl ? (
                        <img src={generatedUrl} alt={`${card.label} preview`} className="aspect-[4/5] h-auto w-full object-cover" />
                      ) : (
                        <div
                          className="relative aspect-[4/5] overflow-hidden bg-slate-950 p-7"
                          style={{
                            backgroundImage: gbCardImageSource
                              ? `linear-gradient(180deg, rgba(2, 6, 23, 0.45), rgba(2, 6, 23, 0.95)), url("${gbCardImageSource}")`
                              : "linear-gradient(135deg, #020617, #111827 55%, #450a0a)",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                              <p className="text-xl font-black tracking-wide text-red-500">GREYBRAINER</p>
                              <p className="mt-1 text-xs font-bold uppercase tracking-[0.28em] text-slate-300">Movie Analysis</p>
                            </div>
                            <div>
                              <p className="mb-3 w-fit rounded bg-red-600 px-3 py-1 text-xs font-black uppercase tracking-wide text-white">
                                {card.type === "hero" ? "Three-Layer Review" : card.type === "rings" ? "Three-Layer Score" : card.type === "morpho" ? "Morphokinetics" : "Verdict"}
                              </p>
                              <p className="text-4xl font-black leading-tight text-white">{plainText(titleForSocial, 86)}</p>
                              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-200">
                                {card.type === "rings"
                                  ? scoreRows.join(" | ") || "Layer scores will appear here."
                                  : card.type === "morpho"
                                    ? morphoLine
                                    : card.type === "verdict"
                                      ? socialVerdict
                                      : `Overall score: ${overallScore || "GB"}`}
                              </p>
                            </div>
                            <p className="text-sm font-bold text-slate-200">movies.greybrain.in</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      {generatedUrl && (
                        <>
                          <a
                            href={generatedUrl}
                            download={`${slugify(article.title)}-${card.type}-gb-card.png`}
                            className="inline-flex items-center rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                          >
                            <Download className="mr-1.5 h-3.5 w-3.5" />
                            Download
                          </a>
                          <button
                            onClick={() => copyToClipboard(generatedUrl, `gb-card-${card.type}`)}
                            className="inline-flex items-center rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                          >
                            {copiedChannel === `gb-card-${card.type}` ? <Check className="mr-1.5 h-3.5 w-3.5 text-green-400" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                            {copiedChannel === `gb-card-${card.type}` ? "Copied" : "Copy URL"}
                          </button>
                          <button
                            onClick={() => addAssetToInlineImages(generatedUrl)}
                            disabled={inlineUrlSet.has(generatedUrl)}
                            className="inline-flex items-center rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white disabled:opacity-50"
                          >
                            <Plus className="mr-1.5 h-3.5 w-3.5" />
                            {inlineUrlSet.has(generatedUrl) ? "In Article" : "Add to Article"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "social" && (
          <div className="mb-12 space-y-8">
            <div className="rounded-lg border border-red-500/30 bg-slate-800 p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">Channel Preview & Approval</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
                    Review how each post will appear, approve the channels, then publish the approved pack through the connected publisher.
                    Website publishing should happen first so every social link opens the live article.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      article.status === "published" ? "bg-emerald-500/15 text-emerald-300" : "bg-amber-500/15 text-amber-300"
                    }`}>
                      {article.status === "published" ? "Site link live" : "Publish site first"}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300">
                      {approvedSocialCount}/{socialPreviewChannels.length} approved
                    </span>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                      publisherUrl.trim() ? "bg-emerald-500/15 text-emerald-300" : "bg-slate-900 text-slate-400"
                    }`}>
                      {publisherUrl.trim() ? "Publisher connected" : "Manual-ready until connected"}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 xl:justify-end">
                  <button
                    onClick={() => setAllSocialApprovals(true)}
                    className="inline-flex items-center rounded-md bg-slate-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-600"
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve All
                  </button>
                  <button
                    onClick={() => setAllSocialApprovals(false)}
                    className="inline-flex items-center rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setShowPublisherSettings((current) => !current)}
                    className="inline-flex items-center rounded-md border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Publisher Setup
                  </button>
                  <button
                    onClick={handlePublishApprovedSocial}
                    disabled={publishingSocial || approvedSocialCount === 0}
                    className="inline-flex items-center rounded-md bg-red-600 px-5 py-2 text-sm font-bold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-900"
                  >
                    {publishingSocial ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    Publish Approved
                  </button>
                </div>
              </div>

              {showPublisherSettings && (
                <div className="mt-6 grid grid-cols-1 gap-4 rounded-lg border border-slate-700 bg-slate-900 p-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Publisher endpoint
                    </label>
                    <input
                      value={publisherUrl}
                      onChange={handlePublisherUrlChange}
                      placeholder="https://your-publisher-worker.example.com/publish"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-400">
                      API key / token
                    </label>
                    <input
                      type="password"
                      value={publisherToken}
                      onChange={handlePublisherTokenChange}
                      placeholder="Optional if endpoint does not need it"
                      className="w-full rounded-md border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                  </div>
                  <p className="text-xs leading-5 text-slate-500 lg:col-span-2">
                    This endpoint receives the approved channel JSON. Your tech person can connect it to Postiz, Publer, Minopa, a Cloudflare Worker, or a custom publisher.
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              {socialPreviewChannels.map((preview) => {
                const approved = Boolean(approvedSocialChannels[preview.channel]);
                return (
                  <div key={preview.channel} className={`rounded-lg border p-5 transition ${
                    approved ? "border-emerald-500/50 bg-emerald-950/20" : "border-slate-700 bg-slate-800"
                  }`}>
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white">{preview.label}</h3>
                        <a
                          href={preview.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center text-sm text-slate-400 transition hover:text-white"
                        >
                          {preview.profileLabel}
                          <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                        </a>
                      </div>
                      <button
                        onClick={() => toggleSocialApproval(preview.channel)}
                        className={`inline-flex shrink-0 items-center rounded-md px-3 py-2 text-xs font-bold transition ${
                          approved
                            ? "bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30"
                            : "bg-slate-700 text-slate-200 hover:bg-slate-600"
                        }`}
                      >
                        {approved ? <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" /> : <Eye className="mr-1.5 h-3.5 w-3.5" />}
                        {approved ? "Approved" : "Approve"}
                      </button>
                    </div>

                    <div className="rounded-lg border border-slate-700 bg-slate-950 p-4">
                      <div className="mb-3 flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-600 text-sm font-black text-white">
                            GB
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">Greybrainer</p>
                            <p className="text-xs text-slate-500">{preview.format}</p>
                          </div>
                        </div>
                        <Smartphone className="h-4 w-4 text-slate-500" />
                      </div>

                      {preview.assetUrl ? (
                        <div className="mb-4 overflow-hidden rounded-md border border-slate-800 bg-slate-900">
                          <img src={preview.assetUrl} alt={`${preview.label} selected social asset`} className="aspect-[4/5] h-auto w-full object-cover" />
                        </div>
                      ) : (
                        <div className="mb-4 flex aspect-[4/5] items-center justify-center rounded-md border border-dashed border-slate-700 bg-slate-900 px-6 text-center text-sm text-slate-500">
                          Generate GB Cards or upload a cover image before publishing this channel.
                        </div>
                      )}

                      <div className="max-h-64 overflow-y-auto whitespace-pre-wrap rounded-md bg-slate-900 p-4 text-sm leading-6 text-slate-300">
                        {preview.text}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span>{preview.text.length} characters</span>
                        <span>•</span>
                        <span>{preview.assetLabel}</span>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-3">
                      <button
                        onClick={() => copyToClipboard(preview.text, `preview-${preview.channel}`)}
                        className="inline-flex items-center rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                      >
                        {copiedChannel === `preview-${preview.channel}` ? <Check className="mr-1.5 h-3.5 w-3.5 text-green-400" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                        {copiedChannel === `preview-${preview.channel}` ? "Copied" : "Copy Text"}
                      </button>
                      <button
                        onClick={() => copyToClipboard(preview.trackedUrl, `preview-link-${preview.channel}`)}
                        className="inline-flex items-center rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                      >
                        {copiedChannel === `preview-link-${preview.channel}` ? <Check className="mr-1.5 h-3.5 w-3.5 text-green-400" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
                        {copiedChannel === `preview-link-${preview.channel}` ? "Copied" : "Copy Link"}
                      </button>
                      {preview.assetUrl && (
                        <a
                          href={preview.assetUrl}
                          download={`${slugify(article.title)}-${preview.channel}-social.png`}
                          className="inline-flex items-center rounded-md border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
                        >
                          <Download className="mr-1.5 h-3.5 w-3.5" />
                          Download Image
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="rounded-lg border border-amber-500/30 bg-amber-950/20 p-4">
              <div className="flex gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
                <p className="text-sm leading-6 text-amber-100/90">
                  The Publish Approved button needs a publisher endpoint before it can post directly. Without that, the writer can still approve,
                  copy text, download the selected image, and post manually with no editing skill required.
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold text-white">Manual Publishing Pack</h2>
              <p className="mb-5 text-sm text-slate-400">
                Backup copy blocks for the team. These remain useful even after automated publishing is connected.
              </p>
            </div>
            {socialOutputs.map(({ channel, label, text }) => (
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
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-white">Three-Layer Concentric Rings</h3>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <button
                    onClick={() => article.images?.rings && addAssetToInlineImages(article.images.rings)}
                    disabled={!article.images?.rings || inlineUrlSet.has(article.images.rings)}
                    className="flex items-center text-sm text-slate-400 hover:text-white disabled:opacity-50 transition"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {article.images?.rings && inlineUrlSet.has(article.images.rings) ? "Included in Article Visuals" : "Add to Article Visuals"}
                  </button>
                  <button
                    onClick={() => article.images?.rings && handleDownloadAsset(article.images.rings, `${slugify(article.title)}_concentric_rings.png`)}
                    disabled={!article.images?.rings}
                    className="flex items-center text-sm text-slate-400 hover:text-white disabled:opacity-50 transition"
                  >
                    Download PNG
                  </button>
                </div>
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
              <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-white">Morphokinetics Flow</h3>
                <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                  <button
                    onClick={() => article.images?.morpho && addAssetToInlineImages(article.images.morpho)}
                    disabled={!article.images?.morpho || inlineUrlSet.has(article.images.morpho)}
                    className="flex items-center text-sm text-slate-400 hover:text-white disabled:opacity-50 transition"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    {article.images?.morpho && inlineUrlSet.has(article.images.morpho) ? "Included in Article Visuals" : "Add to Article Visuals"}
                  </button>
                  <button
                    onClick={() => article.images?.morpho && handleDownloadAsset(article.images.morpho, `${slugify(article.title)}_morphokinetics.png`)}
                    disabled={!article.images?.morpho}
                    className="flex items-center text-sm text-slate-400 hover:text-white disabled:opacity-50 transition"
                  >
                    Download PNG
                  </button>
                </div>
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
