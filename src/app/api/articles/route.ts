import { NextResponse } from "next/server";
import { getAllArticles, isArticleKind } from "@/lib/articles";

export const dynamic = "force-dynamic";

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

  return NextResponse.json({
    articles: filtered.slice(0, limit),
    counts,
    total: filtered.length,
  });
}
