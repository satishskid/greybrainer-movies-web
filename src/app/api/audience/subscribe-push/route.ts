import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      error: "Push subscription status inspection is not available publicly.",
    },
    { status: 403 }
  );
}

export async function POST() {
  // Push subscription storage is not currently bound on the storefront edge.
  // We strictly fail closed with 501 Not Implemented rather than returning a synthetic success receipt.
  return NextResponse.json(
    {
      success: false,
      status: "unsupported",
      error: "Durable push subscription storage is not bound on the storefront edge. No subscription was stored. Please follow our active channels on X, LinkedIn, Instagram, or Facebook.",
    },
    { status: 501 }
  );
}
