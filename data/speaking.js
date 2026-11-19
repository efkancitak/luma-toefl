// Speaking support (REQUIREMENTS v4 "Konuşma desteği", CONTENT-SPEC "Konuşma içeriği").
// All sentences, questions, model answers and phrases are original. The v0.1
// single items (rep-01…04, int-01…04) are kept verbatim as parts of the sets.

import { exercises } from "./content.js";

export const SPEAKING_META = Object.freeze({
  version: 1,
  provenance: "original-ai-assisted",
  reviewStatus: "unreviewed",
  ttsCheck: "Telaffuz örnekleri gerçek iPhone sesiyle henüz dinlenmedi.",
});

const legacy = (id) => {
  const item = exercises.find((exercise) => exercise.id === id);
  if (!item) throw new Error(`Missing legacy speaking item ${id}`);
  return item;
};

/** Response window per sentence: 8–12 s, from sentence length. */
export function repeatSeconds(text) {
  const words = String(text).trim().split(/\s+/).filter(Boolean).length;
  return words <= 6 ? 8 : words <= 10 ? 10 : 12;
}

const S = (id, chunks, extra = {}) => {
  const text = chunks.replace(/\s*\|\s*/g, " ").replace(/\s+/g, " ").trim();
  return { id, text, chunks, seconds: repeatSeconds(text), ...extra };
};
const fromRepeat = (id, setItemId, chunks) => {
  const item = legacy(id);
  const sentence = S(setItemId, chunks, { legacyId: id });
  if (sentence.text !== item.audioText) throw new Error(`Chunks for ${id} must reproduce the v0.1 sentence.`);
  return sentence;
};

export const REPEAT_SETS = Object.freeze([
  {
    id: "lr-1",
    title: "Ofis saatleri",
    scenario: "Bir hoca, ofis saatlerine gelecek öğrencilere yol tarifi ve hazırlık bilgisi veriyor.",
    level: "A2–B1",
    sentences: [
      S("lr-1-1", "Office hours | are on Tuesdays."),
      S("lr-1-2", "My office is | on the third floor."),
      fromRepeat("rep-01", "lr-1-3", "Please bring your draft | to my office hours | tomorrow."),
      S("lr-1-4", "If the door is closed, | knock and wait | a moment."),
      S("lr-1-5", "We can talk about | your research topic | and the reading list."),
      S("lr-1-6", "Students who cannot come in person | may join the meeting | online instead."),
      S("lr-1-7", "Before you leave, | I'll give you a few articles | that should help you | narrow your focus."),
    ],
  },
  {
    id: "lr-2",
    title: "Program değişikliği",
    scenario: "Bölüm sekreterliği, laboratuvar programındaki değişikliği duyuruyor.",
    level: "B1",
    sentences: [
      S("lr-2-1", "The schedule | has changed."),
      S("lr-2-2", "Monday's lab | is moving to Wednesday."),
      S("lr-2-3", "The room number | will stay the same."),
      fromRepeat("rep-02", "lr-2-4", "The updated schedule | will be posted | outside the main office."),
      S("lr-2-5", "Please check your email | for the new times | before Friday."),
      S("lr-2-6", "Students with a conflict | should contact the department assistant | as soon as possible."),
      S("lr-2-7", "Because two instructors | are attending a conference, | several sections will meet online | next week."),
    ],
  },
  {
    id: "lr-3",
    title: "Araştırma sunumu",
    scenario: "Bir öğrenci ekibi, uyku ve bellek üzerine küçük bir çalışmanın sonuçlarını sunuyor.",
    level: "B2",
    sentences: [
      S("lr-3-1", "Let's look | at the results."),
      S("lr-3-2", "The sample included | two hundred students."),
      S("lr-3-3", "Most participants slept | less than seven hours."),
      fromRepeat("rep-03", "lr-3-4", "Although the evidence is limited, | the preliminary results | are encouraging."),
      S("lr-3-5", "Students who slept longer | generally remembered more | of the material."),
      S("lr-3-6", "However, | we did not measure | how much caffeine the participants | consumed each day."),
      S("lr-3-7", "Next term, | we will follow the same students | for a full semester | to test the pattern."),
    ],
  },
  {
    id: "lr-4",
    title: "Seminer tartışması",
    scenario: "Bir araştırma yöntemleri seminerinde hoca, korelasyon ile nedensellik arasındaki farkı tartışıyor.",
    level: "C1",
    sentences: [
      S("lr-4-1", "That's an important | distinction."),
      S("lr-4-2", "Correlation is only | the starting point."),
      S("lr-4-3", "We need to consider | other explanations | as well."),
      fromRepeat("rep-04", "lr-4-4", "A strong correlation | does not necessarily establish | a causal relationship."),
      S("lr-4-5", "For instance, | both variables might be influenced | by family income."),
      S("lr-4-6", "To rule that out, | researchers would need to control for income | in their analysis."),
      S("lr-4-7", "Only after several independent studies | replicate the effect | can we draw firmer conclusions | about the cause."),
    ],
  },
  {
    id: "lr-5",
    title: "Kütüphane tanıtımı",
    scenario: "Bir kütüphaneci, yeni öğrencilere kütüphanenin nasıl kullanılacağını anlatıyor.",
    level: "A2–B1",
    sentences: [
      S("lr-5-1", "Welcome | to the library."),
      S("lr-5-2", "Quiet study rooms | are upstairs."),
      S("lr-5-3", "You can borrow | up to ten books | at a time."),
      S("lr-5-4", "Please return them | within three weeks | to avoid a fine."),
      S("lr-5-5", "If you need a book | we don't have, | we can order it | from another library."),
      S("lr-5-6", "The printers are on the ground floor, | and you can pay | with your student card."),
      S("lr-5-7", "Before the exam period begins, | remember to reserve a study room online, | because they fill up very quickly."),
    ],
  },
  {
    id: "lr-6",
    title: "Araştırma sunumu",
    scenario: "Bir öğrenci, sınıfta küçük bir anket araştırmasının sonuçlarını sunuyor.",
    level: "B2",
    sentences: [
      S("lr-6-1", "Here is | our main finding."),
      S("lr-6-2", "We surveyed | two hundred students."),
      S("lr-6-3", "Most of them | sleep less than | seven hours a night."),
      S("lr-6-4", "Students who slept longer | reported better concentration | in class."),
      S("lr-6-5", "However, | we cannot say | that sleep alone | explains the difference."),
      S("lr-6-6", "Other factors, | such as part-time work and stress, | may also play an important role."),
      S("lr-6-7", "In future research, | we would like to follow the same students | for a full academic year | to see how their habits change."),
    ],
  },
]);

