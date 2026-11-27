// Build a Sentence (v0.9): closer to the real task. A short line from another
// speaker gives the context; the answer frame shows the fixed words and blanks;
// the tiles fill the blanks in order and one tile is extra (it stays unused).
// 22 items, enough for two 10-item rehearsals. Original, AI-assisted.
// provenance: original-ai-assisted · review: unreviewed

function order(list, seed) {
  // Deterministic shuffle, so the tiles never come out in answer order.
  const out = list.map((value, index) => ({ value, key: Math.sin(seed * 97 + index * 13.7) }));
  out.sort((a, b) => a.key - b.key);
  const shuffled = out.map((x) => x.value);
  return shuffled.join("|") === list.join("|") ? [...shuffled.slice(1), shuffled[0]] : shuffled;
}

/** frame: the answer with "_" for each blank; pieces: the right tiles in order; extra: unused tiles. */
function B(id, level, title, context, frame, pieces, extra, explanation, focus, tags, alts = []) {
  // "_." is a blank followed by a full stop.
  const slots = frame.split(" ").flatMap((word) => (word === "_" ? [null] : /^_[.,?!]$/u.test(word) ? [null, word.slice(1)] : [word]));
  if (slots.filter((slot) => slot === null).length !== pieces.length) throw new Error(`${id}: blank count`);
  let next = 0;
  const answer = slots.map((slot) => (slot === null ? pieces[next++] : slot)).join(" ").replace(/\s+([,.?!])/gu, "$1");
  const seed = Number(id.replace(/\D/gu, "")) || 1;
  return Object.freeze({
    id, title, skill: "writing", taskType: "build-sentence", level, estimatedMinutes: 1, type: "build",
    prompt: "Make an appropriate sentence.", context, slots, tokens: order([...pieces, ...extra], seed), solution: pieces,
    answer, alts, explanation, focus, provenance: "original-ai-assisted", tags,
  });
}

