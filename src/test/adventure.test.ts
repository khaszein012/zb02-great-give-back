import { describe,expect,it } from 'vitest';
import { CHAPTERS,STAGES,DIFFICULTY_RULES,TIMER_LENGTHS,bossStage,isCorrect,questionsFor,questionOptions } from '@/game/adventure';
import { DEFAULT,stageUnlocked,unlockedPowerIds,awardReading,awardCheck,readProgress,returningFromEpisode2,STORAGE_KEY } from '@/game/store';
import { hintCost,helperCost,speedBonus } from '@/game/mechanics';

describe('Gadget adventure rules',()=>{
 it('Pip’s Hint costs two points in Detective and Legend, zero in Explorer',()=>{
  expect(hintCost('Detective')).toBe(2);expect(hintCost('Legend')).toBe(2);expect(hintCost('Explorer')).toBe(0);
 });

 it('revealing a Detective helper costs one point',()=>{
  expect(helperCost('Detective')).toBe(1);expect(helperCost('Explorer')).toBe(0);
 });

 it('speed bonus applies only to fast timed answers in mission one',()=>{
  expect(speedBonus(1,true,10,15)).toBe(2);expect(speedBonus(1,true,2,15)).toBe(0);
  expect(speedBonus(2,true,15,15)).toBe(0);expect(speedBonus(1,false,15,15)).toBe(0);
 });

 it('defaults to Detective with a 15 second timer',()=>{
  expect(DEFAULT.difficulty).toBe('Detective');expect(DEFAULT.timerSecs).toBe(15);
 });

 it('uses Explorer three options, 25 seconds and helpers',()=>{
  expect(DIFFICULTY_RULES.Explorer).toEqual({options:3,timer:25,helpers:true});
 });

 it('uses Detective four options, 15 seconds and hidden helpers',()=>{
  expect(DIFFICULTY_RULES.Detective).toEqual({options:4,timer:15,helpers:false});
 });

 it('uses Legend four options, 10 seconds and no helpers',()=>{
  expect(DIFFICULTY_RULES.Legend).toEqual({options:4,timer:10,helpers:false});
 });

 it('accepts only teacher timer lengths 10, 15, 20 and 25',()=>{
  expect(TIMER_LENGTHS).toEqual([10,15,20,25]);
  for(const timerSecs of TIMER_LENGTHS)expect(readProgress({getItem:key=>key===STORAGE_KEY?JSON.stringify({timerSecs}):null}).timerSecs).toBe(timerSecs);
  expect(readProgress({getItem:()=>JSON.stringify({timerSecs:30})}).timerSecs).toBe(15);
 });

 it('unlocks the next mission with one star, and the nest only after six gadgets',()=>{
  expect(stageUnlocked(DEFAULT,1)).toBe(true);
  expect(stageUnlocked(DEFAULT,2)).toBe(false);
  expect(stageUnlocked({...DEFAULT,levelStars:{1:1}},2)).toBe(true);
  expect(stageUnlocked({...DEFAULT,levelStars:{1:1,2:1,3:1,4:1,5:1}},7)).toBe(false);
  expect(stageUnlocked({...DEFAULT,levelStars:{1:1,2:1,3:1,4:1,5:1,6:1}},7)).toBe(true);
 });

 it('teacher unlock all makes every configured mission and the nest available',()=>{
  for(let id=1;id<=7;id++)expect(stageUnlocked({...DEFAULT,allUnlocked:true},id)).toBe(true);
 });

 it('Returning Detective starts with only Pip’s Hint unlocked',()=>{
  expect([...unlockedPowerIds({...DEFAULT,returningBonus:true})]).toEqual(['lens']);
  expect(unlockedPowerIds(DEFAULT).has('lens')).toBe(false);
 });

 it('reading gives exactly two points once without changing hearts or stars',()=>{
  const p=awardReading(DEFAULT,0);
  expect(p.points).toBe(2);expect(awardReading(p,0).points).toBe(2);
  expect(p.hearts).toBe(3);expect(p.stars).toBe(0);expect(DEFAULT.readingMode).toBe('self');
 });

 it('Detective Check gives exactly one point once without changing hearts or stars',()=>{
  const p=awardCheck(DEFAULT,0);
  expect(p.points).toBe(1);expect(awardCheck(p,0).points).toBe(1);
  expect(p.hearts).toBe(3);expect(p.stars).toBe(0);
 });

 it('has six missions plus three boss phases, each with questions',()=>{
  expect(STAGES).toHaveLength(6);
  expect(STAGES.map(s=>s.id)).toEqual([1,2,3,4,5,6]);
  for(const stage of [...STAGES,bossStage(0),bossStage(1),bossStage(2)])expect(stage.questions.length).toBeGreaterThan(0);
 });

 it('never lets a Legend-only question reach Explorer or Detective',()=>{
  for(const stage of STAGES)for(const q of stage.questions){
   if(!q.legend)continue;
   expect(questionsFor(stage,'Detective')).not.toContain(q);
   expect(questionsFor(stage,'Explorer')).not.toContain(q);
   expect(questionsFor(stage,'Legend')).toContain(q);
  }
 });

 it('gives every borrow task both halves as its answer, in every difficulty',()=>{
  const asks=STAGES.flatMap(s=>s.questions).filter(q=>q.kind==='ask');
  expect(asks).toHaveLength(6);
  for(const q of asks){
   expect(q.answer).toHaveLength(2);
   expect(q.legend).toBeUndefined();
   expect(questionsFor(STAGES.find(s=>s.questions.includes(q))!,'Explorer')).toContain(q);
  }
 });

 it('never accepts fewer or more choices than the question needs',()=>{
  for(const stage of STAGES)for(const q of stage.questions){
   if(!q.options.length)continue;
   expect(isCorrect(q,q.answer)).toBe(true);
   expect(isCorrect(q,[])).toBe(false);
   if(q.answer.length===1)expect(isCorrect(q,[...(q.answer),q.answer[0]??''])).toBe(false);
  }
 });

 it('Legend additions are absent from Detective',()=>{
  const s=STAGES[2];if(!s)throw new Error('Stage missing');
  expect(questionsFor(s,'Legend').length).toBeGreaterThan(questionsFor(s,'Detective').length);
 });

 it('chapter 0 asks what Mister Magpie is, and every story check has four distinct options',()=>{
  expect(CHAPTERS[0]?.check?.answer).toEqual(['A magpie in a waistcoat']);
  for(const c of CHAPTERS){if(!c.check)continue;expect(c.check.options).toHaveLength(4);expect(new Set(c.check.options).size).toBe(4);}
 });

 it('keeps nine chapters numbered 0 to 8 in order',()=>{
  expect(CHAPTERS.map(c=>c.id)).toEqual([0,1,2,3,4,5,6,7,8]);
 });
});

