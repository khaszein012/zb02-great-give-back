import { describe,it,expect } from 'vitest';
import { STAGES,CHAPTERS,orderedQuestions,questionOptions,isCorrect,shuffled,type Question } from '@/game/adventure';
import { GADGETS,MAGIC_E_PAIRS,ASK_TASKS,suppliedStages } from '@/game/supplied-content';

const stage=(id:number)=>{const s=STAGES.find(s=>s.id===id);if(!s)throw Error(`Missing stage ${id}`);return s;};

describe('Episode 3 missions 1–3',()=>{
 it('has exactly six gadgets with their articles and photos',()=>{
  expect(GADGETS.map(g=>g[2])).toEqual(['a computer','a TV','a DVD player','a CD player','an MP3 player','a camera']);
  const gadgets=stage(1).questions.filter(q=>q.kind==='snapshot');
  expect(gadgets).toHaveLength(6);
  for(const q of gadgets){expect(q.photo).toBeTruthy();expect(q.sayAfter).toBe(`This is ${q.answer[0]}!`);}
 });

 it('says the gadget name after each snapshot so read-aloud matches the label',()=>{
  for(const q of stage(1).questions.filter(q=>q.kind==='snapshot'))expect(q.sayAfter).toMatch(/^This is an? /);
 });

 it('keeps turn on and turn off as opposite answers',()=>{
  const answers=stage(1).questions.map(q=>q.answer[0]);
  expect(answers).toContain('Turn on the TV.');
  expect(answers).toContain('Turn off the CD player.');
 });

 it('asks politely with Can I and answers with can or cannot',()=>{
  expect(ASK_TASKS.map(t=>t.question)).toEqual(['Can I use your camera, Amy?','Can I use your computer, Leo?','Can I use your DVD, Holly?','Can I use your CD, Max?','Can we use our computer?','Can we use their CD player?']);
  expect(ASK_TASKS.map(t=>t.answer)).toEqual(['Yes, you can.','Yes, you can.',"No, you can't.",'Yes, you can.','Yes, you can.',"No, we can't."]);
 });

 it('offers four request options and four reply options for every borrow task',()=>{
  for(const q of stage(2).questions.filter(q=>q.kind==='ask')){
   if(!q.ask)throw Error('ask task missing');
   expect(q.ask.questionOptions).toHaveLength(4);
   expect(q.ask.replyOptions).toHaveLength(4);
   expect(new Set(q.ask.questionOptions).size).toBe(4);
   expect(new Set(q.ask.replyOptions).size).toBe(4);
   expect(isCorrect(q,q.answer)).toBe(true);
   expect(questionOptions(q,'Explorer')).toHaveLength(0);
  }
 });

 it('asks the borrow tasks first and leaves speaking last',()=>{
  const order=orderedQuestions(stage(2),'Detective',()=>0);
  expect(order.filter(q=>q.kind==='ask')).toHaveLength(6);
  expect(order.slice(0,6).every(q=>q.kind==='ask')).toBe(true);
  expect(order.at(-1)?.speaking).toBe(true);
 });

 it('has four Magic E pairs where the long word is the short word plus e',()=>{
  expect(MAGIC_E_PAIRS.map(p=>[p.short,p.long])).toEqual([['cap','cape'],['kit','kite'],['not','note'],['cub','cube']]);
  for(const q of stage(3).questions.filter(q=>q.kind==='transform')){
   expect(q.base).toBeTruthy();expect(q.photo).toBeTruthy();expect(q.afterPhoto).toBeTruthy();
   expect(q.photo).not.toBe(q.afterPhoto);
   expect(q.answer[0]).toBe(`${q.base}e`);
  }
 });

 it('listens with two-word pairs and four questions',()=>{
  const listens=stage(3).questions.filter(q=>q.kind==='listen');
  expect(listens).toHaveLength(4);
  for(const q of listens)expect(q.pair).toHaveLength(2);
 });

 it('uses four vowel repairs that each complete a real word',()=>{
  const vowels=stage(3).questions.filter(q=>q.kind==='vowel');
  expect(vowels.map(q=>[q.base,q.answer[0]])).toEqual([['n_me','a'],['b_ke','i'],['r_pe','o'],['c_be','u']]);
  for(const q of vowels)expect(questionOptions(q,'Explorer')).toHaveLength(4);
 });

 it('keeps supplied chapter checks and glossaries',()=>{
  expect(CHAPTERS[0]?.check?.answer).toEqual(['A magpie in a waistcoat']);
  expect(CHAPTERS[1]?.check?.answer).toEqual(['space']);
  expect(CHAPTERS[2]?.check?.answer).toEqual(['Can I use it?']);
  expect(CHAPTERS[3]?.check?.answer).toEqual(['a silent e']);
  expect(CHAPTERS[0]?.glossary).toHaveProperty('waistcoat');
  expect(CHAPTERS[1]?.glossary).toHaveProperty('switch on');
  expect(CHAPTERS[3]?.glossary).toHaveProperty('vault');
 });

 it('shuffles without dropping or duplicating questions',()=>{
  const s=stage(1);
  const once=orderedQuestions(s,'Detective',()=>0.9);
  expect(once).toHaveLength(s.questions.length);
  expect(new Set(once.map(q=>q.prompt)).size).toBe(s.questions.length);
 });
});

describe('Content integrity for missions 1–3',()=>{
 it('accepts the right answer and rejects every wrong one',()=>{
  for(const s of suppliedStages)for(const q of s.questions){
   if(!q.options.length)continue;
   expect(isCorrect(q,q.answer)).toBe(true);
   for(const wrong of q.options.filter(o=>!q.answer.includes(o)))expect(isCorrect(q,[wrong])).toBe(false);
  }
 });

 it('never repeats an option inside one question',()=>{
  for(const s of suppliedStages)for(const q of s.questions)expect(new Set(q.options).size).toBe(q.options.length);
 });

 it('has four distinct options containing the answer for every chapter check',()=>{
  for(const c of CHAPTERS){if(!c.check)continue;expect(c.check.options).toHaveLength(4);expect(new Set(c.check.options).size).toBe(4);expect(c.check.options).toContain(c.check.answer[0]);}
 });

 it('gives every question an explanation and a hint',()=>{
  for(const s of suppliedStages)for(const q of s.questions){expect(q.explain.length).toBeGreaterThan(0);expect(q.hint.length).toBeGreaterThan(0);}
 });

 it('offers three options in Explorer and never more than four in Detective',()=>{
  const multi=(q:Question)=>!q.speaking&&q.options.length>0&&q.answer.length===1&&q.kind!=='vowel';
  for(const s of suppliedStages)for(const q of s.questions.filter(multi)){
   expect(questionOptions(q,'Explorer').length).toBeLessThanOrEqual(3);
   expect(questionOptions(q,'Detective').length).toBeLessThanOrEqual(4);
  }
 });
});

describe('shuffled',()=>{
 it('returns a permutation of the input',()=>{
  expect(shuffled([1,2,3,4],()=>0).slice().sort()).toEqual([1,2,3,4]);
  expect(shuffled([])).toEqual([]);
 });
});