export const REPEAT_TECHNIQUE = Object.freeze([
  "Cümleyi anlam öbeklerine böl: “Please bring your draft | to my office hours | tomorrow.” Öbekleri hatırlamak tek tek kelimeleri hatırlamaktan kolaydır.",
  "Vurgulu kelimeleri ve tonlamayı taklit et; işlev kelimelerini hafif ama eksiksiz söyle.",
  "Kısa işlev kelimelerini atlama: a, the, to, -s, -ed. Dikte karşılaştırması en çok bunları yakalar.",
  "Gölgeleme (shadowing): modeli dinlerken yarım saniye geriden aynı anda söyle; önce yavaş, sonra normal hızda.",
  "Prova modunda ses bir kez çalar; cevap penceresi cümle uzunluğuna göre 8–12 saniyedir.",
]);

export const ANSWER_PLAN = Object.freeze([
  { step: "Doğrudan cevap", detail: "1 cümle. Soruya ilk cümlede cevap ver.", seconds: "0–8 sn" },
  { step: "Neden", detail: "1–2 cümle. Ana gerekçeni söyle.", seconds: "8–20 sn" },
  { step: "Kişisel örnek / deneyim", detail: "2–3 cümle. Somut bir olay, yer, kişi.", seconds: "20–38 sn" },
  { step: "Kısa kapanış", detail: "1 cümle. Görüşünü toparla.", seconds: "38–45 sn" },
]);

export const INTERVIEW_TYPES = Object.freeze({
  experience: { label: "Deneyim", example: "Tell me about a time…", plan: ["Ne oldu?", "Ne yaptın?", "Ne öğrendin?"], grammar: ["G3.2", "G3.4", "G3.6"], opener: "One time that comes to mind is when…" },
  preference: { label: "Alışkanlık ve tercih", example: "How do you usually… / Do you prefer…", plan: ["Tercih", "Neden", "Kısa örnek"], grammar: ["G3.1", "G8.1"], opener: "I usually prefer… because…" },
  opinion: { label: "Görüş", example: "Do you think… should…?", plan: ["Net görüş", "Gerekçe ve örnek", "Kapanış"], grammar: ["G4.2", "G4.5", "G10.1"], opener: "In my opinion,…" },
  hypothetical: { label: "Varsayım", example: "What would you do if…?", plan: ["Ne yapardın?", "Neden?", "Olası sonuç"], grammar: ["G5.2", "G5.4"], opener: "If I were in that situation, I would…" },
});

const Q = (id, type, text, model, extra = {}) => ({ id, type, text, model, seconds: 45, ...extra });
const fromInterview = (id, setItemId, type, extra = {}) => {
  const item = legacy(id);
  return Q(setItemId, type, item.audioText, item.modelAnswer, { legacyId: id, ...extra });
};

