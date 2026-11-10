import { NextResponse } from "next/server";
import { VERIFIED_CHANNELS } from "@/components/AudienceProofBar";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      channels: VERIFIED_CHANNELS.map((ch) => ({
        id: ch.id,
        label: ch.label,
        handle: ch.displayHandle,
        url: ch.url,
        description: ch.description,
        status: "active",
      })),
      countsVerified: false,
      note: "Follower counts are not fabricated. Live third-party follower metrics are pending direct provider API integration; displayed channels are verified active publication destinations.",
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
      },
    }
  );
}
