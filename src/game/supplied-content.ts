import type { Stage, Chapter, Question } from './adventure';
import garage from '@/assets/gadget-garage.jpg';
import bench from '@/assets/borrow-bench.jpg';
import vault from '@/assets/vault.jpg';
import computer from '@/assets/gadget-computer.jpg';
import tv from '@/assets/gadget-tv.jpg';
import dvd from '@/assets/gadget-dvd.jpg';
import cd from '@/assets/gadget-cd.jpg';
import mp3 from '@/assets/gadget-mp3.jpg';
import camera from '@/assets/gadget-camera.jpg';
import amysCamera from '@/assets/card-amys-camera.jpg';
import leosComputer from '@/assets/card-leos-computer.jpg';
import hollysDvd from '@/assets/card-hollys-dvd.jpg';
import maxsCd from '@/assets/card-maxs-cd.jpg';
import ourHouse from '@/assets/card-our-house.jpg';
import theirClass from '@/assets/card-their-class.jpg';
import cap from '@/assets/magic-cap.jpg';
import cape from '@/assets/magic-cape.jpg';
import kit from '@/assets/magic-kit.jpg';
import kite from '@/assets/magic-kite.jpg';
import notArt from '@/assets/magic-not.jpg';
import note from '@/assets/magic-note.jpg';
import cub from '@/assets/magic-cub.jpg';
import cube from '@/assets/magic-cube.jpg';

const choice = (prompt: string, answer: string, wrong: string[], explain: string): Question =>
  ({ prompt, answer: [answer], options: [answer, ...wrong], explain, hint: explain });

/** Mission 1 — the six Unit 3 gadgets, plus the two phrasal verbs. */
export const GADGETS: [string, string, string, string][] = [
  ['computer', 'It has a screen and a keyboard. You do school projects on it.', 'a computer', computer],
  ['TV', 'It has a big screen and you watch programmes on it.', 'a TV', tv],
  ['DVD player', 'It plays films from a shiny disc.', 'a DVD player', dvd],
  ['CD player', 'It plays music from a small silver disc.', 'a CD player', cd],
  ['MP3 player', 'It is small and you listen to music in your ears.', 'an MP3 player', mp3],
  ['camera', 'It takes photos.', 'a camera', camera],
];

const gadgetQuestions: Question[] = GADGETS.map(([label, clue, answer, photo]) => ({
  ...choice(clue, answer, GADGETS.map(g => g[2]).filter(a => a !== answer).slice(0, 3), `That is ${answer}.`),
  kind: 'snapshot',
  photo,
  sayAfter: `This is ${answer}!`,
  hint: `Which gadget does that job? ${label} starts with "${label[0]}".`,
}));

const phrasalQuestions: Question[] = [
  choice('The TV is dark and silent. What do you do first?', 'Turn on the TV.', ['Turn off the TV.', 'Turn on the camera.', 'Turn off the computer.'], 'The TV is off, so you turn it on.'),
  choice('The music is too loud. What do you do?', 'Turn off the CD player.', ['Turn on the CD player.', 'Turn off the camera.', 'Turn on the DVD player.'], 'To stop the noise, you turn it off.'),
  choice('Leo asks politely. Which sentence is correct?', 'Amy, can you turn on the TV, please?', ['Amy, can you turn on the TV?', 'Amy, you turn on the TV.', 'Amy, turn the TV the on?'], 'Add please to make a polite request.'),
  choice('Holly wants to watch a film. Which does she turn on?', 'The DVD player', ['The camera', 'The MP3 player', 'The computer'], 'Films come on a disc, so she uses the DVD player.'),
];

