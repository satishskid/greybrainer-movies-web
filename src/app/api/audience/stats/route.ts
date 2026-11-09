import { NextResponse } from "next/server";
import { AUDIENCE_METRICS } from "@/components/AudienceProofBar";

export const dynamic = "force-dynamic";

export async function GET() {
  const total = AUDIENCE_METRICS.reduce((sum, item) => sum + item.count, 0);

  return NextResponse.json(
    {
      total,
      channels: AUDIENCE_METRICS,
      updatedAt: new Date().toISOString(),
    },
    {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=21600, stale-while-revalidate=86400",
      },
    }
  );
}
