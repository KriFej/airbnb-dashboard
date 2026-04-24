import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    // Graceful degradation — caller checks for empty transcript
    return NextResponse.json({ transcript: "" });
  }

  try {
    const form = await req.formData();
    const audio = form.get("audio") as File | null;

    if (!audio) {
      return NextResponse.json({ error: "No audio file" }, { status: 400 });
    }

    const groq = new Groq({ apiKey });

    const transcription = await groq.audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3",
      response_format: "text",
    });

    const transcript =
      typeof transcription === "string"
        ? transcription
        : (transcription as { text?: string }).text ?? "";

    return NextResponse.json({ transcript });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Transcription failed";
    console.error("[transcribe]", message);
    // Return empty so the caller can continue without transcript
    return NextResponse.json({ transcript: "" });
  }
}
