import type { Chapter } from './adventure';

export type GlossaryToken = { text: string; term: string | null };

const escape = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/**
 * Splits chapter text so glossary terms become linkable tokens.
 *
 * Boundaries are required on both sides: without them "gadget" would match inside
 * "Gadgeton" and split the word across two tokens, which renders as broken text.
 */
export function glossaryTokens(text: string, glossary: Chapter['glossary']): GlossaryToken[] {
  const keys = Object.keys(glossary).sort((a, b) => b.length - a.length);
  if (!keys.length) return [{ text, term: null }];
  const matcher = new RegExp(`\\b(${keys.map(escape).join('|')})\\b`, 'gi');
  return text
    .split(matcher)
    .filter((part) => part !== '')
    .map((part) => ({ text: part, term: keys.find((key) => key.toLowerCase() === part.toLowerCase()) ?? null }));
}

/** Character offset of every token, used to highlight the word being read aloud. */
export function tokenOffsets(tokens: readonly GlossaryToken[]): number[] {
  let offset = 0;
  return tokens.map((token) => { const at = offset; offset += token.text.length; return at; });
}