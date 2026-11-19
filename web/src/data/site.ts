import catalog from '../../public/data/catalog.json';
import type { Text } from '../i18n';

export const VERSION = 'v0.17';
export const REPO = 'https://github.com/kasidit-wansudon/kasidit';
const SRC = `${REPO}/blob/main/plugins/kasidit`;

export type Kind = 'command' | 'agent' | 'hook';

export interface Item {
  id: string;
  kind: Kind;
  title: string;
  description: Text;
  url: string;
  featured?: boolean;
  isNew?: boolean;
}

type CatalogEntry = { name: string; description: string; description_th: string; source_file: string };

const NEW = new Set(['kasi-main', 'kasi-diagram']);
// Order = position in the grid: headline feature first.
const FEATURED_ORDER = ['kasi-main', 'kasi-team'];
const FEATURED = new Set(FEATURED_ORDER);

const fromCatalog = (entries: CatalogEntry[], kind: Kind): Item[] =>
  entries.map((e) => ({
    id: e.name,
    kind,
    title: kind === 'command' ? `/${e.name}` : e.name,
    description: { en: e.description, th: e.description_th || e.description },
    url: `${SRC}/${e.source_file}`,
    featured: FEATURED.has(e.name),
    isNew: NEW.has(e.name),
  }));

const HOOKS: Item[] = [
  {
    id: 'kasi-main.py',
    kind: 'hook',
    title: 'kasi-main.py',
    description: {
      en: 'SessionStart, resume, clear and after every compact — re-sends your pinned rules and runs first-run onboarding.',
      th: 'ทำงานตอนเริ่ม session, resume, clear และหลัง compact ทุกครั้ง — ส่งกฎที่ปักหมุดซ้ำ และพาผู้ใช้ใหม่ตั้งค่าครั้งแรก',
    },
    url: `${SRC}/hooks/kasi-main.py`,
    isNew: true,
  },
  {
    id: 'kasi-route.py',
    kind: 'hook',
    title: 'kasi-route.py',
    description: {
      en: 'Every prompt — classifies the mission, recommends a mode from route memory, and re-sends your Always rules.',
      th: 'ทุก prompt — จำแนกภารกิจ แนะนำ mode จาก route memory และส่งกฎ Always ซ้ำ',
    },
    url: `${SRC}/hooks/kasi-route.py`,
  },
  {
    id: 'kasi-main-check.py',
    kind: 'hook',
    title: 'kasi-main-check.py',
    description: {
      en: 'Before the turn ends — blocks a reply written in a script foreign to your language and asks for a rewrite.',
      th: 'ก่อนจบรอบ — block คำตอบที่มีอักษรภาษาอื่นปน แล้วให้เขียนใหม่',
    },
    url: `${SRC}/hooks/kasi-main-check.py`,
    isNew: true,
  },
  {
    id: 'kasi-verify.py',
    kind: 'hook',
    title: 'kasi-verify.py',
    description: {
      en: 'Before the turn ends — checks a "verified: <cmd>" claim really ran, and flags master-orchestrator violations.',
      th: 'ก่อนจบรอบ — ตรวจว่าคำสั่งที่อ้างว่า "verified" รันจริง และจับกรณี master orchestrator ลงมือทำงานเอง',
    },
    url: `${SRC}/hooks/kasi-verify.py`,
  },
  {
    id: 'kasi-record.py',
    kind: 'hook',
    title: 'kasi-record.py',
    description: {
      en: 'Records each mission outcome so the router learns the shortest path that worked, per mission kind.',
      th: 'บันทึกผลของแต่ละภารกิจ ให้ router เรียนรู้เส้นทางที่สั้นที่สุดที่ได้ผลของงานแต่ละประเภท',
    },
    url: `${SRC}/hooks/kasi-record.py`,
  },
  {
    id: 'kasi-update-check.sh',
    kind: 'hook',
    title: 'kasi-update-check.sh',
    description: { en: 'Session start — tells you when a newer Kasidit release is out.', th: 'ตอนเริ่ม session — แจ้งเมื่อมี Kasidit เวอร์ชันใหม่' },
    url: `${SRC}/hooks/kasi-update-check.sh`,
  },
  {
    id: 'kasi-drift-check.sh',
    kind: 'hook',
    title: 'kasi-drift-check.sh',
    description: {
      en: 'Session start — nudges a sync when the Gravity hub has not been synced for 7 days.',
      th: 'ตอนเริ่ม session — เตือนให้ sync เมื่อ Gravity hub ไม่ได้ sync มา 7 วัน',
    },
    url: `${SRC}/hooks/kasi-drift-check.sh`,
  },
];

const commands = fromCatalog(catalog.commands as CatalogEntry[], 'command');
const agents = fromCatalog(catalog.agents as CatalogEntry[], 'agent');

// Featured first (in FEATURED_ORDER) so the bento grid opens on the headline features.
const rank = (i: Item) => (i.featured ? FEATURED_ORDER.indexOf(i.id) : FEATURED_ORDER.length);
export const ITEMS: Item[] = [...commands, ...agents, ...HOOKS].sort((a, b) => rank(a) - rank(b));
export const COUNTS = { commands: commands.length, agents: agents.length, hooks: HOOKS.length };

export const BENCHMARK = {
  rows: [
    { name: 'Kasidit', haiku: '8/12', fable: '10/12', total: '18/24', pct: 75, cost: '$37.18', perSolved: '$2.07', highlight: true },
    { name: 'Superpowers', haiku: '6/12', fable: '11/12', total: '17/24', pct: 71, cost: '$44.07', perSolved: '$2.59' },
    { name: 'No framework', haiku: '6/12', fable: '9/12', total: '15/24', pct: 63, cost: '$29.57', perSolved: '$1.97' },
  ],
};

export const INSTALL_LINES: { kind: 'comment' | 'cmd'; text: string }[] = [
  { kind: 'comment', text: '# In Claude Code' },
  { kind: 'cmd', text: '/plugin marketplace add kasidit-wansudon/kasidit' },
  { kind: 'cmd', text: '/plugin install kasidit' },
  { kind: 'comment', text: '# Update later' },
  { kind: 'cmd', text: '/plugin marketplace update kasidit' },
  { kind: 'comment', text: '# From a shell — prints the steps for your runtime' },
  { kind: 'cmd', text: 'curl -fsSL https://kasi.kasion.dev | sh' },
];

export const LINKS = [
  { label: 'GitHub', url: REPO },
  { label: 'Wiki', url: `${REPO}/wiki` },
  { label: 'Changelog', url: `${REPO}/blob/main/CHANGELOG.md` },
  { label: 'More tools', url: 'https://tools.kasidit-wans.com' },
  { label: 'Author', url: 'https://kasidit-wans.com' },
  { label: 'X / Twitter', url: 'https://x.com/KasiditWans' },
];
