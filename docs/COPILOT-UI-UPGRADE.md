# TNiC UI upgrade — GitHub Copilot playbook

Production: https://tnic.help  
Repo: `tvsnic0419/tnic-longevity-new`

This file is the **source of truth** for Copilot UI upgrades. Keep phases checked off as they merge.

---

## Reusable Copilot prompt (copy-paste every time)

Use this **exact** prompt in GitHub Copilot Chat, Copilot coding agent, or a new issue assigned to Copilot:

```text
Read docs/COPILOT-UI-UPGRADE.md and implement the next unchecked phase exactly as written.

Rules:
- Do not rebrand or invent evidence/data
- Follow STYLE_GUIDE.md, REDESIGN-PROGRESS.md, CLAUDE.md / AGENTS.md
- Reuse Button, SectionSkeleton, .premium-card, .tnic-button-*; derived stats only
- Create the branch named in that phase, commit in logical chunks, open a PR to main
- Run: npm run lint && npm run typecheck && npm run test && npm run build
- Update REDESIGN-PROGRESS.md and check off the phase in docs/COPILOT-UI-UPGRADE.md in the same PR
```

That one prompt is enough for every future run. After Phase 1 and 2 are done, add a new `### Phase N` section below and say the same prompt again.

---

## How to start (human, ~30 seconds)

1. Open the repo on GitHub → **Issues** → **New issue** (or open Copilot Chat in the repo).
2. Paste the **Reusable Copilot prompt** above.
3. Assign **Copilot** / start Copilot coding agent if available on your plan.
4. Review the PR, merge, then run the same prompt again for the next phase.

---

## North star (all phases)

| Role | Primary action | Route |
|------|----------------|-------|
| Newcomer | Start NICO | `/nico` |
| Returner | Dashboard | `/dashboard` (when local stack exists) |
| Explore | Library | `/library` |

Everything else is secondary. Hub accents (cyan/violet/rose) = labels/borders only; primary CTA = cyan→emerald gradient.

---

## Phase checklist

- [ ] **Phase 1** — Chrome & CTA polish (`ui/copilot-polish`)
- [ ] **Phase 2** — Density & time-to-value (`ui/copilot-density`) — start only after Phase 1 is on `main`

---

## Phase 1 — Chrome & CTA polish

**Branch:** `ui/copilot-polish`  
**PR title:** `UI polish: footer, CTAs, elite cards, skeletons, micro-type`

### Read first
`STYLE_GUIDE.md`, latest `REDESIGN-PROGRESS.md`, `CLAUDE.md` / `AGENTS.md`, `app/globals.css`, `lib/design-system.ts`, `components/ui/Button.tsx`, `components/ui/SectionSkeleton.tsx`

### Implement

1. **Footer** (`components/Footer.tsx`)
   - Keep manifesto + 1–2 CTAs + brief subscribe
   - Replace multi-column link dump with 3–4 curated columns: Start / Hubs / Trust
   - One “Full site map” → `/site-map`
   - No text below ~0.7 opacity; fix/remove near-invisible “the back page”
   - Optional mobile accordions

2. **CTA system** (`Nav.tsx`, `Footer.tsx`, home CTAs, `PrivacyConsentBanner.tsx`, `globals.css`)
   - One CTA radius (prefer `rounded-full` pills sitewide)
   - `<Button asChild>` or `.tnic-button-*` only; retire `elite-section-secondary-action`
   - Privacy banner → Button + 44px targets; stack above BackToTop/toasts when visible

3. **Hero CTAs** (`components/home/HomeDescent.tsx`)
   - Under headline + credibility: Primary **Start with NICO**, Secondary **Explore the library**

4. **Elite cards** (`components/home/HomeEliteGrid.tsx`)
   - Lead: name + tier + one-line mechanism
   - Quieter meta row: score / dose / PMIDs
   - **View evidence** primary · **Add to stack** secondary · manufacturer link separated + affiliate disclosure kept
   - Product = single “Verified pick” strip