describe('Storage keys',()=>{
 it('stores Episode 3 separately from Episode 2',()=>{
  expect(STORAGE_KEY).toBe('episode-3-v1');
 });

 it('never lets a fresh Episode 3 import Episode 2 stars or stars',()=>{
  const episodeTwo=JSON.stringify({stars:21,points:400,levelStars:{1:3,2:3,3:3,4:3,5:3,6:3},bossWon:true});
  const fresh=readProgress({getItem:key=>key==='episode-2-v1'?episodeTwo:null});
  expect(fresh.stars).toBe(0);
  expect(fresh.points).toBe(0);
  expect(fresh.levelStars).toEqual({});
  expect(stageUnlocked(fresh,2)).toBe(false);
 });

 it('welcomes back a detective who finished Episode 2',()=>{
  expect(returningFromEpisode2({getItem:key=>key==='episode-2-v1'?JSON.stringify({bossWon:true}):null})).toBe(true);
  expect(returningFromEpisode2({getItem:key=>key==='episode-2-v1'?JSON.stringify({bossWon:false}):null})).toBe(false);
  expect(returningFromEpisode2({getItem:()=>null})).toBe(false);
  expect(returningFromEpisode2({getItem:()=>'not json'})).toBe(false);
 });

 it('gives a returning Episode 2 player Pip’s Hint without importing progress',()=>{
  const p=readProgress({getItem:key=>key==='episode-2-v1'?JSON.stringify({bossWon:true,points:500}):null});
  expect(p.returningBonus).toBe(true);
  expect(p.points).toBe(0);
  expect([...unlockedPowerIds(p)]).toEqual(['lens']);
 });

 it('clamps corrupted saved values instead of crashing',()=>{
  const p=readProgress({getItem:()=>JSON.stringify({points:-50,stars:'lots',hearts:99,difficulty:'Impossible',timerSecs:999,levelStars:{'3':9,'9':2,x:1}})});
  expect(p.points).toBe(0);expect(p.stars).toBe(0);expect(p.hearts).toBe(99);
  expect(p.difficulty).toBe('Detective');expect(p.timerSecs).toBe(15);
  expect(p.levelStars).toEqual({3:3});
 });
});