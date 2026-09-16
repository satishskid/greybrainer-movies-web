import { NextResponse } from "next/server";
import { addDoc, collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders() });
}

export async function GET(request: Request) {
  try {
    const snap = await getDocs(
      query(collection(db, "studio_leads"), orderBy("createdAt", "desc"), limit(25))
    );
    const leads = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ leads }, { headers: corsHeaders() });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message || "Failed to load leads" }, { status: 500, headers: corsHeaders() });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      email,
      contactName,
      studioName,
      role,
      phone,
      serviceInterest,
      projectStage,
      type = "vip_registration",
    } = body;

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid work email." }, { status: 400 });
    }

    const prospectRecord = {
      email: email.trim().toLowerCase(),
      contactName: contactName || "Studio Decision Maker",
      studioName: studioName || "Studio / Independent",
      role: role || "Creative Executive / Producer",
      phone: phone || null,
      serviceInterest: serviceInterest || "Screenplay Diagnostic & Pacing Audit",
      projectStage: projectStage || "Pre-Greenlight Development",
      type, // 'vip_registration' | 'nda_request' | 'inquiry'
      status: "new",
      createdAt: new Date().toISOString(),
      source: "movies.greybrain.in/studio-desk",
    };

    // Store in Firestore studio_leads with fallback
    try {
      const writePromise = addDoc(collection(db, "studio_leads"), prospectRecord);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timeout")), 2000)
      );
      await Promise.race([writePromise, timeoutPromise]);
    } catch (dbError) {
      console.warn("Could not save to Firestore in time:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Executive VIP registration received. Our editorial desk will be in touch.",
      record: prospectRecord,
    });
  } catch (error: any) {
    console.error("Error processing studio lead:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
