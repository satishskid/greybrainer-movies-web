import { NextResponse } from "next/server";
import { GoogleGenAI } from '@google/genai';

export async function POST(request: Request) {
  try {
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: "No content provided" }, { status: 400 });
    }

    const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Gemini API key is not configured" }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
You are a top-tier YouTube film essayist. I will provide you with a raw, detailed AI movie analysis in Markdown.
Your task is to convert this analysis into a compelling, 1-2 minute conversational voiceover script for a faceless YouTube video.

IMPORTANT RULES:
1. Make it sound natural, authoritative, and engaging.
2. The tone should be like a premium video essay (think Nerdwriter or Lessons from the Screenplay).
3. Do NOT include any stage directions, brackets, or visuals notes in the text. ONLY output the words the narrator will say.
4. Keep the total word count around 200-250 words so it fits nicely in a short video.

Here is the raw analysis:
${content.substring(0, 3000)} // truncate to save tokens
`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
      }
    });

    if (!response.text) {
      throw new Error("Gemini returned an empty response");
    }

    return NextResponse.json({ script: response.text });
  } catch (error) {
    console.error("Error generating YouTube script:", error);
    return NextResponse.json({ error: "Failed to generate script" }, { status: 500 });
  }
}
