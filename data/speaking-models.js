// Annotated model answers for every Take an Interview question (v0.6).
// Each answer follows the four steps taught in the app: answer → explain →
// example → result (consequence/reflection). Phrases worth reusing are wrapped
// in {braces} and highlighted in the app. Answers aim at 110–130 words, the pace
// a fluent 45-second answer needs. All text is original.

export const STEPS = Object.freeze({
  answer: { label: "1 · Cevap", tr: "Soruya ilk cümlede doğrudan cevap ver." },
  explain: { label: "2 · Açıkla", tr: "Ana nedenini söyle." },
  example: { label: "3 · Örnek", tr: "Kısa, somut, kişisel bir örnek ver." },
  result: { label: "4 · Sonuç", tr: "Sonucu ya da bundan ne çıkardığını söyle." },
});

export const MODEL_SEGMENTS = Object.freeze({
  "int-1-1": [
    ["answer", "{One skill I learned outside of school} is cooking."],
    ["explain", "{The main reason is that} I moved into a shared apartment in my first year, and eating out every day was simply too expensive."],
    ["example", "{I remember when} I tried to make rice for the first time and burned the whole pot. Instead of giving up, I started watching short cooking videos and practicing three evenings a week. After a couple of months I could make about ten simple dishes, and my roommates started asking me to cook for them."],
    ["result", "{That experience taught me that} small, regular practice works much better than waiting until you feel ready, and I use the same approach for learning English now."],
  ],
  "int-1-2": [
    ["answer", "{Honestly,} the practical skill I'd most like to learn is basic bicycle repair."],
    ["explain", "{That's because} I ride my bike to campus almost every day, so even a small problem can make me late for class."],
    ["example", "{Recently,} I had a flat tire on the way to an exam, and I had to leave the bike and run the rest of the way. If I had known how to fix it, it would have taken ten minutes. I'd also like to learn how to adjust the brakes, because the repair shop near me is always busy."],
    ["result", "{So, overall,} learning this skill would save me time and money, and I'd feel much more confident on longer rides."],
  ],
  "int-1-3": [
    ["answer", "{If I were in that situation,} I would advise my friend to make the goal much smaller."],
    ["explain", "{The main reason is that} big goals feel overwhelming, so people quit before they see any progress."],
    ["example", "{For example,} instead of saying ‘I'm going to learn the guitar,’ my friend could decide to practice one song for ten minutes a day. I would also suggest finding a practice partner, because it's much harder to skip a session when someone is waiting for you. {As a matter of fact,} that's exactly how I kept going with my own running routine last year."],
    ["result", "{As a result,} those small wins would build motivation, and after a few months the bigger goal wouldn't seem impossible anymore."],
  ],
  "int-1-4": [
    ["answer", "{I definitely think} schools should teach more practical skills like managing money."],
    ["explain", "{The main reason is that} everyone needs these skills after graduation, but very few students learn them at home."],
    ["example", "{For instance,} several of my friends got their first credit card at university without understanding how interest works. One of them only paid the minimum each month and ended up owing much more than she had spent. A single class on budgeting in high school could have prevented that. {I have to admit} that the schedule is already full, but even one short course a year would help."],
    ["result", "{That's why I think} practical skills deserve a place in the curriculum, because they affect students' lives every single day."],
  ],
  "int-2-1": [
    ["answer", "{One time that comes to mind is} when my classmates and I had to share one small study room during exam week."],
    ["explain", "{The problem was that} everyone wanted to use it at the same time, so people were arguing and nobody could concentrate."],
    ["example", "I suggested that we create a simple online schedule where each group could reserve two-hour blocks. At first a few people ignored it, so we posted a printed copy on the door as well. Within a week, the arguments stopped, and we even added a quiet hour every evening for people who wanted to work alone."],
    ["result", "{That experience taught me that} a clear, simple system can solve a conflict faster than long discussions, and I've used the same idea in group projects since then."],
  ],
  "int-2-2": [
    ["answer", "{I usually prefer} going to a small café near my campus when I want to study or relax."],
    ["explain", "{That's because} it's quiet in the mornings, but there's still a little background noise, which actually helps me focus."],
    ["example", "{In my case,} the library feels too silent, and I end up checking my phone instead of reading. At the café, I order one coffee, sit by the window, and work for about two hours without stopping. {Except when} it's raining, it's also a nice walk from my apartment, so I get some fresh air on the way."],
    ["result", "{Overall,} having one regular place makes it easier to start working, because my brain already connects that place with studying."],
  ],
  "int-2-3": [
    ["answer", "{I'd say that} the best change would be adding more seating and shade to the courtyard at my school."],
    ["explain", "{The main reason is that} it's the only open space on campus, but there are just two benches and no trees, so almost nobody uses it."],
    ["example", "{For example,} last spring the student council put out a few tables and umbrellas for a week as a test. Suddenly the courtyard was full at lunchtime, and some professors even held small discussion groups there. When the tables were removed, people went back to eating alone in the hallways."],
    ["result", "{So,} a small investment in seating and a few trees would turn an empty space into a real meeting place, and that would make the school feel more like a community."],
  ],
  "int-2-4": [
    ["answer", "{Well, to be honest, I have mixed feelings about this question.}"],
    ["explain", "{On the one hand,} public transportation affects almost everyone every day, so spending more on buses and trains would help people get to work and school on time."],
    ["example", "In my city, a new express bus line cut my commute from fifty minutes to thirty, and I noticed that the roads became a little less crowded. {On the other hand,} parks are just as important for people's health, especially in neighborhoods where apartments are small and there's no other place for children to play."],
    ["result", "{All things considered,} I'd give transportation slightly more money, but I don't think a city should ever ignore its green spaces."],
  ],
  "int-3-1": [
    ["answer", "{I remember when} a news article made me change my opinion about electric scooters in my city."],
    ["explain", "At first I thought they were a great idea, {because} they seemed cheap, fast and better for the environment than cars."],
    ["example", "Then I read a report based on hospital data showing that scooter injuries had tripled in one year, mostly because riders weren't wearing helmets. It also explained that many people used scooters instead of walking, not instead of driving, so the environmental benefit was smaller than I'd assumed. I checked two other sources, and they said something similar."],
    ["result", "{As a result,} I now think scooters can be useful, but only with better safety rules, and {that experience taught me} to look for data before forming a strong opinion."],
  ],
  "int-3-2": [
    ["answer", "{I usually check} two things before I trust information online: who wrote it and whether other sources agree."],
    ["explain", "{That's because} anyone can publish something that looks professional, so the design of a website tells you very little."],
    ["example", "{For instance,} last month I saw a post claiming that a common vitamin could prevent the flu. Instead of sharing it, I searched for the original study and found that it had only twelve participants. Then I looked at a university health website, and it said there wasn't enough evidence yet. It only took about five minutes."],
    ["result", "{In short,} this habit stops me from spreading false information, and it has made me much more careful about what I believe."],
  ],
  "int-3-3": [
    ["answer", "{If I could ask an expert one question,} I'd ask a climate scientist which personal change actually makes the biggest difference."],
    ["explain", "{The main reason is that} I see so much advice online, and it's hard to know which actions matter and which ones are mostly symbolic."],
    ["example", "{For example,} some people say avoiding plastic straws is important, while others say flying less or changing your diet has a much larger effect. Right now I try to do a little of everything, but I don't know where my effort is most useful. An expert could give me a clear answer based on real data."],
    ["result", "{That way,} I could focus my time and money on the change that helps most, and I could also explain it to my friends and family."],
  ],
  "int-3-4": [
    ["answer", "{Yes, I strongly believe that} students should learn how to evaluate news in school."],
    ["explain", "{The main reason is that} young people get most of their news from social media, where false stories often spread faster than true ones."],
    ["example", "{For instance,} in high school, one teacher gave us a short lesson on checking sources. She showed us how to find the original article and how to notice when a photo was taken from a different event. A few weeks later, I recognized a fake story that my cousin had shared, and I was able to show him why it wasn't true."],
    ["result", "{That's why I think} even a few lessons like that can protect students for the rest of their lives."],
  ],
  "int-4-1": [
    ["answer", "{One time that comes to mind is} my final project in my second year at university."],
    ["explain", "{The problem was that} two days before the deadline, my laptop crashed, and I lost part of my data analysis."],
    ["example", "Instead of panicking, I made a list of what was essential and what was optional. I borrowed a computer from the library, rebuilt the most important charts first, and asked my professor whether I could submit one optional section a day later. She agreed, so I worked until late that night and finished the main part on time. {I have to admit} it was the most stressful week of the year."],
    ["result", "{That experience taught me that} under pressure, setting clear priorities is more useful than trying to do everything perfectly."],
  ],
  "int-4-2": [
    ["answer", "{I usually separate} decisions that are easy to change from decisions that are costly to change."],
    ["explain", "{That's because} I can move quickly on the first kind, but the second kind deserves careful checking."],
    ["example", "{For example,} in a group presentation last term, we chose the slide design in about five minutes, because we could change it later. But we spent a whole afternoon checking our data and our main conclusion, because a mistake there would have affected everything else. {Another way to think about it is} that I give my time to the parts the audience will actually judge."],
    ["result", "{As a result,} I rarely miss deadlines, and the important parts of my work are usually accurate."],
  ],
  "int-4-3": [
    ["answer", "{If I were in that situation,} I would first talk to the team member privately."],
    ["explain", "{The main reason is that} there might be a reason I don't know about, such as a health problem or a part-time job."],
    ["example", "I would ask what's difficult for them right now and offer to adjust the tasks if necessary. {For instance,} in a project last year, one classmate wasn't responding, and it turned out he was working night shifts. We gave him the editing work, which he could do on weekends, and he did it really well. If the situation didn't improve after that conversation, then I'd ask the professor for advice."],
    ["result", "{That way,} the problem is solved fairly, and the team still trusts each other at the end."],
  ],
  "int-4-4": [
    ["answer", "{It depends} on the course, but in general I lean toward strict deadlines."],
    ["explain", "{The main reason is that} strict deadlines prepare students for professional life, where clients and managers expect work on time."],
    ["example", "{For example,} in my statistics class, every assignment was due at nine on Monday morning, with no exceptions. It felt harsh at first, but it forced me to plan my week, and I stopped leaving everything to the last night. {On the other hand,} I think students with serious emergencies, like an illness, should still be able to ask for a short extension."],
    ["result", "{So, all in all,} clear deadlines with a few fair exceptions help students build habits they'll need after graduation."],
  ],
  "int-5-1": [
    ["answer", "{One time that comes to mind is} my first month in a student dormitory."],
    ["explain", "{The problem was that} I had never shared a room before, and my roommate went to bed about three hours later than I did."],
    ["example", "At first I couldn't sleep, and I felt frustrated every morning. Instead of complaining to other people, I talked to him directly. We agreed on quiet hours after eleven, he started using headphones, and I bought earplugs and a small lamp for my side of the room. After about a week, things were much better, and we actually became good friends."],
    ["result", "{That experience taught me that} most problems get smaller when you discuss them early and politely, instead of waiting until you're angry."],
  ],
  "int-5-2": [
    ["answer", "{Honestly, I'd rather} live with other people, as long as everyone respects a few shared rules."],
    ["explain", "{The main reason is that} it's easier to stay motivated and organized when someone else is around."],
    ["example", "{In my case,} my flatmate and I cook dinner together twice a week, so I eat much better than I would on my own. We also study in the living room some evenings, and having someone working next to me makes me less likely to waste time. {Of course,} I sometimes miss having complete silence, {but compared to} living alone, it's also a lot cheaper."],
    ["result", "{Overall,} shared housing feels more practical and more enjoyable for a student like me."],
  ],
  "int-5-3": [
    ["answer", "{If I were asked to change one thing,} I would create more quiet study spaces inside the dormitories."],
    ["explain", "{The main reason is that} many students have to walk to the library late at night because their rooms are too noisy to work in."],
    ["example", "{For example,} in my building there are forty students on each floor, but the only place to sit is a small kitchen where people are cooking and talking. If each floor had one small study room with a few desks and good lighting, students wouldn't have to leave the building after dark. Some storage rooms could easily be converted, so the cost would be quite low."],
    ["result", "{As a result,} students would save time, feel safer, and probably have fewer conflicts with their roommates."],
  ],
  "int-5-4": [
    ["answer", "{In my opinion,} it's a good policy, but there should be some exceptions."],
    ["explain", "{The main reason is that} living on campus helps new students make friends and get used to university life, which matters most in the first few months."],
    ["example", "{For instance,} I met my closest friends in my dormitory, not in my classes, because we ate together and studied together every evening. Without that, my first semester would have been much lonelier. {However,} students who have family nearby or who can't afford campus housing shouldn't be forced to move, because the cost can be a real burden."],
    ["result", "{So, overall,} I support the rule, {as long as} the university allows reasonable exceptions for students in difficult situations."],
  ],
  "int-6-1": [
    ["answer", "{One time that comes to mind is} when I was struggling with probability in my statistics course."],
    ["explain", "{The problem was that} I couldn't understand the ideas from the textbook alone, because the graphs were all static."],
    ["example", "A classmate recommended an interactive website where you can change the numbers and immediately see how the graph moves. I spent about an hour experimenting with it, changing one value at a time and predicting what would happen. Suddenly the concept made sense, and I had no trouble with those questions on the exam. {As a matter of fact,} I still use similar tools when I'm learning something visual."],
    ["result", "{That experience taught me that} seeing an idea change in real time can be more effective than reading about it."],
  ],
  "int-6-2": [
    ["answer", "{I almost always} take notes on paper during lectures, and then I type them up later."],
    ["explain", "{The main reason is that} writing by hand forces me to summarize, instead of copying every word the professor says."],
    ["example", "{In my case,} when I used a laptop in my first year, I had pages of notes but remembered very little. Now I write short points on paper, and the same evening I type them into a document. That second step works as my first review, and digital notes are much easier to search before an exam. {I hardly ever} miss important points this way."],
    ["result", "{So,} even though this method takes a bit more time, I think the extra effort is definitely worth it."],
  ],
  "int-6-3": [
    ["answer", "{If I could design a study app,} it would plan short review sessions for me automatically."],
    ["explain", "{The main reason is that} most students know what to study, but they don't know when to review it, so they cram the night before an exam."],
    ["example", "Students would enter their exam dates and topics, and the app would tell them what to review each day. It would bring back difficult topics more often and easy ones less often, so no time would be wasted. {Another way to think about it is} a personal coach that remembers everything for you. I'd also add a mode that blocks social media for twenty-five minutes at a time."],
    ["result", "{As a result,} students would feel less stressed before exams, because the work would be spread out over several weeks."],
  ],
  "int-6-4": [
    ["answer", "{I tend to think} students should be allowed to use AI tools, but with clear limits."],
    ["explain", "{The main reason is that} these tools can explain difficult ideas and give quick feedback, which is helpful when a teacher isn't available."],
    ["example", "{For example,} I sometimes ask an AI tool to check whether my essay paragraph is clear, and then I rewrite it myself. That helps me learn. {However,} if a student lets the tool write the whole assignment, they don't practice anything, and the grade means nothing. {Even though} it's hard to control, I think teachers could ask students to explain how they used the tool."],
    ["result", "{Overall,} I believe universities should teach responsible use rather than simply banning these tools."],
  ],
});

