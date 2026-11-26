import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Command, Github, Search } from 'lucide-react';
import CommandPalette from './components/CommandPalette';
import DotField from './components/DotField';
import ItemCard from './components/ItemCard';
import Terminal from './components/Terminal';
import { Benchmark, Delegate, PinnedRules } from './components/Sections';
import { COUNTS, ITEMS, LINKS, REPO, VERSION, type Kind } from './data/site';
import { useLang, type Text } from './i18n';

const ROTATING: Text[] = [
  { en: 'discipline.', th: 'วินัย' },
  { en: 'one mission.', th: 'ภารกิจเดียว' },
  { en: 'checklists.', th: 'checklist' },
  { en: 'your rules.', th: 'กฎของคุณ' },
];

const FILTERS: { key: 'all' | Kind; label: Text }[] = [
  { key: 'all', label: { en: 'All', th: 'ทั้งหมด' } },
  { key: 'command', label: { en: 'Commands', th: 'Commands' } },
  { key: 'agent', label: { en: 'Agents', th: 'Agents' } },
  { key: 'hook', label: { en: 'Hooks', th: 'Hooks' } },
];

/** Cycles through ROTATING words with a vertical slide. */
function RotatingWord() {
  const { t } = useLang();
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setI((v) => (v + 1) % ROTATING.length), 2200);
    return () => window.clearInterval(id);
  }, []);
  return (
    <span className="rotating-word" aria-live="polite">
      <span key={i} className="rotating-word-inner text-gradient">
        {t(ROTATING[i])}
      </span>
    </span>
  );
}

/** Counts up from 0 the first time it scrolls into view. */
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1400);
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
    io.observe(el);
    return () => io.disconnect();
  }, [to]);
  return (
    <span ref={ref}>
      {n}
      {suffix}
    </span>
  );
}

