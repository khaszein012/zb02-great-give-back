export const TEACHER_PIN = "2026";
export const acceptsTeacherPin = (pin: string) => pin === TEACHER_PIN;

export const POWERUPS = [
  { id: "lens", icon: "📷", name: "Pip's Hint", desc: "Shows a hint" },
  { id: "compass", icon: "➗", name: "50/50", desc: "Removes wrong answers" },
  { id: "heart", icon: "❤️", name: "Extra Heart", desc: "+1 heart" },
  { id: "freeze", icon: "⏸️", name: "Freeze Clock", desc: "Stops the timer" },
  { id: "double", icon: "✖️2", name: "Double Points", desc: "Next answer x2" },
  { id: "skip", icon: "⭐", name: "Skip Star", desc: "Skip 1 question" },
] as const;
export type PowerId = typeof POWERUPS[number]["id"];
export type Session = {
  hearts: number; streak: number; points: number; correct: number;
  frozen: boolean; hint: boolean; double: boolean; skip: boolean;
  removeWrong: number; used: PowerId[];
};
export const newSession = (): Session => ({ hearts: 3, streak: 0, points: 0, correct: 0, frozen: false, hint: false, double: false, skip: false, removeWrong: 0, used: [] });
export function answerSession(s: Session, correct: boolean, basePoints = 1): Session {
  if (s.hearts <= 0) return s;
  return correct
    ? { ...s, correct: s.correct + 1, streak: s.streak + 1, points: s.points + basePoints * (s.double ? 2 : 1), double: false }
    : { ...s, hearts: s.hearts - 1, streak: 0 };
}
export function usePower(s: Session, id: PowerId): Session {
  if (s.used.includes(id) || s.hearts <= 0) return s;
  const next = { ...s, used: [...s.used, id] };
  switch (id) {
    case "compass": return { ...next, removeWrong: 2 };
    case "freeze": return { ...next, frozen: true };
    case "heart": return { ...next, hearts: s.hearts + 1 };
    case "lens": return { ...next, hint: true };
    case "double": return { ...next, double: true };
    case "skip": return { ...next, skip: true };
  }
}
export function starsFor(correct: number, total: number) {
  const ratio = total ? correct / total : 0;
  return ratio >= 0.9 ? 3 : ratio >= 0.7 ? 2 : 1;
}

export const hintCost = (difficulty: "Explorer" | "Detective" | "Legend") => difficulty === "Explorer" ? 0 : 2;
export const helperCost = (difficulty: "Explorer" | "Detective" | "Legend") => difficulty === "Detective" ? 1 : 0;
export const speedBonus = (stageId: number, timerOn: boolean, left: number, total: number) => {
 if(stageId!==1||!timerOn)return 0;
 const elapsed=total-left;
 return elapsed<8/3?3:elapsed<16/3?2:elapsed<8?1:0;
};