// Offline writing coach (v0.8): checks an email or discussion answer against the
// four things the TOEFL writing rubric looks at (task/content, social
// conventions, range, accuracy), finds mechanical mistakes it can fix with high
// confidence, and builds the "repeat" exercise (every second sentence blank).
// Pure functions, no DOM: tested in tests/v8.test.mjs.

const MISSPELLINGS = Object.freeze({
  intrested: "interested", intresting: "interesting", oppurtunity: "opportunity", oppurtunities: "opportunities", opportunaty: "opportunity",
  gratefull: "grateful", recieve: "receive", recieved: "received", beleive: "believe", belive: "believe", definately: "definitely",
  definatly: "definitely", wich: "which", untill: "until", alot: "a lot", becuase: "because", beacuse: "because", becasue: "because",
  accomodate: "accommodate", accomodation: "accommodation", tommorow: "tomorrow", tomorow: "tomorrow", adress: "address",
  goverment: "government", enviroment: "environment", seperate: "separate", seperately: "separately", occured: "occurred",
  sucess: "success", succesful: "successful", successfull: "successful", neccessary: "necessary", necesary: "necessary",
  responsability: "responsibility", wellcome: "welcome", acheive: "achieve", arguement: "argument", buisness: "business",
  calender: "calendar", collegue: "colleague", comming: "coming", commited: "committed", concious: "conscious", embarass: "embarrass",
  existance: "existence", familar: "familiar", finaly: "finally", foriegn: "foreign", freind: "friend", fourty: "forty",
  garantee: "guarantee", happend: "happened", immediatly: "immediately", independant: "independent", knowlege: "knowledge",
  libary: "library", maintainance: "maintenance", noticable: "noticeable", occassion: "occasion", posible: "possible",
  prefered: "preferred", proffesor: "professor", profesor: "professor", publically: "publicly", realy: "really", recomend: "recommend",
  reccomend: "recommend", refered: "referred", relevent: "relevant", remeber: "remember", resturant: "restaurant", schedual: "schedule",
  sincerly: "sincerely", sincerelly: "sincerely", studing: "studying", suprise: "surprise", truely: "truly", wether: "whether",
  writting: "writing", writen: "written", hopefuly: "hopefully", usefull: "useful", helpfull: "helpful", beautifull: "beautiful",
  carefull: "careful", wonderfull: "wonderful", thier: "their", teh: "the", becomming: "becoming", begining: "beginning",
  dissapoint: "disappoint", dissapointed: "disappointed", experiance: "experience", grammer: "grammar", informations: "information",
  advices: "advice", equipments: "equipment", homeworks: "homework", knowledges: "knowledge", furnitures: "furniture", feedbacks: "feedback",
  evidences: "evidence", researches: "research", oppinion: "opinion", appologize: "apologize", inconvinience: "inconvenience",
  convinient: "convenient", attatch: "attach", attatched: "attached", applicaton: "application", assigment: "assignment",
  dont: "don't", cant: "can't", doesnt: "doesn't", didnt: "didn't", isnt: "isn't", arent: "aren't", wasnt: "wasn't", werent: "weren't",
  couldnt: "couldn't", wouldnt: "wouldn't", shouldnt: "shouldn't", havent: "haven't", hasnt: "hasn't", im: "I'm", ive: "I've", thats: "that's",
});
const DAYS_MONTHS = /\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|april|june|july|august|september|october|november|december)\b/gu;
const UNCOUNTABLE = new Set(["informations", "advices", "equipments", "homeworks", "knowledges", "furnitures", "feedbacks", "evidences", "researches"]);

// [pattern, replacement, why] — frequent errors of Turkish speakers; each replacement is safe in context.
// -ing form of a verb: see → seeing, make → making, lie → lying, get → getting.
const DOUBLE_FINAL = new Set(["get", "put", "run", "sit", "stop", "plan", "begin", "chat", "shop", "swim", "set", "cut", "hit", "win", "forget", "admit", "prefer", "refer", "regret", "commit", "submit", "travel"]);
export function ingForm(verb) {
  const v = String(verb).toLowerCase();
  if (v === "be") return "being";
  if (/ie$/u.test(v)) return `${v.slice(0, -2)}ying`;
  if (/(ee|oe|ye)$/u.test(v)) return `${v}ing`;
  if (/[^aeiou]e$/u.test(v) || /[aiou]e$/u.test(v)) return `${v.slice(0, -1)}ing`;
  if (DOUBLE_FINAL.has(v)) return `${v}${v.at(-1)}ing`;
  return `${v}ing`;
}
const FORWARD_VERBS = "hear|see|meet|receive|work|talk|speak|visit|join|start|get|discuss|attend|study|come|go|have|take|make|write|read|learn|do|begin|welcome|help|share|continue|participate|volunteer|travel|chat";

