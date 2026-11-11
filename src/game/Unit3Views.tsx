import { useMemo,useState } from 'react';
import { Button } from '@/components/ui/button';
import { shuffled,type Question } from './adventure';
import { ASK_STEPS,askCorrect,punctuateAnswer,punctuateCorrect,punctuatedSentence } from './unit3-rules';
import { speak,sfx } from './audio';
import { FESTIVAL_POSTER } from './later-content';

const control='game-btn btn-option h-auto min-h-16 whitespace-normal px-5 py-3 text-2xl';

/** Mission 2 — pick the polite request, then pick the reply that matches it. */
export function AskAndAnswer({q,disabled,onAnswer,onMistake}:{q:Question;disabled:boolean;onAnswer:(choices:string[])=>void;onMistake:()=>void}){
 const ask=q.ask;
 const questions=useMemo(()=>shuffled(ask?.questionOptions??[]),[ask]);
 const replies=useMemo(()=>shuffled(ask?.replyOptions??[]),[ask]);
 const [step,setStep]=useState(0);const [question,setQuestion]=useState('');const [reply,setReply]=useState('');const [message,setMessage]=useState('');
 if(!ask)return null;
 const chooseQuestion=(value:string)=>{
  if(disabled)return;
  if(!q.answer.includes(value)){setMessage('Read the sentence again. Who is asking, and whose thing is it?');onMistake();return;}
  sfx.click();setQuestion(value);setStep(1);setMessage('');speak(value);
 };
 const chooseReply=(value:string)=>{
  if(disabled)return;
  if(!askCorrect(question,value,q.answer)){setMessage('Does your reply match the question? Yes means yes. No means no.');onMistake();return;}
  setReply(value);speak(value);onAnswer([question,value]);
 };
 return <div className="space-y-5">
  <div className="flex flex-wrap items-center gap-3 font-display text-2xl font-bold"><span className={`rounded-full px-4 py-1 ${step===0?'bg-gold text-navy':'bg-muted'}`}>1 · {ASK_STEPS[0]}</span><span className={`rounded-full px-4 py-1 ${step===1?'bg-gold text-navy':'bg-muted'}`}>2 · {ASK_STEPS[1]}</span></div>
  {step===0&&<div className="grid gap-3 md:grid-cols-2">{questions.map(option=><Button key={option} variant="ghost" disabled={disabled} className={control} onClick={()=>chooseQuestion(option)}>{option}</Button>)}</div>}
  {step===1&&<>
   <p className="rounded-lg bg-gold/20 p-4 text-3xl font-bold">{question}</p>
   <div className="grid gap-3 md:grid-cols-2">{replies.map(option=><Button key={option} variant="ghost" disabled={disabled} className={`${control} ${reply===option?'btn-correct':''}`} onClick={()=>chooseReply(option)}>{option}</Button>)}</div>
   <Button variant="ghost" disabled={disabled} className={`${control}`} onClick={()=>{setStep(0);setQuestion('');setMessage('');}}>↩ Ask again</Button>
  </>}
  {message&&<p role="status" className="text-2xl font-bold">{message}</p>}
 </div>;
}

/** Mission 5 — tap the words that need a capital, then choose the sentence ending. */
export function PunctuationRepair({q,disabled,onAnswer,onMistake}:{q:Question;disabled:boolean;onAnswer:(choices:string[])=>void;onMistake:()=>void}){
 const task=q.punctuate;
 const [caps,setCaps]=useState<number[]>([]);const [end,setEnd]=useState<'.'|'?'|'!'>('.');const [message,setMessage]=useState('');
 if(!task)return null;
 const toggle=(index:number)=>{
  if(disabled)return;
  sfx.click();
  setCaps(current=>current.includes(index)?current.filter(i=>i!==index):[...current,index]);
  setMessage('');
 };
 return <div className="space-y-5">
  <p className="text-2xl font-bold">Tap every word that needs a capital letter.</p>
  <div className="flex flex-wrap items-center gap-2 rounded-xl bg-gold/20 p-4" aria-label="Your sentence">
   {task.words.map((word,index)=><Button key={`${word}-${index}`} variant="ghost" aria-pressed={caps.includes(index)} disabled={disabled} onClick={()=>toggle(index)} className={`game-btn h-auto whitespace-normal px-3 py-2 text-3xl font-bold ${caps.includes(index)?'btn-gold':'btn-option'}`}>{caps.includes(index)?(word[0]?.toUpperCase()??'')+word.slice(1):word}</Button>)}
   <span className="font-display text-4xl">{end}</span>
  </div>
  <div className="flex flex-wrap gap-3" aria-label="Choose the ending">
   {(['.','?','!'] as const).map(mark=><Button key={mark} variant="ghost" aria-pressed={end===mark} disabled={disabled} className={`game-btn h-auto min-w-16 px-5 py-3 font-display text-4xl ${end===mark?'btn-gold':'btn-option'}`} onClick={()=>{setEnd(mark);setMessage('');}}>{mark}</Button>)}
  </div>
  <p className="text-2xl"><span className="font-bold text-muted-foreground">Preview: </span>{punctuatedSentence(task, caps)}</p>
  <Button variant="ghost" disabled={disabled} className="game-btn btn-go h-auto px-6 py-4 text-2xl" onClick={()=>{
   if(punctuateCorrect(task, caps, end)) {speak(punctuateAnswer(task));onAnswer([punctuateAnswer(task)]);}
   else {setMessage('Check the names, the first word, and whether the sentence is asking or telling.');onMistake();}
  }}>Check the sign ✓</Button>
  {message&&<p role="status" className="text-2xl font-bold">{message}</p>}
 </div>;
}

/** Reference panel for Mission 4, so students can read the leaflet while answering. */
export function FestivalLeaflet({onClose}:{onClose:()=>void}){
 const poster=FESTIVAL_POSTER;
 return <div className="fixed inset-0 z-40 overflow-y-auto bg-navy/95 p-4" role="dialog" aria-modal="true" aria-label="Festival leaflet">
  <div className="mx-auto max-w-3xl space-y-5">
   <div className="sticky top-0 flex items-center justify-between bg-navy py-3 text-paper"><h2 className="font-display text-3xl">🎪 {poster.title}</h2><Button variant="ghost" className={control} onClick={onClose}>Close ✕</Button></div>
   <article className="rounded-lg border-4 border-gold bg-card p-6 text-2xl leading-relaxed">
    <p className="font-display text-3xl font-bold">{poster.title}</p>
    <p className="mt-2"><b>Where:</b> {poster.where}</p>
    <p><b>When:</b> {poster.when}</p>
    <p className="mt-3"><b>What you can see:</b></p>
    <ul className="ml-6 list-disc">{poster.acts.map(act=><li key={act}>{act}</li>)}</ul>
    <p className="mt-3"><b>Tickets:</b> adult {poster.prices.adult} · child {poster.prices.child}</p>
    <p className="mt-3 text-xl font-bold text-muted-foreground">{poster.note}</p>
    <Button variant="ghost" className={`${control} mt-3`} onClick={()=>speak(`${poster.title}. ${poster.where}. ${poster.when}. ${poster.acts.join('. ')}.`)}>🔊 Listen to the leaflet</Button>
   </article>
  </div>
 </div>;
}