import { NextResponse } from "next/server";
import { getAllArticles, isArticleKind, slugify } from "@/lib/articles";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const kind = searchParams.get("kind");
  const limitParam = Number(searchParams.get("limit") ?? "80");
  const limit = Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 220) : 80;

  const allArticles = await getAllArticles(220);
  const filtered = isArticleKind(kind) ? allArticles.filter((article) => article.kind === kind) : allArticles;
  const counts = allArticles.reduce(
    (acc, article) => {
      acc[article.kind] += 1;
      return acc;
    },
    { review: 0, brief: 0, insight: 0, comparison: 0 },
  );

  return NextResponse.json(
    {
      articles: filtered.slice(0, limit),
      counts,
      total: filtered.length,
    },
    { headers: corsHeaders() }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      slug,
      kind = "brief",
      type = "daily_brief",
      content,
      editorial,
      excerpt,
      coverImageUrl,
      createdBy = "Greybrainer AI",
      tags = [],
      storyScore,
      conceptScore,
      executionScore,
      overallScore,
      morphokineticsTeaser,
    } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content required." },
        { status: 400, headers: corsHeaders() }
      );
    }

    const docSlug = slug || slugify(title);
    const docData = {
      title,
      slug: docSlug,
      kind,
      type,
      status: "published",
      content,
      editorial: editorial || content,
      excerpt: excerpt || content.slice(0, 200),
      coverImageUrl:
        coverImageUrl ||
        (kind === "review"
          ? "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1400&q=80"
          : "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1400&q=80"),
      createdBy,
      publishedAt: new Date().toISOString(),
      publishedAtMs: Date.now(),
      createdAt: new Date().toISOString(),
      tags,
      storyScore: storyScore || null,
      conceptScore: conceptScore || null,
      executionScore: executionScore || null,
      overallScore: overallScore || null,
      morphokineticsTeaser: morphokineticsTeaser || null,
    };

    const docRef = await addDoc(collection(db, "published_research"), docData);

    return NextResponse.json(
      {
        success: true,
        id: docRef.id,
        slug: docSlug,
        url: `https://movies.greybrain.in/reviews/${docSlug}`,
      },
      { headers: corsHeaders() }
    );
  } catch (error: any) {
    console.error("Error creating article:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to publish article" },
      { status: 500, headers: corsHeaders() }
    );
  }
}
