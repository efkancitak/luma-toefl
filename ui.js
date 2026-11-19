// Shared, side-effect-free view helpers.

export const e = (value = "") => String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const paths = {
  home: "M3 10 12 3l9 7M5 9v12h5v-7h4v7h5V9",
  book: "M12 5v15M3 4c4-1 6 0 9 2 3-2 5-3 9-2v15c-4-1-6 0-9 2-3-2-5-3-9-2Z",
  play: "m9 5 11 7-11 7ZM4 5v14",
  cards: "M8 3h12v15H8ZM4 7v14h12",
  chart: "M4 20h17M6 16v-5M12 16V5M18 16V9",
  settings: "M4 7h16M4 17h16M14 4.5v5M9 14.5v5",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 14h10l1-14M10 11v6M14 11v6",
  arrow: "M4 12h16m-6-6 6 6-6 6",
  back: "M20 12H4m6-6-6 6 6 6",
  headphones: "M4 14v-3a8 8 0 0 1 16 0v3M4 12H2v7h5v-7ZM20 12h2v7h-5v-7Z",
  pen: "m14 4 6 6M4 20l5-1L21 7l-6-6L3 13Z",
  mic: "M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0ZM5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8",
  check: "m5 12 4 4L19 6",
  close: "M6 6l12 12M18 6 6 18",
  sound: "m3 9 5 0 5-5v16l-5-5H3ZM17 8a6 6 0 0 1 0 8M20 5a10 10 0 0 1 0 14",
  clock: "M12 7v5l4 2M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0",
  leaf: "M20 3C6 1 1 10 6 17c7 5 16 0 14-14ZM4 21 15 10",
  search: "M20 20l-5-5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0",
  download: "M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4",
  external: "M14 3h7v7M21 3 11 13M10 5H3v16h16v-7",
  stop: "M6 6h12v12H6Z",
  user: "M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0M4 22v-3a8 8 0 0 1 16 0v3",
  speech: "M4 5h16v11H9l-5 4Z M8 9h8M8 12h5",
  layers: "m12 3 9 5-9 5-9-5ZM3 13l9 5 9-5",
  copy: "M8 8h12v12H8ZM4 16V4h12",
  star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9Z",
  repeat: "M17 2l4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 0 1-3 3H3",
};
export const icon = (name) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name] || paths.book}"/></svg>`;

export const SKILLS = {
  reading: { name: "Reading", tr: "Okuma", icon: "book" },
  listening: { name: "Listening", tr: "Dinleme", icon: "headphones" },
  writing: { name: "Writing", tr: "Yazma", icon: "pen" },
  speaking: { name: "Speaking", tr: "Konuşma", icon: "mic" },
};
export const LEVELS = ["A1", "A2", "B1", "B2", "C1", "C2"];

export function head(title, subtitle, action = "") {
  return `<div class="page-head"><div><h1>${title}</h1><p>${subtitle}</p></div>${action}</div>`;
}

/** "A1–B1" contains "A2"? Level labels are editorial ranges. */
export function levelInRange(range, level) {
  if (level === "all") return true;
  const parts = String(range).split(/[–-]/).map((part) => part.trim());
  const from = LEVELS.indexOf(parts[0]);
  const to = LEVELS.indexOf(parts[parts.length - 1]);
  const target = LEVELS.indexOf(level);
  return target >= from && target <= to;
}

export function dateLabel(value, options = { day: "numeric", month: "long", year: "numeric" }) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("tr-TR", options);
}
export function shortDate(iso) {
  return new Date(iso).toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
}
export function formatTime(seconds) {
  const sec = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}
export function countWords(text = "") {
  return String(text || "").trim().split(/\s+/).filter(Boolean).length;
}

/** TTS-safe text: strips stress capitals, arrows, chunk bars and notes in parentheses. */
export function speakable(text) {
  const plain = String(text).replace(/\(.*?\)/g, " ").replace(/[|↗↘·…]/g, " ").replace(/\s+/g, " ").trim();
  return /[A-Z]{2,}/.test(plain) ? plain.toLowerCase() : plain;
}

export function dictionaryUrl(word) {
  const clean = speakable(word).toLowerCase().replace(/[^a-z' -]/g, "").trim();
  return `https://dictionary.cambridge.org/dictionary/english/${encodeURIComponent(clean)}`;
}

/** Highlighted word diff for a dictation comparison result. */
export function dictationDiff(result) {
  const parts = result.ops.map((op) => {
    if (op.type === "match") return `<span class="w w-match">${e(op.expected)}</span>`;
    if (op.type === "missing") return `<span class="w w-missing" title="Eksik">${e(op.expected)}</span>`;
    if (op.type === "extra") return `<span class="w w-extra" title="Eklenen">+${e(op.heard)}</span>`;
    return `<span class="w w-changed" title="Değişen"><s>${e(op.expected)}</s> ${e(op.heard)}</span>`;
  });
  const details = [
    result.missing.length ? `Eksik: ${result.missing.map(e).join(", ")}` : "",
    result.extra.length ? `Eklenen: ${result.extra.map(e).join(", ")}` : "",
    result.changed.length ? `Değişen: ${result.changed.map((c) => `${e(c.expected)} → ${e(c.heard)}`).join(", ")}` : "",
  ].filter(Boolean);
  return `<div class="diff-box"><p class="diff-score"><strong>${result.matched}/${result.total}</strong> kelime eşleşti <span class="badge">dikte eşleşmesi</span></p><p class="diff-words" lang="en">${parts.join(" ")}</p>${details.length ? `<p class="small">${details.join(" · ")}</p>` : '<p class="small">Eksik, eklenen veya değişen kelime yok.</p>'}<p class="small muted">Dikte tanıma hatası telaffuz hatası sayılmaz. Bu sonuç telaffuz puanı değildir ve başka ölçümlerle birleştirilmez.</p></div>`;
}

export function legend() {
  return '<p class="small muted diff-legend"><span class="w w-match">eşleşen</span> <span class="w w-missing">eksik</span> <span class="w w-extra">+eklenen</span> <span class="w w-changed"><s>hedef</s> duyulan</span></p>';
}
