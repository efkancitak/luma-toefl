// The most used irregular verbs with their three forms (V1 · V2 · V3) and Turkish
// meaning, grouped by pattern for learning. Used by lesson G3.13 and the
// V2/V3 practice screen (#verbs). Alternatives are written "a/b" (learned/learnt).
// review: unreviewed

// [V1, V2, V3, Turkish]
export const IRREGULAR_VERBS = Object.freeze([
  // AAA — üç hâli aynı
  ["cost", "cost", "cost", "mal olmak"], ["cut", "cut", "cut", "kesmek"], ["hit", "hit", "hit", "vurmak; çarpmak"], ["hurt", "hurt", "hurt", "acıtmak; incitmek"],
  ["let", "let", "let", "izin vermek"], ["put", "put", "put", "koymak"], ["quit", "quit", "quit", "bırakmak"], ["read", "read", "read", "okumak (V2/V3 'red' okunur)"],
  ["set", "set", "set", "kurmak; ayarlamak"], ["shut", "shut", "shut", "kapatmak"], ["spread", "spread", "spread", "yaymak; yayılmak"], ["upset", "upset", "upset", "üzmek"],
  ["bet", "bet", "bet", "bahse girmek"], ["broadcast", "broadcast", "broadcast", "yayın yapmak"], ["burst", "burst", "burst", "patlamak"], ["fit", "fit", "fit", "uymak (beden)"],
  // ABB — V2 ve V3 aynı
  ["bring", "brought", "brought", "getirmek"], ["buy", "bought", "bought", "satın almak"], ["think", "thought", "thought", "düşünmek"], ["teach", "taught", "taught", "öğretmek"],
  ["catch", "caught", "caught", "yakalamak"], ["fight", "fought", "fought", "kavga etmek; savaşmak"], ["seek", "sought", "sought", "aramak"], ["build", "built", "built", "inşa etmek"],
  ["send", "sent", "sent", "göndermek"], ["spend", "spent", "spent", "harcamak"], ["lend", "lent", "lent", "ödünç vermek"], ["bend", "bent", "bent", "bükmek"],
  ["feel", "felt", "felt", "hissetmek"], ["keep", "kept", "kept", "tutmak; saklamak"], ["sleep", "slept", "slept", "uyumak"], ["meet", "met", "met", "tanışmak; buluşmak"],
  ["leave", "left", "left", "ayrılmak; bırakmak"], ["lose", "lost", "lost", "kaybetmek"], ["mean", "meant", "meant", "anlamına gelmek"], ["lead", "led", "led", "yol göstermek; yönetmek"],
  ["feed", "fed", "fed", "beslemek"], ["hold", "held", "held", "tutmak; düzenlemek"], ["find", "found", "found", "bulmak"], ["have", "had", "had", "sahip olmak"],
  ["make", "made", "made", "yapmak; üretmek"], ["say", "said", "said", "söylemek"], ["pay", "paid", "paid", "ödemek"], ["lay", "laid", "laid", "koymak; sermek"],
  ["sell", "sold", "sold", "satmak"], ["tell", "told", "told", "anlatmak; söylemek"], ["hear", "heard", "heard", "duymak"], ["stand", "stood", "stood", "ayakta durmak"],
  ["understand", "understood", "understood", "anlamak"], ["sit", "sat", "sat", "oturmak"], ["win", "won", "won", "kazanmak"], ["shoot", "shot", "shot", "ateş etmek; çekmek (film)"],
  ["learn", "learned/learnt", "learned/learnt", "öğrenmek"], ["dream", "dreamed/dreamt", "dreamed/dreamt", "rüya görmek; hayal etmek"], ["burn", "burned/burnt", "burned/burnt", "yakmak; yanmak"], ["light", "lit", "lit", "yakmak (ışık, ateş)"],
  ["dig", "dug", "dug", "kazmak"], ["hang", "hung", "hung", "asmak"], ["stick", "stuck", "stuck", "yapıştırmak; takılmak"], ["strike", "struck", "struck", "vurmak; çarpmak"],
  // ABA — V1 ve V3 aynı
  ["come", "came", "come", "gelmek"], ["become", "became", "become", "olmak; haline gelmek"], ["run", "ran", "run", "koşmak; yönetmek"], ["overcome", "overcame", "overcome", "üstesinden gelmek"],
  // ABC — üç hâli farklı
  ["be", "was/were", "been", "olmak"], ["go", "went", "gone", "gitmek"], ["do", "did", "done", "yapmak"], ["see", "saw", "seen", "görmek"],
  ["take", "took", "taken", "almak"], ["give", "gave", "given", "vermek"], ["get", "got", "gotten/got", "almak; olmak (ABD: gotten)"], ["write", "wrote", "written", "yazmak"],
  ["speak", "spoke", "spoken", "konuşmak"], ["break", "broke", "broken", "kırmak"], ["choose", "chose", "chosen", "seçmek"], ["know", "knew", "known", "bilmek"],
  ["grow", "grew", "grown", "büyümek; yetiştirmek"], ["throw", "threw", "thrown", "atmak"], ["blow", "blew", "blown", "esmek; üflemek"], ["fly", "flew", "flown", "uçmak"],
  ["draw", "drew", "drawn", "çizmek; çekmek"], ["show", "showed", "shown", "göstermek"], ["drive", "drove", "driven", "araba sürmek"], ["ride", "rode", "ridden", "binmek (bisiklet, at)"],
  ["rise", "rose", "risen", "yükselmek"], ["arise", "arose", "arisen", "ortaya çıkmak"], ["eat", "ate", "eaten", "yemek"], ["fall", "fell", "fallen", "düşmek"],
  ["forget", "forgot", "forgotten", "unutmak"], ["forgive", "forgave", "forgiven", "affetmek"], ["hide", "hid", "hidden", "saklamak; saklanmak"], ["bite", "bit", "bitten", "ısırmak"],
  ["begin", "began", "begun", "başlamak"], ["drink", "drank", "drunk", "içmek"], ["sing", "sang", "sung", "şarkı söylemek"], ["swim", "swam", "swum", "yüzmek"],
  ["ring", "rang", "rung", "çalmak (zil)"], ["sink", "sank", "sunk", "batmak"], ["shrink", "shrank", "shrunk", "küçülmek"], ["wear", "wore", "worn", "giymek"],
  ["tear", "tore", "torn", "yırtmak"], ["steal", "stole", "stolen", "çalmak (hırsızlık)"], ["freeze", "froze", "frozen", "donmak"], ["wake", "woke", "woken", "uyanmak"],
  ["lie", "lay", "lain", "uzanmak (lie–lied–lied: yalan söylemek)"], ["shake", "shook", "shaken", "sallamak"], ["mistake", "mistook", "mistaken", "yanlış anlamak; karıştırmak"], ["prove", "proved", "proven/proved", "kanıtlamak"],
  ["undertake", "undertook", "undertaken", "üstlenmek"], ["withdraw", "withdrew", "withdrawn", "geri çekmek; para çekmek"], ["forbid", "forbade", "forbidden", "yasaklamak"], ["swear", "swore", "sworn", "yemin etmek; küfretmek"],
]);

export const VERB_PATTERNS = Object.freeze([
  ["AAA", "Üç hâli aynı", "cut – cut – cut"],
  ["ABB", "V2 ile V3 aynı", "buy – bought – bought"],
  ["ABA", "V1 ile V3 aynı", "come – came – come"],
  ["ABC", "Üç hâli farklı", "go – went – gone"],
]);

const first = (form) => form.split("/")[0];
/** AAA, ABB, ABA or ABC by the main forms. */
export function verbPattern([v1, v2, v3]) {
  const [a, b, c] = [v1, first(v2), first(v3)];
  if (a === b && b === c) return "AAA";
  if (b === c) return "ABB";
  if (a === c) return "ABA";
  return "ABC";
}

/** A typed form is right when it matches any written alternative (learned/learnt). */
export function formMatches(expected, typed) {
  const clean = String(typed ?? "").trim().toLowerCase().replace(/\s+/gu, " ");
  return Boolean(clean) && expected.split("/").some((form) => form === clean);
}
