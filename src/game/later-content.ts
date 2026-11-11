import type { Stage, Chapter, Question } from './adventure';
import festival from '@/assets/festival-green.jpg';
import signShop from '@/assets/sign-shop.jpg';
import globeRoom from '@/assets/globe-room.jpg';
import globeEquator from '@/assets/globe-equator.jpg';
import globeBrazil from '@/assets/globe-brazil.jpg';
import globeBoth from '@/assets/globe-both.jpg';

const choice = (prompt: string, answer: string, wrong: string[], explain?: string, kind?: Question['kind']): Question =>
  ({ prompt, answer: [answer], options: [answer, ...wrong], explain: explain ?? answer, hint: explain ?? answer, ...(kind ? { kind } : {}) });

/**
 * The Fringe leaflet from the textbook unit (book page 29). Kept as data so the reader
 * can show it and the questions can be checked against it.
 */
export const FESTIVAL_POSTER = {
  title: 'Edinburgh Festival Fringe',
  where: 'Edinburgh, Scotland',
  when: '3rd–4th August and 12th–20th August',
  acts: ['Fire juggling', 'Bollywood dancing', 'Magic tricks', 'Street theatre'],
  prices: { adult: '£40', child: '£16' },
  note: 'Shows are on all day, in the streets and in the halls.',
};

export const VERDICTS = ['TRUE ✅', 'FALSE ❌', 'NOT IN THE TEXT ❓'];

const fact = (prompt: string, verdict: number, correction?: Question): Question => {
  const base = choice(prompt, VERDICTS[verdict] ?? '', VERDICTS.filter((_, i) => i !== verdict), undefined, 'forum');
  return correction ? { ...base, correction } : base;
};

const WHO_NAMES = ['Kelly', 'Nuria', 'Ismail', 'Janet'];

/** Stage 5 — punctuation. The textbook teaches capitals, full stops and question marks. */
export const PUNCTUATION_RULES = ['A capital letter starts a name.', 'A capital letter starts a sentence.', 'A full stop ends a telling sentence.', 'A question mark ends an asking sentence.'];

export const PUNCTUATE_TASKS: { words: string[]; caps: number[]; end: '.' | '?' | '!'; wrong: { caps: number[]; end: '.' | '?' | '!' }[] }[] = [
  { words: ['can', 'you', 'turn', 'on', 'the', 'TV'], caps: [0, 5], end: '?', wrong: [{ caps: [0], end: '.' }, { caps: [5], end: '?' }, { caps: [], end: '?' }] },
  { words: ['leo', 'likes', 'his', 'computer'], caps: [0], end: '.', wrong: [{ caps: [0], end: '?' }, { caps: [1], end: '.' }, { caps: [], end: '.' }] },
  { words: ['is', 'this', 'your', 'camera', 'amy'], caps: [0, 4], end: '?', wrong: [{ caps: [0, 4], end: '.' }, { caps: [4], end: '?' }, { caps: [0], end: '?' }] },
  { words: ['that', 'is', 'their', 'CD', 'player'], caps: [0, 3], end: '.', wrong: [{ caps: [0], end: '.' }, { caps: [0, 3], end: '?' }, { caps: [0, 4], end: '.' }] },
];

export const TONGUE_TWISTER = 'Can you call and ask if Amy can use a camera at the festival?';

/** Stage 6 — CLIL geography from book page 30. */
export const HEMISPHERE_COUNTRIES = [
  { name: 'the UK', hemisphere: 'north' },
  { name: 'Spain', hemisphere: 'north' },
  { name: 'Brazil', hemisphere: 'south' },
  { name: 'Australia', hemisphere: 'south' },
  { name: 'Egypt', hemisphere: 'north' },
  { name: 'Kenya', hemisphere: 'south' },
];

