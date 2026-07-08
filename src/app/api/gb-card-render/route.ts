import { NextResponse } from "next/server";
import sharp from "sharp";
import { getHubRole } from "@/lib/hubRoles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CardType = "hero" | "rings" | "morpho" | "verdict";

interface CardRenderRequest {
  cardType?: CardType;
  title?: string;
  subtitle?: string;
  verdict?: string;
  whoShouldWatch?: string;
  overallScore?: string;
  scoreRows?: string[];
  morphoLine?: string;
  producerLine?: string;
  liveUrl?: string;
  backgroundUrl?: string;
  ringsUrl?: string;
  morphoUrl?: string;
}

const WIDTH = 1080;
const HEIGHT = 1350;
const MAX_REMOTE_IMAGE_BYTES = 8 * 1024 * 1024;
const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDdWuwH2BAz9nSWVLXyC2uE8qoxl5QU3lY";

interface FirebaseLookupResponse {
  users?: Array<{
    email?: string;
    disabled?: boolean;
  }>;
}

function getBearerToken(request: Request) {
  const authorization = request.headers.get("authorization") || "";
  const match = authorization.match(/^Bearer\s+(.+)$/i);
  return match?.[1] || null;
}

async function getEmailFromFirebaseToken(idToken: string) {
  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ idToken }),
    },
  );

  if (!response.ok) return null;

  const body = (await response.json()) as FirebaseLookupResponse;
  const user = body.users?.[0];

  if (!user?.email || user.disabled) return null;
  return user.email;
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function text(value: unknown, fallback = "") {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function lines(value: string, maxChars: number, maxLines: number) {
  const words = value.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
  const output: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      output.push(current);
      current = word;
    } else {
      current = next;
    }

    if (output.length === maxLines) break;
  }

  if (current && output.length < maxLines) output.push(current);
  return output;
}

async function imageDataUri(url?: string) {
  if (!url) return "";

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";

    const response = await fetch(url);
    if (!response.ok) return "";

    const contentType = response.headers.get("content-type") || "image/png";
    if (!contentType.startsWith("image/")) return "";

    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length > MAX_REMOTE_IMAGE_BYTES) return "";

    return `data:${contentType};base64,${bytes.toString("base64")}`;
  } catch {
    return "";
  }
}

function backgroundLayer(backgroundDataUri: string) {
  if (!backgroundDataUri) {
    return `
      <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#baseGradient)" />
      <circle cx="880" cy="210" r="280" fill="#7f1d1d" opacity="0.28" />
      <circle cx="180" cy="1120" r="360" fill="#0f766e" opacity="0.22" />
    `;
  }

  return `
    <image href="${backgroundDataUri}" x="0" y="0" width="${WIDTH}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice" opacity="0.68" />
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#darkWash)" />
  `;
}

function brandHeader(kicker = "GREYBRAINER") {
  return `
    <text x="70" y="92" fill="#ff1018" font-family="Inter, Arial, sans-serif" font-size="42" font-weight="900" letter-spacing="1.5">${escapeXml(kicker)}</text>
    <text x="70" y="132" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700" letter-spacing="3">MOVIE ANALYSIS</text>
  `;
}

function footer(liveUrl: string) {
  return `
    <line x1="70" y1="1240" x2="1010" y2="1240" stroke="#334155" stroke-width="2" opacity="0.9" />
    <text x="70" y="1290" fill="#e2e8f0" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="800">movies.greybrain.in</text>
    <text x="1010" y="1290" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="18" font-weight="600" text-anchor="end">${escapeXml(liveUrl.replace(/^https?:\/\//, ""))}</text>
  `;
}

function titleBlock(title: string, y: number, size = 72, maxChars = 19, maxLines = 4) {
  return lines(title.toUpperCase(), maxChars, maxLines)
    .map((line, index) => (
      `<text x="70" y="${y + index * (size + 14)}" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="${size}" font-weight="900">${escapeXml(line)}</text>`
    ))
    .join("");
}

function bulletText(items: string[], x: number, y: number) {
  return items.slice(0, 4).map((item, index) => `
    <circle cx="${x}" cy="${y + index * 52 - 8}" r="6" fill="${index === 0 ? "#ef4444" : index === 1 ? "#14b8a6" : index === 2 ? "#f59e0b" : "#cbd5e1"}" />
    <text x="${x + 24}" y="${y + index * 52}" fill="#e2e8f0" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="700">${escapeXml(item)}</text>
  `).join("");
}

