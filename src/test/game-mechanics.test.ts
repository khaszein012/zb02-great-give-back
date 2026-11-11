import { describe, expect, it } from "vitest";
import { acceptsTeacherPin, answerSession, newSession, POWERUPS, starsFor, usePower } from "@/game/mechanics";
import { readProgress, STORAGE_KEY } from "@/game/store";

describe("Preserved game systems", () => {
  it("unlocks teacher mode only with PIN 2026", () => {
    expect(acceptsTeacherPin("2026")).toBe(true);
    expect(acceptsTeacherPin("2025")).toBe(false);
  });

  it("starts with three hearts and loses one for a wrong answer", () => {
    expect(newSession().hearts).toBe(3);
    expect(answerSession(newSession(), false).hearts).toBe(2);
  });

  it("keeps streak and points, and resets streak on a wrong answer", () => {
    const s = [1, 2, 3].reduce((s) => answerSession(s, true), newSession());
    expect(s.streak).toBe(3); expect(s.points).toBe(3);
    expect(answerSession(s, false).streak).toBe(0);
  });

  it("preserves three-star scoring", () => {
    expect(starsFor(9, 10)).toBe(3); expect(starsFor(7, 10)).toBe(2); expect(starsFor(6, 10)).toBe(1);
  });

  it("preserves all six power-up effects", () => {
    expect(POWERUPS).toHaveLength(6);
    expect(usePower(newSession(), "compass").removeWrong).toBe(2);
    expect(usePower(newSession(), "freeze").frozen).toBe(true);
    expect(usePower(newSession(), "heart").hearts).toBe(4);
    expect(usePower(newSession(), "lens").hint).toBe(true);
    expect(answerSession(usePower(newSession(), "double"), true).points).toBe(2);
    expect(usePower(newSession(), "skip").skip).toBe(true);
    const s = usePower(newSession(), "heart");
    expect(usePower(s, "heart").hearts).toBe(4);
  });

  it("reads saved Episode 3 counters and settings", () => {
    const saved = readProgress({ getItem: (key) => key === STORAGE_KEY ? JSON.stringify({ points: 42, stars: 5, hearts: 2, streak: 3, musicOn: false, timerSecs: 25 }) : null });
    expect(saved.points).toBe(42); expect(saved.stars).toBe(5); expect(saved.hearts).toBe(2);
    expect(saved.streak).toBe(3); expect(saved.musicOn).toBe(false); expect(saved.timerSecs).toBe(25);
  });

  it("does not treat Episode 2 data as Episode 3 progress", () => {
    const saved = readProgress({ getItem: (key) => key === "episode-2-v1" ? JSON.stringify({ points: 25, stars: 6 }) : null });
    expect(saved.points).toBe(0);
    expect(saved.stars).toBe(0);
    expect(saved.returningBonus).toBe(false);
  });
});