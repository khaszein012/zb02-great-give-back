import map from '@/assets/gadgeton.jpg';
import story from '@/assets/story-give-back.jpg';
import { suppliedStages, suppliedChapters } from './supplied-content';
import { laterStages, laterChapters } from './later-content';
import { suppliedBossStage, BOSS_PHASE_NAMES, finaleChapters } from './finale-content';
import { CHAPTER_IMAGES } from './chapter-images';

export type Difficulty = 'Explorer' | 'Detective' | 'Legend';
export const DIFFICULTIES: Difficulty[] = ['Explorer', 'Detective', 'Legend'];
export const DIFFICULTY_RULES = { Explorer: { options: 3, timer: 25, helpers: true }, Detective: { options: 4, timer: 15, helpers: false }, Legend: { options: 4, timer: 10, helpers: false } } as const;
export const TIMER_LENGTHS = [10, 15, 20, 25] as const;

export type AskTask = { questionOptions: string[]; replyOptions: string[] };
export type PunctuateTask = { words: string[]; caps: number[]; end: '.' | '?' | '!' };

export type Question = {
  prompt: string; options: string[]; answer: string[]; explain: string; hint: string;
  emoji?: string; speech?: string; speaking?: boolean; helper?: string; legend?: boolean;
  kind?: 'snapshot' | 'ask' | 'punctuate' | 'spelling' | 'rule' | 'forum' | 'who' | 'transform' | 'listen' | 'vowel' | 'meaning' | 'alarm' | 'agreement' | 'builder' | 'boss-speech' | 'twister' | 'reply';
  photo?: string; base?: string; traps?: string[]; sayAfter?: string; correction?: Question; pair?: string[]; afterPhoto?: string;
  ask?: AskTask; punctuate?: PunctuateTask;
};

const q = (prompt: string, answer: string, wrong: string[], explain: string, hint: string, emoji?: string): Question => ({ prompt, options: [answer, ...wrong], answer: [answer], explain, hint, ...(emoji ? { emoji } : {}) });

export type Stage = { id: number; place: string; mission: string; desc: string; x: number; y: number; image: string; emoji: string; questions: Question[]; cutscene: string[]; taunt: string; after?: string[]; phase?: number; timerSecs?: number };

/** Stages are concatenated in id order; a later batch can replace one by reusing its id. */
export const STAGES: Stage[] = [...suppliedStages, ...laterStages].sort((a, b) => a.id - b.id);
export const BOSS_PHASES = BOSS_PHASE_NAMES;
export const bossStage = suppliedBossStage;
export const MAP_IMAGE = map;
export const STORY_IMAGE = story;

export type Chapter = { id: number; title: string; text: string; image: string; glossary: Record<string, { meaning: string; emoji: string }>; check: Question | null };
export const CHAPTERS: Chapter[] = [...suppliedChapters, ...laterChapters, ...finaleChapters]
  .map(chapter => ({ ...chapter, image: CHAPTER_IMAGES[chapter.id] ?? chapter.image }))
  .sort((a, b) => a.id - b.id);

export const INTRO_LINES = ["Previously… Detective Zabyr found the Stolen Weekend and brought it back!", "Pip: Zabyr! Mister Magpie has taken EVERY gadget in Gadgeton!", "Mister Magpie: If I can use it, it is mine! Shiny things are for keeping!", 'Pip: And nobody can ask for anything back. All their words are upside down!'];

/**
 * Activities where the student assembles letters or words and a countdown still makes
 * sense as a challenge, but not at the difficulty timer's speed.
 */
export const BUILD_SECONDS = 45;
export const BUILD_KINDS = ['spelling', 'builder'];
/** Kinds that run no countdown at all: the thinking is the task, not the speed. */
export const UNTIMED_KINDS = ['punctuate', 'ask', 'transform', 'twister', 'reply', 'boss-speech'];

/** Kinds that render their own activity UI, so PlayStage never draws option buttons for them. */
export const ACTIVITY_KINDS = ['ask', 'punctuate', 'spelling', 'transform', 'twister', 'reply', 'builder', 'boss-speech'];
/** Kinds that keep their whole option list at every difficulty. */
const FIXED_OPTION_KINDS = ['rule', 'forum', 'who', 'listen', 'vowel', 'meaning', 'agreement'];

export const questionOptions = (q: Question, difficulty: Difficulty): string[] => {
  if (ACTIVITY_KINDS.includes(q.kind ?? '')) return [];
  if (FIXED_OPTION_KINDS.includes(q.kind ?? '')) return [...q.options];
  const count = q.answer.length > 1 ? 4 : DIFFICULTY_RULES[difficulty].options;
  const options = [...q.answer, ...q.options.filter((o) => !q.answer.includes(o))].slice(0, count);
  return options.map((v, i) => ({ v, key: (i * 7 + q.prompt.length) % 11 })).sort((a, b) => a.key - b.key).map((x) => x.v);
};

export const questionsFor = (stage: Stage, difficulty: Difficulty) => stage.questions.filter((q) => !q.legend || difficulty === 'Legend');
export const isCorrect = (q: Question, choices: string[]) => choices.length === q.answer.length && q.answer.every((a) => choices.includes(a));

export function shuffled<T>(items: readonly T[], random: () => number = Math.random): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) { const j = Math.floor(random() * (i + 1)); const a = result[i]; const b = result[j]; if (a !== undefined && b !== undefined) { result[i] = b; result[j] = a; } }
  return result;
}

/**
 * Each mission keeps its own teaching order: the new activity leads, practice follows,
 * and anything spoken goes last so a teacher can pick it up at the end.
 */
export function orderedQuestions(stage: Stage, difficulty: Difficulty, random: () => number = Math.random): Question[] {
  const qs = questionsFor(stage, difficulty);
  const group = (...kinds: string[]) => kinds.flatMap((kind) => shuffled(qs.filter((q) => q.kind === kind), random));
  const rest = (skip: string[]) => shuffled(qs.filter((q) => !skip.includes(q.kind ?? '')), random);
  const speakingLast = (items: Question[]) => [...items.filter((q) => !q.speaking), ...items.filter((q) => q.speaking)];
  switch (stage.id) {
    case 2: return speakingLast([...group('ask'), ...rest(['ask'])]);
    case 3: return [...group('transform', 'listen', 'vowel'), ...rest(['transform', 'listen', 'vowel'])];
    case 5: return speakingLast([...group('punctuate'), ...rest(['punctuate'])]);
    case 6: return speakingLast(shuffled(qs, random));
    default: return shuffled(qs, random);
  }
}