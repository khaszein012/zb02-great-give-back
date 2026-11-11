import { useEffect,useState } from 'react';
import { Button } from '@/components/ui/button';
import type { Question } from './adventure';
import { REPLY_SECONDS, TWISTER_RATES, replyPoints } from './activity-rules';
import { TONGUE_TWISTER } from './later-content';
import { speak,sfx } from './audio';
import { TimerRing } from './ui';

const control='game-btn btn-option h-auto min-h-16 whitespace-normal px-5 py-3 text-2xl';

/** Mission 3 — click the magic e and watch the short word become a long one. */
export function MagicTransform({q,disabled,onAnswer}:{q:Question;disabled:boolean;onAnswer:(choices:string[])=>void}){
 const [changed,setChanged]=useState(false);
 return <div className="flex flex-wrap items-center justify-center gap-5">
  <img src={changed?q.afterPhoto:q.photo} alt={changed?q.answer[0]:q.base} width={384} height={336} className={`h-48 w-56 rounded-lg object-contain ${changed?'anim-pop':''}`}/>
  <span className="font-display text-6xl">{changed?q.answer[0]:q.base}</span>
  <Button variant="ghost" aria-label="Add magic e" disabled={disabled||changed} className="game-btn btn-gold h-auto px-8 py-5 text-4xl" onClick={()=>{setChanged(true);speak(`${q.base}. ${q.answer[0]}.`);sfx.whoosh();onAnswer(q.answer);}}>🪄 + e</Button>
 </div>;
}

/** Missions 5 and 6 — read aloud at three speeds, judged by the teacher. */
export function TeacherSpeaking({kind,disabled,paused,onAward}:{kind:'reply'|'twister';disabled:boolean;paused:boolean;onAward:(points:number)=>void}){
 const [pro,setPro]=useState(false);const [left,setLeft]=useState(REPLY_SECONDS);const [running,setRunning]=useState(false);const [read,setRead]=useState(0);
 useEffect(()=>{if(!running||paused||disabled||left===0)return;const id=setInterval(()=>setLeft(x=>Math.max(0,x-1)),1000);return()=>clearInterval(id);},[running,paused,disabled,left]);
 if(kind==='twister')return <div className="space-y-4">
  <p className="text-3xl font-bold leading-relaxed">{TONGUE_TWISTER}</p>
  <div className="flex flex-wrap gap-3">{TWISTER_RATES.map((rate,i)=><Button key={rate} variant="ghost" className={`${control} ${read===i+1?'btn-gold':''}`} onClick={()=>{setRead(i+1);speak(TONGUE_TWISTER,rate);}}>🔊 {i+1} {['Steady','Faster','Fastest'][i]}</Button>)}</div>
  <div className="flex flex-wrap gap-3">
   <Button variant="ghost" disabled={disabled} className={`${control} btn-go`} onClick={()=>onAward(1)}>Nailed it! ⭐</Button>
   <Button variant="ghost" disabled={disabled} className={control} onClick={()=>{setRead(0);speak('Try again. You can do it!');}}>Try again</Button>
  </div>
 </div>;
 return <div className="space-y-4">
  <div className="flex flex-wrap items-center gap-4">
   <TimerRing left={left} total={REPLY_SECONDS}/>
   <Button variant="ghost" disabled={disabled} className={control} onClick={()=>{setLeft(REPLY_SECONDS);setRunning(true);}}>🎙️ {running?'Restart':'Start'} speaking</Button>
   <Button variant="ghost" disabled={disabled} className={control} aria-pressed={pro} onClick={()=>setPro(x=>!x)}>{pro?'Show helper':'Hide helper'}</Button>
   {pro&&<span className="font-display text-2xl font-bold text-success-dark">PRO MODE · ×2</span>}
  </div>
  {left===0&&<p role="status" className="text-2xl">Time’s up — over to your teacher! ⭐</p>}
  <div className="flex flex-wrap gap-3">{(['⭐ Three sentences','⭐⭐ + because','⭐⭐⭐ PRO MODE'] as const).map((label,i)=><Button variant="ghost" key={label} disabled={disabled||(i===2&&!pro)} className={`${control} btn-go`} onClick={()=>onAward(replyPoints((i+1) as 1|2|3,pro))}>{label}</Button>)}</div>
 </div>;
}