import { useEffect, useState } from "react";
import { TIMER_LENGTHS, type Difficulty } from "./adventure";

export type Progress = {
  stars: number; points: number; hearts: number; streak: number;
  powerupsUnlocked: number; allUnlocked: boolean;
  timerOn: boolean; timerSecs: number; musicVol: number; sfxVol: number; musicOn: boolean;
  difficulty: Difficulty; levelStars: Record<number, number>; introSeen: boolean; bossWon: boolean;
  skipCutscenes: boolean; returningBonus: boolean; teaser: string;
  prologuesOn: boolean; readingMode: "self" | "pip"; checksOn: boolean;
  chaptersUnlocked: number[]; readingRewards: number[]; checkRewards: number[];
};
export const STORAGE_KEY = "episode-3-v1";
/** Episode 2 keeps its own key. We read it only to spot a returning detective. */
const PREVIOUS_EPISODE_KEY = "episode-2-v1";
export const DEFAULT: Progress = { stars: 0, points: 0, hearts: 3, streak: 0, powerupsUnlocked: 0, allUnlocked: false, timerOn: true, timerSecs: 15, musicVol: 0.3, sfxVol: 0.7, musicOn: true, difficulty: "Detective", levelStars: {}, introSeen: false, bossWon: false, skipCutscenes: false, returningBonus: false, teaser: "Episode 3… can you ask for it all back?", prologuesOn: true, readingMode: "self", checksOn: true, chaptersUnlocked: [0], readingRewards: [], checkRewards: [] };
export const stageUnlocked = (p: Progress, id: number) => p.allUnlocked || id === 1 || (id === 7 ? [1,2,3,4,5,6].every((n) => (p.levelStars[n] ?? 0) >= 1) : (p.levelStars[id - 1] ?? 0) >= 1);
export const completedStages = (p: Progress) => [1,2,3,4,5,6].filter((id) => (p.levelStars[id] ?? 0) > 0).length;
export const unlockedPowerIds = (p: Progress) => new Set([...(p.allUnlocked ? ["lens", "compass", "heart", "freeze", "double", "skip"] : ["lens", "compass", "heart", "freeze", "double", "skip"].slice(0, p.powerupsUnlocked)), ...(p.returningBonus ? ["lens"] : [])]);
export function awardReading(p: Progress, id: number): Progress { return p.readingRewards.includes(id) ? p : { ...p, points: p.points + 2, readingRewards: [...p.readingRewards, id] }; }
export function awardCheck(p: Progress, id: number): Progress { return p.checkRewards.includes(id) ? p : { ...p, points: p.points + 1, checkRewards: [...p.checkRewards, id] }; }

/** True when the player finished Episode 2, so Episode 3 can welcome them back. */
export function returningFromEpisode2(storage: Pick<Storage, "getItem">): boolean {
  try {
    const saved = JSON.parse(storage.getItem(PREVIOUS_EPISODE_KEY) ?? "{}");
    return saved.bossWon === true;
  } catch { return false; }
}

export function readProgress(storage: Pick<Storage, "getItem">): Progress {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const saved = JSON.parse(raw ?? "{}");
    const finite = (value: unknown, fallback: number) => typeof value === "number" && Number.isFinite(value) ? value : fallback;
    const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));
    const bool = (key: string) => typeof saved[key] === "boolean" ? saved[key] : DEFAULT[key as keyof Progress];
    const ids = (v: unknown) => Array.isArray(v) ? v.filter((x) => typeof x === "number" && x >= 0 && x <= 8) : [];
    const levelStars: Record<number, number> = {};
    if (raw && saved.levelStars && typeof saved.levelStars === "object") for (const [key, value] of Object.entries(saved.levelStars)) {
      const id = Number(key); if (id >= 1 && id <= 7 && typeof value === "number") levelStars[id] = clamp(Math.floor(value), 0, 3);
    }
    return {
      ...DEFAULT,
      stars: Math.max(0, finite(saved.stars, 0)),
      points: Math.max(0, finite(saved.points, 0)),
      hearts: Math.max(0, finite(saved.hearts, 3)), streak: Math.max(0, finite(saved.streak, 0)),
      powerupsUnlocked: clamp(finite(saved.powerupsUnlocked, 0), 0, 6),
      allUnlocked: bool("allUnlocked") as boolean,
      timerOn: bool("timerOn") as boolean,
      timerSecs: (TIMER_LENGTHS as readonly number[]).includes(saved.timerSecs) ? saved.timerSecs : 15,
      musicVol: clamp(finite(saved.musicVol, 0.3), 0, 1), sfxVol: clamp(finite(saved.sfxVol, 0.7), 0, 1),
      musicOn: bool("musicOn") as boolean,
      difficulty: ["Explorer", "Detective", "Legend"].includes(saved.difficulty) ? saved.difficulty : "Detective",
      levelStars, introSeen: bool("introSeen") as boolean, bossWon: bool("bossWon") as boolean,
      skipCutscenes: bool("skipCutscenes") as boolean,
      returningBonus: raw ? bool("returningBonus") as boolean : returningFromEpisode2(storage),
      prologuesOn: bool("prologuesOn") as boolean, checksOn: bool("checksOn") as boolean,
      readingMode: saved.readingMode === "pip" ? "pip" : "self", teaser: typeof saved.teaser === "string" ? saved.teaser : DEFAULT.teaser,
      chaptersUnlocked: [...new Set([0, ...ids(saved.chaptersUnlocked)])], readingRewards: ids(saved.readingRewards), checkRewards: ids(saved.checkRewards),
    };
  } catch { return { ...DEFAULT }; }
}
export function useProgress() {
  const [p, setP] = useState<Progress>(DEFAULT);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setP(readProgress(localStorage));
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(p)); } catch {}
  }, [p, ready]);
  return [p, setP, ready] as const;
}
