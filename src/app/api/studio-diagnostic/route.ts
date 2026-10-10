import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ error: "Lead listing is not publicly available." }, { status: 403 });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid enquiry." }, { status: 400 });
  }
  const email = body && typeof body === "object" && "email" in body ? body.email : null;
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return NextResponse.json({ error: "Please provide a valid work email." }, { status: 400 });
  }

  const token = process.env.STUDIO_ENQUIRY_TOKEN;
  const url = process.env.STUDIO_ENQUIRY_URL;
  const failure = () => NextResponse.json({ success: false, error: "Save could not be confirmed. Retry or email dr.satish@greybrain.ai directly." }, { status: 503 });
  if (!token || !url) return failure();
  const input = body as Record<string, unknown>;
  const requestId = input.requestId;
  if (typeof requestId !== "string" || !/^[a-f0-9-]{36}$/i.test(requestId)) {
    return NextResponse.json({ error: "Invalid enquiry receipt key." }, { status: 400 });
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, "Idempotency-Key": requestId },
      body: JSON.stringify({ email: email.trim().toLowerCase(), studioName: input.studioName, serviceInterest: input.serviceInterest }),
      signal: AbortSignal.timeout(8000),
      cache: "no-store",
    });
    if (!response.ok) return failure();
    const receipt = await response.json();
    if (receipt.success !== true || receipt.receiptId !== requestId) return failure();
    return NextResponse.json({ success: true, receiptId: requestId });
  } catch {
    return failure();
  }
}
