// Device TTS and microphone recording, shared by practice, speaking sets and
// pronunciation lessons. Recordings stay on the device (IndexedDB).

import { saveRecording, getRecording } from "./storage.js";

const SPEAKER_LABELS = /(?:Student|Staff member|Lab assistant|Librarian|Professor|Woman|Man):\s*/;

export function ttsSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Novelty and robotic system voices that some devices list first among English voices.
const NOVELTY_VOICES = /^(albert|bad news|bahh|bells|boing|bubbles|cellos|deranged|good news|hysterical|jester|organ|pipe organ|superstar|trinoids|whisper|wobble|zarvox|fred|junior|kathy|ralph|princess|eddy|flo|grandma|grandpa|reed|rocko|sandy|shelley)\b/i;
let preferredVoice = "";

/** Remembers the learner's chosen device voice (by name); empty = automatic choice. */
export function setPreferredVoice(name) {
  preferredVoice = typeof name === "string" ? name : "";
}

export function voiceScore(voice) {
  let score = 0;
  if (/^en[-_]US/i.test(voice.lang)) score += 3;
  else if (/^en[-_]GB/i.test(voice.lang)) score += 1;
  if (/premium|enhanced|siri|natural/i.test(voice.name)) score += 4;
  if (voice.localService) score += 2; // works offline
  if (voice.default) score += 1;
  if (NOVELTY_VOICES.test(voice.name)) score -= 20;
  return score;
}

