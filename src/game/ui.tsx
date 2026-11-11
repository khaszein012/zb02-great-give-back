import { useMemo } from "react";
import { ArrowLeft, Music, Music2, Settings } from "lucide-react";
import { speak } from "./audio";
import { Button } from "@/components/ui/button";

export function TopBar(props: {
  onBack?: (() => void) | undefined; hearts: number; streak: number; musicOn: boolean; onMusic: () => void; onSettings: () => void; title?: string;
}) {
  return (
    <header className="glass-navy relative z-30 flex flex-wrap items-center gap-3 px-4 py-3 shadow-lg">
      {props.onBack ? (
        <Button variant="ghost" onClick={props.onBack} aria-label="Back" className="game-btn btn-gold grid size-12 place-items-center">
          <ArrowLeft className="size-6" />
        </Button>
      ) : <div className="hidden size-12 md:block" />}
      <div className="flex items-center gap-2 font-display text-2xl font-bold tracking-wide text-gold md:text-3xl">
        {props.title ?? "EPISODE 3"}
      </div>
      <div className="ml-auto flex flex-wrap items-center gap-2 md:gap-4">
        <div className="flex gap-1 text-3xl" aria-label={`${props.hearts} hearts`}>
          {Array.from({ length: Math.max(3, props.hearts) }).map((_, i) => (
            <span key={i} className={i < props.hearts ? "anim-pop" : "opacity-25 grayscale"}>❤️</span>
          ))}
        </div>
        <div className={`rounded-full bg-navy-soft px-4 py-1 font-display text-2xl font-bold ${props.streak >= 3 ? "text-gold anim-pop" : ""}`}>
          🔥 x{Math.max(1, Math.min(props.streak, 3))}
        </div>
        <Button variant="ghost" onClick={props.onMusic} aria-label="Toggle music" aria-pressed={props.musicOn} title="Toggle music" className="game-btn grid size-12 place-items-center rounded-2xl bg-navy-soft">
          {props.musicOn ? <Music className="size-6" /> : <Music2 className="size-6 opacity-40" />}
        </Button>
        <Button variant="ghost" onClick={props.onSettings} aria-label="Settings" title="Settings" className="game-btn grid size-12 place-items-center rounded-2xl bg-navy-soft">
          <Settings className="size-6" />
        </Button>
      </div>
    </header>
  );
}

export function Confetti({ n = 90 }: { n?: number }) {
  const pieces = useMemo(() => Array.from({ length: n }).map((_, i) => ({
    left: Math.random() * 100, delay: Math.random() * 1.5, dur: 2.5 + Math.random() * 2,
    color: ["var(--gold)", "var(--success)", "var(--heart)", "var(--boss-glow)", "var(--primary)"][i % 5],
    size: 8 + Math.random() * 10,
  })), [n]);
  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden" aria-hidden>
      {pieces.map((p, i) => (
        <span key={i} className="absolute top-0 rounded-sm"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.5, background: p.color, animation: `confetti ${p.dur}s ${p.delay}s linear forwards` }} />
      ))}
    </div>
  );
}

export function TimerRing({ left, total, size = 84 }: { left: number; total: number; size?: number }) {
  const r = size / 2 - 7; const c = 2 * Math.PI * r; const f = Math.max(0, left / total);
  const color = f > 0.5 ? "var(--success)" : f > 0.25 ? "var(--gold)" : "var(--heart)";
  return (
    <div className="relative" style={{ width: size, height: size }} aria-label={`${Math.ceil(left)} seconds left`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--muted)" strokeWidth={8} fill="var(--card)" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={8} fill="none" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - f)} style={{ transition: "stroke-dashoffset 1s linear" }} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-display text-2xl font-bold">{Math.ceil(left)}</span>
    </div>
  );
}

export function Stars({ n, size = "text-2xl" }: { n: number; size?: string }) {
  return (
    <span className={`${size} tracking-tight`} aria-label={`${n} of 3 stars`}>
      {[0, 1, 2].map((i) => <span key={i} className={i < n ? "" : "opacity-25 grayscale"}>⭐</span>)}
    </span>
  );
}

export function ListenBtn({ text }: { text: string }) {
  return (
    <Button variant="ghost" onClick={() => speak(text)} className="game-btn btn-gold inline-flex h-auto items-center gap-2 px-5 py-3 text-xl">
      🔊 Listen
    </Button>
  );
}
