import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ReviewArticle } from "./ReviewArticle";

interface Props {
  params: Promise<{ slug: string }>;
}

async function getArticleBySlug(slug: string) {
  const q = query(
    collection(db, "published_research"),
    where("slug", "==", slug),
    where("status", "==", "published")
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return { id: doc.id, ...doc.data() } as any;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not Found | Greybrainer" };
  return {
    title: `${article.title} | Greybrainer Deep Review`,
    description: `AI-powered cinematic analysis of ${article.title} using the Greybrainer Methodology. Comprehensive three-layer evaluation.`,
    openGraph: {
      title: `${article.title} — Greybrainer Deep Review`,
      description: `Comprehensive three-layer film analysis of ${article.title}.`,
      images: article.coverImageUrl ? [article.coverImageUrl] : [],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${article.title} — Greybrainer`,
      description: `AI-powered cinematic analysis of ${article.title}.`,
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