export default function App() {
  const { lang, setLang, t } = useLang();
  const [filter, setFilter] = useState<'all' | Kind>('all');
  const [paletteOpen, setPaletteOpen] = useState(false);
  const shown = filter === 'all' ? ITEMS : ITEMS.filter((i) => i.kind === filter);
  const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);
  const navLinks: [Text, string][] = [
    [{ en: 'Pinned rules', th: 'กฎปักหมุด' }, '#pinned'],
    [{ en: 'Framework', th: 'Framework' }, '#framework'],
    [{ en: 'Benchmark', th: 'Benchmark' }, '#benchmark'],
    [{ en: 'Install', th: 'ติดตั้ง' }, '#install'],
  ];

  return (
    <div className="relative min-h-screen overflow-x-clip bg-surface-950 text-surface-100">
      <CommandPalette open={paletteOpen} setOpen={setPaletteOpen} />

      {/* Floating pill nav */}
      <header className="fixed inset-x-0 top-3 z-50 px-3">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 rounded-full border border-surface-100/10 bg-surface-950/70 py-2 pl-4 pr-2 backdrop-blur-xl">
          <a href="#top" className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight">
            <img src="/assets/favicon.svg" alt="" className="h-7 w-7" />
            <span>
              kasidit<span className="text-brand-500">.</span>
            </span>
          </a>
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map(([label, href]) => (
              <a key={href} href={href} className="rounded-full px-3.5 py-1.5 text-sm text-surface-400 transition hover:bg-surface-100/5 hover:text-surface-100">
                {t(label)}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-surface-100/10 bg-surface-100/[0.03] px-3 py-1.5 text-sm text-surface-400 transition hover:border-surface-100/25 hover:text-surface-100"
              aria-label="Search"
            >
              <Search className="h-3.5 w-3.5" />
              <kbd className="hidden rounded border border-surface-100/15 px-1.5 text-[10px] text-surface-500 sm:inline">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === 'en' ? 'th' : 'en')}
              className="rounded-full border border-surface-100/10 px-3 py-1.5 font-mono text-xs text-surface-400 transition hover:border-surface-100/25 hover:text-surface-100"
              aria-label="Switch language"
            >
              {lang === 'en' ? 'EN · ไทย' : 'ไทย · EN'}
            </button>
            <a href={REPO} target="_blank" rel="noreferrer" className="pill-cta pill-cta-sm">
              <span className="hidden sm:inline">GitHub</span>
              <span className="pill-cta-dot">
                <Github className="h-3.5 w-3.5" strokeWidth={2.2} />
              </span>
            </a>
          </div>
        </nav>
      </header>

      <main id="top">
        {/* Hero */}
        <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 pb-20 pt-32">
          <DotField className="absolute inset-0 h-full w-full" />
          <div className="hero-aurora pointer-events-none absolute left-1/2 top-[18%] h-[520px] w-[900px] max-w-[140vw] -translate-x-1/2" aria-hidden="true" />

          <div className="relative z-10 mx-auto max-w-5xl text-center">
            <a
              href="#pinned"
              className="animate-rise inline-flex items-center gap-3 whitespace-nowrap rounded-full border border-surface-100/10 bg-surface-100/[0.04] py-1.5 pl-1.5 pr-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-300 backdrop-blur transition hover:border-brand-500/50 sm:tracking-[0.2em]"
            >
              <span className="rounded-full bg-brand-500 px-2 py-0.5 text-surface-950">{t({ en: 'New', th: 'ใหม่' })}</span>
              {VERSION} · {COUNTS.commands} commands<span className="hidden sm:inline"> · {COUNTS.hooks} hooks</span>
              <span aria-hidden>→</span>
            </a>

            <h1 className="animate-rise mt-8 text-[44px] font-medium leading-[1.04] tracking-[-0.05em] sm:text-7xl md:text-[88px]" style={{ animationDelay: '80ms' }}>
              {t({ en: 'Stop fighting your AI.', th: 'เลิกสู้กับ AI' })}
              <br />
              {t({ en: 'Give it ', th: 'ให้มันมี ' })}
              <RotatingWord />
            </h1>

            <p className="animate-rise mx-auto mt-7 max-w-xl text-base leading-relaxed text-surface-400 md:text-lg" style={{ animationDelay: '160ms' }}>
              {t({
                en: 'Mindful AI coding framework for Claude Code. Mission-driven, runtime-verified, tier-aware — works the same on Opus, Sonnet and Haiku.',
                th: 'AI coding framework สำหรับ Claude Code ทำงานทีละภารกิจ ตรวจด้วยการรันจริง ปรับตามระดับ model ใช้ได้เหมือนกันทั้ง Opus, Sonnet และ Haiku',
              })}
            </p>

            <div className="animate-rise mt-10 flex flex-wrap items-center justify-center gap-3" style={{ animationDelay: '240ms' }}>
              <a href="#install" className="pill-cta">
                <span>{t({ en: 'Install', th: 'ติดตั้ง' })}</span>
                <span className="pill-cta-dot pill-cta-dot-lg">
                  <ArrowUpRight className="h-4 w-4" strokeWidth={2.4} />
                </span>
              </a>
              <button
                type="button"
                onClick={() => setPaletteOpen(true)}
                className="inline-flex items-center gap-2 rounded-full border border-surface-100/15 bg-surface-950/40 px-6 py-3.5 text-[15px] font-medium text-surface-200 backdrop-blur transition hover:border-surface-100/40"
              >
                <Command className="h-4 w-4" />
                {t({ en: 'Jump to a command', th: 'ค้นหา command' })}
              </button>
            </div>

            <p className="animate-rise mt-10 font-mono text-xs text-surface-500" style={{ animationDelay: '320ms' }}>
              MIT · Claude Code + thClaws · Opus / Sonnet / Haiku
            </p>
          </div>
        </section>

        {/* Marquee */}
        <section className="border-y border-surface-100/[0.07] py-7">
          <div className="marquee-mask relative overflow-hidden">
            <div className="animate-marquee flex w-max gap-12 pr-12">
              {[...ITEMS, ...ITEMS]
                .filter((i) => i.kind === 'command')
                .map((i, k) => (
                  <span key={`${i.id}-${k}`} className="whitespace-nowrap font-mono text-2xl font-medium tracking-tight text-surface-100/25 md:text-3xl">
                    {i.title}
                  </span>
                ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="px-4 py-24">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-surface-100/10 bg-surface-100/10 lg:grid-cols-4">
            {[
              { to: 75, suffix: '%', label: { en: 'resolved on SWE-bench (63% with no framework)', th: 'แก้ผ่านบน SWE-bench (ไม่ใช้ framework 63%)' } },
              { to: COUNTS.commands, suffix: '', label: { en: 'slash commands', th: 'slash commands' } },
              { to: COUNTS.agents, suffix: '', label: { en: 'specialist agents', th: 'specialist agents' } },
              { to: COUNTS.hooks, suffix: '', label: { en: 'runtime hooks', th: 'runtime hooks' } },
            ].map((s) => (
              <div key={s.label.en} className="bg-surface-950 p-7 md:p-10">
                <p className="text-5xl font-medium tracking-[-0.06em] md:text-7xl">
                  <CountUp to={s.to} suffix={s.suffix} />
                </p>
                <p className="mt-3 text-sm text-surface-500">{t(s.label)}</p>
              </div>
            ))}
          </div>
        </section>

        <Delegate />

        <PinnedRules />

        {/* Framework bento */}
        <section id="framework" className="scroll-mt-24 px-4 pb-28">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="max-w-2xl">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-500">{t({ en: 'The framework', th: 'ตัว framework' })}</p>
                <h2 className="mt-3 text-4xl font-medium tracking-[-0.045em] md:text-6xl">
                  {t({ en: 'Everything inside,', th: 'ทุกอย่างข้างใน' })}
                  <br />
                  <span className="text-surface-500">{t({ en: 'one click from source.', th: 'คลิกเดียวถึง source' })}</span>
                </h2>
              </div>
              <div className="flex flex-wrap gap-2" role="tablist" aria-label="Filter">
                {FILTERS.map((f) => {
                  const count = f.key === 'all' ? ITEMS.length : ITEMS.filter((i) => i.kind === f.key).length;
                  const active = f.key === filter;
                  return (
                    <button
                      key={f.key}
                      type="button"
                      role="tab"
                      aria-selected={active}
                      onClick={() => setFilter(f.key)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        active ? 'border-surface-100 bg-surface-100 text-surface-950' : 'border-surface-100/10 text-surface-400 hover:border-surface-100/30 hover:text-surface-100'
                      }`}
                    >
                      {t(f.label)}
                      <span className={`ml-2 text-xs ${active ? 'text-surface-950/50' : 'text-surface-600'}`}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div key={filter} className="mt-12 grid grid-flow-dense gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {shown.map((item, i) => (
                <ItemCard key={item.id} item={item} index={i} />
              ))}
            </div>
          </div>
        </section>

        <Benchmark />

        {/* Install */}
        <section id="install" className="relative scroll-mt-24 border-y border-surface-100/10 bg-[#0a0d12] px-4 py-24">
          <div className="relative mx-auto max-w-3xl">
            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-500">{t({ en: 'Install', th: 'ติดตั้ง' })}</p>
              <h2 className="mt-3 text-4xl font-medium tracking-[-0.045em] md:text-5xl">{t({ en: 'Two commands. Then it asks your language.', th: 'สองคำสั่ง แล้วมันจะถามภาษาของคุณ' })}</h2>
            </div>
            <div className="relative mt-12">
              <div className="terminal-glow pointer-events-none absolute inset-0" aria-hidden="true" />
              <Terminal />
            </div>
          </div>
        </section>

        {/* Connect */}
        <section className="px-4 py-28">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-surface-100/10 px-6 py-16 md:px-14 md:py-20">
            <DotField className="absolute inset-0 h-full w-full opacity-60" />
            <div className="hero-aurora pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[800px] max-w-[140vw] -translate-x-1/2" aria-hidden="true" />
            <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <div>
                <h2 className="text-4xl font-medium leading-[1.05] tracking-[-0.045em] md:text-6xl">
                  {t({ en: 'Discipline over', th: 'วินัย' })}
                  <br />
                  <span className="text-gradient">{t({ en: 'cleverness.', th: 'สำคัญกว่าความฉลาด' })}</span>
                </h2>
                <p className="mt-5 max-w-lg text-surface-400">
                  {t({
                    en: 'Built by a self-taught Thai engineer through dogfooding on production legacy codebases. Open source, MIT.',
                    th: 'สร้างโดย engineer ไทยที่เรียนรู้ด้วยตัวเอง ผ่านการใช้งานจริงกับ codebase legacy บน production เป็น open source ภายใต้ MIT',
                  })}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex items-center justify-between rounded-2xl border border-surface-100/10 bg-surface-950/60 px-4 py-3.5 text-sm text-surface-300 backdrop-blur transition hover:border-brand-500/60 hover:text-surface-100"
                  >
                    {link.label}
                    <ArrowUpRight className="h-3.5 w-3.5 text-surface-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-400" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-surface-100/[0.07] px-4 py-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-sm text-surface-500 sm:flex-row">
          <p>© {new Date().getFullYear()} Kasidit Wansudon · MIT</p>
          <p>
            {t({ en: 'Press ', th: 'กด ' })}
            <kbd className="rounded border border-surface-100/15 px-1.5 text-xs">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
            {t({ en: ' anywhere to search.', th: ' ที่ไหนก็ได้เพื่อค้นหา' })}
          </p>
        </div>
      </footer>
    </div>
  );
}
