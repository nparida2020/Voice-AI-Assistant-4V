import Groq from "groq-sdk";
import { NextResponse } from "next/server";
import { Buffer } from "buffer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return new NextResponse("Missing text", { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not set");
    }

    const groq = new Groq({ apiKey });

    // ✅ UPDATED MODEL
    const tts = await groq.audio.speech.create({
      model: "canopylabs/orpheus-v1-english",
      voice:"troy",
      input: text,
      response_format:"wav"
    });

    const audioBuffer = await tts.arrayBuffer();
    const audioBase64 = Buffer.from(audioBuffer).toString("base64");

    if (!audioBase64) {
      throw new Error("TTS API returned empty audio data.");
    }

    return new NextResponse(audioBase64, {
      headers: { "Content-Type": "text/plain" },
    });

  } catch (error) {
    console.error("Speak API Error:", error);
    return new NextResponse("Failed to generate audio (500).", { status: 500 });
  }
}