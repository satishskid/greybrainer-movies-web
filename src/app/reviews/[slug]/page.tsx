import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ReviewArticle } from "./ReviewArticle";
import { getAllArticles, getArticleBySlug } from "@/lib/articles";
import type { SiteArticle } from "@/lib/articleTypes";
import { absoluteUrl, SITE_BRAND, SITE_DESCRIPTION, SITE_NAME, toPlainText } from "@/lib/site";

interface Props {
  params: Promise<{ slug: string }>;
}

export const revalidate = 900;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Not Found | Greybrainer" };
  const title = article.seoTitle || `${article.title} Review`;
  const description = article.seoDescription || article.verdict || article.excerpt || SITE_DESCRIPTION;
  const canonical = `/reviews/${article.slug}`;
  const images = articleImageUrls(article);

  return {
    title,
    description,
    keywords: article.tags,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: absoluteUrl(canonical),
      images,
      type: "article",
      publishedTime: article.publishedAt || undefined,
      authors: [article.createdBy || SITE_BRAND],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images,
    },
  };
}

export default async function ReviewPage({ params }: Props) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const articles = await getAllArticles();
  const relatedArticles = getRelatedArticles(article, articles);
  const jsonLd = buildArticleJsonLd(article, relatedArticles);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <ReviewArticle article={article} relatedArticles={relatedArticles} />
    </>
  );
}

function getRelatedArticles(article: SiteArticle, articles: SiteArticle[]) {
  const bySlug = new Map(articles.map((item) => [item.slug, item]));
  const selected = article.relatedSlugs
    .map((relatedSlug) => bySlug.get(relatedSlug))
    .filter((item): item is SiteArticle => item !== undefined && item.slug !== article.slug);

  if (selected.length >= 3) return selected.slice(0, 3);

  const fallback = articles
    .filter((item) => item.slug !== article.slug && item.kind === article.kind)
    .slice(0, 3 - selected.length);

  return [...selected, ...fallback].slice(0, 3);
}

function articleImageUrls(article: SiteArticle) {
  return [
    article.coverImageUrl,
    ...article.diagnosticImages.map((image) => image.url),
    ...article.inlineImageUrls,
  ].filter((url): url is string => Boolean(url));
}

function parseRating(score?: string) {
  if (!score) return null;
  const match = score.match(/\d+(?:\.\d+)?/);
  if (!match) return null;
  const value = Number(match[0]);
  if (!Number.isFinite(value)) return null;
  return value > 10 ? value / 10 : value;
}

function buildArticleJsonLd(article: SiteArticle, relatedArticles: SiteArticle[]) {
  const canonicalUrl = absoluteUrl(`/reviews/${article.slug}`);
  const description = article.seoDescription || article.verdict || article.excerpt;
  const rating = parseRating(article.overallScore);
  const publishedDate = article.publishedAt || new Date().toISOString();
  const articleType = article.kind === "review" ? "Review" : "Article";
  const mainEntity = {
    "@type": articleType,
    "@id": `${canonicalUrl}#article`,
    headline: article.searchHeadline || article.title,
    name: article.title,
    description: toPlainText(description || SITE_DESCRIPTION, 240),
    image: articleImageUrls(article),
    datePublished: publishedDate,
    dateModified: publishedDate,
    author: {
      "@type": "Organization",
      name: article.createdBy || SITE_BRAND,
    },
    publisher: {
      "@id": `${absoluteUrl("/")}#organization`,
    },
    mainEntityOfPage: {
      "@id": `${canonicalUrl}#webpage`,
    },
    keywords: article.tags,
    ...(article.kind === "review"
      ? {
          itemReviewed: {
            "@type": "CreativeWork",
            name: article.title,
          },
          ...(rating
            ? {
                reviewRating: {
                  "@type": "Rating",
                  ratingValue: rating,
                  bestRating: 10,
                  worstRating: 0,
                },
              }
            : {}),
        }
      : {}),
  };

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${absoluteUrl("/")}#organization`,
        name: SITE_BRAND,
        url: absoluteUrl("/"),
        sameAs: [
          "https://medium.com/@GreyBrainer",
          "https://www.linkedin.com/company/greybrainer/",
          "https://x.com/Greybrainlens",
          "https://www.instagram.com/greybrainlens/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${absoluteUrl("/")}#website`,
        name: SITE_NAME,
        url: absoluteUrl("/"),
        publisher: { "@id": `${absoluteUrl("/")}#organization` },
      },
      {
        "@type": "WebPage",
        "@id": `${canonicalUrl}#webpage`,
        url: canonicalUrl,
        name: article.seoTitle || article.title,
        description: toPlainText(description || SITE_DESCRIPTION, 240),
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${canonicalUrl}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Reviews", item: absoluteUrl("/reviews") },
          { "@type": "ListItem", position: 3, name: article.title, item: canonicalUrl },
        ],
      },
      mainEntity,
      ...(article.faqs.length
        ? [
            {
              "@type": "FAQPage",
              "@id": `${canonicalUrl}#faq`,
              mainEntity: article.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: toPlainText(faq.answer),
                },
              })),
            },
          ]
        : []),
      ...(relatedArticles.length
        ? [
            {
              "@type": "ItemList",
              "@id": `${canonicalUrl}#related`,
              name: "Related Greybrainer articles",
              itemListElement: relatedArticles.map((item, index) => ({
                "@type": "ListItem",
                position: index + 1,
                name: item.title,
                url: absoluteUrl(`/reviews/${item.slug}`),
              })),
            },
          ]
        : []),
    ],
  };
}
