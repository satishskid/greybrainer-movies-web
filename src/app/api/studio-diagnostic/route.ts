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

  // Never acknowledge delivery without a durable destination and receipt.
  return NextResponse.json({
    success: false,
    error: "Your enquiry has not been sent. Please email dr.satish@greybrain.ai directly.",
  }, { status: 503 });
}
