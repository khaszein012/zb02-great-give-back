import { describe,it,expect } from 'vitest';
import { STAGES,CHAPTERS,orderedQuestions,questionOptions,isCorrect } from '@/game/adventure';
import { FESTIVAL_POSTER,VERDICTS,PUNCTUATE_TASKS,HEMISPHERE_COUNTRIES,TONGUE_TWISTER } from '@/game/later-content';
import { askCorrect,punctuateCorrect,punctuatedSentence,punctuateAnswer } from '@/game/unit3-rules';
import { TWISTER_RATES,replyPoints,REPLY_SECONDS } from '@/game/activity-rules';

const stage=(id:number)=>{const s=STAGES.find(s=>s.id===id);if(!s)throw Error(`Missing stage ${id}`);return s;};

describe('Mission 4 — the festival leaflet',()=>{
 it('keeps the textbook leaflet facts exactly',()=>{
  expect(FESTIVAL_POSTER.where).toBe('Edinburgh, Scotland');
  expect(FESTIVAL_POSTER.when).toBe('3rd–4th August and 12th–20th August');
  expect(FESTIVAL_POSTER.prices).toEqual({adult:'£40',child:'£16'});
  expect(FESTIVAL_POSTER.acts).toEqual(['Fire juggling','Bollywood dancing','Magic tricks','Street theatre']);
 });

 it('uses three verdicts only',()=>{
  expect(VERDICTS).toEqual(['TRUE ✅','FALSE ❌','NOT IN THE TEXT ❓']);
  for(const q of stage(4).questions.filter(q=>q.kind==='forum'))expect(questionOptions(q,'Explorer')).toHaveLength(3);
 });

 it('has twelve verdicts followed by four Who questions',()=>{
  expect(stage(4).questions.filter(q=>q.kind==='forum')).toHaveLength(12);
  expect(stage(4).questions.filter(q=>q.kind==='who')).toHaveLength(4);
 });

 it('marks a statement FALSE only when the leaflet contradicts it, and NOT IN THE TEXT otherwise',()=>{
  const verdicts=stage(4).questions.filter(q=>q.kind==='forum').map(q=>q.answer[0]);
  expect(verdicts).toEqual(['TRUE ✅','TRUE ✅','TRUE ✅','TRUE ✅','FALSE ❌','TRUE ✅','TRUE ✅','FALSE ❌','NOT IN THE TEXT ❓','NOT IN THE TEXT ❓','TRUE ✅','NOT IN THE TEXT ❓']);
 });

 it('supplies the corrected sentence for every FALSE verdict',()=>{
  const falses=stage(4).questions.filter(q=>q.kind==='forum'&&q.answer[0]==='FALSE ❌');
  expect(falses.map(q=>q.correction?.answer[0])).toEqual(['The festival is in August.','The festival is in Scotland.']);
  for(const q of falses){if(!q.correction)throw Error('Missing correction');expect(q.correction.options).toHaveLength(4);expect(new Set(q.correction.options).size).toBe(4);expect(isCorrect(q.correction,q.correction.answer)).toBe(true);}
 });

 it('offers the four Who names as options',()=>{
  for(const q of stage(4).questions.filter(q=>q.kind==='who'))expect(questionOptions(q,'Explorer')).toHaveLength(4);
 });
});