export const laterStages: Stage[] = [
  {
    id: 4, place: 'Festival Green', mission: 'Leaflet Detective', desc: 'Read the festival leaflet. TRUE, FALSE or NOT IN THE TEXT?',
      x: 68, y: 58, image: festival, emoji: '🎪',
    cutscene: ['Pip: Mister Magpie replaced the festival leaflet with nonsense!', 'Pip: Read the real leaflet. TRUE, FALSE or NOT IN THE TEXT?'],
    after: ['The festival posters turn back to their proper colours.'],
    taunt: 'Mister Magpie: Nobody reads carefully any more. Nobody!',
    questions: [
      fact('The festival is in Edinburgh.', 0),
      fact('Bollywood dancing is at the festival.', 0),
      fact('The shows cost £40 for an adult.', 0),
      fact('A child\u2019s ticket costs £16.', 0),
      fact('The festival is in July.', 1, choice('Choose the corrected sentence.', 'The festival is in August.', ['The festival is in July.', 'The festival are in August.', 'The festival is on August.'])),
      fact('The festival has fire juggling.', 0),
      fact('There is a magic show at the festival.', 0),
      fact('The festival is in England.', 1, choice('Choose the corrected sentence.', 'The festival is in Scotland.', ['The festival is in England.', 'The festival are in Scotland.', 'The festival is on Scotland.'])),
      fact('The festival is only for children.', 2),
      fact('Tickets cost £40 for two adults.', 2),
      fact('You can see street theatre.', 0),
      fact('The festival has a dog show.', 2),
      ...[['Who likes playing volleyball?', 'Janet'], ['Who is from Egypt?', 'Ismail'], ['Who is from Spain?', 'Nuria'], ['Who is from the UK?', 'Kelly']]
        .map(([prompt, answer]) => choice(prompt ?? '', answer ?? '', WHO_NAMES.filter(x => x !== answer), undefined, 'who')),
    ],
  },
  {
    id: 5, place: 'Signwriter\u2019s Shop', mission: 'Punctuation Patrol', desc: 'Every sign has lost its capitals and full stops. Fix them!',
      x: 80, y: 30, image: signShop, emoji: '✏️',
    cutscene: ['Pip: The signs all over town have lost their punctuation!', 'Pip: Start with a capital, end with a full stop or a question mark.'],
    after: ['Every sign in Gadgeton shines with tidy full stops.'],
    taunt: 'Mister Magpie: Punctuation? Too much effort!',
    questions: [
      ...PUNCTUATE_TASKS.map(task => ({
        prompt: 'Add the capital letters. Choose the correct ending.',
        answer: [task.words.map((w, i) => (task.caps.includes(i) ? w[0]?.toUpperCase() + w.slice(1) : w)).join(' ') + task.end],
        options: [],
        explain: task.words.map((w, i) => (task.caps.includes(i) ? w[0]?.toUpperCase() + w.slice(1) : w)).join(' ') + task.end,
        hint: 'Names and the first word need capitals. Asking sentences end with ?',
        kind: 'punctuate' as const,
        punctuate: task,
      })),
      choice('Which sentence is written correctly?', 'Can I use your camera, Amy?', ['can i use your camera, amy?', 'Can i use your camera, Amy.', 'Can I use your camera, amy'], 'Capitals for I, Amy and the first word. A question mark at the end.'),
      choice('Which sentence is written correctly?', 'That is their CD player.', ['that is their cd player.', 'That is their CD player', 'That Is Their CD Player.']),
      choice('Which sign needs a question mark?', 'Can I use your MP3 player?', ['Can I use your MP3 player.', 'can I use your MP3 player?', 'Can I Use Your MP3 Player?'], 'It is asking, so it ends with a question mark.'),
      choice('Which sign needs a full stop?', 'This is our computer.', ['This is our computer?', 'this is our computer.', 'This is our computer!'], 'It is telling us something, so it ends with a full stop.'),
      choice('Where does the capital letter belong?', 'leo likes his computer.', ['Leo likes his computer.', 'leo Likes his computer.', 'leo likes His computer.'], 'Names and the first word of a sentence take a capital.'),
      { prompt: 'Read the tongue twister three times, getting faster each time.', options: [], answer: [], explain: TONGUE_TWISTER, hint: TONGUE_TWISTER, kind: 'twister', speaking: true },
    ],
  },
  {
    id: 6, place: 'Globe Room', mission: 'Equator Explorer', desc: 'Find the equator, then sort the countries north and south.',
      x: 45, y: 82, image: globeRoom, emoji: '🌍',
    cutscene: ['Pip: The globe has lost its equator line!', 'Pip: Find it again, then sort the countries into the two halves.'],
    after: ['A thin gold line circles the globe once more.'],
    taunt: 'Mister Magpie: Geography! I only care about shiny things.',
    questions: [
      { ...choice('What is the line around the middle of the Earth called?', 'the equator', ['the horizon', 'the hemisphere', 'the meridian'], 'The equator is the line around the middle of the Earth.'), photo: globeEquator },
      choice('The equator divides the Earth into two halves. What are they called?', 'the north and south hemispheres', ['the left and right halves', 'the top and bottom poles', 'the east and west sides'], 'The equator divides the Earth into the northern and southern hemispheres.'),
      { ...choice('Which country is in the southern hemisphere?', 'Brazil', ['the UK', 'Spain', 'Egypt'], 'Brazil is in the southern hemisphere.'), photo: globeBrazil },
      { ...choice('Which country is in both hemispheres?', 'Kenya', ['Spain', 'the UK', 'Australia'], 'The equator passes through Kenya, so it is in both hemispheres.'), photo: globeBoth },
      choice('Which two countries are both in the northern hemisphere?', 'the UK and Spain', ['Brazil and Australia', 'Brazil and the UK', 'Australia and Spain'], 'The UK and Spain are both north of the equator.'),
      choice('Which two countries are both in the southern hemisphere?', 'Brazil and Australia', ['Brazil and Spain', 'the UK and Egypt', 'Egypt and Kenya'], 'Brazil and Australia are both south of the equator.'),
      { ...choice('"It\u2019s hot in Brazil." Here, "It\u2019s" means…', 'it is', ['it has'], 'In "It\u2019s hot", It\u2019s means it is.'), kind: 'meaning', legend: true },
      { ...choice('"It\u2019s got a line through it." Here, "It\u2019s" means…', 'it has', ['it is'], 'In "It\u2019s got", It\u2019s means it has.'), kind: 'meaning', legend: true },
      { prompt: 'Tell your class about a country: where it is, which hemisphere, and one gadget the children use there.', options: [], answer: [], explain: 'Brazil is in South America, in the southern hemisphere. The children there use computers at school and cameras on the beach.', hint: 'Country → hemisphere → a gadget they use.', emoji: '🎙️', speaking: true, helper: '___ is in ___. It is in the ___ hemisphere. They use ___ there.' },
    ],
  },
];