export const INTERVIEW_SETS = Object.freeze([
  {
    id: "int-set-1",
    title: "Yeni beceriler öğrenmek",
    theme: "learning new skills",
    level: "A2–B1",
    researcher: "Bir eğitim araştırmacısı, öğrencilerin okul dışında nasıl beceri kazandığını inceliyor.",
    questions: [
      Q("int-1-1", "experience", "Tell me about a skill you learned outside of school.", "One skill I learned outside of school is cooking. When I moved into a shared apartment last year, I couldn't afford to eat out every day, so I started watching short cooking videos. At first, I burned a lot of rice, but I kept practicing three times a week. Now I can make about ten simple dishes, and my roommates often ask me to cook. That experience taught me that small, regular practice works better than waiting until I feel ready.", { phrases: ["ph13", "ph48"] }),
      fromInterview("int-01", "int-1-2", "preference", { phrases: ["ph17", "ph09"] }),
      Q("int-1-3", "hypothetical", "Imagine a friend wants to learn a new skill but keeps giving up. What would you advise them to do?", "If I were in that situation, I would advise my friend to make the goal much smaller. For example, instead of 'learn the guitar', the goal could be 'practice one song for ten minutes a day'. The main reason is that small goals are easier to keep, and every small success builds motivation. I would also suggest practicing with someone else, because it is harder to quit when another person is waiting for you. Over time, those small steps would add up.", { phrases: ["ph17", "ph09"] }),
      Q("int-1-4", "opinion", "Some people think schools should teach more practical skills, like managing money. Do you agree?", "Yes, I strongly agree. In my opinion, skills like budgeting are just as important as math or history, because everyone needs them after graduation. For instance, several of my friends got their first credit card at university without understanding interest rates, and some of them ended up in debt. A short course in high school could have prevented that. Overall, I think schools should include at least one practical course every year.", { phrases: ["ph04", "ph10", "ph41"] }),
    ],
  },
  {
    id: "int-set-2",
    title: "Ortak alanlar ve topluluk",
    theme: "shared spaces and community",
    level: "B1",
    researcher: "Bir şehir planlama araştırmacısı, gençlerin ortak alanları nasıl kullandığını inceliyor.",
    questions: [
      Q("int-2-1", "experience", "Tell me about a time you worked with neighbors or classmates to solve a shared problem.", "Last spring, the study room in our dormitory was always messy, and nobody wanted to use it. A few of us decided to fix the problem together. We made a simple cleaning schedule, asked the dorm office for a recycling bin, and put up a sign with three basic rules. Within two weeks, the room was clean, and more students started studying there in the evenings. I learned that a small, clear plan can change people's habits quickly.", { phrases: ["ph14", "ph20", "ph48"] }),
      Q("int-2-2", "preference", "Where do you usually study or relax when you are not at home?", "I usually go to a small café near my campus. I prefer it to the library because I can have a coffee and the background noise actually helps me focus. For example, last week I finished a whole chapter of my statistics book there in one afternoon. The library is great for exams, but for everyday studying the café works better for me.", { phrases: ["ph25", "ph09"] }),
      fromInterview("int-02", "int-2-3", "hypothetical", { phrases: ["ph02", "ph18"] }),
      Q("int-2-4", "opinion", "Should cities spend more money on parks or on public transportation? Why?", "I'd say cities should spend more on public transportation. The main reason is that good buses and trains affect almost everyone, every day. In my city, for instance, many students spend over an hour commuting, which leaves them less time for studying or resting. Parks are important too, but people first need a reliable way to reach them. So, all in all, I think transportation should come first, and parks can be improved step by step.", { phrases: ["ph02", "ph17", "ph42"] }),
    ],
  },
  {
    id: "int-set-3",
    title: "Bilgi ve fikir değiştirmek",
    theme: "information and changing your mind",
    level: "B2",
    researcher: "Bir iletişim araştırmacısı, öğrencilerin yeni bilgiyle görüşlerini nasıl güncellediğini inceliyor.",
    questions: [
      fromInterview("int-03", "int-3-1", "experience", { phrases: ["ph13", "ph48"] }),
      Q("int-3-2", "preference", "How do you usually check whether information you see online is reliable?", "I usually check two things before I believe something online. First, I look at who published it and whether they have any expertise. Second, I try to find the same information on at least one other independent site. For example, last month I saw a post about a new exam rule, but when I checked the official website, the rule didn't exist. That's why I never share something until I have checked the original source.", { phrases: ["ph09", "ph24"] }),
      Q("int-3-3", "hypothetical", "If you could ask an expert one question about a topic you care about, what would you ask?", "If I could ask an expert one question, I would ask a sleep scientist how much sleep students really need during exam periods. The reason is that many of my friends sleep only four or five hours before exams, and they believe it helps them study more. If the expert said that this actually harms memory, I think many students would change their habits. So the answer could have a very practical effect.", { phrases: ["ph17", "ph21"] }),
      Q("int-3-4", "opinion", "Some people say students should learn how to evaluate news in school. Do you agree?", "I strongly believe they should. These days, students get most of their news from social media, where false stories can spread very quickly. A short course on checking sources would give them a simple habit for life. For instance, my cousin learned in high school to look for the original study behind a headline, and now she often corrects misleading posts in our family group. For these reasons, I think news evaluation should be a regular part of the curriculum.", { phrases: ["ph04", "ph10", "ph46"] }),
    ],
  },
  {
    id: "int-set-4",
    title: "Zaman ve proje yönetimi",
    theme: "time and project management",
    level: "B2–C1",
    researcher: "Bir eğitim araştırmacısı, öğrencilerin zaman baskısı altında nasıl çalıştığını inceliyor.",
    questions: [
      Q("int-4-1", "experience", "Tell me about a time you had to finish an important task under time pressure.", "One time that comes to mind is my final project in my second year. Two days before the deadline, my laptop crashed, and I lost part of my analysis. Instead of panicking, I made a list of what was essential and what was optional. I rebuilt the main graphs in the library, worked with a classmate to check my numbers, and submitted the project an hour before the deadline. Since then, I always back up my files every evening.", { phrases: ["ph39", "ph20"] }),
      fromInterview("int-04", "int-4-2", "preference", { phrases: ["ph15", "ph30"] }),
      Q("int-4-3", "hypothetical", "If a team member was not doing their share of a group project, what would you do?", "If I were in that situation, I would talk to the team member privately before doing anything else. There might be a reason I don't know about, such as a health problem or another job. I would ask what is difficult for them and suggest a smaller, clear task with a specific deadline. If nothing changed after that, I would inform the instructor, because the whole team's grade would depend on it.", { phrases: ["ph36", "ph19"] }),
      Q("int-4-4", "opinion", "Do you think it is better to have strict deadlines or flexible deadlines at university?", "In my opinion, a mix is better than either extreme, but I lean toward strict deadlines. Strict deadlines prepare students for professional life, where clients and managers expect work on time. On the other hand, completely rigid rules can be unfair when a student is ill. For example, one of my professors gives everyone three 'late days' for the whole semester, and that system works really well. Overall, clear deadlines with a small amount of flexibility seem the most reasonable approach.", { phrases: ["ph01", "ph26", "ph41"] }),
    ],
  },
  {
    id: "int-set-5",
    title: "Kampüste yaşam ve barınma",
    theme: "campus life and housing",
    level: "B1",
    researcher: "Bir üniversite araştırmacısı, öğrencilerin barınma ve günlük yaşam deneyimlerini inceliyor.",
    questions: [
      Q("int-5-1", "experience", "Tell me about a time you had to adapt to a new living situation.", "One time that comes to mind is my first month in a student dormitory. I had never shared a room before, and my roommate went to bed much later than I did. At first, I couldn't sleep, and I felt frustrated. Instead of complaining, I talked to him, and we agreed on quiet hours after eleven. I also bought earplugs. After a week, things were much better. That experience taught me that most problems get smaller when you discuss them early and politely.", { phrases: ["ph39", "ph48"] }),
      Q("int-5-2", "preference", "Do you prefer living alone or with other people? Why?", "I usually prefer living with other people, as long as everyone respects shared rules. The main reason is that it is easier to stay motivated when someone else is around. For example, my flatmate and I cook dinner together twice a week, so I eat better than I would alone. Living with others is also cheaper than renting my own place. Of course, I sometimes miss having complete silence, but compared to living alone, I think shared housing is more enjoyable and more practical for a student.", { phrases: ["ph17", "ph25"] }),
      Q("int-5-3", "hypothetical", "If your university asked you to improve one thing about student housing, what would you change?", "If I were asked to change one thing, I would create more quiet study spaces inside the dormitories. Right now, many students have to walk to the library at night because their rooms are too noisy. If each floor had a small study room, students would save time and feel safer. It would also reduce conflicts between roommates who have different schedules. The cost would be low, because some storage rooms could simply be converted. I think this small change would improve daily life a lot.", { phrases: ["ph18", "ph21"] }),
      Q("int-5-4", "opinion", "Some universities require first-year students to live on campus. Do you think this is a good policy?", "In my opinion, it is a good policy, but there should be exceptions. Living on campus helps new students make friends and get used to university life, which is especially important in the first months. For instance, I met my closest friends in my dormitory, not in my classes. However, students who have family nearby or who cannot afford campus housing shouldn't be forced to move. So overall, I support the rule as long as the university allows reasonable exceptions.", { phrases: ["ph01", "ph10", "ph41"] }),
    ],
  },
  {
    id: "int-set-6",
    title: "Teknoloji ve öğrenme",
    theme: "technology and learning",
    level: "B2",
    researcher: "Bir eğitim teknolojisi araştırmacısı, öğrencilerin dijital araçları nasıl kullandığını inceliyor.",
    questions: [
      Q("int-6-1", "experience", "Tell me about a time when technology helped you learn something difficult.", "One time that comes to mind is when I was struggling with statistics last year. I couldn't understand probability distributions from the textbook alone. A classmate recommended an interactive website where you can change the numbers and immediately see how the graph moves. I spent about an hour experimenting with it, and the idea finally made sense. After that, I had no trouble with the exam questions on that topic. That experience taught me that seeing a concept change in real time can be more effective than reading about it.", { phrases: ["ph39", "ph48"] }),
      Q("int-6-2", "preference", "How do you usually take notes: on paper or on a device? Why?", "I usually take notes on paper during lectures and type them up later. The main reason is that writing by hand forces me to summarize instead of copying every word. In my case, I remember the material much better that way. Typing my notes afterward is also useful because it works as a first review, and digital notes are easier to search before an exam. Compared to using only a laptop, this method takes more time, but I think the extra effort is worth it.", { phrases: ["ph17", "ph15", "ph25"] }),
      Q("int-6-3", "hypothetical", "If you could design an app to help students study, what would it do?", "If I could design a study app, it would plan short review sessions automatically. Students would enter their exam dates and topics, and the app would tell them what to review each day. It would bring back difficult topics more often and easy ones less often, so that time wasn't wasted. I would also add a feature that blocks social media for twenty-five minutes at a time. If students used it regularly, they would probably feel less stressed before exams, because the work would be spread out.", { phrases: ["ph21", "ph24"] }),
      Q("int-6-4", "opinion", "Do you think students should be allowed to use artificial intelligence tools for their assignments?", "I tend to think they should be allowed, but with clear limits. These tools can explain difficult ideas and give quick feedback on a draft, which is helpful when a teacher isn't available. On the other hand, if a student lets the tool write the whole assignment, they don't learn anything. For example, using it to check grammar is very different from asking it to produce an essay. Overall, I believe universities should teach students how to use these tools responsibly rather than simply banning them.", { phrases: ["ph06", "ph26", "ph41"] }),
    ],
  },
]);