5. **Loading** (`app/stacks/page.tsx`, `app/stacks/lab/page.tsx`, `app/library/page.tsx`)
   - Replace bare “Loading…” / crude pulse with `SectionSkeleton` + `role="status"`

6. **Micro-type** (`globals.css` `.text-micro`, `Nav.tsx` ~0.58rem lockup, footer chips)
   - Floor ≥12px (prefer `.text-caption`) or remove decorative micro text

7. **Tablet nav** (`Nav.tsx`, `lib/nav-data.ts`)
   - Collapse to compact by ~1024 so primary CTA never clips
   - Expand Explore: NICO, shop/verify, hallmarks or elite-8 (keep ~4 primary links)

### Out of scope for Phase 1
Library IA rebuild, products density wall, HomeDescent acts 1–3, ContextBar redesign, data/evidence changes.

### Verify
`npm run lint` · `npm run typecheck` · `npm run test` · `npm run build`  
Update `REDESIGN-PROGRESS.md`. Check off Phase 1 in this file.

---

## Phase 2 — Density & time-to-value

**Prerequisite:** Phase 1 merged to `main` (do not regress it).  
**Branch:** `ui/copilot-density`  
**PR title:** `UI: library/products density, HomeDescent shorten, mobile chrome`

### Implement

**A. `/library` — one browse surface**  
Files: `app/library/page.tsx`, `CompoundExplorer.tsx`, `LibraryModulesHub.tsx`, `AntiAgingLibrary.tsx`, `LifestylePillarsHub.tsx`, related
- Flow: hub hero → search + tier/hallmark filters → **one** paginated compound grid (no duplicate listings)
- Synergies / lifestyle / guides / tools behind tabs or “Browse modules”
- Demote 12-hallmark gallery below fold or link `/hallmarks`
- Replace nested hallmark internal scroll with filter/select or jump list; single-column mobile
- `scroll-margin-top` so filters aren’t under sticky nav
- Empty Research Queue: example save + short how-it-works
- Keep SSR/SEO; no full-page CSR bailout

**B. `/products` — verified first**  
- Hero = verified picks only
- “No verified pick yet” behind disclosure / pagination / compact table — not full prose cards by default
- Keep affiliate/testing honesty

**C. HomeDescent — less theater** (`HomeDescent.tsx`, `app/page.tsx`)
- Keep Act 0 (hero + path cards + in-content CTAs)
- Defer/collapse Acts 1–3 behind “Explore the system” OR one shorter viz beat
- Cut pinned-scene dead space; **Skip to interventions** → `#elite-interventions`
- No extra WebGL on mobile; honor `prefers-reduced-motion`
- Keep Elite / Hallmarks / Steps / NICO sections

**D. Mobile sticky chrome** (`SubPageLayout.tsx`, `ContextBar.tsx`, optional `ScrollProgress.tsx`)
- Small screens: ContextBar → one-line breadcrumb / “Your workspace” disclosure
- Nav + ContextBar must not eat ~20–25% of viewport
- ScrollProgress: thinner tablet variant or intentional desktop-only (comment in code)

**E. `/stacks` + `/labs` mobile**
- Stacks: equal-width 3-tab control at 390px (no scrollbar); sticky/top **Clone & Customize**
- Labs: fix orphaned last tool tile (full-width last item or balanced shortlist)

**F. Accent discipline** — hub colors for labels/borders only; primary CTA stays cyan→emerald.

### Out of scope for Phase 2
Token redesign, evidence matrix, changing grades/picks, deep-dive rewrite.

### Verify
Same as Phase 1. Screenshots in PR: home mobile, library, stacks tabs. Check off Phase 2 in this file.

---

## Adding future upgrades

1. Append a new `## Phase N — …` section with branch name, checklist, files, out-of-scope, verify.
2. Uncheck it in **Phase checklist**.
3. Tell Copilot the **same reusable prompt** at the top of this file.

No new magic words required — the playbook file is the prompt.