const chapter = (id: number, title: string, text: string, glossary: Chapter['glossary'], prompt: string, answer: string, wrong: string[]): Chapter =>
  ({ id, title, text, image: '', glossary, check: choice(prompt, answer, wrong) });

export const laterChapters: Chapter[] = [
  chapter(4, 'The Leaflet That Lied', `Every August, the Festival Green fills with jugglers, dancers and magicians. It is the busiest week of the year in Gadgeton.
Today the green is empty and every leaflet is wrong. "Fire juggling at midnight?" says Pip. "Bollywood dancing in the library? None of this is true!"
Zabyr picks one up. The real leaflet says the festival runs from the third to the fourth of August, and again from the twelfth to the twentieth.
"There are two things to check," says Pip. "Is it true? And is it even in the text?"`,
    { leaflet: { meaning: 'A small printed sheet of information.', emoji: '📄' }, juggler: { meaning: 'Someone who throws and catches things in the air.', emoji: '🤹' }, altogether: { meaning: 'Counting everyone together.', emoji: '➕' } },
    'When is the festival?', 'In August', ['In July', 'In December', 'In March']),

  chapter(5, 'The Shop with No Full Stops', `The Signwriter's Shop makes every sign in Gadgeton. Today every sign reads like this: can i use your camera amy
"There are no capitals and no full stops anywhere," says Pip. "Nobody knows where one sentence ends and the next one begins."
Zabyr takes out his pen. Names need capitals. The first word of a sentence needs a capital. A telling sentence ends with a full stop. An asking sentence ends with a question mark.
By the afternoon, every sign in the window is tidy. Mister Magpie hates it.`,
    { signwriter: { meaning: 'Someone whose job is painting letters on signs.', emoji: '🖌️' }, tidy: { meaning: 'Neat and in good order.', emoji: '✨' }, 'full stop': { meaning: 'The small dot ( . ) at the end of a sentence.', emoji: '⚫' } },
    'What does an asking sentence end with?', 'a question mark', ['a full stop', 'a capital letter', 'a comma']),

  chapter(6, 'Round the World in One Room', `The last room is round, with a globe as tall as Zabyr.
"The equator is missing," says Pip. "Without it, nobody knows which half of the world they live in."
Zabyr finds the line and draws it back around the middle. North of the line is the northern hemisphere. South of it is the southern hemisphere.
"The UK and Spain are north," says Pip. "Brazil and Australia are south. And Kenya? Kenya is right on the line, so it is in both."
Zabyr turns the globe slowly. Somewhere in that room is the last thing Mister Magpie took.`,
    { equator: { meaning: 'The imaginary line around the middle of the Earth.', emoji: '🌍' }, hemisphere: { meaning: 'One half of the Earth, north or south of the equator.', emoji: '🌐' }, globe: { meaning: 'A round model of the Earth.', emoji: '🗺️' } },
    'Where is Kenya?', 'On the equator', ['In the north hemisphere only', 'In the south hemisphere only', 'In Australia']),
].map(ch => ({ ...ch, image: '' }));