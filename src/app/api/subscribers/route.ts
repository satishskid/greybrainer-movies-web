import { NextResponse } from "next/server";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email, persona, source } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const subscriber = {
      email: email.trim().toLowerCase(),
      persona: persona || "General / Executive",
      subscribedAt: new Date().toISOString(),
      source: source || "IntelligenceWireNudge",
      active: true,
    };

    try {
      // Use email as doc ID to prevent duplicates
      const safeId = email.trim().toLowerCase().replace(/[^a-zA-Z0-9_-]/g, "_");
      const writePromise = setDoc(doc(db, "subscribers", safeId), subscriber, { merge: true });
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Firestore write timeout")), 2000)
      );
      await Promise.race([writePromise, timeoutPromise]);
    } catch (dbError) {
      console.warn("Could not write subscriber to Firestore in time:", dbError);
    }

    return NextResponse.json({
      success: true,
      message: "Subscribed to the Greybrainer Intelligence Wire.",
    });
  } catch (error: any) {
    console.error("Subscriber API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error." },
      { status: 500 }
    );
  }
}
