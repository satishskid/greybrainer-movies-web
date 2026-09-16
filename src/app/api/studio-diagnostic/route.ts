import { NextResponse } from "next/server";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

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