/** English device voices, best first; the chosen voice (if still installed) leads. */
export function englishVoices() {
  const voices = globalThis.speechSynthesis?.getVoices?.() ?? [];
  return voices
    .filter((voice) => /^en[-_]/i.test(voice.lang))
    .map((voice, index) => ({ voice, index, score: voiceScore(voice) + (voice.name === preferredVoice ? 100 : 0) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((entry) => entry.voice);
}

export function listVoices() {
  return englishVoices().map((voice) => ({ name: voice.name, lang: voice.lang, local: !!voice.localService, novelty: NOVELTY_VOICES.test(voice.name) }));
}

export function cancelSpeech() {
  globalThis.speechSynthesis?.cancel();
}

/**
 * Speaks English text. Resolves when speech ends, or after an estimated
 * duration if the browser never fires `end` (seen on some mobile engines).
 */
export function speak(text, { rate = 1, onError } = {}) {
  if (!ttsSupported()) {
    onError?.("Bu tarayıcı sesli okuma sunmuyor. Metinle çalışmaya devam edebilirsin.");
    return Promise.resolve(false);
  }
  speechSynthesis.cancel();
  const voices = englishVoices();
  // Dialogues alternate between the two best voices; novelty voices are never cast.
  const natural = voices.filter((voice) => !NOVELTY_VOICES.test(voice.name)).slice(0, 2);
  const cast = natural.length ? natural : voices.slice(0, 1);
  const parts = String(text).split(SPEAKER_LABELS).filter((part) => part.trim());
  const words = String(text).split(/\s+/).length;
  const estimate = (words / 2.6 / rate + 1.5 * parts.length) * 1000;
  return new Promise((resolve) => {
    let done = false;
    const finish = (ok = true) => { if (!done) { done = true; clearTimeout(timer); resolve(ok); } };
    const timer = setTimeout(() => finish(true), estimate + 2500);
    parts.forEach((part, index) => {
      const utterance = new SpeechSynthesisUtterance(part);
      const voice = cast.length ? cast[index % cast.length] : null;
      utterance.lang = voice?.lang || "en-US";
      utterance.rate = rate;
      utterance.voice = voice;
      utterance.onerror = (event) => {
        if (!["interrupted", "canceled"].includes(event.error)) onError?.("Ses başlatılamadı. İngilizce cihaz sesini kontrol et.");
        finish(false);
      };
      if (index === parts.length - 1) utterance.onend = () => finish(true);
      speechSynthesis.speak(utterance);
    });
  });
}

/** Speaks chunks one by one with a short pause (shadowing aid). */
export async function speakChunks(chunks, { rate = 0.9, pause = 700, onError } = {}) {
  for (const chunk of chunks) {
    const ok = await speak(chunk, { rate, onError });
    if (!ok) return;
    await new Promise((resolve) => setTimeout(resolve, pause));
  }
}

// ── Recording ──────────────────────────────────────────────────────────────

const rec = { recorder: null, stream: null, timeout: null, saving: false, pending: false, id: null, startedAt: 0, maxMs: 0, ticket: 0 };
let micReady = false;

function micErrorMessage(error) {
  return error?.name === "NotAllowedError"
    ? "Mikrofon izni verilmedi. Safari site ayarlarından izin verebilir ya da dikte ve metinle devam edebilirsin."
    : "Mikrofon açılamadı. Başka bir uygulamanın mikrofonu kullanmadığını kontrol et.";
}

/**
 * Asks for microphone permission ahead of a timed response window, so the
 * permission dialog never eats the window. Opens and closes the stream at once.
 */
export async function prepareMic() {
  if (micReady) return { ok: true };
  if (!micSupported()) return { ok: false, message: "Bu tarayıcıda ses kaydı yok; sesli söyleyip dikteyle kontrol edebilirsin." };
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    micReady = true;
    return { ok: true };
  } catch (error) {
    return { ok: false, message: micErrorMessage(error) };
  }
}

export function micSupported() {
  return !!(navigator.mediaDevices?.getUserMedia && window.MediaRecorder);
}

export function recorderStatus() {
  return { active: !!rec.recorder, saving: rec.saving, pending: rec.pending, id: rec.id, startedAt: rec.startedAt, maxMs: rec.maxMs };
}

export function isBusy() {
  return !!rec.recorder || rec.saving || rec.pending;
}

/**
 * Starts a recording saved under `id`. Calls onSaved(id) after the blob is in
 * IndexedDB, onError(message) for permission/device problems.
 */
export async function startRecording({ id, itemId, maxSeconds = 90, onStart, onSaved, onError, onDone }) {
  if (isBusy()) return false;
  if (!micSupported()) {
    onError?.("Ses kaydı için HTTPS ve desteklenen bir tarayıcı gerekli. Sesli söyleyip dikte veya notla devam edebilirsin.");
    return false;
  }
  let stream;
  const ticket = ++rec.ticket;
  try {
    rec.pending = true;
    stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    rec.pending = false;
    micReady = true;
    if (ticket !== rec.ticket) {
      // The response window closed (or the page changed) while permission was pending.
      stream.getTracks().forEach((track) => track.stop());
      onDone?.();
      return false;
    }
    const mime = ["audio/mp4", "audio/webm;codecs=opus", "audio/webm"].find((type) => MediaRecorder.isTypeSupported(type));
    const recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
    const chunks = [];
    Object.assign(rec, { recorder, stream, id, startedAt: Date.now(), maxMs: maxSeconds * 1000 });
    recorder.ondataavailable = (event) => { if (event.data.size) chunks.push(event.data); };
    recorder.onstop = async () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks, { type: recorder.mimeType || "audio/mp4" });
      try {
        if (!blob.size) throw new Error("empty");
        await saveRecording(id, itemId, blob);
        onSaved?.(id);
      } catch {
        onError?.("Ses kaydedilemedi. Depolama alanını kontrol et; dikte veya notla devam edebilirsin.");
      } finally {
        rec.saving = false;
        rec.id = null;
        onDone?.();
      }
    };
    recorder.start();
    rec.timeout = setTimeout(stopRecording, maxSeconds * 1000);
    onStart?.();
    return true;
  } catch (error) {
    rec.pending = false;
    stream?.getTracks().forEach((track) => track.stop());
    if (ticket === rec.ticket) onError?.(micErrorMessage(error));
    onDone?.();
    return false;
  }
}

export function stopRecording() {
  clearTimeout(rec.timeout);
  if (rec.pending) rec.ticket += 1; // cancel a start that is still waiting for permission
  const recorder = rec.recorder;
  rec.recorder = null;
  if (recorder && recorder.state !== "inactive") {
    rec.saving = true;
    recorder.stop();
  }
  rec.stream?.getTracks().forEach((track) => track.stop());
  rec.stream = null;
}

let player = null;
export function stopPlayback() {
  if (player) { player.pause(); URL.revokeObjectURL(player.src); player = null; }
}

/** Plays a saved recording; resolves when it ends. */
export async function playRecording(id) {
  stopPlayback();
  const record = await getRecording(id);
  if (!record) return false;
  const url = URL.createObjectURL(record.blob);
  player = new Audio(url);
  await new Promise((resolve) => {
    player.onended = resolve;
    player.onerror = resolve;
    player.play().catch(resolve);
  });
  stopPlayback();
  return true;
}

/** Model (TTS) then own recording, back to back — REQUIREMENTS "kayıt–model karşılaştırması". */
export async function modelThenRecording(text, id, { rate = 1, onError } = {}) {
  await speak(text, { rate, onError });
  await new Promise((resolve) => setTimeout(resolve, 400));
  const played = await playRecording(id);
  if (!played) onError?.("Bu kayıt bu cihazda bulunamadı.");
}