function fallbackRings() {
  return `
    <circle cx="540" cy="610" r="270" fill="none" stroke="#ef4444" stroke-width="26" opacity="0.95" />
    <circle cx="540" cy="610" r="190" fill="none" stroke="#14b8a6" stroke-width="24" opacity="0.95" />
    <circle cx="540" cy="610" r="112" fill="none" stroke="#f59e0b" stroke-width="22" opacity="0.95" />
    <text x="540" y="595" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="900" text-anchor="middle">THREE</text>
    <text x="540" y="635" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="900" text-anchor="middle">LAYERS</text>
  `;
}

function fallbackMorpho() {
  const points = "110,640 230,560 350,630 470,475 590,520 710,410 850,475 970,360";
  return `
    <polyline points="${points}" fill="none" stroke="#22d3ee" stroke-width="16" stroke-linecap="round" stroke-linejoin="round" />
    ${points.split(" ").map((point) => {
      const [cx, cy] = point.split(",");
      return `<circle cx="${cx}" cy="${cy}" r="16" fill="#0f172a" stroke="#f8fafc" stroke-width="6" />`;
    }).join("")}
  `;
}

function renderSvg(request: CardRenderRequest, backgroundDataUri: string, ringsDataUri: string, morphoDataUri: string) {
  const cardType = request.cardType || "hero";
  const title = text(request.title, "Greybrainer Review");
  const subtitle = text(request.subtitle, "Three-Layer Movie Analysis");
  const verdict = text(request.verdict, "A concise Greybrainer verdict will appear here after the writer prepares the website publish pack.");
  const whoShouldWatch = text(request.whoShouldWatch, "For viewers who want a sharper read on story signal, craft, and audience energy.");
  const overallScore = text(request.overallScore, "GB");
  const morphoLine = text(request.morphoLine, "Morphokinetics reads attention, tension, release, and emotional momentum without exposing the internal scoring model.");
  const producerLine = text(request.producerLine, "For producers and directors, this card surfaces where intent lands, craft amplifies it, and audience energy may shift.");
  const liveUrl = text(request.liveUrl, "movies.greybrain.in");
  const scoreRows = Array.isArray(request.scoreRows) && request.scoreRows.length
    ? request.scoreRows.filter(Boolean)
    : ["Story/Script: pending", "Concept: pending", "Execution: pending", "Overall: pending"];

  const defs = `
    <defs>
      <linearGradient id="baseGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#020617" />
        <stop offset="45%" stop-color="#111827" />
        <stop offset="100%" stop-color="#450a0a" />
      </linearGradient>
      <linearGradient id="darkWash" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#020617" stop-opacity="0.58" />
        <stop offset="52%" stop-color="#020617" stop-opacity="0.74" />
        <stop offset="100%" stop-color="#020617" stop-opacity="0.95" />
      </linearGradient>
      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="24" stdDeviation="20" flood-color="#000000" flood-opacity="0.45" />
      </filter>
    </defs>
  `;

  let body = "";
  if (cardType === "hero") {
    body = `
      ${brandHeader()}
      <rect x="70" y="210" width="460" height="58" rx="8" fill="#dc2626" />
      <text x="96" y="248" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="900" letter-spacing="1.6">${escapeXml(subtitle.toUpperCase())}</text>
      ${titleBlock(title, 395)}
      <rect x="70" y="930" width="320" height="150" rx="18" fill="#0f172a" opacity="0.9" stroke="#334155" />
      <text x="104" y="984" fill="#94a3b8" font-family="Inter, Arial, sans-serif" font-size="22" font-weight="800" letter-spacing="1.5">OVERALL SCORE</text>
      <text x="104" y="1058" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="70" font-weight="900">${escapeXml(overallScore)}</text>
    `;
  } else if (cardType === "rings") {
    body = `
      ${brandHeader()}
      <text x="70" y="250" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="60" font-weight="900">THREE-LAYER SCORE</text>
      <rect x="80" y="340" width="920" height="560" rx="28" fill="#020617" opacity="0.78" stroke="#334155" filter="url(#shadow)" />
      ${ringsDataUri
        ? `<image href="${ringsDataUri}" x="120" y="375" width="840" height="490" preserveAspectRatio="xMidYMid meet" />`
        : fallbackRings()}
      <rect x="90" y="950" width="900" height="190" rx="18" fill="#0f172a" opacity="0.88" stroke="#334155" />
      ${bulletText(scoreRows, 130, 1018)}
    `;
  } else if (cardType === "morpho") {
    body = `
      ${brandHeader()}
      <text x="70" y="250" fill="#ffffff" font-family="Inter, Arial, sans-serif" font-size="60" font-weight="900">MORPHOKINETICS</text>
      <text x="72" y="300" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="26" font-weight="700">How attention, tension and emotion move through the film</text>
      <rect x="70" y="375" width="940" height="430" rx="28" fill="#020617" opacity="0.8" stroke="#334155" filter="url(#shadow)" />
      ${morphoDataUri
        ? `<image href="${morphoDataUri}" x="100" y="405" width="880" height="370" preserveAspectRatio="xMidYMid meet" />`
        : fallbackMorpho()}
      <rect x="70" y="870" width="940" height="250" rx="20" fill="#0f172a" opacity="0.88" stroke="#334155" />
      ${lines(morphoLine, 44, 4).map((line, index) => (
        `<text x="110" y="${935 + index * 46}" fill="#e2e8f0" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(line)}</text>`
      )).join("")}
    `;
  } else {
    body = `
      ${brandHeader()}
      <text x="70" y="250" fill="#fb7185" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="900" letter-spacing="3">50-WORD VERDICT</text>
      <rect x="70" y="300" width="940" height="365" rx="26" fill="#0f172a" opacity="0.9" stroke="#334155" />
      ${lines(verdict, 43, 7).map((line, index) => (
        `<text x="110" y="${375 + index * 44}" fill="#f8fafc" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(line)}</text>`
      )).join("")}
      <text x="70" y="760" fill="#93c5fd" font-family="Inter, Arial, sans-serif" font-size="34" font-weight="900" letter-spacing="3">WHO SHOULD WATCH</text>
      <rect x="70" y="810" width="940" height="180" rx="22" fill="#020617" opacity="0.86" stroke="#334155" />
      ${lines(whoShouldWatch, 48, 3).map((line, index) => (
        `<text x="110" y="${875 + index * 44}" fill="#e2e8f0" font-family="Inter, Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(line)}</text>`
      )).join("")}
      <text x="70" y="1060" fill="#fbbf24" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="900" letter-spacing="2">PRODUCER / DIRECTOR SIGNAL</text>
      ${lines(producerLine, 52, 3).map((line, index) => (
        `<text x="70" y="${1115 + index * 38}" fill="#cbd5e1" font-family="Inter, Arial, sans-serif" font-size="25" font-weight="700">${escapeXml(line)}</text>`
      )).join("")}
    `;
  }

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      ${defs}
      ${backgroundLayer(backgroundDataUri)}
      <rect x="0" y="0" width="${WIDTH}" height="${HEIGHT}" fill="none" stroke="#111827" stroke-width="24" />
      ${body}
      ${footer(liveUrl)}
    </svg>
  `;
}

export async function POST(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const email = await getEmailFromFirebaseToken(token);
  if (!email || !getHubRole(email)) {
    return NextResponse.json({ error: "This account is not allowed to generate cards." }, { status: 403 });
  }

  try {
    const payload = (await request.json()) as CardRenderRequest;
    const [backgroundDataUri, ringsDataUri, morphoDataUri] = await Promise.all([
      imageDataUri(payload.backgroundUrl),
      imageDataUri(payload.ringsUrl),
      imageDataUri(payload.morphoUrl),
    ]);
    const svg = renderSvg(payload, backgroundDataUri, ringsDataUri, morphoDataUri);
    const png = await sharp(Buffer.from(svg)).png().toBuffer();
    const body = png.buffer.slice(png.byteOffset, png.byteOffset + png.byteLength) as ArrayBuffer;

    return new NextResponse(body, {
      headers: {
        "content-type": "image/png",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("GB card render failed:", error);
    return NextResponse.json({ error: "Could not render GB card." }, { status: 500 });
  }
}
