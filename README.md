# Detective Zabyr — Episode 3: The Great Give-Back

A storybook English adventure for young EFL learners, built on the engine from
[Episode 2](https://github.com/khaszein012/zb01-stolen-weekend).

**Language content:** *Family and Friends*-style Unit 3 — *My things* (book pages 19–32).
Gadget vocabulary, `your / our / their`, `Can I use your…? Yes, you can. / No, you can't.`,
Magic E, punctuation, the Edinburgh Festival Fringe, and the equator with hemispheres.

## Story

Mister Magpie, a magpie in a tweed waistcoat, has taken every gadget in Gadgeton.
"If I can use it, it is mine!" He has also scrambled everyone's polite words, so nobody
can ask for anything back. Detective Zabyr and Pip work through six districts to win the
gadgets back, then face the magpie in his nest on the hill.

## Curriculum map

| Mission | District | Unit 3 content | Activity |
|---|---|---|---|
| 1 | Gadget Garage | computer, TV, DVD player, CD player, MP3 player, camera; turn on / turn off | Snapshot cards |
| 2 | Borrow Bench | your / our / their; Can I use…? + short reply | **Ask & Answer** (new) |
| 3 | Silent E Vault | Magic E — a_e, i_e, o_e, u_e | Transform + listen |
| 4 | Festival Green | Fringe leaflet reading; TRUE / FALSE / NOT IN THE TEXT | Verdicts + Who |
| 5 | Signwriter's Shop | capitals, full stops, question marks | **Punctuation Repair** (new) |
| 6 | Globe Room | equator, north/south hemispheres, Brazil | MCQ + speaking |
| Boss | Magpie's Nest | mixed review, question building, spoken give-back | 3 phases |

Nine chapters run alongside, each with a glossary and (except the epilogue) one
Detective Check. All content is plain data in `src/game/*-content.ts`.

## Architecture

- **`src/game/adventure.ts`** — types, the stage/chapter registries, difficulty rules,
  option selection and per-mission question ordering. Pure functions only.
- **`src/game/*-content.ts`** — all curriculum as data. No logic.
- **`src/game/unit3-rules.ts`** — pure rules for the two new activities.
- **`src/game/*.tsx`** — thin React render layer.
- **`src/test/`** — 80 tests pinning the answer keys, ordering and scoring.

Because rules and content are separated, the whole curriculum is testable without a browser.

## Development

```bash
bun install
bun run dev      # http://localhost:8080
bunx vitest run  # 80 tests
bunx tsc --noEmit
bun run build
```

## Art

`src/assets/` currently holds flat colour placeholders at the exact dimensions the layout
uses. Replace them in place; filenames are referenced from `chapter-images.ts` and the
content files.

| Asset | Size | Count |
|---|---|---|
| `gadgeton.jpg` (map) | 1920×1080 | 1 |
| `story-give-back.jpg` | 1536×1024 | 1 |
| `chapter-0…8.jpg` | 1536×1152 (4:3) | 9 |
| Mission backdrops | 1536×1024 | 7 |
| Gadget and card images | 768×768 | 12 |
| Magic E pairs | 768×672 | 8 |
| Globe diagrams | 768×768 | 3 |

Regenerate placeholders with `python tools/make-placeholders.py` (needs Pillow).

## Saving

Progress is stored under `localStorage["episode-3-v1"]`, separate from Episode 2's
`episode-2-v1`. A player who finished Episode 2 is welcomed back and starts with Pip's
Hint unlocked, but does not inherit Episode 2 stars or unlocks.

## Teacher mode

Settings → PIN `2026` → difficulty, timer length, unlock-all, cutscene and check toggles,
teaser text, and jump-to-mission shortcuts.