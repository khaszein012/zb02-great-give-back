import type { Chapter, Question, Stage } from './adventure';
import { suppliedStages } from './supplied-content';
import { laterStages } from './later-content';
import { CHAPTER_IMAGES } from './chapter-images';
import nest from '@/assets/magpie-nest.jpg';

export const BOSS_PHASE_NAMES = ['The Shiny Magnet', 'Ask It Back', 'The Give-Back Speech'];

export const BOSS_INTRO = [
  'Mister Magpie: Every gadget in Gadgeton, and nobody can ask for a single one back!',
  'Pip: Look, Zabyr! His nest is built out of everything he took!',
  'Zabyr: Then let\u2019s ask for it back. Politely. All of it.',
];

export const BOSS_DEFEAT = [
  'Mister Magpie: You asked. Every one of you asked politely. Nobody has ever asked me for anything.',
  'Mister Magpie: Here. Take them. …Can I come to the festival?',
  'Pip: Of course you can!',
];

export const FESTIVAL_LINES = ['Pip: The gadgets are back and the leaflet is true again!', 'Townspeople: Thank you, Detective Zabyr!', 'Mister Magpie: Shiny things are better when you share them.'];

/** Question-builder pairs: answer in, question out. Each has one grammar trap tile. */
export const BUILDER_PAIRS = [
  { answer: 'Yes, you can.', question: 'Can I use your camera?', trap: 'Do' },
  { answer: "No, you can't.", question: 'Can I use your MP3 player?', trap: 'Does' },
  { answer: 'Yes, we can.', question: 'Can we use their DVD player?', trap: 'Do' },
  { answer: 'This is our computer.', question: 'Is this our computer?', trap: 'Are' },
  { answer: 'That is their CD.', question: 'Is that their CD?', trap: 'Are' },
  { answer: 'Yes, he can.', question: 'Can Leo use your computer?', trap: 'Does' },
];

const agreement = (prompt: string, answer: string, wrong: string[]): Question => ({
  prompt, answer: [answer], options: [answer, ...wrong], explain: answer,
  hint: 'Match the person and the positive or negative reply.', kind: 'agreement',
});

export const BOSS_ALARM_SECONDS = 10;
export const BOSS_BUILDER_SECONDS = 30;
export const BOSS_SPEECH_SECONDS = [45, 60] as const;

export function suppliedBossStage(phase: number): Stage {
  const questions: Question[] = phase === 0
    ? [
      ...(suppliedStages.find(s => s.id === 1)?.questions.slice(0, 2) ?? []).map(q => ({ ...q, kind: 'alarm' as const })),
      ...(suppliedStages.find(s => s.id === 3)?.questions.filter(q => q.kind === 'transform').slice(0, 2) ?? []),
      ...(laterStages.find(s => s.id === 4)?.questions.slice(0, 2) ?? []),
      ...(laterStages.find(s => s.id === 6)?.questions.slice(0, 2) ?? []),
      agreement('I can use your camera.', 'So can I.', ['Neither can I.', 'So do I.']),
      agreement("I can't turn off the TV.", "Neither can I.", ['So can I.', 'Neither do I.']),
    ]
    : phase === 1
      ? BUILDER_PAIRS.map(pair => ({
        prompt: pair.answer, answer: [pair.question], options: [], explain: pair.question,
        hint: 'Start with Can or Is. Check the person, then add the question mark.',
        kind: 'builder' as const, traps: [pair.trap],
      }))
      : [{
        prompt: 'Mister Magpie thinks asking is boring. Change his mind!',
        answer: [], options: [], explain: 'The nest falls apart and every gadget tumbles out.',
        hint: 'Ask for something politely + say what you will do with it; use your / our / their; one thing you cannot borrow — and ask Magpie a question.',
        kind: 'boss-speech' as const, speaking: true,
      }];

  return {
    id: 7, phase, place: 'Magpie\u2019s Nest', mission: BOSS_PHASE_NAMES[phase] ?? BOSS_PHASE_NAMES[0] ?? 'Final battle',
    desc: 'Ask for every gadget back!', x: 88, y: 12,
    image: nest, emoji: '🪺', questions,
    cutscene: BOSS_INTRO,
    taunt: phase === 2 ? 'Mister Magpie: Shiny things are better when you share them.' : 'Mister Magpie: Put that down! That\u2019s mine… isn\u2019t it?',
    ...(phase === 0 ? { timerSecs: BOSS_ALARM_SECONDS } : phase === 1 ? { timerSecs: BOSS_BUILDER_SECONDS } : {}),
    ...(phase === 2 ? { after: BOSS_DEFEAT } : {}),
  };
}

export const finaleChapters: Chapter[] = [
  {
    id: 7, title: 'The Nest on the Hill', image: CHAPTER_IMAGES[7] ?? '',
    text: `At the top of the hill there is a nest the size of a house. It is made of computers, cameras, DVD players and one very bent bicycle.
Mister Magpie sits on the top in his tweed waistcoat. "You came for my shiny things," he says. "Well, they are mine now."
"But you didn\u2019t ask," says Pip. "You just took."
Mister Magpie looks at his nest. Not one machine works. Not one switch will turn on. A camera with no film, a TV with no programme, a CD player with no music.
Zabyr takes a deep breath. "Can I use your camera, please?"
Mister Magpie is so surprised that he falls off his own nest.`,
    glossary: {
      nest: { meaning: 'The home a bird builds for itself.', emoji: '🪺' },
      bent: { meaning: 'Not straight any more.', emoji: '↩️' },
      surprised: { meaning: 'Feeling that something unexpected has happened.', emoji: '😲' },
    },
    check: {
      prompt: 'Why does not one machine work in the nest?', answer: ['Mister Magpie never asked to borrow them.'],
      options: ['Mister Magpie never asked to borrow them.', 'The batteries are all flat.', 'It is raining on the hill.', 'They are all switched on.'],
      explain: 'Mister Magpie just took them. He never asked, so nothing works properly.', hint: 'Pip says, "You just took."',
    },
  },
  {
    id: 8, title: 'The Great Give-Back', image: CHAPTER_IMAGES[8] ?? '',
    text: `One by one, the gadgets go back to the people they belong to.
Leo opens his space project on his own computer. Amy takes a photo of the whole town. Holly plays her DVD, Max plays his CD, and the little MP3 player goes back into a pocket where it fits.
At the festival, the leaflet is true again. Fire jugglers, Bollywood dancers and a magician who is not at all like Mister Magpie.
Then Pip\u2019s camera flashes. Click! The perfect photo of the best week of the year.
"Asked politely and given back," says Zabyr. "That is how it works."`,
    glossary: {
      festival: { meaning: 'A special time when people celebrate with music, dancing and shows.', emoji: '🎪' },
      belong: { meaning: 'To be owned by someone.', emoji: '🏷️' },
    },
    check: null,
  },
];