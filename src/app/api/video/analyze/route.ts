import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

interface RushInput {
  name: string;
  duration: number;
  frames: string[];       // base64 data URLs
  transcript?: string;    // Whisper transcription (optional)
}

interface ClipSegment {
  rushIndex: number;
  rushName: string;
  start: number;
  end: number;
  description: string;
}

interface EditPlan {
  title: string;
  synopsis: string;
  totalDuration: number;
  clips: ClipSegment[];
  editingNotes: string;
}

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { rushes, style }: { rushes: RushInput[]; style: string } = body;

    if (!rushes || rushes.length === 0) {
      return NextResponse.json({ error: "No rushes provided" }, { status: 400 });
    }

    const client = new Anthropic({ apiKey });
    const contentBlocks: Anthropic.MessageParam["content"] = [];

    const hasTranscripts = rushes.some((r) => r.transcript && r.transcript.trim());

    contentBlocks.push({
      type: "text",
      text: `Tu es un monteur vidéo professionnel expert. Tu reçois ${rushes.length} rush(es) brut(s) à monter.

Style de montage demandé : ${style || "Dynamique et engageant"}
${hasTranscripts ? "Tu disposes également de la transcription audio de chaque rush (générée par Whisper)." : ""}

Rushes disponibles :
${rushes
  .map((r, i) => {
    const lines = [`Rush ${i + 1} : "${r.name}" — durée: ${r.duration.toFixed(1)}s — ${r.frames.length} frames analysées`];
    if (r.transcript?.trim()) {
      lines.push(`  Transcription audio : "${r.transcript.trim().slice(0, 600)}${r.transcript.length > 600 ? "…" : ""}"`);
    }
    return lines.join("\n");
  })
  .join("\n")}

Analyse maintenant les frames visuelles et les transcriptions, puis génère un plan de montage.`,
    });

    // Add frames for each rush
    for (let i = 0; i < rushes.length; i++) {
      const rush = rushes[i];
      contentBlocks.push({
        type: "text",
        text: `\n--- Rush ${i + 1} : "${rush.name}" (${rush.duration.toFixed(1)}s) ---`,
      });

      for (let j = 0; j < rush.frames.length; j++) {
        const frameData = rush.frames[j];
        const base64 = frameData.replace(/^data:image\/\w+;base64,/, "");
        contentBlocks.push({
          type: "image",
          source: { type: "base64", media_type: "image/jpeg", data: base64 },
        } as Anthropic.ImageBlockParam);
        const t = (j / Math.max(rush.frames.length - 1, 1)) * rush.duration;
        contentBlocks.push({
          type: "text",
          text: `Frame ${j + 1}/${rush.frames.length} (à ${t.toFixed(1)}s)`,
        });
      }
    }

    contentBlocks.push({
      type: "text",
      text: `Génère UNIQUEMENT un JSON valide (sans markdown, sans texte avant ou après) :
{
  "title": "Titre créatif de la vidéo montée",
  "synopsis": "Description en 2-3 phrases du résultat final",
  "totalDuration": <durée totale estimée en secondes>,
  "clips": [
    {
      "rushIndex": <index 0-based>,
      "rushName": "<nom>",
      "start": <début en secondes>,
      "end": <fin en secondes>,
      "description": "<ce qui se passe>"
    }
  ],
  "editingNotes": "Notes : transitions suggérées, rythme, ambiance sonore"
}

Règles :
- Sélectionne les meilleurs moments (visuel ET audio si transcription disponible)
- Max 8s par clip recommandé pour rythme dynamique
- Les timestamps doivent rester dans la durée de chaque rush
- Tu peux utiliser plusieurs clips du même rush
- Utilise la transcription pour identifier les dialogues ou moments clés`,
    });

    const message = await client.messages.create({
      model: "claude-opus-4-7",
      max_tokens: 2048,
      messages: [{ role: "user", content: contentBlocks }],
    });

    const rawText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let plan: EditPlan;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      plan = JSON.parse(jsonMatch ? jsonMatch[0] : rawText);
    } catch {
      return NextResponse.json(
        { error: "Failed to parse Claude response", raw: rawText },
        { status: 500 }
      );
    }

    return NextResponse.json({ plan });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
