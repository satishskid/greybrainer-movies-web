import { NextResponse } from "next/server";
import { getHubRole } from "@/lib/hubRoles";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FIREBASE_API_KEY =
  process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDdWuwH2BAz9nSWVLXyC2uE8qoxl5QU3lY";
const DEFAULT_WORKER_API_BASE =
  "https://greybrainer-omnichannel-api.satish-9f4.workers.dev/api";
const MAX_IMAGE_BYTES = 12 * 1024 * 1024;

interface FirebaseLookupResponse {
  users?: Array<{
    email?: string;
    disabled?: boolean;
  }>;
}

interface R2UploadResponse {
  key?: string;
  url?: string;
  contentType?: string | null;
  size?: number;
  error?: string;
}

function getWorkerApiBaseUrl() {
  const configured =
    process.env.OMNICHANNEL_API_BASE_URL ||
    process.env.NEXT_PUBLIC_OMNICHANNEL_API_BASE_URL ||
    DEFAULT_WORKER_API_BASE;
  return configured.replace(/\/$/, "");
}

function getWorkerUploadToken() {
  return process.env.OMNICHANNEL_UPLOAD_TOKEN || process.env.ASSET_UPLOAD_TOKEN || "";
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

async function readWorkerResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};

  try {
    return JSON.parse(text) as R2UploadResponse;
  } catch {
    return { error: text };
  }
}

export async function POST(request: Request) {
  try {
    const token = getBearerToken(request);
    if (!token) {
      return NextResponse.json({ error: "Sign in required." }, { status: 401 });
    }

    const email = await getEmailFromFirebaseToken(token);
    if (!email || !getHubRole(email)) {
      return NextResponse.json({ error: "This account is not allowed to upload assets." }, { status: 403 });
    }

    const formData = await request.formData();
    const draftId = String(formData.get("draftId") ?? "").trim();
    const kind = String(formData.get("kind") ?? "asset").trim() || "asset";
    const file = formData.get("file");

    if (!draftId) {
      return NextResponse.json({ error: "draftId is required." }, { status: 400 });
    }

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Image file is required." }, { status: 400 });
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Only image uploads are supported." }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_BYTES) {
      return NextResponse.json({ error: "Image size exceeds 12MB limit." }, { status: 400 });
    }

    const workerFormData = new FormData();
    workerFormData.append("draftId", draftId);
    workerFormData.append("kind", kind);
    workerFormData.append("file", file, file.name || "asset");
    const uploadToken = getWorkerUploadToken();

    if (!uploadToken) {
      return NextResponse.json({ error: "R2 upload token is not configured." }, { status: 500 });
    }

    const response = await fetch(`${getWorkerApiBaseUrl()}/assets/upload`, {
      method: "POST",
      headers: { authorization: `Bearer ${uploadToken}` },
      body: workerFormData,
    });
    const payload = await readWorkerResponse(response);

    if (!response.ok || !payload.url) {
      return NextResponse.json(
        { error: payload.error || "R2 upload failed." },
        { status: response.ok ? 502 : response.status },
      );
    }

    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    console.error("R2 upload failed:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected image upload failure." },
      { status: 500 },
    );
  }
}