/** Mission 2 — your / our / their and the borrowing pattern. */
export const ASK_TASKS: { speaker: string; thing: string; owner: string; question: string; answer: string; wrongQuestions: string[]; wrongReplies: string[]; photo: string }[] = [
  { speaker: 'Zabyr', thing: 'camera', owner: 'Amy', question: 'Can I use your camera, Amy?', answer: 'Yes, you can.', wrongQuestions: ['Can I use my camera, Amy?', 'Can I use your camera?', 'You can use my camera?'], wrongReplies: ['No, you can.', 'Yes, you do.', 'Yes, I can.'], photo: amysCamera },
  { speaker: 'Holly', thing: 'computer', owner: 'Leo', question: 'Can I use your computer, Leo?', answer: 'Yes, you can.', wrongQuestions: ['Can I use his computer, Leo?', 'Can Leo use your computer?', 'Can I use your computers, Leo?'], wrongReplies: ["Yes, you can't.", 'Yes, he can.', 'No, you can.'], photo: leosComputer },
  { speaker: 'Max', thing: 'DVD', owner: 'Holly', question: 'Can I use your DVD, Holly?', answer: "No, you can't.", wrongQuestions: ['Can I use her DVD, Max?', 'Can you use my DVD, Holly?', 'Can I use your DVDs, Holly?'], wrongReplies: ['Yes, you can.', "No, you can.", "No, I can't."], photo: hollysDvd },
  { speaker: 'Zabyr', thing: 'CD', owner: 'Max', question: 'Can I use your CD, Max?', answer: "Yes, you can.", wrongQuestions: ['Can I use your CD?', 'Can he use your CD, Max?', 'Can I use your CDs, Max?'], wrongReplies: ['Yes, I can.', "No, you can't.", 'Yes, you do.'], photo: maxsCd },
  { speaker: 'Pip', thing: 'computer', owner: 'us', question: 'Can we use our computer?', answer: 'Yes, you can.', wrongQuestions: ['Can we use their computer?', 'Can we use your computer?', 'Can we uses our computer?'], wrongReplies: ['Yes, we do.', 'No, we can.', "Yes, we can't."], photo: ourHouse },
  { speaker: 'Pip', thing: 'CD player', owner: 'them', question: 'Can we use their CD player?', answer: "No, we can't.", wrongQuestions: ['Can we use our CD player?', 'Can they use their CD player?', 'Can we use their CD players?'], wrongReplies: ['Yes, we can.', 'No, we can.', "No, they can't."], photo: theirClass },
];

const reviewSentence = (answer: string, wrong: string[]): Question =>
  choice('Choose the correct sentence for this team.', answer, wrong, answer);

const askQuestions: Question[] = ASK_TASKS.map(task => ({
  prompt: `${task.speaker} wants the ${task.thing}. Ask ${task.owner === 'us' ? 'to use it together' : task.owner === 'them' ? 'to use the one that belongs to them' : `to borrow it from ${task.owner}`}.`,
  answer: [task.question, task.answer],
  options: [],
  explain: `${task.question} ${task.answer}`,
  hint: 'Ask with Can I / Can we, then answer with can or can\u2019t.',
  kind: 'ask',
  photo: task.photo,
  ask: { questionOptions: [task.question, ...task.wrongQuestions], replyOptions: [task.answer, ...task.wrongReplies] },
}));

/** Mission 3 — Magic E. Short vowel word plus silent e makes the vowel say its name. */
export const MAGIC_E_PAIRS = [
  { short: 'cap', long: 'cape', shortMeaning: 'You wear this on your head.', longMeaning: 'A superhero wears this.', shortPhoto: cap, longPhoto: cape },
  { short: 'kit', long: 'kite', shortMeaning: 'A box of tools or parts.', longMeaning: 'It flies on a string.', shortPhoto: kit, longPhoto: kite },
  { short: 'not', long: 'note', shortMeaning: 'The opposite of yes.', longMeaning: 'A short message you write.', shortPhoto: notArt, longPhoto: note },
  { short: 'cub', long: 'cube', shortMeaning: 'A baby animal.', longMeaning: 'A shape with six square faces.', shortPhoto: cub, longPhoto: cube },
];

export const MAGIC_E_WORDS = ['face', 'name', 'bike', 'nine', 'rope', 'note', 'cube', 'June'];

const transformQuestions: Question[] = MAGIC_E_PAIRS.map(pair => ({
  prompt: `Magic E! ${pair.short} →`,
  base: pair.short,
  answer: [pair.long],
  options: [],
  explain: `${pair.short} becomes ${pair.long}. The silent e makes the vowel say its name.`,
  hint: 'Add the silent e and the vowel says its name.',
  kind: 'transform',
  photo: pair.shortPhoto,
  afterPhoto: pair.longPhoto,
}));