// [pattern, replacement, why] — frequent errors of Turkish speakers; each replacement is safe in context.
const PHRASE_FIXES = [
  [/\bI am agree\b/gi, "I agree", "agree fiildir; am almaz."],
  [/\bI'm agree\b/gi, "I agree", "agree fiildir; am almaz."],
  [/\b(discuss(?:es|ed|ing)?) about\b/gi, "$1", "discuss edat almaz (talk about olur): we discussed the project."],
  [/\bexplain me\b/gi, "explain to me", "explain + to + kişi."],
  [/\baccording to me\b/gi, "in my opinion", "Görüş için in my opinion; according to başkasının görüşü içindir."],
  [new RegExp(`\\blook(s|ed|ing)? forward to (${FORWARD_VERBS})\\b`, "gi"), (_, end = "", verb) => `look${end} forward to ${ingForm(verb)}`, "look forward to + -ing: look forward to seeing you."],
  [/\bdespite of\b/gi, "despite", "despite edat almaz (in spite of olur)."],
  [/\bin nowadays\b/gi, "nowadays", "nowadays tek başına kullanılır."],
  [/\bfor example like\b/gi, "for example", "for example ile like birlikte kullanılmaz."],
  [/\bmake (?:a )?research\b/gi, "do research", "do research; research sayılamaz."],
  [/\bmore (better|worse|easier|harder|bigger|smaller|faster|cheaper|higher|lower)\b/gi, "$1", "more ile -er birlikte kullanılmaz."],
  [/\bthe most (best|worst)\b/gi, "the $1", "best/worst zaten üstünlük bildirir."],
  [/\bpeople is\b/gi, "people are", "people çoğuldur."],
  [/\bI am writing for (ask|asking|inform|informing|request|requesting)\b/gi, (_, verb) => `I am writing to ${verb.replace(/ing$/u, "").replace(/^ask$/u, "ask")}`, "Amaç: I am writing to + yalın fiil."],
  [/\bwill can\b/gi, "will be able to", "İki modal yan yana gelmez: will be able to."],
  [/\bI want that you\b/gi, "I would like you to", "want that değil: would like + kişi + to."],
  [/\bsuggest (me|him|her|us|them) to\b/gi, (_, who) => `suggest that ${({ me: "I", him: "he", her: "she", us: "we", them: "they" })[who.toLowerCase()]}`, "suggest + kişi + to kullanılmaz: suggest that + özne + yalın fiil."],
  [/\bdepend(s|ed|ing)? of\b/gi, "depend$1 on", "depend on."],
  [/\binterested about\b/gi, "interested in", "interested in."],
  // Only with a person: "married with two children" (evli ve iki çocuklu) is correct English.
  [/\bmarried with (him|her|them|me|you|us|a man|a woman|someone|somebody)\b/gi, "married to $1", "Biriyle evli: married to someone. (married with children = evli ve çocuklu, doğru.)"],
  [/\bsince (two|three|four|five|six|seven|eight|nine|ten|several|many|a few|\d+) (years|months|weeks|days|hours)(?: ago)?\b/gi, "for $1 $2", "Süre için for: for two years. Since bir başlangıç noktası ister: since 2023, since last year."],
  [/\b(although|even though)\b([^.!?;]*?),\s*but\b/gi, "$1$2,", "although ile but birlikte kullanılmaz."],
  [/\ba (hours?|honest|honestly|honou?r|honou?rs|honou?rable|heirs?|x-rays?)\b/gi, (m, word) => `${m[0] === "A" ? "An" : "an"} ${word}`, "Sesli harf sesiyle başlıyorsa an: an hour, an honour, an x-ray (eks-rey)."],
];
const A_AN_EXCEPTIONS = /^(uni|use|usu|uti|eu|one|once|ure|ura)/u;
const AN_EXCEPTIONS = /^(hour|honest|honor|honour|heir|herb)/u;
const ACRONYMS = new Set(["TOEFL", "USA", "UK", "CV", "PDF", "ID", "IT", "AI", "MBA", "GPA", "ETS", "NASA", "DNA", "OK", "TV", "PC", "IELTS", "SAT", "PM", "AM", "ASAP", "FAQ", "HR", "EU", "UN"]);
const SUBORDINATE = /^(if|when|whenever|although|though|even though|because|since|as|after|before|while|unless|once|until|whether)\b/iu;

export const LINKING_WORDS = Object.freeze(["however", "therefore", "moreover", "furthermore", "in addition", "on the other hand", "although", "even though", "whereas", "while", "despite", "for example", "for instance", "such as", "because", "since", "as a result", "consequently", "thus", "firstly", "secondly", "finally", "in conclusion", "overall", "for these reasons", "in my opinion", "personally", "admittedly", "in contrast", "similarly", "unless", "as long as", "otherwise", "instead", "that is why", "also", "besides", "in particular", "to sum up", "nevertheless", "but", "so", "yet", "if", "when", "while", "still", "rather than", "instead of", "as well as", "which means", "that said", "after", "before", "or"]);

const tidy = (text) => String(text ?? "").replace(/\r\n?/gu, "\n");
export function countWords(text) { return tidy(text).trim().split(/\s+/u).filter(Boolean).length; }

/** Sentences of a block of prose (abbreviations like Mr. and e.g. do not end a sentence). */
export function splitSentences(text) {
  const protectedText = tidy(text).replace(/\b(Mr|Mrs|Ms|Dr|Prof|St|e\.g|i\.e|etc|vs|a\.m|p\.m)\./giu, (m) => m.replace(/\./gu, "\u0000"));
  return protectedText.split(/(?<=[.!?])\s+(?=["'(]?[A-Za-z0-9])/u).map((s) => s.replace(/\u0000/gu, ".").trim()).filter(Boolean);
}

function isGreeting(line) { return /^(dear|hello|hi|to:|subject:|re:)\b/iu.test(line.trim()); }
function isClosing(line) { return /^(sincerely|best regards|kind regards|warm regards|regards|best wishes|yours sincerely|yours truly|best|thanks|thank you|many thanks)\s*,?\s*$/iu.test(line.trim()); }

function capitalize(word) { return word.charAt(0).toUpperCase() + word.slice(1); }

/**
 * Applies the high-confidence fixes. Returns { fixed, issues } where each issue is
 * { kind: "accuracy" | "convention", wrong, right, why }.
 */
export function autoFix(text, kind = "email") {
  let out = tidy(text);
  const issues = [];
  const note = (issue) => { if (!issues.some((x) => x.wrong === issue.wrong && x.right === issue.right)) issues.push(issue); };
  // rank: 1 grammar, 2 spelling and words, 3 capitals and conventions, 4 punctuation, 5 spacing (shown last).
  const apply = (pattern, replacement, why, issueKind = "accuracy", rank = 1) => {
    out = out.replace(pattern, (...args) => {
      const match = args[0];
      const replaced = typeof replacement === "function" ? replacement(...args) : match.replace(new RegExp(pattern.source, pattern.flags.replace("g", "")), replacement);
      if (replaced !== match) note({ kind: issueKind, wrong: match, right: replaced, why, rank });
      return replaced;
    });
  };
  // Spacing first, silently: it only changes what the reader sees, not the language.
  out = out.replace(/[ \t]{2,}/gu, " ").replace(/[ \t]+$/gmu, "");
  apply(/(\w+)[ \t]+([,.!?;:])(?=\s|$)/gu, "$1$2", "Noktalama işaretinden önce boşluk olmaz.", "accuracy", 5);
  apply(/([,;!?])(?=[A-Za-z])/gu, "$1 ", "Noktalama işaretinden sonra boşluk bırak.", "accuracy", 5);
  apply(/([a-z]{2,})\.([A-Z][a-z])/gu, "$1. $2", "Noktadan sonra boşluk bırak.", "accuracy", 5);
  // Spelling and uncountable nouns.
  apply(/\b[A-Za-z]+\b/gu, (word) => {
    const fix = MISSPELLINGS[word.toLowerCase()];
    if (!fix) return word;
    return word[0] === word[0].toUpperCase() && word[0] !== word[0].toLowerCase() ? capitalize(fix) : fix;
  }, "Yazım hatası.", "accuracy", 2);
  for (const issue of issues) if (UNCOUNTABLE.has(issue.wrong.toLowerCase())) issue.why = "Bu isim sayılamaz; -s almaz.";
  for (const [pattern, replacement, why] of PHRASE_FIXES) apply(pattern, replacement, why);
  apply(/\ba ([aeio][a-z]*)\b/gu, (match, word) => (A_AN_EXCEPTIONS.test(word) ? match : `an ${word}`), "Sesli harfle başlayan kelimeden önce an.");
  // Single letters keep "an" (an x-ray, an F, an MBA): their names start with a vowel sound.
  apply(/\ban ([bcdfgjklmnpqrstvwxyz][a-z]*)\b(?![-'’])/gu, (match, word) => (AN_EXCEPTIONS.test(word) || word.length === 1 ? match : `a ${word}`), "Ünsüzle başlayan kelimeden önce a.");
  apply(/\ban (unique|units?|unions?|university|universities|uniform|universal|usual|useful|users?|usage|utility|european|one|once)\b/gu, "a $1", "Kelime 'yu' sesiyle başlıyorsa a: a useful, a university.");
  apply(/\b(\w+)\s+\1\b/giu, (match, word) => (["that", "had"].includes(word.toLowerCase()) ? match : word), "Aynı kelime iki kez yazılmış.", "accuracy", 2);
  apply(/\bi\b(?!\.)/gu, "I", "Ben anlamındaki I her zaman büyük harfle yazılır.", "accuracy", 3);
  apply(/\bi'(m|ve|d|ll)\b/gu, "I'$1", "Ben anlamındaki I her zaman büyük harfle yazılır.", "accuracy", 3);
  apply(DAYS_MONTHS, (word) => capitalize(word), "Gün ve ay adları büyük harfle başlar.", "accuracy", 3);
  // A line written in capitals (DEAR MR CARTER, I AM WRITING …) → normal capitals.
  // A single all-caps word is left alone: STEM, CEO, GPS, UCLA, COVID are abbreviations.
  out = out.split("\n").map((line) => {
    const words = line.match(/[A-Za-z]{2,}/gu) ?? [];
    const caps = words.filter((w) => /^[A-Z]+$/u.test(w) && !ACRONYMS.has(w));
    if (words.length < 3 || caps.length / words.length < 0.6) return line;
    return line.replace(/\b[A-Z]{2,}\b\.?/gu, (match, offset, whole) => {
      const word = match.replace(".", "");
      if (ACRONYMS.has(word)) return match;
      // A title before a name: MR CARTER → Mr. Carter.
      if (["MR", "MRS", "MS", "DR"].includes(word) && /^ [A-Za-z]/u.test(whole.slice(offset + match.length))) {
        const title = `${capitalize(word.toLowerCase())}.`;
        note({ kind: "convention", wrong: word, right: title, why: "Unvan: Mr. / Ms. / Dr.", rank: 3 });
        return title;
      }
      const right = capitalize(word.toLowerCase()) + (match.endsWith(".") ? "." : "");
      note({ kind: "convention", wrong: word, right, why: "Satırı bütünüyle büyük harfle yazma; yalnız ilk harf büyük.", rank: 3 });
      return right;
    });
  }).join("\n");
  apply(/\b(MR|MRS|MS|DR)\b\.?(?= [A-Z])/gu, (word) => `${capitalize(word.replace(".", "").toLowerCase())}.`, "Unvan: Mr. / Ms. / Dr.", "convention", 3);
  if (kind === "email") apply(/\b(Mr|Mrs|Ms|Dr)\b(?!\.)/gu, "$1.", "ABD yazımında unvandan sonra nokta: Mr. / Ms. / Dr.", "convention", 3);
  // Sentence starts and line starts.
  out = out.split("\n").map((line) => {
    let fixedLine = line.replace(/^(\s*)([a-z])/u, (m, space, letter) => {
      note({ kind: "accuracy", wrong: line.trim().split(/\s+/u).slice(0, 3).join(" "), right: (space + letter.toUpperCase() + line.trimStart().slice(1)).trim().split(/\s+/u).slice(0, 3).join(" "), why: "Cümle ve satır büyük harfle başlar.", rank: 3 });
      return space + letter.toUpperCase();
    });
    fixedLine = fixedLine.replace(/([.!?])(\s+)([a-z])/gu, (m, mark, space, letter, offset, whole) => {
      const before = whole.slice(Math.max(0, offset - 4), offset + 1).toLowerCase();
      if (/(e\.g\.|i\.e\.|etc\.|a\.m\.|p\.m\.|vs\.)$/u.test(before)) return m;
      note({ kind: "accuracy", wrong: `${mark} ${letter}…`, right: `${mark} ${letter.toUpperCase()}…`, why: "Noktadan sonra yeni cümle büyük harfle başlar.", rank: 3 });
      return mark + space + letter.toUpperCase();
    });
    return fixedLine;
  }).join("\n");
  if (kind === "email") {
    out = out.replace(/^((?:Dear|Hello|Hi)[ \t][^\n,:;]+?)[ \t]*$/mu, (m, greeting) => { note({ kind: "convention", wrong: greeting, right: `${greeting},`, why: "Selamlamadan sonra virgül.", rank: 3 }); return `${greeting},`; });
    out = out.replace(/^(sincerely|best regards|kind regards|warm regards|regards|best wishes|yours sincerely|thank you|thanks)[ \t]*,?[ \t]*$/gimu, (m, closing) => {
      const right = `${capitalize(closing.toLowerCase())},`;
      if (right !== m.trim()) note({ kind: "convention", wrong: m.trim(), right, why: "Kapanış büyük harfle başlar ve virgülle biter.", rank: 3 });
      return right;
    });
  }
  // A prose line of four or more words without final punctuation.
  out = out.split("\n").map((line) => {
    const trimmed = line.trim();
    if (!trimmed || isGreeting(trimmed) || isClosing(trimmed) || countWords(trimmed) < 4 || /[.!?:,;]$/u.test(trimmed)) return line;
    // A question (Would it be possible …) ends with a question mark.
    const mark = /^(would|could|can|is|are|am|do|does|did|will|shall|should|may|have|has|what|where|when|why|how|who|which)\b/iu.test(splitSentences(trimmed).at(-1) ?? "") ? "?" : ".";
    note({ kind: "accuracy", wrong: `…${trimmed.split(/\s+/u).slice(-2).join(" ")}`, right: `…${trimmed.split(/\s+/u).slice(-2).join(" ")}${mark}`, why: mark === "?" ? "Soru cümlesi soru işaretiyle biter." : "Cümle noktalama işaretiyle biter.", rank: 4 });
    return `${line.replace(/\s+$/u, "")}${mark}`;
  }).join("\n");
  issues.sort((a, b) => (a.rank ?? 1) - (b.rank ?? 1));
  return { fixed: out, issues };
}

const has = (text, pattern) => pattern.test(text);
const lowerTokensOf = (text) => new Set(String(text).toLowerCase().match(/[a-z][a-z-]+/gu) ?? []);

/** Things a reader would flag but that need a person to rewrite (no auto-fix). */
function warnings(text, kind) {
  const list = [];
  const lower = text.toLowerCase();
  const prose = text.split("\n").filter((line) => line.trim() && !isGreeting(line) && !isClosing(line) && countWords(line) > 3).join(" ");
  for (const sentence of splitSentences(prose)) {
    const words = countWords(sentence);
    if (words > 35) list.push({ kind: "style", wrong: `${sentence.split(/\s+/u).slice(0, 6).join(" ")} …`, why: `Çok uzun cümle (${words} kelime). İkiye böl; uzun cümlede hata riski artar.` });
    if (!SUBORDINATE.test(sentence) && /,\s+(i|we|they|he|she|it|this|there)\s+(am|is|are|was|were|will|would|have|has|had|can|could|think|believe|want|need)\b/iu.test(sentence)) {
      list.push({ kind: "accuracy", wrong: `${sentence.split(/\s+/u).slice(0, 8).join(" ")} …`, why: "İki tam cümle yalnız virgülle bağlanmış olabilir (comma splice). Nokta koy ya da and / but / so / because ekle." });
    }
  }
  // he / she / it + a plain verb (She go → She goes). A warning, not a fix: "Does she go", "Let it go" are correct.
  const AUX_BEFORE = /\b(do|does|did|can|could|will|would|shall|should|may|might|must|let|lets|make|makes|made|help|helps|watch|see|saw|hear|heard|why|not|n't|to)\s*$/iu;
  const agreement = /\b(he|she|it)\s+(go|do|have|want|like|need|make|take|work|study|live|think|say|come|know|get|give|use|try|play|watch|teach|help|look|feel|seem|believe|prefer|agree|enjoy|spend|start|finish|walk|read|write|speak|leave|stay|become|mean|cost|depend|allow|provide|include|require|offer|show|support)\b/giu;
  for (const sentence of splitSentences(prose)) {
    for (const m of sentence.matchAll(agreement)) {
      const before = sentence.slice(0, m.index);
      if (AUX_BEFORE.test(before) || /\b(does|did|do|can|could|will|would|should|must|may|might)\b[^,.;!?]*$/iu.test(before) && /\?$/u.test(sentence)) continue;
      const verb = m[2].toLowerCase();
      const third = verb === "have" ? "has" : verb === "do" ? "does" : verb === "go" ? "goes" : /(s|sh|ch|x|z|o)$/u.test(verb) ? `${verb}es` : /[^aeiou]y$/u.test(verb) ? `${verb.slice(0, -1)}ies` : `${verb}s`;
      list.push({ kind: "accuracy", wrong: `${m[1]} ${m[2]}`, why: `Geniş zamanda he / she / it ile fiil -s alır: ${m[1]} ${third}. (Geçmiş zamansa ${m[1]} ${verb === "go" ? "went" : "…ed"}; does / can / will gibi bir yardımcı fiilden sonra yalın kalır.)` });
    }
  }
  if (kind === "email" && /\bi want\b/iu.test(text)) list.push({ kind: "convention", wrong: "I want …", why: "Rica ederken 'I want' sert duyulur: I would like to … / Could I …? / Would it be possible …?" });
  const contractions = lower.match(/\b(?:don't|can't|won't|isn't|aren't|doesn't|didn't|i'm|it's|i've|i'll|wouldn't|couldn't)\b/gu) ?? [];
  if (kind === "email" && contractions.length >= 2) list.push({ kind: "convention", wrong: contractions.slice(0, 3).join(", "), why: "Hocaya veya yetkiliye yazılan e-postada tam biçim daha güvenli: do not, cannot, I am." });
  const overused = [["very", "very çok tekrarlanmış; uygun yerde daha kesin bir sıfat seç (very important → essential). Zor kelime değil, doğru anlam önemli."], ["thing", "thing belirsizdir; ne olduğunu adlandır (issue, factor, problem)."], ["i think", "I think tekrarı: In my opinion, I believe, From my perspective ile çeşitlendir."], ["good", "good yerine daha kesin: helpful, effective, beneficial."]];
  for (const [word, why] of overused) {
    const count = (lower.match(new RegExp(`\\b${word}s?\\b`, "gu")) ?? []).length;
    if (count >= 3) list.push({ kind: "style", wrong: `${word} ×${count}`, why });
  }
  return list;
}

function linkersUsed(text) {
  const lower = ` ${text.toLowerCase().replace(/\s+/gu, " ")} `;
  return LINKING_WORDS.filter((linker) => new RegExp(`[^a-z]${linker.replace(/ /gu, "\\s")}[^a-z]`, "u").test(lower));
}

function structuresUsed(text) {
  const found = [];
  if (/\b(who|which|whose|where)\b/iu.test(text) || /\b\w+ that (is|are|was|were|has|have|can|will)\b/iu.test(text)) found.push("relative clause");
  if (/\b(if|unless|as long as)\b/iu.test(text)) found.push("koşul");
  if (/\b(is|are|was|were|be|been|being)\s+(\w+ed|made|done|given|taken|known|seen|held|built|written|shown|told|found)\b/iu.test(text)) found.push("passive");
  if (/\b(would|could|might|may|should)\b/iu.test(text)) found.push("modal");
  if (/\b(although|even though|whereas|while|despite)\b/iu.test(text)) found.push("karşıtlık yan cümlesi");
  if (/\b(have|has|had)\s+(\w+ed|been|made|done|seen|taken|given|known|written)\b/iu.test(text)) found.push("perfect");
  return found;
}

const EMAIL_CHECKS = [
  ["greeting", "Selamlama (Dear …,)", /^(dear|hello|hi)\b/imu],
  ["purpose", "Amaç cümlesi (I am writing to / about …)", /\b(i am writing|i'm writing|i write to|i would like to (ask|inform|request|let you know|propose|suggest|invite|apologi[sz]e|explain|share)|this (email|message) is (about|to)|thank you for (your|the)|i (suggest|propose|recommend)|i am (registered|contacting|a student|enrolled)|i have a question|i need to|i was (charged|unable|hoping))\b/iu],
  // A request, a proposal or an invitation: the email's communicative goal, not one fixed phrase.
  ["request", "Rica, öneri veya davet (Could you … / I would like to propose …)", /\b(could you|would you|would it be possible|i was wondering|i would (really )?appreciate|could i|may i|please|can you|i (would like to |want to )?(suggest|propose|recommend)|we could|it would be (great|helpful|wonderful)|i hope (you|we) (can|could|will)|would you consider|i would like to invite|let me know)\b/iu],
  ["thanks", "Teşekkür veya nazik kapanış (Thank you / I look forward to …)", /\b(thank you|thanks|appreciate|grateful|look(ing)? forward to|i hope to hear|i would be (happy|glad|grateful) to|please let me know)\b/iu],
  ["closing", "Kapanış (Best regards, / Sincerely, + ad)", /^(sincerely|best regards|kind regards|warm regards|regards|best wishes|yours sincerely|best)\s*,?\s*$/imu],
];
// An opinion can be stated in many ways; markers only make it likely, they are not required.
const OPINION = /\b(i think|i believe|in my opinion|in my view|i agree|i disagree|personally|from my perspective|i would argue|i strongly|i expect|i predict|i doubt|i suspect|(can|cannot|can't) be justified|is (justified|reasonable|wise|a mistake|useful|helpful|valuable|worth)|makes sense|i (support|oppose|prefer|favou?r|side with)|i am (for|against|in favou?r of)|i'm (for|against|in favou?r of)|my (view|opinion|position|answer) is|i would (choose|say|prefer|rather)|i feel that|it seems to me|i am convinced|i'm convinced)\b|\b(should|ought to|must|need to|had better)\b|\b(is|are|would be) (better|worse|more \w+|less \w+|the (best|most \w+)|a (good|bad|better|great) idea|essential|necessary|unnecessary|harmful|beneficial)\b/iu;
const ENGAGE = /\b(agree with|disagree with|as \w+ (said|says|mentioned|pointed out|suggested|argued|argues)|\w+'s (point|idea|view|argument|concern|suggestion)|makes a (good|valid|fair) point|unlike \w+|like \w+ said|(one|another|the other|the first|the second) (student|classmate|person)|(my|other|both) (classmates|students)|both (of them|views|sides|ideas)|others (argue|say|worry|believe)|some (people|students) (argue|say|worry|believe)|(this|that|the) (concern|worry|point|argument|objection) is (real|valid|understandable|fair)|i understand (why|the concern|that))\b/iu;
const CONCEDE = /\b(yet|however|although|even though|while|admittedly|it is true that|true,|but|on the other hand|i understand|that said|still)\b/iu;
const STOP = new Set("the a an and or but of to in on for with is are was were be been that this these those it its they them their people student students one another other says say said may might can could will would should about whether every some more most less than also because if from at by as not no do does help helps".split(" "));
/** The ideas of the other students: content words of the "One student … / Another …" sentences of the prompt. */
function otherIdeas(prompt) {
  const sentences = splitSentences(String(prompt ?? "")).filter((s) => /\b(student|says|argues|thinks|believes|suggests|another|others|claims|worries)\b/iu.test(s));
  return new Set(sentences.join(" ").toLowerCase().match(/[a-z]{4,}/gu)?.filter((w) => !STOP.has(w)) ?? []);
}
const DISCUSSION_CHECKS = [
  ["opinion", "Açık görüş (In my opinion / should / is better …)", OPINION],
  ["reason", "Gerekçe (because / the main reason …)", /\b(because|since|the main reason|this is because|due to|as a result|therefore|so that|which means|that is why|without (this|such|it)|otherwise)\b|\b(improves?|allows?|helps?|reduces?|increases?|prevents?|provides?|protects?|encourages?|benefits?|matters?|leads? to|causes?|costs?|depends? on|gives?|makes?)\b/iu],
  ["example", "Örnek (For example / In my experience …)", /\b(for example|for instance|such as|in my experience|a good example|when i was|last (year|semester|term|week|month)|imagine|consider|in my (own )?(school|class|courses?|university|country|city|neighbou?rhood)|my (friend|brother|sister|roommate|cousin|group|teacher))\b|\b(a|one) (student|teacher|grant|park|city|town|company|person|family|school|university|program|course) (can|could|might|may|would|will|is|was)\b|\bsome (cities|towns|schools|universities|companies|countries|students|people) (are|have|already)\b/iu],
  ["engage", "Diğer öğrenciye bağlanma (I agree with … / that concern is real, but …)", ENGAGE],
];

/**
 * Full report for one answer: word counts, criteria (task/content, conventions,
 * range, accuracy) with ok / warn / miss and notes, fixable issues, warnings,
 * and the auto-corrected text to start the improved version from.
 */
export function analyzeWriting(text, { kind = "email", target = kind === "email" ? 80 : 100, academic = [], prompt = "" } = {}) {
  const raw = tidy(text);
  const words = countWords(raw);
  const prose = raw.split("\n").filter((line) => line.trim() && !isGreeting(line) && !isClosing(line)).join(" ");
  const sentences = splitSentences(prose);
  const average = sentences.length ? Math.round(words / sentences.length) : 0;
  const { fixed, issues } = autoFix(raw, kind);
  const notes = warnings(raw, kind);
  const linkers = linkersUsed(raw);
  const structures = structuresUsed(raw);
  const lowerTokens = new Set(raw.toLowerCase().match(/[a-z][a-z-]+/gu) ?? []);
  const academicUsed = academic.filter((word) => lowerTokens.has(word));
  const checks = (kind === "email" ? EMAIL_CHECKS : DISCUSSION_CHECKS).map(([id, label, pattern]) => ({ id, label, ok: has(raw, pattern) }));
  // Engaging with others without naming them: their idea comes back with a concession (Attendance concerns are real, yet …).
  if (kind !== "email") {
    const engage = checks.find((c) => c.id === "engage");
    const ideas = otherIdeas(prompt);
    const shared = [...lowerTokensOf(raw)].filter((w) => ideas.has(w));
    if (!engage.ok && shared.length && CONCEDE.test(raw)) engage.ok = true;
  }
  const accuracyCount = issues.filter((x) => x.kind === "accuracy").length + notes.filter((x) => x.kind === "accuracy").length;
  const status = (score) => (score >= 2 ? "ok" : score === 1 ? "warn" : "miss");

  const contentNotes = [];
  if (words < target) contentNotes.push(`${words} kelime: hedef en az ${target}. Kısa cevap gelişimi (açıklama, örnek) gösteremez.`);
  else contentNotes.push(`${words} kelime: uzunluk yeterli.`);
  const taskChecks = kind === "email" ? checks.filter((c) => ["purpose", "request"].includes(c.id)) : checks.filter((c) => ["opinion", "reason", "example"].includes(c.id));
  for (const c of taskChecks) if (!c.ok) contentNotes.push(`Olası eksik: ${c.label}. Başka bir yapıyla yazdıysan sorun yok.`);
  contentNotes.push("Bu kontrol anlamı ölçemez; soruyu gerçekten cevaplayıp cevaplamadığını aşağıdaki maddelerle sen işaretle.");
  const contentScore = (words >= target ? 1 : 0) + (taskChecks.every((c) => c.ok) ? 1 : 0);

  const conventionChecks = kind === "email" ? checks : checks.filter((c) => c.id === "engage");
  const conventionMissing = conventionChecks.filter((c) => !c.ok);
  const conventionNotes = conventionMissing.length ? conventionMissing.map((c) => `Olası eksik: ${c.label}.`) : [kind === "email" ? "Selamlama, amaç, rica, teşekkür ve kapanış yerinde." : "Diğer öğrencilerin fikrine bağlandın."];
  for (const note of notes.filter((x) => x.kind === "convention")) conventionNotes.push(note.why);
  const conventionScore = kind === "email" ? (conventionMissing.length === 0 ? 2 : conventionMissing.length <= 2 ? 1 : 0) : (conventionMissing.length ? 1 : 2);

  const rangeNotes = [
    linkers.length ? `Bağlaçlar (${linkers.length}): ${linkers.join(", ")}.` : "Bağlaç yok: However, In addition, For example, Therefore ekle.",
    structures.length ? `Yapılar: ${structures.join(", ")}.` : "Hep basit cümle: bir relative clause (which/who), bir koşul (if) veya bir modal (would/could) ekle.",
    `Ortalama cümle uzunluğu ${average} kelime${average && average < 9 ? "; cümleleri bağlaçla birleştir" : average > 26 ? "; bazı cümleleri böl" : ""}.`,
    academicUsed.length ? `Akademik kelimeler: ${academicUsed.slice(0, 8).join(", ")}.` : "Destedeki akademik kelimelerden birkaçını kullan (significant, benefit, approach …).",
  ];
  // A short email needs fewer linkers than a discussion post.
  const rangeScore = (linkers.length >= (kind === "email" ? 2 : 3) ? 1 : 0) + (structures.length >= 2 ? 1 : 0) + (academicUsed.length >= 2 && average >= 9 ? 0.5 : 0);

  const accuracyNotes = accuracyCount ? [`Otomatik kontrol ${accuracyCount} hata veya olası hata buldu (aşağıda). Yalnız yazım ve sık yapılan kalıp hatalarını görür; dil bilgisinin tamamını denetleyemez.`] : ["Otomatik kontrol hata bulmadı. Bu, metnin doğru olduğu anlamına gelmez: yalnız yazım ve sık yapılan kalıp hatalarını görür. Geliştir adımında cümleleri kendin de oku."];
  // No green badge for accuracy: the checker cannot vouch for grammar it does not test.
  const accuracyStatus = accuracyCount === 0 ? "check" : accuracyCount <= 3 ? "warn" : "miss";

  const criteria = [
    { id: "content", label: "Görev ve içerik", sub: "soruyu cevaplamak", status: status(contentScore), notes: contentNotes },
    { id: "conventions", label: kind === "email" ? "Sosyal kurallar" : "Tartışmaya katkı", sub: kind === "email" ? "nezaket ve e-posta düzeni" : "diğer fikirlere bağlanma", status: status(conventionScore), notes: conventionNotes },
    { id: "range", label: "Kelime ve dil bilgisi çeşitliliği", sub: "geniş bir yelpaze", status: status(Math.floor(rangeScore)), notes: rangeNotes },
    { id: "accuracy", label: "Doğruluk", sub: "otomatik kontrol: yazım ve sık hatalar", status: accuracyStatus, notes: accuracyNotes },
  ];
  return { words, target, sentences: sentences.length, average, criteria, checks, issues, warnings: notes, fixed, linkers, structures, academicUsed };
}

/**
 * The "repeat" exercise: keep the subject, greeting and closing, keep every
 * other sentence of the body and blank the rest (2nd, 4th, …).
 * Returns [{ type: "keep" | "blank" | "break", text, n }].
 */
export function repeatTemplate(text) {
  const parts = [];
  let index = 0;
  let blanks = 0;
  for (const line of tidy(text).split("\n")) {
    const trimmed = line.trim();
    if (!trimmed) { if (parts.length && parts[parts.length - 1].type !== "break") parts.push({ type: "break" }); continue; }
    if (isGreeting(trimmed) || isClosing(trimmed) || countWords(trimmed) <= 3) { parts.push({ type: "keep", text: trimmed }); parts.push({ type: "break" }); continue; }
    for (const sentence of splitSentences(trimmed)) {
      if (index % 2 === 1) parts.push({ type: "blank", text: sentence, n: (blanks += 1) });
      else parts.push({ type: "keep", text: sentence });
      index += 1;
    }
    parts.push({ type: "break" });
  }
  while (parts.length && parts[parts.length - 1].type === "break") parts.pop();
  return parts;
}

/** Word-level diff for the side-by-side view: what was removed from a, what was added in b. */
export function wordDiff(a, b) {
  // Line breaks are tokens too, so both sides keep their layout.
  const tokens = (text) => tidy(text).replace(/\n{2,}/gu, "\n\n").split(/([ \t]+|\n)/u).filter((t) => t && !/^[ \t]+$/u.test(t));
  const L = tokens(a);
  const R = tokens(b);
  if (L.length * R.length > 250_000) return { left: L.map((t) => ({ t, type: "same" })), right: R.map((t) => ({ t, type: "same" })) };
  const table = Array.from({ length: L.length + 1 }, () => new Uint16Array(R.length + 1));
  for (let i = L.length - 1; i >= 0; i -= 1) for (let j = R.length - 1; j >= 0; j -= 1) {
    table[i][j] = L[i] === R[j] ? table[i + 1][j + 1] + 1 : Math.max(table[i + 1][j], table[i][j + 1]);
  }
  const outL = [];
  const outR = [];
  let i = 0;
  let j = 0;
  while (i < L.length && j < R.length) {
    if (L[i] === R[j]) { outL.push({ t: L[i], type: "same" }); outR.push({ t: R[j], type: "same" }); i += 1; j += 1; }
    else if (table[i + 1][j] >= table[i][j + 1]) { outL.push({ t: L[i], type: "del" }); i += 1; }
    else { outR.push({ t: R[j], type: "add" }); j += 1; }
  }
  while (i < L.length) outL.push({ t: L[i++], type: "del" });
  while (j < R.length) outR.push({ t: R[j++], type: "add" });
  return { left: outL, right: outR };
}
