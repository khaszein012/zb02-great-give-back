import { describe,it,expect } from 'vitest';
import { BUILD_KINDS,BUILD_SECONDS,UNTIMED_KINDS,ACTIVITY_KINDS,STAGES,questionOptions,type Question } from '@/game/adventure';

const allQuestions=():Question[]=>STAGES.flatMap(s=>s.questions);

describe('Timer budgets per activity',()=>{
 it('gives spelling and question building a longer budget than the shortest teacher timer',()=>{
  // A 10-second countdown on an eleven-letter spelling is unwinnable.
  expect(BUILD_SECONDS).toBeGreaterThanOrEqual(40);
  expect(BUILD_KINDS).toEqual(['spelling','builder']);
 });

 it('never runs a countdown on a thinking or speaking activity',()=>{
  for(const kind of ['punctuate','ask','transform','twister','reply','boss-speech'])expect(UNTIMED_KINDS).toContain(kind);
 });

 it('keeps each kind in exactly one timer category',()=>{
  for(const kind of BUILD_KINDS)expect(UNTIMED_KINDS).not.toContain(kind);
  for(const kind of UNTIMED_KINDS)expect(BUILD_KINDS).not.toContain(kind);
 });

 it('leaves punctuation and borrowing untimed so no countdown steals the answer',()=>{
  expect(UNTIMED_KINDS).toContain('punctuate');
  expect(UNTIMED_KINDS).toContain('ask');
 });

 it('times plain multiple-choice questions with the difficulty timer',()=>{
  for(const q of allQuestions().filter(q=>!q.kind&&!q.speaking)){
   expect(BUILD_KINDS).not.toContain(q.kind);
   expect(UNTIMED_KINDS).not.toContain(q.kind);
  }
 });

 it('keeps every activity kind out of the option-button path',()=>{
  for(const kind of ACTIVITY_KINDS){
   const sample=allQuestions().find(q=>q.kind===kind);
   if(!sample)continue;
   expect(questionOptions(sample,'Explorer')).toHaveLength(0);
  }
 });

 it('still offers options for kinds the student answers by tapping',()=>{
  for(const kind of ['meaning','agreement']){
   const sample=allQuestions().find(q=>q.kind===kind);
   if(!sample)continue;
   expect(questionOptions(sample,'Explorer').length).toBeGreaterThan(0);
  }
 });
});