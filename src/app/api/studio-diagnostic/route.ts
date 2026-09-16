import { NextResponse } from "next/server";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studioName, contactName, email, phone, projectTitle, projectStage, primaryFocus, notes } = body;

    if (!studioName || !contactName || !email) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const leadRecord = {
      studioName,
      contactName,
      email,
      phone: phone || null,
      projectTitle: projectTitle || null,
      projectStage: projectStage || "Screenplay in Development",
      primaryFocus: primaryFocus || "7-Layer Comprehensive Review",
      notes: notes || null,
      createdAt: new Date().toISOString(),
      status: "new",
      source: "movies.greybrain.in",
    };

    // Store in Firestore studio_leads collection with timeout protection
    try {
      const writePromise = addDoc(collection(db, "studio_leads"), leadRecord);
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timeout")), 2000)
      );
      await Promise.race([writePromise, timeoutPromise]);
    } catch (dbError) {
      console.warn("Could not save to Firestore in time, logging lead locally:", leadRecord, dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Studio diagnostic request received. Our team will reach out within 12 hours.",
      lead: leadRecord,
    });
  } catch (error: any) {
    console.error("Error processing studio diagnostic lead:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
