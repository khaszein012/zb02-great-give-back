import type { Chapter } from './adventure';
export const hasDetectiveCheck=(chapter:Chapter,enabled:boolean,replay=false)=>enabled&&!replay&&chapter.check!==null;
export function questionTiles(question:string,traps:readonly string[]=[]){return [...question.replace(/\?$/,'').split(' '),'?',...traps];}
export function buildQuestion(tiles:readonly string[]){return tiles.join(' ').replace(/ \?$/,'?');}
export function bossHealth(phase:number,correct:number,total:number){return [0,1,2].map(section=>section<phase?0:section>phase?1:Math.max(0,1-correct/Math.max(1,total)));}