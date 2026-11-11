import type { PunctuateTask } from './adventure';

/**
 * Renders a task sentence from words plus the marks the student has chosen.
 * Punctuation is the whole point of the activity, so the preview must show it exactly.
 */
export function punctuatedSentence(task: PunctuateTask, caps: readonly number[]): string {
  const words = task.words.map((word, i) => (caps.includes(i) ? capitalise(word) : word));
  return `${words.join(' ')}${task.end}`;
}

function capitalise(word: string): string {
  const first = word[0];
  return first === undefined ? word : `${first.toUpperCase()}${word.slice(1)}`;
}

/** A task is only satisfied by the exact same set of capitals and the same ending mark. */
export function punctuateCorrect(task: PunctuateTask, caps: readonly number[], end: string): boolean {
  const sameCaps = sameSet(caps, task.caps);
  return sameCaps && end === task.end;
}

function sameSet(a: readonly number[], b: readonly number[]): boolean {
  const left = new Set(a);
  const right = new Set(b);
  if (left.size !== right.size) return false;
  for (const value of left) if (!right.has(value)) return false;
  return true;
}

/** The reading target shown after a correct answer, with every mark in place. */
export const punctuateAnswer = (task: PunctuateTask) => punctuatedSentence(task, task.caps);

/**
 * Borrowing is two answers in sequence: the polite request, then the reply.
 * The reply must match the request (yes/no), so scoring uses both halves together.
 */
export function askCorrect(question: string, reply: string, expected: readonly string[]): boolean {
  return expected.length >= 2 && question === expected[0] && reply === expected[1];
}

/** Splits the paired answer into the two halves the UI asks for. */
export const ASK_STEPS = ['Ask politely', 'Now answer'] as const;