import { useState, type Dispatch, type SetStateAction } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DIFFICULTIES, DIFFICULTY_RULES, TIMER_LENGTHS, STAGES, BOSS_PHASES } from './adventure';
import { acceptsTeacherPin } from './mechanics';
import { type Progress } from './store';
export function Teacher({ p, setP, onClose, onJump }: { p: Progress; setP: Dispatch<SetStateAction<Progress>>; onClose: () => void; onJump: (id:number,phase?:number) => void }) {
 const [pin,setPin]=useState(''); const [ok,setOk]=useState(false); const [error,setError]=useState(false);
 const up=(patch:Partial<Progress>)=>setP(x=>({...x,...patch}));
 return <div className="fixed inset-0 z-[60] grid place-items-center bg-navy/80 p-4" role="dialog" aria-modal="true" aria-labelledby="settings-title" onKeyDown={e=>{if(e.key==='Escape')onClose();}}>
 <div className="panel relative max-h-[92dvh] w-full max-w-3xl space-y-5 overflow-y-auto p-5 md:p-8">
 <Button variant="ghost" onClick={onClose} aria-label="Close" title="Close" className="absolute right-4 top-4 size-12 bg-muted"><X/></Button>
 <h2 id="settings-title" className="pr-12 font-display text-3xl font-bold">⚙️ Settings</h2>
 {(['sfxVol','musicVol'] as const).map((key,i)=><label key={key} className="block text-xl font-bold">{i===0?'Sound effects volume':'Music volume'}<input className="block w-full accent-gold" type="range" min="0" max="1" step="0.1" value={p[key]} onChange={e=>up({[key]:+e.target.value})}/></label>)}
 {!ok?<form className="space-y-3 border-t pt-5" onSubmit={e=>{e.preventDefault();const pass=acceptsTeacherPin(pin);setOk(pass);setError(!pass);setPin('');}}><div className="flex gap-3"><input autoFocus className="min-w-0 flex-1 rounded-xl border-4 border-border px-3 py-3 text-xl" type="password" inputMode="numeric" aria-label="Teacher PIN" placeholder="Teacher PIN" value={pin} onChange={e=>setPin(e.target.value)}/><Button type="submit" variant="ghost" className="game-btn btn-gold h-auto text-xl">Unlock</Button></div>{error&&<p role="alert" className="font-bold text-destructive">Incorrect PIN</p>}</form>:
 <div className="space-y-5 border-t pt-5"><h3 className="font-display text-2xl font-bold">👩‍🏫 Teacher mode</h3>
 <fieldset><legend className="mb-2 text-xl font-bold">Difficulty</legend><div className="flex flex-wrap gap-3">{DIFFICULTIES.map(d=><Button key={d} variant="ghost" aria-pressed={p.difficulty===d} onClick={()=>up({difficulty:d,timerSecs:DIFFICULTY_RULES[d].timer})} className={`game-btn h-auto py-3 text-xl ${p.difficulty===d?'btn-gold':'btn-option'}`}>{d}</Button>)}</div></fieldset>
 <fieldset><legend className="mb-2 text-xl font-bold">Timer</legend><div className="flex flex-wrap gap-3"><label className="flex items-center gap-2 text-xl"><input type="checkbox" checked={p.timerOn} onChange={e=>up({timerOn:e.target.checked})}/> On</label>{TIMER_LENGTHS.map(s=><Button key={s} variant="ghost" aria-pressed={p.timerSecs===s} onClick={()=>up({timerSecs:s})} className={`game-btn h-auto py-3 text-xl ${p.timerSecs===s?'btn-gold':'btn-option'}`}>{s}s</Button>)}</div></fieldset>
 <div className="grid gap-3 sm:grid-cols-2">{([{key:'allUnlocked',label:'Unlock all levels'},{key:'skipCutscenes',label:'Skip all cutscenes'},{key:'returningBonus',label:'Returning Detective bonus'},{key:'prologuesOn',label:'Prologues'},{key:'checksOn',label:'Detective Check'}] as const).map(({key,label})=><label key={key} className="flex items-center gap-3 text-xl font-bold"><input type="checkbox" checked={p[key]} onChange={e=>up({[key]:e.target.checked})}/>{label}</label>)}</div>
 <label className="block text-xl font-bold">Default reading mode<select className="mt-2 block w-full rounded-lg border-2 border-border bg-card p-3" value={p.readingMode} onChange={e=>up({readingMode:e.target.value==='pip'?'pip':'self'})}><option value="self">Read it myself</option><option value="pip">Read with Pip</option></select></label>
 <label className="block text-xl font-bold">Teaser text<textarea className="mt-2 block w-full rounded-lg border-2 border-border p-3 font-sans" maxLength={160} value={p.teaser} onChange={e=>up({teaser:e.target.value})}/></label>
 <fieldset><legend className="mb-3 text-xl font-bold">Jump to a level or boss phase</legend><div className="grid gap-3 sm:grid-cols-2">{STAGES.map(s=><Button key={s.id} variant="ghost" onClick={()=>onJump(s.id)} className="game-btn btn-option h-auto justify-start whitespace-normal py-3 text-lg">{s.id}. {s.place}</Button>)}{BOSS_PHASES.map((b,i)=><Button key={b} variant="ghost" onClick={()=>onJump(7,i)} className="game-btn h-auto justify-start whitespace-normal bg-boss py-3 text-lg text-paper">👑 {b}</Button>)}</div></fieldset>
 <Button variant="ghost" className="game-btn btn-option h-auto py-3 text-xl" onClick={()=>{if(confirm('Reset all progress?'))setP(x=>({...x,points:0,stars:0,hearts:3,streak:0,levelStars:{},powerupsUnlocked:0,allUnlocked:false,introSeen:false,bossWon:false,chaptersUnlocked:[0],readingRewards:[],checkRewards:[]}));}}>Reset progress</Button>
 </div>}
 </div></div>;
}