const listenPair = (short: string, long: string): Question => {
  const explain = `${short} has a short vowel. ${long} has a silent e, so the vowel says its name.`;
  return { prompt: 'Listen. Is it the short word or the long word?', answer: [long], options: [short, long], explain, hint: 'Listen for the vowel saying its name.', kind: 'listen', pair: [short, long] };
};

const listenQuestions: Question[] = [
  listenPair('kit', 'kite'),
  listenPair('cap', 'cape'),
  listenPair('cub', 'cube'),
  listenPair('not', 'note'),
];

/** Vowel repair: students pick the missing letter that completes the long-vowel pattern. */
export const MAGIC_E_HOLES: [string, string][] = [['n_me', 'a'], ['b_ke', 'i'], ['r_pe', 'o'], ['c_be', 'u']];

const vowelQuestions: Question[] = MAGIC_E_HOLES.map(([prompt, answer], i) => ({
  ...choice(`Fix the word: ${prompt}`, answer, ['a', 'e', 'i', 'o', 'u'].filter(x => x !== answer).slice(0, 3), `The word is ${prompt.replace('_', answer)}.`),
  base: prompt,
  kind: 'vowel',
  legend: i >= 2,
}));

export const suppliedStages: Stage[] = [
  {
    id: 1, place: 'Gadget Garage', mission: 'Gadget Snapshots', desc: 'Name each machine and flip the switch back on.',
    x: 16, y: 72, image: garage, emoji: '🔌',
    cutscene: ['Pip: Mister Magpie has emptied the whole garage!', 'Pip: Name each gadget and the lights come back on!'],
    after: ['Leo: You turned everything back on. Brilliant!'],
    taunt: 'Mister Magpie: Shiny! Mine! All of it!',
    questions: [...gadgetQuestions, ...phrasalQuestions],
  },
  {
    id: 2, place: 'Borrow Bench', mission: 'Ask and Answer', desc: 'Borrow politely, and say yes or no correctly.',
    x: 33, y: 52, image: bench, emoji: '🤝',
    cutscene: ['Amy: Nobody asks politely any more. Everyone just takes!', 'Pip: Ask with Can I, then answer with can or can\u2019t.'],
    after: ['Holly: Thank you for asking. Of course you can!'],
    taunt: 'Mister Magpie: Asking? What a boring idea.',
    questions: [
      ...askQuestions,
      reviewSentence('This is our computer.', ['This is their computer.', 'This is your computer.', 'This is ours computer.']),
      reviewSentence('That is their CD player.', ['That is our CD player.', 'That is your CD player.', 'That is theirs CD player.']),
      reviewSentence("They are Holly's DVDs. They are her DVDs.", ['They are their DVDs.', 'They are our DVDs.', 'They are your DVDs.']),
      { prompt: 'Ask a friend to borrow something, then say what you will do with it.', options: [], answer: [], explain: 'Can I use your camera, Amy? Yes, you can. I want to take a photo of the festival.', hint: 'Can I use your ___ ? Yes, you can. / No, you can\u2019t.', emoji: '🎙️', speaking: true, helper: 'Can I use your ___ , ___ ? Yes, you can. / No, you can\u2019t. I want to ___.' },
    ],
  },
  {
    id: 3, place: 'Silent E Vault', mission: 'The Silent E', desc: 'Add the magic e and make the vowel say its name.',
    x: 52, y: 30, image: vault, emoji: '🪄',
    cutscene: ['Pip: The vault only opens for long vowel words!', 'Pip: Add the silent e. Make the vowel say its name!'],
    after: ['The vault door swings open in a shower of gold.'],
    taunt: 'Mister Magpie: Without that letter, nothing in here works!',
    questions: [...transformQuestions, ...listenQuestions, ...vowelQuestions,
      { ...choice('Which word has a silent e that makes the vowel say its name?', 'note', ['not', 'net', 'nut'], 'Note has a silent e, so the o says its name.'), legend: true },
    ],
  },
];

