import { NextResponse } from "next/server";
import { getHubRole } from "@/lib/hubRoles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDdWuwH2BAz9nSWVLXyC2uE8qoxl5QU3lY";
const MAX_CHANNELS = 8;
const MAX_TEXT_LENGTH = 8000;

interface FirebaseLookupResponse {
  users?: Array<{
    email?: string;
    disabled?: boolean;
  }>;
}

interface ApprovedChannel {
  channel?: string;
  label?: string;
  text?: string;
  assetUrl?: string;
  trackedUrl?: string;
  format?: string;
}

interface SocialPublishRequest {
  articleId?: string;
  title?: string;
  liveUrl?: string;
  publisherUrl?: string;
  publisherToken?: string;
  channels?: ApprovedChannel[];
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

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function publisherEndpoint(value?: string) {
  const configured = text(value) || text(process.env.SOCIAL_PUBLISHER_WEBHOOK_URL);
  if (!configured) return "";

  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" && url.protocol !== "http:") return "";
    return url.toString();
  } catch {
    return "";
  }
}

function cleanChannels(channels: ApprovedChannel[] | undefined) {
  return (channels || [])
    .slice(0, MAX_CHANNELS)
    .map((channel) => ({
      channel: text(channel.channel),
      label: text(channel.label),
      text: text(channel.text).slice(0, MAX_TEXT_LENGTH),
      assetUrl: text(channel.assetUrl),
      trackedUrl: text(channel.trackedUrl),
      format: text(channel.format),
    }))
    .filter((channel) => channel.channel && channel.text);
}

async function readPublisherBody(response: Response) {
  const raw = await response.text();
  if (!raw) return null;

  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return raw.slice(0, 1000);
  }
}

export async function POST(request: Request) {
  const token = getBearerToken(request);
  if (!token) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }

  const email = await getEmailFromFirebaseToken(token);
  if (!email || !getHubRole(email)) {
    return NextResponse.json({ error: "This account is not allowed to publish social posts." }, { status: 403 });
  }

  let payload: SocialPublishRequest;
  try {
    payload = (await request.json()) as SocialPublishRequest;
  } catch {
    return NextResponse.json({ error: "Invalid social publish payload." }, { status: 400 });
  }

  const endpoint = publisherEndpoint(payload.publisherUrl);
  if (!endpoint) {
    return NextResponse.json(
      { error: "Connect a valid publisher endpoint before automated social publishing." },
      { status: 400 },
    );
  }

  const channels = cleanChannels(payload.channels);
  if (!channels.length) {
    return NextResponse.json({ error: "Approve at least one channel before publishing." }, { status: 400 });
  }

  const publisherToken = text(payload.publisherToken) || text(process.env.SOCIAL_PUBLISHER_API_KEY);
  const publisherResponse = await fetch(endpoint, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...(publisherToken ? { authorization: `Bearer ${publisherToken}` } : {}),
    },
    body: JSON.stringify({
      source: "greybrainer-writer-hub",
      requestedBy: email,
      articleId: text(payload.articleId),
      title: text(payload.title),
      liveUrl: text(payload.liveUrl),
      channels,
    }),
  });
  const publisherBody = await readPublisherBody(publisherResponse);

  if (!publisherResponse.ok) {
    return NextResponse.json(
      {
        error: "Publisher endpoint rejected the request.",
        status: publisherResponse.status,
        publisherBody,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    accepted: true,
    status: publisherResponse.status,
    channelCount: channels.length,
    publisherBody,
  });
}