const PH = (id, func, phrase, tr, example, register, level) => ({ id, function: func, phrase, tr, example, register, level });

export const PHRASE_FUNCTIONS = Object.freeze({
  opinion: "Görüş bildirme",
  example: "Örnek verme",
  reason: "Neden-sonuç",
  compare: "Karşılaştırma",
  time: "Doğal zaman kazanma",
  closing: "Toparlama",
  agree: "Katılma ve karşı çıkma",
  addition: "Ekleme ve sıralama",
  hedge: "Temkinli konuşma",
});

export const PHRASES = Object.freeze([
  PH("ph01", "opinion", "In my opinion, …", "Bence, …", "In my opinion, group projects teach patience.", "both", "A2"),
  PH("ph02", "opinion", "I'd say that …", "… diyebilirim", "I'd say that mornings are my most productive time.", "speech", "B1"),
  PH("ph03", "opinion", "From my experience, …", "Deneyimlerime göre, …", "From my experience, short breaks help me focus.", "speech", "B1"),
  PH("ph04", "opinion", "I strongly believe that …", "…e kesinlikle inanıyorum", "I strongly believe that libraries should stay open later.", "both", "B1"),
  PH("ph05", "opinion", "As far as I'm concerned, …", "Bana kalırsa, …", "As far as I'm concerned, the cost is the biggest issue.", "speech", "B2"),
  PH("ph06", "opinion", "I tend to think that …", "… diye düşünme eğilimindeyim", "I tend to think that smaller classes are more effective.", "both", "B2"),
  PH("ph07", "opinion", "I'm not completely convinced that …", "…den tam olarak emin değilim", "I'm not completely convinced that online exams are fair.", "both", "C1"),
  PH("ph08", "opinion", "It seems to me that …", "Bana öyle geliyor ki …", "It seems to me that most students prefer flexible deadlines.", "speech", "B2"),
  PH("ph09", "example", "For example, …", "Örneğin, …", "For example, last semester I joined a coding club.", "both", "A2"),
  PH("ph10", "example", "For instance, …", "Mesela, …", "For instance, my roommate studies with music on.", "both", "B1"),
  PH("ph11", "example", "A good example of this is …", "Bunun iyi bir örneği …", "A good example of this is the new bike-sharing system.", "both", "B1"),
  PH("ph12", "example", "Take … as an example.", "… örneğini ele alalım.", "Take my hometown as an example.", "speech", "B2"),
  PH("ph13", "example", "I remember when …", "… zamanı hatırlıyorum", "I remember when I gave my first presentation in English.", "speech", "A2"),
  PH("ph14", "example", "Last semester, …", "Geçen dönem, …", "Last semester, I had three exams in one week.", "speech", "A2"),
  PH("ph15", "example", "In my case, …", "Benim durumumda, …", "In my case, studying at night never works.", "speech", "B1"),
  PH("ph16", "example", "… such as …", "… gibi (örnek sayarken)", "I enjoy outdoor activities such as hiking and cycling.", "both", "B1"),
  PH("ph17", "reason", "The main reason is that …", "Asıl neden şu: …", "The main reason is that I learn faster with feedback.", "both", "B1"),
  PH("ph18", "reason", "That's because …", "Bunun nedeni …", "That's because the bus is often late.", "speech", "A2"),
  PH("ph19", "reason", "This is mainly due to …", "Bu esas olarak X'ten kaynaklanıyor", "This is mainly due to the high cost of housing.", "both", "B2"),
  PH("ph20", "reason", "As a result, …", "Sonuç olarak, …", "As a result, I started planning my week on Sundays.", "both", "B1"),
  PH("ph21", "reason", "This means that …", "Bu, … anlamına geliyor", "This means that students have more time to revise.", "both", "B1"),
  PH("ph22", "reason", "One reason is …, and another is …", "Bir neden X, bir diğeri Y", "One reason is the price, and another is the location.", "speech", "B1"),
  PH("ph23", "reason", "Because of this, …", "Bu yüzden, …", "Because of this, I always save a copy of my work.", "both", "A2"),
  PH("ph24", "reason", "That's why …", "İşte bu yüzden …", "That's why I prefer studying in the morning.", "speech", "A2"),
  PH("ph25", "compare", "Compared to …, …", "X'e kıyasla, …", "Compared to buses, trains are more reliable.", "both", "B1"),
  PH("ph26", "compare", "On the other hand, …", "Öte yandan, …", "On the other hand, living alone can be lonely.", "both", "B1"),
  PH("ph27", "compare", "… is much more … than …", "X, Y'den çok daha …", "Cycling is much more practical than driving in my city.", "both", "A2"),
  PH("ph28", "compare", "Unlike …, …", "X'in aksine, …", "Unlike my old school, this university has a huge library.", "both", "B2"),
  PH("ph29", "compare", "Both … and … have their advantages.", "Hem X'in hem Y'nin avantajları var.", "Both online and in-person classes have their advantages.", "both", "B1"),
  PH("ph30", "compare", "While …, …", "X iken (bir yandan), …", "While online classes are flexible, they can feel isolating.", "both", "B2"),
  PH("ph31", "compare", "In contrast, …", "Buna karşılık, …", "In contrast, my brother learns best by reading.", "both", "B2"),
  PH("ph32", "compare", "The biggest difference is that …", "En büyük fark şu: …", "The biggest difference is that seminars are interactive.", "speech", "B1"),
  PH("ph33", "time", "That's an interesting question.", "Bu ilginç bir soru.", "That's an interesting question — I'd say it depends on the person.", "speech", "A2"),
  PH("ph34", "time", "Let me think about that for a second.", "Bunu bir saniye düşüneyim.", "Let me think about that for a second… I'd choose the library.", "speech", "B1"),
  PH("ph35", "time", "I've never really thought about it, but …", "Bunu hiç düşünmemiştim ama …", "I've never really thought about it, but I'd probably choose science.", "speech", "B1"),
  PH("ph36", "time", "Well, it depends on …", "Şey, X'e bağlı", "Well, it depends on the subject.", "speech", "B1"),
  PH("ph37", "time", "To be honest, …", "Açıkçası, …", "To be honest, I don't enjoy group work very much.", "speech", "A2"),
  PH("ph38", "time", "Off the top of my head, …", "İlk aklıma gelen, …", "Off the top of my head, I'd say time management.", "speech", "C1"),
  PH("ph39", "time", "One thing that comes to mind is …", "Aklıma gelen bir şey …", "One thing that comes to mind is my grandmother's garden.", "speech", "B2"),
  PH("ph40", "time", "What I mean is …", "Demek istediğim …", "What I mean is that practice matters more than talent.", "speech", "B1"),
  PH("ph41", "closing", "Overall, …", "Genel olarak, …", "Overall, I think the benefits are bigger than the costs.", "both", "B1"),
  PH("ph42", "closing", "So, all in all, …", "Sonuçta, her şey düşünüldüğünde …", "So, all in all, I'd recommend it to any student.", "speech", "B2"),
  PH("ph43", "closing", "That's why I think …", "Bu yüzden düşünüyorum ki …", "That's why I think schools should start later.", "speech", "B1"),
  PH("ph44", "closing", "In short, …", "Kısacası, …", "In short, it saves time and money.", "both", "B1"),
  PH("ph45", "closing", "To sum up, …", "Özetle, …", "To sum up, both options work, but I prefer the first.", "both", "B1"),
  PH("ph46", "closing", "For these reasons, …", "Bu nedenlerle, …", "For these reasons, I support the new policy.", "both", "B2"),
  PH("ph47", "closing", "At the end of the day, …", "Nihayetinde, …", "At the end of the day, what matters is consistency.", "speech", "B2"),
  PH("ph48", "closing", "That experience taught me that …", "O deneyim bana … öğretti.", "That experience taught me that asking for help is not a weakness.", "speech", "B1"),
  PH("ph49", "opinion", "I think …", "Bence …; Sanırım …", "I think online classes are useful for working students.", "both", "A1"),
  PH("ph50", "opinion", "I believe that …", "… olduğuna inanıyorum.", "I believe that every student should learn to cook.", "both", "A2"),
  PH("ph51", "opinion", "Personally, I feel that …", "Kişisel olarak … diye düşünüyorum.", "Personally, I feel that small classes are better for learning.", "both", "B1"),
  PH("ph52", "opinion", "My view is that …", "Benim görüşüm şu: …", "My view is that the library should stay open all night during exams.", "both", "B1"),
  PH("ph53", "opinion", "I'm in favor of …", "…'den yanayım.", "I'm in favor of longer breaks between classes.", "both", "B1"),
  PH("ph54", "opinion", "I'm firmly convinced that …", "…'e kesinlikle inanıyorum.", "I'm firmly convinced that practice matters more than talent.", "both", "C1"),
  PH("ph55", "opinion", "There's no doubt in my mind that …", "…'den hiç şüphem yok.", "There's no doubt in my mind that reading improves vocabulary.", "speech", "C1"),
  PH("ph56", "example", "Like …", "… gibi", "Healthy snacks, like fruit and nuts, give you energy.", "speech", "A2"),
  PH("ph57", "example", "To give you an example, …", "Size bir örnek vereyim, …", "To give you an example, my roommate studies with music on.", "speech", "B1"),
  PH("ph58", "example", "When I was in high school, …", "Lisedeyken …", "When I was in high school, I joined a science club.", "speech", "A2"),
  PH("ph59", "example", "This was especially true when …", "Bu özellikle … olduğunda geçerliydi.", "This was especially true when I had three exams in one week.", "both", "B2"),
  PH("ph60", "example", "A case in point is …", "Buna iyi bir örnek …", "A case in point is the new bike-sharing program on campus.", "both", "C1"),
  PH("ph61", "example", "To illustrate, …", "Örneklemek gerekirse, …", "To illustrate, the city planted trees to reduce summer heat.", "both", "B2"),
  PH("ph62", "reason", "So …", "Bu yüzden …", "The bus was full, so I walked to class.", "speech", "A1"),
  PH("ph63", "reason", "Because …", "Çünkü …", "I study early because the library is quiet in the morning.", "both", "A1"),
  PH("ph64", "reason", "That's the reason why …", "İşte bu yüzden …", "The rooms are cheaper. That's the reason why I live off campus.", "speech", "B1"),
  PH("ph65", "reason", "This leads to …", "Bu …'e yol açar.", "Too much screen time leads to poor sleep.", "both", "B1"),
  PH("ph66", "reason", "Since …", "…'den dolayı; …'diği için", "Since the course is online, I can watch the lectures at night.", "both", "B1"),
  PH("ph67", "reason", "As a consequence, …", "Bunun sonucu olarak, …", "Many students skip breakfast. As a consequence, they feel tired in class.", "both", "B2"),
  PH("ph68", "reason", "This can be attributed to …", "Bu …'e bağlanabilir.", "The higher scores can be attributed to the new tutoring program.", "both", "C1"),
  PH("ph69", "reason", "Owing to …", "… nedeniyle", "Owing to the storm, the event was postponed.", "both", "C1"),
  PH("ph70", "compare", "… is better than …", "… …'den daha iyidir.", "Studying in a group is better than studying alone for me.", "speech", "A2"),
  PH("ph71", "compare", "Similarly, …", "Benzer şekilde, …", "Similarly, many students prefer short videos to long lectures.", "both", "B1"),
  PH("ph72", "compare", "Whereas …", "…'ken; oysa", "Whereas my brother likes math, I prefer languages.", "both", "B2"),
  PH("ph73", "compare", "Neither … nor …", "Ne … ne de …", "Neither the bus nor the train is fast enough.", "both", "B2"),
  PH("ph74", "compare", "By comparison, …", "Kıyasla, …", "By comparison, the old system was much slower.", "both", "B2"),
  PH("ph75", "compare", "Conversely, …", "Tersine, …", "Some students work better at night; conversely, others need the morning.", "both", "C1"),
  PH("ph76", "compare", "There's a world of difference between … and …", "… ile … arasında dağlar kadar fark var.", "There's a world of difference between reading a topic and teaching it.", "speech", "C1"),
  PH("ph77", "time", "Hmm, let me see …", "Hmm, bir bakayım …", "Hmm, let me see … I'd probably choose the science museum.", "speech", "A2"),
  PH("ph78", "time", "That's a good question.", "Bu güzel bir soru.", "That's a good question. I think I'd choose the second option.", "speech", "A2"),
  PH("ph79", "time", "How can I put this?", "Nasıl söylesem?", "How can I put this? It was difficult but very rewarding.", "speech", "B1"),
  PH("ph80", "time", "If I had to choose, …", "Seçmem gerekseydi, …", "If I had to choose, I'd say living on campus.", "speech", "B1"),
  PH("ph81", "time", "I'd have to say …", "… demem gerekir.", "I'd have to say that my biggest challenge was time management.", "speech", "B1"),
  PH("ph82", "time", "It's hard to say, but …", "Söylemesi zor ama …", "It's hard to say, but probably the first option.", "speech", "B2"),
  PH("ph83", "time", "Now that I think about it, …", "Şimdi düşünüyorum da, …", "Now that I think about it, that class changed my plans.", "speech", "B2"),
  PH("ph84", "closing", "So, …", "Yani, …; Sonuç olarak, …", "So, that's why I prefer studying in the morning.", "speech", "A2"),
  PH("ph85", "closing", "In conclusion, …", "Sonuç olarak, …", "In conclusion, the benefits are greater than the costs.", "both", "B1"),
  PH("ph86", "closing", "All things considered, …", "Her şey göz önüne alındığında, …", "All things considered, I'd still recommend the course.", "both", "B2"),
  PH("ph87", "closing", "Taking everything into account, …", "Her şeyi hesaba katarak, …", "Taking everything into account, a flexible schedule works best.", "both", "C1"),
  PH("ph88", "closing", "That's the main reason I …", "… olmamın temel nedeni bu.", "That's the main reason I chose this university.", "speech", "B1"),
  PH("ph89", "closing", "Ultimately, …", "Nihayetinde, …", "Ultimately, the decision depends on your goals.", "both", "B2"),
  PH("ph90", "agree", "I agree with …", "…'e katılıyorum.", "I agree with the first student.", "both", "A2"),
  PH("ph91", "agree", "I don't agree with …", "…'e katılmıyorum.", "I don't agree with the idea of longer school days.", "both", "A2"),
  PH("ph92", "agree", "That's a fair point, but …", "Haklı bir nokta, ama …", "That's a fair point, but online classes can feel lonely.", "speech", "B1"),
  PH("ph93", "agree", "I see what you mean, but …", "Ne demek istediğini anlıyorum, ama …", "I see what you mean, but the cost is too high.", "speech", "B1"),
  PH("ph94", "agree", "I partly agree, because …", "Kısmen katılıyorum, çünkü …", "I partly agree, because some homework is useful.", "both", "B1"),
  PH("ph95", "agree", "I completely agree that …", "…'e tamamen katılıyorum.", "I completely agree that students need more sleep.", "both", "B1"),
  PH("ph96", "agree", "I'd go along with that, up to a point.", "Bir yere kadar buna katılırım.", "I'd go along with that, up to a point, but there are exceptions.", "speech", "B2"),
  PH("ph97", "agree", "While I understand that …, I still think …", "… anlıyorum ama yine de … düşünüyorum.", "While I understand that tests are useful, I still think projects show more.", "both", "B2"),
  PH("ph98", "agree", "… makes a valid point about …", "… … konusunda geçerli bir noktaya değiniyor.", "Andrew makes a valid point about cost, but he ignores the long-term benefits.", "both", "B2"),
  PH("ph99", "agree", "I would challenge the idea that …", "… fikrine itiraz ederim.", "I would challenge the idea that technology always makes learning easier.", "both", "C1"),
  PH("ph100", "agree", "Building on …'s point, …", "…'nin fikrinden yola çıkarak, …", "Building on Kelly's point, I'd add that libraries also offer quiet space.", "both", "C1"),
  PH("ph101", "addition", "First, …", "İlk olarak, …", "First, I would make a study plan.", "both", "A1"),
  PH("ph102", "addition", "Also, …", "Ayrıca, …", "Also, the campus has a free gym.", "speech", "A1"),
  PH("ph103", "addition", "And another thing is …", "Bir de şu var: …", "And another thing is the price of food.", "speech", "A2"),
  PH("ph104", "addition", "Then, …", "Sonra, …", "Then, I review my notes before bed.", "both", "A1"),
  PH("ph105", "addition", "On top of that, …", "Üstelik, …", "On top of that, the course is free.", "speech", "B1"),
  PH("ph106", "addition", "What's more, …", "Dahası, …", "What's more, the professor gives detailed feedback.", "both", "B1"),
  PH("ph107", "addition", "In addition, …", "Ek olarak, …", "In addition, students can borrow laptops.", "both", "B1"),
  PH("ph108", "addition", "Not only … but also …", "Sadece … değil, aynı zamanda …", "The program not only saves money but also reduces waste.", "both", "B2"),
  PH("ph109", "addition", "Furthermore, …", "Bunun yanı sıra, …", "Furthermore, smaller classes allow more discussion.", "both", "B2"),
  PH("ph110", "addition", "Another point worth mentioning is …", "Belirtmeye değer bir başka nokta …", "Another point worth mentioning is the effect on the environment.", "both", "C1"),
  PH("ph111", "hedge", "Maybe …", "Belki …", "Maybe the library could open earlier.", "speech", "A1"),
  PH("ph112", "hedge", "I'm not sure, but …", "Emin değilim ama …", "I'm not sure, but I think the deadline is Friday.", "speech", "A2"),
  PH("ph113", "hedge", "It might be …", "… olabilir.", "It might be better to start with an easier course.", "both", "B1"),
  PH("ph114", "hedge", "In some cases, …", "Bazı durumlarda, …", "In some cases, working part-time helps students organize their time.", "both", "B1"),
  PH("ph115", "hedge", "To some extent, …", "Bir dereceye kadar, …", "To some extent, success depends on luck.", "both", "B2"),
  PH("ph116", "hedge", "It's likely that …", "Muhtemelen …; … olması olası.", "It's likely that more students will choose online courses.", "both", "B2"),
  PH("ph117", "hedge", "Generally speaking, …", "Genel olarak konuşursak, …", "Generally speaking, students sleep less during exams.", "both", "B2"),
  PH("ph118", "hedge", "There's some evidence that …", "… yönünde bazı kanıtlar var.", "There's some evidence that exercise improves memory.", "both", "C1"),
  PH("ph119", "hedge", "This may not always be the case, but …", "Bu her zaman geçerli olmayabilir ama …", "This may not always be the case, but small groups usually work faster.", "both", "C1"),
]);