describe('Mission 5 — punctuation',()=>{
 it('has four punctuation tasks, each with three wrong alternatives',()=>{
  expect(PUNCTUATE_TASKS).toHaveLength(4);
  for(const task of PUNCTUATE_TASKS)expect(task.wrong).toHaveLength(3);
 });

 it('capitalises names and first words, and ends asks with a question mark',()=>{
  expect(punctuateAnswer(PUNCTUATE_TASKS[0]!)).toBe('Can you turn on the TV?');
  expect(punctuateAnswer(PUNCTUATE_TASKS[1]!)).toBe('Leo likes his computer.');
  expect(punctuateAnswer(PUNCTUATE_TASKS[2]!)).toBe('Is this your camera Amy?');
  // "CD" is an initialism, so it is already written in capitals in the source words.
  expect(punctuateAnswer(PUNCTUATE_TASKS[3]!)).toBe('That is their CD player.');
 });

 it('accepts only the exact set of capitals and the exact ending mark',()=>{
  const task=PUNCTUATE_TASKS[0]!;
  expect(punctuateCorrect(task,task.caps,task.end)).toBe(true);
  expect(punctuateCorrect(task,task.caps,'.')).toBe(false);
  expect(punctuateCorrect(task,[0],'?')).toBe(false);
  expect(punctuateCorrect(task,[],'?')).toBe(false);
  expect(punctuateCorrect(task,[0,5,5,0],'?')).toBe(true);
 });

 it('renders the preview with the chosen marks so students see the sign',()=>{
  const task=PUNCTUATE_TASKS[1]!;
  expect(punctuatedSentence(task,[])).toBe('leo likes his computer.');
  expect(punctuatedSentence(task,[0])).toBe('Leo likes his computer.');
 });

 it('gives every punctate question the same answer as the shared rule module',()=>{
  const tasks=stage(5).questions.filter(q=>q.kind==='punctuate');
  expect(tasks).toHaveLength(4);
  for(const q of tasks){if(!q.punctuate)throw Error('Missing task');expect(q.answer[0]).toBe(punctuateAnswer(q.punctuate));expect(questionOptions(q,'Explorer')).toHaveLength(0);}
 });

 it('keeps a three-speed tongue twister constraint',()=>{
  expect(TWISTER_RATES).toEqual([.85,1,1.15]);
  expect(TONGUE_TWISTER.length).toBeGreaterThan(20);
 });

 it('uses a 45-second speaking ring',()=>{
  expect(REPLY_SECONDS).toBe(45);
 });

 it('doubles each teacher-selected tier only in pro mode',()=>{
  expect([replyPoints(1,false),replyPoints(2,false),replyPoints(3,false)]).toEqual([1,2,3]);
  expect([replyPoints(1,true),replyPoints(2,true),replyPoints(3,true)]).toEqual([2,4,6]);
 });
});

describe('Mission 6 — hemispheres',()=>{
 it('sorts every country into the correct hemisphere',()=>{
  expect(HEMISPHERE_COUNTRIES).toEqual([
   {name:'the UK',hemisphere:'north'},{name:'Spain',hemisphere:'north'},
   {name:'Brazil',hemisphere:'south'},{name:'Australia',hemisphere:'south'},
   {name:'Egypt',hemisphere:'north'},{name:'Kenya',hemisphere:'south'},
  ]);
 });

 it('names the equator as the line around the middle of the Earth',()=>{
  expect(stage(6).questions[0]?.answer[0]).toBe('the equator');
 });

 it('keeps the it is / it has pair only in Legend',()=>{
  const meanings=stage(6).questions.filter(q=>q.kind==='meaning');
  expect(meanings.map(q=>q.answer[0])).toEqual(['it is','it has']);
  for(const q of meanings)expect(q.legend).toBe(true);
  expect(orderedQuestions(stage(6),'Detective').filter(q=>q.kind==='meaning')).toHaveLength(0);
  expect(orderedQuestions(stage(6),'Legend').filter(q=>q.kind==='meaning')).toHaveLength(2);
 });

 it('leaves the spoken task last',()=>{
  expect(orderedQuestions(stage(6),'Legend').at(-1)?.speaking).toBe(true);
 });
});

describe('Borrowing answers must match in pairs',()=>{
 it('accepts only a request and reply that agree',()=>{
  const expected=['Can I use your camera, Amy?','Yes, you can.'];
  expect(askCorrect(expected[0]!,expected[1]!,expected)).toBe(true);
  expect(askCorrect(expected[0]!,"No, you can't.",expected)).toBe(false);
  expect(askCorrect('Can I use my camera, Amy?',expected[1]!,expected)).toBe(false);
  expect(askCorrect(expected[0]!,expected[1]!,[])).toBe(false);
 });
});

describe('Missions 4–6 chapters',()=>{
 it('uses the supplied checks and glossary',()=>{
  expect(CHAPTERS[4]?.check?.answer).toEqual(['In August']);
  expect(CHAPTERS[5]?.check?.answer).toEqual(['a question mark']);
  expect(CHAPTERS[6]?.check?.answer).toEqual(['On the equator']);
  expect(CHAPTERS[4]?.glossary).toHaveProperty('leaflet');
  expect(CHAPTERS[5]?.glossary).toHaveProperty('full stop');
  expect(CHAPTERS[6]?.glossary).toHaveProperty('equator');
 });
});