const chapter = (id: number, title: string, text: string, glossary: Chapter['glossary'], prompt: string, answer: string, wrong: string[]): Chapter =>
  ({ id, title, text, image: '', glossary, check: { prompt, answer: [answer], options: [answer, ...wrong], explain: answer, hint: answer } });

export const suppliedChapters: Chapter[] = [
  chapter(0, 'The Morning Everything Went Quiet', `Detective Zabyr is famous in Gadgeton. Last week he found the Stolen Weekend and gave it back to everyone. Today he is eating breakfast when the toaster stops.
Then the radio stops. Then the lights go out.
"It's not the electricity," says Pip, hovering by the window. "It's Mister Magpie. He has taken every gadget in town!"
Mister Magpie is a magpie in a tweed waistcoat. He loves shiny things. "If I can use it," he says, "it is mine!"
"But nobody can ask for anything back," says Pip. "All their polite words are gone."
Zabyr picks up his magnifying glass. "Then we start at the garage."`,
    { gadget: { meaning: 'A small machine that does a useful job.', emoji: '🔌' }, waistcoat: { meaning: 'A smart jacket with no sleeves, worn over a shirt.', emoji: '🦺' }, polite: { meaning: 'Speaking in a kind and careful way.', emoji: '🙏' } },
    'What is Mister Magpie?', 'A magpie in a waistcoat', ['A boy from Zabyr\u2019s class', 'A robot in the garage', 'A teacher at school']),

  chapter(1, 'The Garage with No Power', `The Gadget Garage is cold and dark. Six machines sit in a row, but not one of them is switched on.
Leo is standing by his computer. "I had a school project about space," he says. "Now I can't open it."
Pip shines a small light along the shelf. "Every machine has a name. Say the right name and its switch comes back."
Zabyr reads the labels one by one: computer, TV, DVD player, CD player, MP3 player, camera.
"Careful," says Pip. "Two of these switches are upside down. Turn on, not turn off!"`,
    { 'switch on': { meaning: 'To make a machine start working.', emoji: '🔛' }, 'switch off': { meaning: 'To make a machine stop working.', emoji: '🔴' }, label: { meaning: 'A small piece of writing that tells you what something is.', emoji: '🏷️' } },
    'What was Leo\u2019s project about?', 'space', ['fishing', 'the festival', 'music']),

  chapter(2, 'The Bench Where Nobody Asked', `At the Borrow Bench, three children are arguing.
"That's my camera!" says Amy.
"Can I use it?" asks Zabyr politely.
Amy stops. Nobody has asked her politely all morning. "Yes, you can," she says.
Pip is delighted. "That's the pattern! Can I use your camera? Yes, you can. No, you can't."
Holly tries it with Leo's computer. Max tries it with Holly's DVD. Each time, another small light switches back on in the town.
"Your, our and their," says Pip. "Three little words. They make a big difference."`,
    { borrow: { meaning: 'To use something that belongs to someone else, then give it back.', emoji: '🤝' }, politely: { meaning: 'In a kind and careful way.', emoji: '🙏' }, pattern: { meaning: 'The way something usually happens.', emoji: '🧩' } },
    'What does Zabyr say to Amy?', 'Can I use it?', ['That\u2019s my camera!', 'Give me the camera.', 'Where is your camera?']),

  chapter(3, 'The Vault of Long Vowels', `Behind the Borrow Bench there is a door with no handle.
"A word vault," says Pip. "Mister Magpie locked it with a silent e."
Zabyr looks at the words carved into the door: cap, kit, not, cub. Beside each one there is an empty space.
"Add the e," says Pip, "and the vowel says its name. Cap becomes cape. Kit becomes kite."
One by one the words change. The door hums. Zabyr can hear something shining on the other side.`,
    { silent: { meaning: 'Not pronounced when you say the word.', emoji: '🤫' }, vault: { meaning: 'A strong room with a heavy locked door.', emoji: '🔐' }, carve: { meaning: 'To cut letters or shapes into a hard surface.', emoji: '🪚' } },
    'What do you add to cap to make cape?', 'a silent e', ['a silent s', 'a second a', 'a silent h']),
].map(ch => ({ ...ch, image: '' }));