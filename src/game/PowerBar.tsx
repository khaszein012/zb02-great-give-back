import { Button } from "@/components/ui/button";
import { POWERUPS, type PowerId } from "./mechanics";

export function PowerBar({ unlocked, unlockedIds, used, onUse }: { unlocked: number; unlockedIds?: Set<string>; used?: PowerId[]; onUse?: ((id: PowerId) => void) | undefined }) {
  return (
    <div className="glass-navy flex flex-wrap items-center gap-3 rounded-3xl px-4 py-3">
      <span className="font-display text-xl font-bold text-gold">POWER-UPS</span>
      {POWERUPS.map((p, i) => {
        const open = unlockedIds ? unlockedIds.has(p.id) : i < unlocked;
        const isUsed = used?.includes(p.id);
        return (
          <Button key={p.id} variant="ghost" disabled={!open || isUsed || !onUse} onClick={() => onUse?.(p.id)} title={`${p.name}: ${p.desc}`}
            aria-label={open ? `${p.name}: ${p.desc}` : `${p.name} (locked)`}
            className={`game-btn h-auto min-h-12 gap-2 rounded-2xl px-3 py-2 text-lg ${open && !isUsed ? "bg-gold text-navy" : "bg-navy-soft"}`}>
            <span className="text-2xl">{open ? p.icon : "🔒"}</span><span className="hidden lg:inline">{p.name}</span>
          </Button>
        );
      })}
    </div>
  );
}