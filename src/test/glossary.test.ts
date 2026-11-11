import { describe,it,expect } from 'vitest';
import { CHAPTERS } from '@/game/adventure';
import { glossaryTokens,tokenOffsets } from '@/game/glossary';

const glossary = (entries: string[]) => Object.fromEntries(entries.map(k => [k,{meaning:'x',emoji:'🔎'}]));

describe('Glossary tokeniser',()=>{
 it('links a whole word, not a fragment of a longer one',()=>{
  // Regression: "gadget" inside "Gadgeton" split the place name and rendered broken text.
  const tokens=glossaryTokens('Famous in Gadgeton.',glossary(['gadget']));
  expect(tokens).toEqual([{text:'Famous in Gadgeton.',term:null}]);
 });

 it('still links the term when it stands alone',()=>{
  const tokens=glossaryTokens('A gadget is useful.',glossary(['gadget']));
  expect(tokens.map(t=>[t.text,t.term])).toEqual([['A ',null],['gadget','gadget'],[' is useful.',null]]);
 });

 it('matches case-insensitively but reports the glossary key',()=>{
  const tokens=glossaryTokens('The Waistcoat is smart.',glossary(['waistcoat']));
  expect(tokens.find(t=>t.term)?.term).toBe('waistcoat');
  expect(tokens.find(t=>t.text==='Waistcoat')?.term).toBe('waistcoat');
 });

 it('prefers the longest term so multiword entries win',()=>{
  const tokens=glossaryTokens('Check the full stop.',glossary(['stop','full stop']));
  expect(tokens.find(t=>t.term)?.text).toBe('full stop');
 });

 it('never drops or reorders text',()=>{
  const text='Switch on the gadget, then switch off the TV.';
  expect(glossaryTokens(text,glossary(['gadget','switch on'])).map(t=>t.text).join('')).toBe(text);
 });

 it('returns one plain token when a chapter has no glossary',()=>{
  expect(glossaryTokens('Plain text.',{})).toEqual([{text:'Plain text.',term:null}]);
 });

 it('records offsets that line up with the original text',()=>{
  const text='A gadget is here.';
  const tokens=glossaryTokens(text,glossary(['gadget']));
  const offsets=tokenOffsets(tokens);
  tokens.forEach((token,i)=>{
   const at=offsets[i]??0;
   expect(text.slice(at,at+token.text.length)).toBe(token.text);
  });
 });

 it('rejoins every real chapter back to its original text',()=>{
  for(const chapter of CHAPTERS){
   const tokens=glossaryTokens(chapter.text,chapter.glossary);
   expect(tokens.map(t=>t.text).join('')).toBe(chapter.text);
  }
 });

 it('never splits a word in any real chapter',()=>{
  for(const chapter of CHAPTERS){
   for(const token of glossaryTokens(chapter.text,chapter.glossary)){
    if(!token.term)continue;
    expect(token.text.toLowerCase()).toBe(token.term.toLowerCase());
   }
  }
 });
});