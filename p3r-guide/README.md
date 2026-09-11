# Persona 3 Reload — Complete Guide (web app)

An unofficial, self-contained fan guide for **Persona 3 Reload**, built with Vite, React 19 and TypeScript. Content is stored as typed data modules and rendered into a standard game-guide structure.

## Sections

| Section | Contents |
| --- | --- |
| Overview | Progress summary, section index, full-moon calendar |
| Walkthrough | Month-by-month calendar (April–January): story, full moons, deadlines, exams, Social Link focus, Linked Episode windows, Tartarus goals |
| Tartarus | All six blocks, unlock dates, barrier floors, guardians, Old Document floors, Monad Passages, missing persons |
| Full Moon Bosses | Affinities, phases, step-by-step strategies, rewards |
| Characters | Party members (Personas, Theurgies, affinities, tips) and supporting cast |
| Social Links | All 22 Arcana: start dates, requirements, schedules, ultimate Personas, romance flags; Social Stats |
| Linked Episodes | Windows and rewards for Junpei, Akihiko, Koromaru, Ken, Shinjiro, Ryoji |
| Personas & Fusion | Fusion Spells, special fusions, recommended Personas, Heart Items, fusion tips |
| Items & Shops | Consumables, materials, key items; every shop, sale day and Tanaka's schedule |
| Equipment | Weapons per character (ultimates flagged), armor, footwear, accessories |
| Elizabeth Requests | All 101 requests with solutions, rewards, deadlines and a persistent checklist |
| Class & Exam Answers | Every classroom and exam question in date order |
| Tips & Strategy / Secrets | Combat, calendar, money, fusion advice; Reaper, Elizabeth, hidden content, story choices, NG+ |

## Features

- Global search (`Ctrl/Cmd + K` or `/`) across all guide data
- Spoiler toggle that blurs story spoilers until revealed (persisted)
- Checklists for bosses, Social Links, Linked Episodes and requests saved in `localStorage`
- Responsive layout with a collapsible sidebar; hash-based routing so the built site works from any static host or `file://`

## Development

```bash
npm install
npm run dev        # start dev server
npm run typecheck  # tsc -b
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
```

## Structure

```
src/
  data/        typed guide content (walkthrough, bosses, tartarus, characters, socialLinks, personas, items, equipment, requests, school, tips, secrets)
  components/  Layout, SearchModal, shared UI primitives
  lib/         store (spoilers + progress), search index
  pages/       one page per guide section
```

Persona 3 Reload is © ATLUS / SEGA. This is an unofficial fan project.
