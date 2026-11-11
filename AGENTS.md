<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep reusable game mechanics independent of episode content; the Episode 2 shell must work with no activities configured.
- Retain browser-based progress saving and migrate only reusable counters/settings from legacy saves, not old level or boss state.
- Episode content lives in browser-safe adventure data; story, gameplay and teacher views share typed settings and pure rule helpers so scoring and unlocks are testable without rendering.
- Supplied mission/chapter data overrides only matching episode entries; typed activity views share session scoring, and browser-safe pure helpers govern listening, email repairs, sorting and teacher-awarded replies so their rules are testable independently.
- Chapters explicitly use a nullable Detective Check; shared rules prevent an epilogue from opening a quiz, and the finale advances through festival, epilogue and certificate without adding cloud storage.