/** Plain text of an annotated answer (braces removed). */
export function plainModel(segments) {
  return segments.map(([, text]) => text.replace(/[{}]/g, "")).join(" ");
}

/** The speaking guide (Öğren tab). Rubric points are paraphrased from the ETS Speaking Scoring Guide. */
export const SPEAKING_GUIDE = Object.freeze({
  scoring: [
    ["Konuya cevap ve geliştirme", "Soruya doğrudan cevap veriyor ve fikri açıklama ile örnekle geliştiriyor musun? Sadece sorunun kelimelerini tekrar etmek düşük puan alır."],
    ["Akıcılık ve hız", "Doğal bir konuşma hızı ve yerinde duraklar. Sık ve uzun duraklar, çok fazla “eee” puanı düşürür."],
    ["Anlaşılırlık", "Telaffuz, ritim ve tonlama anlamı rahat aktarıyor mu? Hızlı ama anlaşılmayan konuşma işe yaramaz."],
    ["Dil kullanımı", "Doğru ve çeşitli dil bilgisi ve kelime. Bağlaçlar fikirler arasındaki ilişkiyi (neden, karşıtlık, sonuç) kurdukları için önemlidir; sayıları değil, doğru ilişkiyi kurmaları puanı etkiler."],
  ],
  pace: "ETS bir kelime sayısı belirtmez. Rubrik doğal bir akış, anlaşılırlık ve gelişmiş bir cevap ister: soruya doğrudan cevap, bir gerekçe, somut bir ayrıntı ve 45 saniyede rahatça bitirmek. Kısa ama net ve gelişmiş bir cevap, aceleyle söylenmiş uzun bir cevaptan iyidir. Dolgu ve tekrarla uzatma. Dikte sayısı yalnız bilgi verir.",
  scenario: "Interview görevinde genellikle bir araştırmaya katılan öğrencisin; araştırmacı deneyimini, alışkanlığını, bir varsayımı ve görüşünü sorar. Soruları kampüs, eğitim, teknoloji ve toplum gibi tanıdık konulardan gelir.",
  openers: [
    "That's a tough choice, but I'd probably …",
    "That's an interesting question. I'd say …",
    "Honestly, I've never really thought about it, but …",
    "Well, it depends, but in general …",
  ],
  openersTip: "Açılış cümlesi sana düşünmek için birkaç saniye kazandırır; ama cümlenin sonunda mutlaka cevabını söyle.",
  expand: [
    ["Örnek ver", "Kısa, somut, kişisel bir an anlat: ne zaman, nerede, ne oldu. “I remember when …”, “Recently, …”, “For instance, …”"],
    ["Karşı görüşü an", "Diğer tarafın haklı bir noktasını kabul et, sonra kendi görüşüne dön. “I have to admit … However, …”, “Even though …”"],
    ["Karışık duygular", "İki tarafı da anlat: “Well, to be honest, I have mixed feelings about this question. On the one hand, … On the other hand, …” Sonda iki tarafı da kabul edebilirsin."],
  ],
  delivery: [
    "Tonlama noktalamaya değil, anlama göre değişir: bir fikri bitirirken ses genelde düşer (I prefer the library.); devam edeceğini gösterirken düz kalır veya hafifçe yükselir (If I have time, …); emin olmadığında veya evet/hayır sorarken yükselebilir (Really?). Aynı cümle farklı tonla farklı anlam taşır: 'You're coming.' (bilgi) / 'You're coming?' (şaşkınlık).",
    "Vurguyu en önemli kelimeye koy: I didn't say SHE took it (başkası aldı) / I didn't say she TOOK it (aldığını değil, ödünç aldığını).",
    "Anlam öbekleri arasında kısa dur, kelimelerin arasında değil.",
    "Kelimelerden çok doğal kalıplarla düşün: “The main reason is that …”, “That experience taught me that …”. Kalıp hazırsa beynin içeriğe odaklanır.",
    "Basit tut: 4 adım, her adımda 1–3 cümle. Karmaşık cümle kurup yarıda kalmaktan iyidir.",
  ],
  repeat: "Listen and Repeat'te puan, cümleyi birebir tekrar etmene bağlıdır. Bir iki işlev kelimesinin (a, the, to) ya da -s, -ed eklerinin düşmesi bile 5'i 4'e indirir; anlamı bozan eksikler 3 ve altına.",
});