const PL = (id, title, focus, tip, kind, items, sentences, selfCheck) => ({ id, title, focus, tip, kind, items, sentences, selfCheck });

export const PRONUNCIATION = Object.freeze([
  PL("P1", "/θ/ ve /ð/: th sesleri", "Türkçede bu iki ses yoktur; çoğu zaman t/d veya s/z ile değiştirilir. Dilinin ucunu üst ön dişlerinin hafifçe arasına koy ve havayı üfle: think'te ses telleri titreşmez (/θ/), they'de titreşir (/ð/). Elini boğazına koyarak farkı hissedebilirsin.", "Dil ucu dişlerin arasından çok az görünmeli; ayna karşısında dene.", "pairs",
    [["think", "sink"], ["thank", "tank"], ["three", "tree"], ["path", "pass"], ["thin", "tin"], ["they", "day"], ["then", "den"], ["breathe", "breeze"]],
    ["I think these three theories are worth testing.", "They thanked their teacher on Thursday.", "The path through the north side is thinner."],
    "Kaydında th seslerinde dilin dişlerin arasında olduğunu duyabiliyor musun? t/s ile karışan kelimeyi not et."),
  PL("P2", "/w/ ve /v/", "Türkçede v bazen w'ye yakın söylenir (tavuk), ama İngilizcede ikisi ayrı anlam taşır. /w/ için dudakları yuvarlayıp öne uzat, dişler dudağa değmesin; /v/ için üst dişler alt dudağa hafifçe değer.", "/w/'de dudaklar 'u' der gibi yuvarlak; /v/'de üst dişleri alt dudakta hisset.", "pairs",
    [["west", "vest"], ["wine", "vine"], ["wet", "vet"], ["worse", "verse"], ["wary", "vary"], ["wail", "veil"], ["while", "vile"]],
    ["We visited a very wet village.", "The vet went west on Wednesday.", "Will you review the video with me?"],
    "w ile v'yi ayırt edebildin mi? Özellikle 'very' ve 'west' kelimelerini kendi kaydında dinle."),
  PL("P3", "/æ/ ve /e/", "Türkçede tek bir 'e' sesi vardır. İngilizcede /æ/ (bad) ağız daha açık ve çene aşağıda söylenir; /e/ (bed) Türkçe 'e'ye yakındır.", "/æ/ için çeneni bir parmak genişliğinde aç; 'a' ile 'e' arası bir ses.", "pairs",
    [["bad", "bed"], ["man", "men"], ["had", "head"], ["sat", "set"], ["pan", "pen"], ["land", "lend"], ["sad", "said"], ["bag", "beg"]],
    ["The man had a bad headache.", "Can you send the black pen back?", "Ten cats sat on the mat."],
    "bad ile bed kaydında farklı duyuluyor mu? Fark yoksa çeneyi biraz daha aç."),
  PL("P4", "Kısa ve uzun ünlüler", "live – leave, full – fool: uzun ünlü hem daha uzun hem daha gergindir. Türkçede ünlü uzunluğu anlam değiştirmez, İngilizcede değiştirir.", "Uzun ünlüde dudaklar daha gergin (leave'de gülümser gibi, fool'da öne uzanmış).", "pairs",
    [["live", "leave"], ["ship", "sheep"], ["sit", "seat"], ["fill", "feel"], ["full", "fool"], ["pull", "pool"], ["hit", "heat"], ["look", "Luke"]],
    ["Please sit in this seat.", "Fill the cup if you feel thirsty.", "We'll leave if you don't live here."],
    "Çiftlerde uzun ünlü gerçekten daha uzun mu? sit ile seat'i art arda dinle."),
  PL("P5", "Schwa ve vurgusuz heceler", "İngilizcede vurgusuz hecelerin çoğu /ə/ (schwa) denen kısa ve belirsiz bir sesle söylenir: about = /əˈbaʊt/. Her heceyi Türkçedeki gibi tam ve eşit söylemek konuşmayı yapay ve yavaş yapar.", "Vurgulu heceyi uzun ve net, diğerlerini kısa ve gevşek söyle.", "words",
    [["about", "a·BOUT"], ["problem", "PROB·lem"], ["today", "to·DAY"], ["banana", "ba·NA·na"], ["computer", "com·PU·ter"], ["support", "sup·PORT"], ["condition", "con·DI·tion"], ["chocolate", "CHOC·late"]],
    ["Today's problem is about the computer.", "Can you support the condition we agreed on?", "I'd like a banana and a chocolate bar."],
    "Vurgusuz hecelerde sesi kısalttın mı? 'about'u 'abaut' diye iki tam hece söylemedin mi?"),
  PL("P6", "-ed sonu: /t/, /d/, /ɪd/", "Geçmiş zaman -ed eki üç türlü okunur: ötümsüz sesten sonra /t/ (asked, stopped), ötümlü sesten sonra /d/ (played, called), t veya d'den sonra /ɪd/ (needed, wanted). Ek hece yalnız /ɪd/ türünde eklenir; 'ask-ed' diye iki hece söylemek yaygın bir hatadır.", "asked tek hecedir: 'askt'. needed iki hecedir: 'nee-did'.", "words",
    [["asked", "/t/"], ["stopped", "/t/"], ["watched", "/t/"], ["played", "/d/"], ["called", "/d/"], ["opened", "/d/"], ["needed", "/ɪd/"], ["wanted", "/ɪd/"], ["decided", "/ɪd/"]],
    ["She asked a question and waited for the answer.", "We played, laughed, and talked all night.", "I decided to stop and called my mother."],
    "asked ve stopped'ı tek hece söyledin mi? Dikte karşılaştırması -ed'i yakaladı mı?"),
  PL("P7", "Kelime sonu ünsüzler ve /ŋ/", "Türkçe hece yapısı ünsüz kümelerini sevmez; bu yüzden 'tests' gibi kelimelere araya ünlü eklenir veya son ses düşer. -ng sesi /ŋ/ ise tek bir genizsil sestir; 'thinking'in sonuna ayrıca 'g' eklenmez.", "Son ünsüzleri bırakmadan bitir; -ng'de dilin arkası damağa değer ve orada kalır.", "words",
    [["tests", "-sts"], ["months", "-nths"], ["texts", "-ksts"], ["asks", "-sks"], ["helped", "-lpt"], ["world", "-rld"], ["thinking", "-ŋ"], ["sing", "-ŋ"], ["long", "-ŋ"], ["morning", "-ŋ"]],
    ["She texts me twice a month.", "I'm thinking about the long morning tests.", "The world asks for clear results."],
    "Son ünsüzler kaydında duyuluyor mu? 'thinking'in sonunda 'g' patlaması var mı?"),
  PL("P8", "Kelime vurgusu ve kelime ailesi", "İngilizcede her kelimenin bir vurgulu hecesi vardır ve kelime ailesinde vurgu yer değiştirebilir. Yanlış hece vurgulanırsa kelime tanınmayabilir.", "Vurgulu hece daha uzun, daha yüksek ve daha net; diğerleri schwa'ya yaklaşır.", "pairs",
    [["PHOtograph", "phoTOgraphy"], ["ANalyze", "aNALysis"], ["REcord (isim)", "reCORD (fiil)"], ["PREsent (isim)", "preSENT (fiil)"], ["DEmocrat", "deMOcracy"], ["eCOnomy", "ecoNOmic"], ["aCAdemy", "acaDEmic"]],
    ["We need to record the lecture for the record.", "Analyze the data before you write the analysis.", "The academic year at the academy starts in October."],
    "Çiftlerde vurgunun yer değiştirdiğini kendi kaydında duyabiliyor musun?"),
  PL("P9", "Cümle vurgusu ve zayıf biçimler", "İçerik kelimeleri (isim, fiil, sıfat) vurgulu, işlev kelimeleri (to, for, can, and, of, a, the) zayıf söylenir: to → /tə/, for → /fə/, can → /kən/. Hepsini eşit vurgulamak hem yavaşlatır hem dinleyiciyi yorar.", "İşlev kelimelerini atlama; sadece kısalt ve vurgusuz söyle.", "words",
    [["to", "/tə/"], ["for", "/fə/"], ["can", "/kən/"], ["and", "/ən/"], ["of", "/əv/"], ["at", "/ət/"], ["was", "/wəz/"], ["from", "/frəm/"]],
    ["I want to go for a walk.", "We can meet at the end of the day.", "A cup of tea and a piece of cake."],
    "Kaydında vurgu içerik kelimelerine mi düşüyor? 'to' ve 'for' tam mı, zayıf mı?"),
  PL("P10", "Bağlama (linking)", "Bir kelime ünsüzle bitip sonraki ünlüyle başlıyorsa ikisi bağlanır: 'turn it off' → 'tur-ni-toff'. Türkçe konuşanlar kelimeleri tek tek ayırma eğilimindedir; bağlamak hem doğal hem anlaşılırdır.", "Ünsüzü bir sonraki kelimeye 'taşı'; arada duraklama yapma.", "words",
    [["turn it off", "tur-ni-toff"], ["an apple", "a-napple"], ["pick it up", "pi-ki-tup"], ["look at it", "loo-ka-tit"], ["an hour ago", "a-nou-ra-go"], ["find out", "fin-dout"], ["check in", "che-kin"], ["as soon as", "a-ssoo-nas"]],
    ["Pick it up and put it on the table.", "Turn it off as soon as you're done.", "I found out an hour ago."],
    "Öbekleri tek kelime gibi akıtabildin mi? Dikte bağlanan öbekleri doğru yazdı mı?"),
  PL("P11", "Tonlama: soru türleri, liste, emin olmama", "Evet/hayır sorularında ses genellikle sonda yükselir (↗), wh- sorularında ve düz cümlede alçalır (↘). Listede son öğeye kadar yükselip sonda alçalır. Emin olmadığında cümle sonunu hafif yükseltmek belirsizlik anlatır.", "Cümlenin son vurgulu kelimesinde sesini yükselt veya alçalt; tüm cümleyi değil.", "words",
    [["Are you coming? ↗", "evet/hayır"], ["Where are you going? ↘", "wh- sorusu"], ["You're coming? ↗", "şaşkınlık"], ["red ↗, green ↗, and blue ↘", "liste"], ["I think so… ↗", "emin değil"], ["It's on Monday. ↘", "bilgi"]],
    ["Do you need help, or are you fine?", "We need paper, pens, and a stapler.", "What time does the library close?"],
    "Soruların sonunda ses yönü doğru mu? Liste tonlamasını kaydında duyabiliyor musun?"),
  PL("P12", "Anlam öbekleri ve duraklama", "Uzun cümleyi anlam öbeklerine böl ve öbek sınırlarında kısa duraklama yap: 'Students who cannot come in person | may join the meeting online.' Duraklamayı dil bilgisi sınırında yapmak anlamı korur ve Listen and Repeat'te cümleyi hatırlamayı kolaylaştırır.", "Duraklama yalnız | işaretlerinde; öbek içinde kelimeleri bağla.", "words",
    [["After the lecture | we went to the library", "zaman öbeği"], ["The report | published last year | was widely cited", "arkadan niteleme"], ["If you finish early | you can leave", "koşul"], ["The students in the back row | couldn't hear", "uzun özne"], ["Because the bus was late | I missed the first class", "neden"], ["What I need | is more time", "vurgu yapısı"]],
    ["Before you leave, | I'll give you a few articles | that should help you.", "Although the evidence is limited, | the preliminary results | are encouraging.", "Only after several studies replicate the effect | can we draw firmer conclusions."],
    "Duraklamaları öbek sınırlarında mı yaptın? Öbek ortasında nefes aldığın yer oldu mu?"),
]);

