import { useMemo, useState } from 'react';
import { Undo2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { shuffled, type Question } from './adventure';
import { sfx } from './audio';

export function spellingTiles(question: Question): string[] {
 return [...(question.answer[0] ?? ''), ...(question.traps ?? [])];
}
export function SpellingBeam({question,disabled,onAnswer}: { question:Question; disabled:boolean; onAnswer:(word:string)=>void }) {
 const tiles=useMemo(()=>shuffled(spellingTiles(question)),[question]);
 const [selected,setSelected]=useState<number[]>([]);
 const word=selected.map(i=>tiles[i]??'').join('');
 return <div className="space-y-5">
  <div className="spelling-beam flex min-h-24 flex-wrap items-center justify-center gap-2 rounded-xl bg-gold/20 p-3" aria-label="Spelling beam">
   {selected.length===0?<span className="text-3xl font-bold text-muted-foreground">{question.base} → …</span>:selected.map((index,i)=><span key={i} className="grid size-11 place-items-center rounded-lg bg-card font-display text-3xl font-bold shadow-sm">{tiles[index]}</span>)}
  </div>
  <div className="flex flex-wrap justify-center gap-3" aria-label="Letter tiles">
   {tiles.map((letter,index)=><Button key={index} variant="ghost" aria-label={`Letter ${letter}, tile ${index+1}`} disabled={disabled||selected.includes(index)} onClick={()=>{setSelected(x=>[...x,index]);sfx.click();}} className="game-btn btn-option size-14 p-0 text-3xl">{letter}</Button>)}
  </div>
  <div className="flex flex-wrap justify-center gap-3">
   <Button variant="ghost" disabled={disabled||!selected.length} onClick={()=>setSelected(x=>x.slice(0,-1))} aria-label="Undo letter" title="Undo letter" className="game-btn btn-option size-14"><Undo2/></Button>
   <Button variant="ghost" disabled={disabled||!selected.length} onClick={()=>setSelected([])} aria-label="Clear word" title="Clear word" className="game-btn btn-option size-14"><RotateCcw/></Button>
   <Button variant="ghost" disabled={disabled||!word} onClick={()=>onAnswer(word)} className="game-btn btn-go h-auto px-6 py-3 text-2xl">Check word ✓</Button>
  </div>
 </div>;
}