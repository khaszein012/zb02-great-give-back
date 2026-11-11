let ctx: AudioContext | null = null;
let musicGain: GainNode | null = null;
let musicTimer: number | null = null;
let currentTrack: "map" | "boss" | null = null;
export const vol = { sfx: 0.7, music: 0.3, musicOn: true };

function ac() {
  if (typeof window === "undefined") return null;
  if (!ctx) ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", when = 0, gain = 0.3, dest?: AudioNode) {
  const c = ac(); if (!c) return;
  const o = c.createOscillator(); const g = c.createGain();
  o.type = type; o.frequency.value = freq;
  const t = c.currentTime + when;
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain * (dest ? 1 : vol.sfx), t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g); g.connect(dest ?? c.destination);
  o.start(t); o.stop(t + dur + 0.05);
}

export const sfx = {
  correct: () => { tone(880, 0.15, "triangle"); tone(1320, 0.3, "triangle", 0.1); },
  wrong: () => { tone(220, 0.25, "sine", 0, 0.35); tone(180, 0.3, "sine", 0.12, 0.3); },
  thunk: () => { tone(90, 0.25, "square", 0, 0.25); tone(60, 0.3, "sine", 0, 0.4); },
  pop: () => tone(1500, 0.08, "sine", 0, 0.25),
  whoosh: () => { [400, 700, 1000, 1400].forEach((f, i) => tone(f, 0.12, "sawtooth", i * 0.03, 0.06)); },
  fire: () => { [523, 659, 784, 1047, 1319].forEach((f, i) => tone(f, 0.2, "triangle", i * 0.06, 0.2)); },
  fanfare: () => { [523, 659, 784, 1047].forEach((f, i) => tone(f, i === 3 ? 0.7 : 0.18, "square", i * 0.15, 0.12)); },
  laugh: () => { [400, 350, 400, 350].forEach((f, i) => tone(f, 0.1, "square", i * 0.13, 0.1)); },
  click: () => tone(600, 0.05, "triangle", 0, 0.15),
  splash: () => { [950,650,430,260].forEach((f,i)=>tone(f,.16,"sine",i*.04,.16)); },
  alarm: () => { [880,660,880,660].forEach((f,i)=>tone(f,.15,'square',i*.15,.12)); },
  cheer: () => { [523,659,784,1047,1319,1568].forEach((f,i)=>tone(f,.45,'triangle',i*.07,.15)); },
  boot: () => { tone(130,.2,"square",0,.12);tone(90,.3,"sine",.1,.2); },
};

const MAP_SEQ = [523, 659, 784, 659, 587, 698, 880, 698, 523, 659, 784, 1047, 988, 784, 659, 587];
const BOSS_SEQ = [220, 0, 262, 220, 0, 311, 294, 262, 220, 0, 262, 220, 330, 311, 294, 247];

export function playMusic(track: "map" | "boss") {
  const c = ac(); if (!c) return;
  if (currentTrack === track && musicTimer) return;
  stopMusic();
  currentTrack = track;
  if (!vol.musicOn) return;
  musicGain = c.createGain(); musicGain.gain.value = vol.music * 0.5; musicGain.connect(c.destination);
  const seq = track === "map" ? MAP_SEQ : BOSS_SEQ;
  const step = track === "map" ? 0.28 : 0.2;
  let i = 0;
  const tick = () => {
    if (!musicGain) return;
    const f = seq[i % seq.length];
    if (f) tone(f, step * 1.6, track === "map" ? "triangle" : "square", 0, track === "map" ? 0.25 : 0.12, musicGain);
    if (i % 4 === 0) tone((track === "map" ? 131 : 110), step * 3.5, "sine", 0, 0.35, musicGain);
    i++;
  };
  tick();
  musicTimer = window.setInterval(tick, step * 1000);
}
export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  musicGain?.disconnect(); musicGain = null;
}
export function setMusicOn(on: boolean) {
  vol.musicOn = on;
  if (!on) stopMusic(); else if (currentTrack) { const t = currentTrack; currentTrack = null; playMusic(t); }
}
export function setMusicVol(v: number) { vol.music = v; if (musicGain) musicGain.gain.value = v * 0.5; }

export function speak(text: string, rate = 0.85) {
  if (typeof window === "undefined" || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/___/g, "blank"));
  u.lang = "en-GB"; u.rate = rate;
  const v = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("en-GB")) ||
    window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("en"));
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}
