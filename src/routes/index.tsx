import { createFileRoute } from '@tanstack/react-router';
import { useEffect,useMemo,useRef,useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProgress,awardReading,awardCheck,completedStages } from '@/game/store';
import { CHAPTERS,STAGES,INTRO_LINES,STORY_IMAGE,bossStage,type Chapter } from '@/game/adventure';
import { playMusic,stopMusic,setMusicOn,setMusicVol,vol,sfx } from '@/game/audio';
import { TopBar,Confetti } from '@/game/ui';
import { AdventureMap } from '@/game/AdventureMap';
import { Teacher } from '@/game/Teacher';
import { StoryPage,Cutscene,ChapterShelf } from '@/game/StoryBook';
import { PlayStage } from '@/game/PlayStage';
import { Festival,Certificate } from '@/game/FinaleViews';
export const Route=createFileRoute('/')({
 head:()=>({meta:[{title:'Detective Zabyr — The Great Give-Back'},{name:'description',content:'Explore Gadgeton with Zabyr and Pip, win back six stolen gadgets and stop Mister Magpie’s pick-up nest.'},{property:'og:title',content:'Detective Zabyr — The Great Give-Back'},{property:'og:description',content:'A storybook English adventure through Gadgeton with six gadget missions and Mister Magpie’s nest.'},{property:'og:type',content:'website'},{name:'twitter:card',content:'summary_large_image'}],links:[{rel:'preconnect',href:'https://fonts.googleapis.com'},{rel:'preconnect',href:'https://fonts.gstatic.com',crossOrigin:'anonymous'},{rel:'stylesheet',href:'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Nunito:wght@600;700;800;900&display=swap'}]}),component:Game,
});
type Screen='map'|'story'|'cutscene'|'play'|'shelf'|'ending'|'festival';
function Game(){
 const [p,setP]=useProgress();const [screen,setScreen]=useState<Screen>('map');const [settings,setSettings]=useState(false);const [id,setId]=useState(0);const [phase,setPhase]=useState(0);const [chapter,setChapter]=useState<Chapter|null>(null);const [replay,setReplay]=useState(false);const [status,setStatus]=useState({hearts:3,streak:0});const started=useRef(false);const won=useRef(false);
 const stage=useMemo(()=>id===7?bossStage(phase):STAGES.find(s=>s.id===id),[id,phase]);
 useEffect(()=>{vol.sfx=p.sfxVol;setMusicVol(p.musicVol);setMusicOn(p.musicOn);},[p.sfxVol,p.musicVol,p.musicOn]);
 useEffect(()=>{const go=()=>{if(started.current)return;started.current=true;playMusic('map');};window.addEventListener('pointerdown',go,{once:true});window.addEventListener('keydown',go,{once:true});return()=>{window.removeEventListener('pointerdown',go);window.removeEventListener('keydown',go);stopMusic();};},[]);
 useEffect(()=>{if(started.current)playMusic(id===7&&screen==='play'?'boss':'map');},[screen,id]);
 const toMap=()=>{window.speechSynthesis?.cancel();setScreen('map');setStatus({hearts:3,streak:0});};
 const cutOrPlay=()=>{if(p.skipCutscenes){if(id===0){setP(x=>({...x,introSeen:true}));toMap();}else setScreen('play');}else setScreen('cutscene');};
 const open=(next:number,bossPhase=0,direct=false)=>{setId(next);setPhase(bossPhase);won.current=false;setReplay(false);setStatus({hearts:3,streak:0});const c=CHAPTERS.find(c=>c.id===next);setP(x=>({...x,chaptersUnlocked:[...new Set([...x.chaptersUnlocked,next])]}));if(direct){setScreen('play');return;}if(p.prologuesOn&&c){setChapter(c);setScreen('story');}else if(p.skipCutscenes){if(next===0){setP(x=>({...x,introSeen:true}));setScreen('map');}else setScreen('play');}else setScreen('cutscene');};
 const finished=(stars:number,points:number)=>{won.current=true;if(id===7){setP(x=>{const levelStars=phase===2?{...x.levelStars,7:Math.max(x.levelStars[7]??0,stars)}:x.levelStars;return {...x,points:Math.max(0,x.points+points),levelStars,stars:Object.values(levelStars).reduce((a,b)=>a+b,0),...(phase===2?{bossWon:true,chaptersUnlocked:[...new Set([...x.chaptersUnlocked,8])]}:{})};});}else setP(x=>{const levelStars={...x.levelStars,[id]:Math.max(x.levelStars[id]??0,stars)};const count=completedStages({...x,levelStars});return {...x,introSeen:true,points:Math.max(0,x.points+points),stars:Object.values(levelStars).reduce((a,b)=>a+b,0),levelStars,powerupsUnlocked:count,chaptersUnlocked:[...new Set([...x.chaptersUnlocked,Math.min(7,id+1)])]};});};
 const afterPlay=()=>{if(id===7&&won.current){won.current=false;if(phase<2){setPhase(n=>n+1);setStatus({hearts:3,streak:0});}else setScreen('festival');}else toMap();};
 return <div className={`flex min-h-screen flex-col ${screen==='story'?'bg-background':''}`}>
 <TopBar title="🧲 THE GREAT GIVE-BACK" onBack={screen==='map'?undefined:toMap} hearts={screen==='play'?status.hearts:3} streak={screen==='play'?status.streak:0} musicOn={p.musicOn} onMusic={()=>setP(x=>({...x,musicOn:!x.musicOn}))} onSettings={()=>setSettings(true)}/>
 {screen==='map'&&<AdventureMap p={p} onOpen={open} onStory={()=>setScreen('shelf')} onIntro={()=>open(0)}/>}
 {screen==='shelf'&&<ChapterShelf p={p} onOpen={c=>{setChapter(c);setReplay(true);setScreen('story');}}/>}
 {screen==='story'&&chapter&&<StoryPage key={chapter.id} chapter={chapter} p={p} replay={replay} onReading={()=>setP(x=>awardReading(x,chapter.id))} onCheck={()=>setP(x=>awardCheck(x,chapter.id))} onDone={()=>{if(replay)setScreen('shelf');else if(id===8)setScreen('ending');else cutOrPlay();}}/>}
 {screen==='cutscene'&&<Cutscene key={id} image={id===0?CHAPTERS[0]?.image:stage?.image} lines={id===0?(p.returningBonus?['Welcome back, World Detective!',...INTRO_LINES]:INTRO_LINES):(stage?.cutscene??[])} onDone={()=>{if(id===0){setP(x=>({...x,introSeen:true}));toMap();}else setScreen('play');}}/>}
 {screen==='play'&&stage&&<PlayStage key={`${id}-${phase}-${p.difficulty}`} stage={stage} p={p} paused={settings} onStatus={(hearts,streak)=>setStatus({hearts,streak})} onFinish={finished} onExit={afterPlay}/>}
 {screen==='festival'&&<Festival onDone={()=>{const c=CHAPTERS.find(c=>c.id===8);if(p.prologuesOn&&c){setId(8);setChapter(c);setReplay(false);setScreen('story');}else setScreen('ending');}}/>}
 {screen==='ending'&&<Certificate p={p} onExit={toMap}/>}
 {settings&&<Teacher p={p} setP={setP} onClose={()=>setSettings(false)} onJump={(next,bossPhase)=>{setSettings(false);open(next,bossPhase,true);}}/>}
 </div>;
}
