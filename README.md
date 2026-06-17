# CODING AGENTS: READ THIS FIRST

This is a **handoff bundle** from Claude Design (claude.ai/design).

A user mocked up designs in HTML/CSS/JS using an AI design tool, then exported this bundle so a coding agent can implement the designs for real.

## Branches — IMPORTANT

This repo has two branches with different roles:

- **`main`** — the live site. GitHub Pages serves this to `outliersatplay.com`. Don't commit work-in-progress here.
- **`dev`** — the working branch. All edits, drafts, half-finished case studies live here. Push freely.

**Default working branch is `dev`.** When the user starts a session, assume any changes go on `dev` unless they explicitly say "ship to main" / "merge to main" / "make this live."

**To ship:** fast-forward `main` to `dev` (`git checkout main && git merge --ff-only dev && git push`), then switch back to `dev`. Only do this on explicit user request.

**To preview the WIP locally:** `python3 -m http.server 8088` from the repo root, then drive a headless Chromium against `http://localhost:8088/` and screenshot — this is how to verify changes without shipping.

## What you should do — IMPORTANT

**Read `project/index.html` in full.** The user had this file open when they triggered the handoff, so it's almost certainly the primary design they want built. Read it top to bottom — don't skim. Then **follow its imports**: open every file it pulls in (shared components, CSS, scripts) so you understand how the pieces fit together before you start implementing.

**If anything is ambiguous, ask the user to confirm before you start implementing.** It's much cheaper to clarify scope up front than to build the wrong thing.

## About the design files

The design medium is **HTML/CSS/JS** — these are prototypes, not production code. Your job is to **recreate them pixel-perfectly** in whatever technology makes sense for the target codebase (React, Vue, native, whatever fits). Match the visual output; don't copy the prototype's internal structure unless it happens to fit.

**Don't render these files in a browser or take screenshots unless the user asks you to.** Everything you need — dimensions, colors, layout rules — is spelled out in the source. Read the HTML and CSS directly; a screenshot won't tell you anything they don't.

## Bundle contents

- `README.md` — this file
- `project/` — the `Outlier designs` project files (HTML prototypes, assets, components)