export const BUILD_ITEMS = Object.freeze([
  B("bs-01", "A2", "A Morning Routine", "What does Lena do before breakfast?", "Every morning, _ _ _ breakfast.", ["Lena", "walks", "before"], ["walking"],
    "Cümle başındaki zaman ifadesinden sonra özne + fiil gelir: Lena walks. Geniş zamanda he/she fiili -s alır; walking burada fazla parça.", "Söz dizimi: zaman + özne + fiil", ["word-order", "routine", "preposition"]),
  B("bs-02", "B1", "A Delayed Flight", "Why did you arrive so late?", "Because _ _ storm, the flight _ _.", ["of", "the", "was", "delayed"], ["delay"],
    "Because of + isim (because + cümle). Uçağı biri ertelediği için edilgen: was delayed. Delay (yalın) tek başına fiil olarak uymaz.", "because of + isim, edilgen", ["passive", "cause", "word-order"]),
  B("bs-03", "B2", "Unexpected Results", "Did the researchers share their surprising results?", "_ the results _ unexpected, the researchers _ _.", ["Although", "were", "published", "them"], ["Despite"],
    "Although'dan sonra tam cümle gelir (the results were …). Despite'tan sonra isim veya -ing gelir; burada fiilli bir cümle olduğu için uymaz.", "although + cümle / despite + isim", ["concession", "clause-order", "pronoun"]),
  B("bs-04", "C1", "Adopting a Technology", "Will this technology become common soon?", "_ costs decline, the technology is _ _ be _ adopted.", ["Unless", "unlikely", "to", "widely"], ["wide"],
    "Unless = if … not. Be unlikely to + yalın fiil; edilgen mastar: to be adopted. Fiili niteleyen zarf widely; wide sıfattır.", "unless, be unlikely to, edilgen mastar", ["passive-infinitive", "condition", "academic-grammar"]),
  B("bs-05", "A2", "Finding the Library", "I'm new on campus. Can I ask you something?", "Could you tell me _ _ _ _?", ["where", "the", "library", "is"], ["does"],
    "Dolaylı soruda düz cümle sırası kullanılır: where the library is (where is the library değil). Does gerekmez.", "dolaylı soru: düz sıra", ["indirect-question", "request", "word-order"]),
  B("bs-06", "A2", "Living in the City", "How long have you lived here?", "I _ _ in this city _ 2020.", ["have", "lived", "since"], ["for"],
    "Present perfect: have lived. Başlangıç noktası (2020) için since; süre (five years) için for.", "present perfect + since/for", ["present-perfect", "word-order", "preposition"]),
  B("bs-07", "B1", "A Helpful Article", "Was the article useful for your essay?", "The article _ I _ yesterday _ very _.", ["that", "read", "was", "helpful"], ["it"],
    "That I read yesterday, article'ı niteleyen sıfat cümlesidir. İçinde 'it' tekrar edilmez (the article that I read it yanlış).", "relative clause: zamir tekrarı yok", ["relative-clause", "word-order"]),
  B("bs-08", "B1", "Rain Plans", "What happens if the weather is bad tomorrow?", "If it _ tomorrow, we _ _ the meeting indoors.", ["rains", "will", "hold"], ["will rain"],
    "First conditional: if tarafında geniş zaman (if it rains), ana cümlede will. If tarafında will kullanılmaz (bu anlamda).", "first conditional", ["condition", "word-order"]),
  B("bs-09", "B1", "Ending a Message", "Professor Lee: I will send you the schedule next week.", "Thank you. I am _ _ _ _ from you soon.", ["looking", "forward", "to", "hearing"], ["hear"],
    "Look forward to + -ing: buradaki to bir edattır, ardından hearing gelir. Look forward to hear yanlıştır.", "look forward to + -ing", ["gerund-infinitive", "email", "word-order"]),
  B("bs-10", "B2", "Joining a Club", "Why don't you join the debate club?", "If I _ more time, I _ _ the debate club.", ["had", "would", "join"], ["have"],
    "Second conditional: şimdiki hayalî durum için if + geçmiş (had), ana cümlede would + yalın fiil.", "second conditional", ["conditional-second", "word-order"]),
  B("bs-11", "B2", "Confirmed Results", "Were the results checked by anyone else?", "Yes, the results _ _ _ a second group of researchers.", ["were", "confirmed", "by"], ["confirm"],
    "Edilgen: were + V3 (confirmed). Eylemi yapanı by ile ekleriz.", "edilgen + by", ["passive", "word-order"]),
  B("bs-12", "C1", "A Successful Policy", "Was the new policy successful?", "Not only _ the policy _ costs, but it also _ access.", ["did", "reduce", "improved"], ["reduced"],
    "Not only başa gelince devrik yapı: not only did + özne + yalın fiil (reduce). İkinci kısım normal sırada: it also improved.", "not only devriği", ["inversion", "word-order"]),
  B("bs-13", "B1", "A Favor", "I'm going to the bookstore after class.", "_ you pick _ a notebook _ me?", ["Could", "up", "for"], ["to"],
    "Rica: Could you …? Pick up = alıp getirmek; isim nesne ortada da olabilir. 'Benim için' = for me.", "rica + phrasal verb", ["request", "phrasal", "word-order"]),
  B("bs-14", "B1", "A New Room", "The professor changed the room for tomorrow's class.", "Do you know _ the new room _?", ["where", "is"], ["does"],
    "Dolaylı soruda fiil sona gider: where the new room is.", "dolaylı soru", ["indirect-question", "word-order"]),
  B("bs-15", "B2", "Arriving Late", "Did you see the start of the lecture?", "No, the lecture _ _ _ _ I arrived.", ["had", "already", "started", "when"], ["has"],
    "Geçmişteki bir olaydan (I arrived) daha önce olan: past perfect (had started). Already, had ile V3 arasına girer.", "past perfect", ["past-perfect", "word-order"]),
  B("bs-16", "B1", "Relaxing", "What do you usually do to relax?", "I _ _ _ music after a long day.", ["enjoy", "listening", "to"], ["listen"],
    "Enjoy'dan sonra -ing gelir: enjoy listening. Listen to + nesne.", "enjoy + -ing", ["gerund-infinitive", "word-order"]),
  B("bs-17", "B2", "Study Habits", "Did you always like studying in the library?", "Not really. I _ _ study at home, but now I _ the library.", ["used", "to", "prefer"], ["using"],
    "Used to + yalın fiil: geçmişteki ama artık süren olmayan alışkanlık. Şimdiki tercih: prefer.", "used to", ["used-to", "word-order"]),
  B("bs-18", "B2", "The Advisor's Question", "What did the advisor ask you?", "She asked me _ I _ _ the form.", ["whether", "had", "submitted"], ["did"],
    "Dolaylı evet/hayır sorusu whether (veya if) ile kurulur; zaman bir geri kayar: Have you submitted …? → whether I had submitted.", "dolaylı anlatım: soru", ["reported-speech", "indirect-question"]),
  B("bs-19", "B1", "Comparing Dorms", "Which dorm do you like more?", "The new dorm is _ _ _ the old one.", ["much", "quieter", "than"], ["more"],
    "Kısa sıfat -er alır (quieter); more ile birlikte kullanılmaz. Farkı büyütmek için much.", "karşılaştırma", ["comparative", "word-order"]),
  B("bs-20", "B2", "Missing the Bus", "I missed the bus again this morning.", "You _ _ _ earlier.", ["should", "have", "left"], ["leave"],
    "Geçmişe dönük eleştiri: should have + V3 (left).", "should have + V3", ["modal-perfect", "word-order"]),
  B("bs-21", "B1", "An Expensive Book", "Why didn't you buy the textbook?", "It was _ expensive, and I didn't have _ _.", ["too", "enough", "money"], ["very"],
    "Too = gereğinden fazla (bu yüzden almadım). Enough isimden önce gelir: enough money. Very de dilbilgisel olarak doğru, ama nedeni too daha iyi anlatır.", "too / enough", ["degree", "word-order"], ["It was very expensive, and I didn't have enough money."]),
  B("bs-22", "C1", "A Research Partner", "Who is the researcher you mentioned?", "She is the researcher _ _ I wrote my thesis.", ["with", "whom"], ["who"],
    "Edat başa gelirse whom kullanılır: with whom. (Günlük dilde: the researcher I wrote my thesis with.)", "edat + whom", ["relative-clause", "formal"]),
]);
