import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ReviewArticle } from "./ReviewArticle";
import { getArticleBySlug } from "@/lib/articles";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 900;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not Found | Greybrainer" };
  return {
    title: `${article.title} | Greybrainer Movies`,
    description: article.excerpt,
    openGraph: {
      title: `${article.title} — Greybrainer Movies`,
      description: article.excerpt,
      images: article.coverImageUrl ? [article.coverImageUrl] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} — Greybrainer`,
      description: article.excerpt,
      images: article.coverImageUrl ? [article.coverImageUrl] : [],
    },
  };
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ReviewArticle article={article} />;
}
