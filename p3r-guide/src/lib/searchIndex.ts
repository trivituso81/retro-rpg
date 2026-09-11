import { characters, npcs } from '../data/characters';
import { fullMoonBosses } from '../data/bosses';
import { tartarusBlocks, monadPassages } from '../data/tartarus';
import { walkthrough } from '../data/walkthrough';
import { socialLinks, linkedEpisodes } from '../data/socialLinks';
import { fusionSpells, specialFusions, recommendedPersonas, heartItems } from '../data/personas';
import { items, shops } from '../data/items';
import { weapons, bodyArmor, footwear, accessories } from '../data/equipment';
import { requests } from '../data/requests';
import { classQuestions } from '../data/school';
import { tips } from '../data/tips';
import { secrets } from '../data/secrets';

export interface SearchEntry {
  title: string;
  section: string;
  sub: string;
  to: string;
  text: string;
  spoiler?: boolean;
}

function build(): SearchEntry[] {
  const out: SearchEntry[] = [];

  for (const c of characters) {
    out.push({ title: c.name, section: 'Characters', sub: `${c.arcana} · ${c.persona}`, to: `/characters/${c.id}`, text: `${c.name} ${c.jpName ?? ''} ${c.role} ${c.persona} ${c.evolvedPersona ?? ''} ${c.weapon} ${c.theurgies.map((t) => t.name).join(' ')} ${c.bio}` });
  }
  for (const n of npcs) {
    out.push({ title: n.name, section: 'Characters', sub: n.group, to: '/characters#npcs', text: `${n.name} ${n.group} ${n.description}` });
  }
  for (const b of fullMoonBosses) {
    out.push({ title: b.name, section: 'Bosses', sub: `${b.date} · ${b.arcana}`, to: `/bosses#${b.id}`, text: `${b.name} ${b.arcana} ${b.date} ${b.location} ${b.summary} ${b.strategy.join(' ')}` });
  }
  for (const t of tartarusBlocks) {
    out.push({ title: t.name, section: 'Tartarus', sub: `Floors ${t.floors[0]}–${t.floors[1]}`, to: `/tartarus#${t.id}`, text: `${t.name} ${t.subtitle} ${t.guardians.map((g) => g.name).join(' ')} ${t.notes.join(' ')}` });
  }
  for (const m of monadPassages) {
    out.push({ title: `Monad Passage ${m.floor}F`, section: 'Tartarus', sub: m.block, to: '/tartarus#monad', text: `monad passage ${m.floor} ${m.block} ${m.cardRequired} ${m.enemies.join(' ')} ${m.reward}` });
  }
  for (const m of walkthrough) {
    out.push({ title: `${m.name} ${m.year}`, section: 'Walkthrough', sub: m.summary.slice(0, 80), to: `/walkthrough/${m.id}`, text: `${m.name} ${m.summary} ${m.objectives.join(' ')}` });
    for (const e of m.events) {
      out.push({ title: e.title, section: 'Walkthrough', sub: `${e.date} · ${m.name}`, to: `/walkthrough/${m.id}`, text: `${e.date} ${e.title} ${e.detail}`, spoiler: e.spoiler });
    }
  }
  for (const s of socialLinks) {
    out.push({ title: `${s.name} (${s.arcana})`, section: 'Social Links', sub: `${s.title} · starts ${s.startDate}`, to: `/social-links#${s.id}`, text: `${s.name} ${s.arcana} ${s.title} ${s.location} ${s.ultimatePersona} ${s.description} ${s.tips.join(' ')}` });
  }
  for (const l of linkedEpisodes) {
    out.push({ title: `${l.character} — Linked Episodes`, section: 'Linked Episodes', sub: l.persona, to: '/linked-episodes', text: `${l.character} ${l.persona} ${l.keyItem} ${l.episodes.map((e) => e.reward).join(' ')}` });
  }
  for (const f of fusionSpells) {
    out.push({ title: f.name, section: 'Personas', sub: `Fusion Spell · ${f.personas.join(' + ')}`, to: '/personas#fusion-spells', text: `${f.name} ${f.personas.join(' ')} ${f.effect} ${f.howTo}` });
  }
  for (const f of specialFusions) {
    out.push({ title: f.result, section: 'Personas', sub: `Special fusion · ${f.arcana}`, to: '/personas#special', text: `${f.result} ${f.arcana} ${f.ingredients.join(' ')} ${f.note ?? ''}` });
  }
  for (const p of recommendedPersonas) {
    out.push({ title: p.name, section: 'Personas', sub: p.arcana, to: '/personas#recommended', text: `${p.name} ${p.arcana} ${p.note} ${p.unlock ?? ''}` });
  }
  for (const h of heartItems) {
    out.push({ title: h.item, section: 'Personas', sub: `Heart Item · ${h.persona} Lv ${h.level}`, to: '/personas#heart', text: `${h.item} ${h.persona} ${h.use}` });
  }
  for (const i of items) {
    out.push({ title: i.name, section: 'Items', sub: i.category, to: '/items', text: `${i.name} ${i.category} ${i.effect} ${i.source}` });
  }
  for (const s of shops) {
    out.push({ title: s.name, section: 'Items', sub: s.location, to: '/items#shops', text: `${s.name} ${s.location} ${s.sells} ${s.tip}` });
  }
  for (const w of weapons) {
    out.push({ title: w.name, section: 'Equipment', sub: `${w.type} · ${w.user}`, to: '/equipment', text: `${w.name} ${w.type} ${w.user} ${w.effect} ${w.source}` });
  }
  for (const a of [...bodyArmor, ...footwear, ...accessories]) {
    out.push({ title: a.name, section: 'Equipment', sub: a.slot, to: '/equipment#armor', text: `${a.name} ${a.slot} ${a.effect} ${a.source}` });
  }
  for (const r of requests) {
    out.push({ title: `#${r.n} ${r.title}`, section: 'Requests', sub: r.reward, to: '/requests', text: `${r.n} ${r.title} ${r.task} ${r.solution} ${r.reward}` });
  }
  for (const q of classQuestions) {
    out.push({ title: `${q.date}: ${q.answer}`, section: 'School', sub: q.question, to: '/school', text: `${q.date} ${q.question} ${q.answer} ${q.exam ?? ''}` });
  }
  for (const t of tips) {
    out.push({ title: t.title, section: 'Tips', sub: t.category, to: `/tips#${t.id}`, text: `${t.title} ${t.category} ${t.body.join(' ')}` });
  }
  for (const s of secrets) {
    out.push({ title: s.title, section: 'Secrets', sub: s.category, to: `/secrets#${s.id}`, text: `${s.title} ${s.category} ${s.body.join(' ')}`, spoiler: s.spoiler });
  }
  return out.map((e) => ({ ...e, text: e.text.toLowerCase() }));
}

let cache: SearchEntry[] | null = null;

export function searchIndex(): SearchEntry[] {
  if (!cache) cache = build();
  return cache;
}

export function search(query: string, limit = 30): SearchEntry[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const words = q.split(/\s+/);
  const scored: { e: SearchEntry; score: number }[] = [];
  for (const e of searchIndex()) {
    let score = 0;
    const title = e.title.toLowerCase();
    for (const w of words) {
      if (title.includes(w)) score += 5;
      else if (e.text.includes(w)) score += 1;
      else {
        score = 0;
        break;
      }
    }
    if (score > 0) scored.push({ e, score });
  }
  scored.sort((a, b) => b.score - a.score || a.e.title.localeCompare(b.e.title));
  return scored.slice(0, limit).map((s) => s.e);
}
