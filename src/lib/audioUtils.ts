function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

function encodeWAV(samples: Float32Array, sampleRate: number): Blob {
  const dataLen = samples.length * 2;
  const buffer = new ArrayBuffer(44 + dataLen);
  const view = new DataView(buffer);

  writeString(view, 0, "RIFF");
  view.setUint32(4, 36 + dataLen, true);
  writeString(view, 8, "WAVE");
  writeString(view, 12, "fmt ");
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);  // PCM
  view.setUint16(22, 1, true);  // mono
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeString(view, 36, "data");
  view.setUint32(40, dataLen, true);

  let offset = 44;
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    offset += 2;
  }

  return new Blob([buffer], { type: "audio/wav" });
}

// Extract up to maxSeconds of audio from a video file, resampled to 16 kHz mono
// (optimal for Whisper transcription)
export async function extractAudioWav(
  file: File,
  maxSeconds = 300
): Promise<Blob | null> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const audioCtx = new AudioContext();

    let decoded: AudioBuffer;
    try {
      decoded = await audioCtx.decodeAudioData(arrayBuffer);
    } finally {
      await audioCtx.close();
    }

    const targetRate = 16_000;
    const sourceSamples = Math.min(
      decoded.length,
      Math.round(maxSeconds * decoded.sampleRate)
    );
    const targetLength = Math.ceil((sourceSamples / decoded.sampleRate) * targetRate);

    const offline = new OfflineAudioContext(1, targetLength, targetRate);

    // Mix all channels into mono in a temp buffer at original rate
    const mono = new AudioContext({ sampleRate: decoded.sampleRate });
    const tmpBuf = mono.createBuffer(1, sourceSamples, decoded.sampleRate);
    const out = tmpBuf.getChannelData(0);
    const nCh = decoded.numberOfChannels;
    for (let c = 0; c < nCh; c++) {
      const ch = decoded.getChannelData(c);
      for (let i = 0; i < sourceSamples; i++) out[i] += ch[i] / nCh;
    }
    await mono.close();

    // Resample via OfflineAudioContext
    const resampledBuf = offline.createBuffer(1, sourceSamples, decoded.sampleRate);
    resampledBuf.copyToChannel(out, 0);
    const src = offline.createBufferSource();
    src.buffer = resampledBuf;
    src.connect(offline.destination);
    src.start();

    const rendered = await offline.startRendering();
    return encodeWAV(rendered.getChannelData(0), targetRate);
  } catch {
    return null;
  }
}

export async function transcribeRush(audioBlob: Blob): Promise<string> {
  const form = new FormData();
  form.append("audio", audioBlob, "audio.wav");

  const res = await fetch("/api/video/transcribe", {
    method: "POST",
    body: form,
  });

  if (!res.ok) return "";
  const json = await res.json();
  return (json.transcript as string) ?? "";
}
