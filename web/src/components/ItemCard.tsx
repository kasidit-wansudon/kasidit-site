import { useRef } from 'react';
import { ArrowUpRight, Bot, Terminal, Webhook } from 'lucide-react';
import type { Item, Kind } from '../data/site';
import { useLang } from '../i18n';

const KIND: Record<Kind, { icon: typeof Bot; label: { en: string; th: string } }> = {
  command: { icon: Terminal, label: { en: 'Slash command', th: 'Slash command' } },
  agent: { icon: Bot, label: { en: 'Specialist agent', th: 'Specialist agent' } },
  hook: { icon: Webhook, label: { en: 'Runtime hook', th: 'Runtime hook' } },
};

/** Bento card: cursor-following spotlight + gentle 3D tilt (pointer devices only). */
export default function ItemCard({ item, index }: { item: Item; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const { t } = useLang();
  const { icon: Icon, label } = KIND[item.kind];

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse') return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    el.style.setProperty('--mx', `${x * 100}%`);
    el.style.setProperty('--my', `${y * 100}%`);
    el.style.setProperty('--rx', `${(0.5 - y) * 6}deg`);
    el.style.setProperty('--ry', `${(x - 0.5) * 8}deg`);
  };
  const onLeave = () => {
    ref.current?.style.setProperty('--rx', '0deg');
    ref.current?.style.setProperty('--ry', '0deg');
  };

  return (
    <a
      ref={ref}
      href={item.url}
      target="_blank"
      rel="noreferrer"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tool-card group animate-rise ${item.featured ? 'lg:col-span-2' : ''}`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
    >
      <span className="tool-card-spot" aria-hidden="true" />
      <span className="tool-card-border" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="flex items-start justify-between gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-2xl border border-surface-100/10 bg-surface-100/[0.04] text-surface-100 transition duration-500 group-hover:border-brand-500/60 group-hover:bg-brand-500 group-hover:text-surface-950 group-hover:shadow-[0_0_40px_-6px_#f59e0b]">
            <Icon className="h-5 w-5" strokeWidth={1.7} />
          </span>
          {item.isNew ? (
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/10 px-2.5 py-1 text-[11px] text-brand-400">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-500 shadow-[0_0_10px] shadow-brand-500" />
              New
            </span>
          ) : null}
        </div>

        <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-surface-500">{t(label)}</p>
        <h3
          className={`mt-2 font-mono font-medium tracking-[-0.02em] text-surface-100 ${
            item.featured ? 'text-2xl md:text-3xl' : 'text-xl'
          }`}
        >
          {item.title}
        </h3>
        <p className={`mt-3 flex-1 leading-relaxed text-surface-400 ${item.featured ? 'max-w-xl text-base' : 'text-sm'}`}>
          {t(item.description)}
        </p>

        <div className="mt-6 flex items-center justify-end">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-surface-100/15 text-surface-400 transition duration-300 group-hover:rotate-45 group-hover:border-brand-500 group-hover:bg-brand-500 group-hover:text-surface-950">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </a>
  );
}