/** Prompts copied verbatim from CONTENT-SPEC v4; placeholders filled by the app. */
export const PROMPTS = Object.freeze({
  writing: (taskType, summary, response, help) => `Aşağıda özgün bir TOEFL iBT yazma pratiğinin görev özeti ve kendi İngilizce yanıtım var. Geri bildirimi Türkçe yaz. Önce görevin hangi noktalarını karşıladığımı belirt. Metnimden kısa örneklerle en önemli iki veya üç dil ya da yapı hatasını açıkla. Her hata için düzeltme ve bir yeniden yazma önerisi ver. Anlamımı koru. TOEFL puanı veya CEFR seviyesi verme.
Görev türü: ${taskType}
Görev özeti: ${summary}
Yanıtım: ${response}
Süre ve kullandığım yardım: ${help}`,
  transcript: (question, transcript) => `Aşağıda özgün bir TOEFL iBT mülakat pratiği sorusu ve yaklaşık 45 saniyelik cevabımın dikteyle elde edilmiş transkripti var. Transkript dikte hatası içerebilir; yalnız açıkça dil bilgisi veya kelime seçimi olan hataları belirt. Geri bildirimi Türkçe yaz. Soruya doğrudan cevap verip vermediğimi, gerekçe ve örneğimin yeterliliğini ve fikir sırasını değerlendir. En önemli iki veya üç hatayı düzeltmesiyle göster. Aynı fikri daha doğal anlatan, 45 saniyede söylenebilecek bir yeniden konuşma önerisi ver. Telaffuz, akıcılık, TOEFL puanı veya CEFR seviyesi hakkında yorum yapma.
Soru: ${question}
Transkriptim: ${transcript}`,
  rehearsal: (theme) => `Benimle TOEFL iBT "Take an Interview" provası yap. Konu: ${theme}. Bir kampüs araştırmacısı gibi davran ve kişisel deneyimden görüşe ilerleyen dört soruyu birer birer İngilizce sor. Her sorudan sonra yaklaşık 45 saniye konuşmama izin ver ve cevaplarım sırasında yorum yapma. Dört soru bitince Türkçe olarak her cevap için doğrudan cevap, gerekçe/örnek ve dil kullanımı hakkında kısa geri bildirim ver; duyduğun en önemli üç dil hatasını düzeltmesiyle yaz. Telaffuz puanı, TOEFL puanı veya CEFR seviyesi verme.`,
});

export const SPEAKING_SETS = Object.freeze([
  ...REPEAT_SETS.map((set) => ({ ...set, kind: "repeat", items: set.sentences })),
  ...INTERVIEW_SETS.map((set) => ({ ...set, kind: "interview", items: set.questions })),
]);
export const SET_BY_ID = new Map(SPEAKING_SETS.map((set) => [set.id, set]));
export const PRONUNCIATION_BY_ID = new Map(PRONUNCIATION.map((lesson) => [lesson.id, lesson]));
export const PHRASE_BY_ID = new Map(PHRASES.map((phrase) => [phrase.id, phrase]));
