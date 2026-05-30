# Africa Modelling Bridge — Site

The **v0.0 funder prototype**. A live, shareable URL that pairs with the concept note.

## Stack

- **Astro 5** (static-first) with **MDX** + **React** islands
- **Tailwind CSS** with a small custom design system (`bridge` teal, `ember` terracotta, `cream` parchment)
- Content as code via Astro Content Collections (`src/content/`)
- Deployable to **Cloudflare Pages**

## Quickstart

```bash
npm install
npm run dev
# → http://localhost:4321
```

## Build

```bash
npm run build
npm run preview
```

## What ships in v0.0

- Concept-note narrative as a beautiful scroll on `/`
- Five-layer approach at `/approach`
- Module status board on `/about/governance` — all 20 modules with v0.0 / v0.1 / v0.5 / v1.0 badges
- Country pages (TZ, MW, DRC) — narrative for v0.0; full data v0.5+
- Researcher showcase with Ernest + Lesley-Anne + 2 placeholder anchors
- Three dossier previews
- Funder pathway preview
- **M10 Document Triage demo** at `/tools/triage` — the magic moment
- All other AI tools have explainer pages with "coming v0.X" badges

## Pointers

- Concept note: `../concept_note_2026-05-21.md`
- Build plan: `../platform_build_plan_2026-05-22.md`
