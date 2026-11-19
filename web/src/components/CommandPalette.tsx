import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Search } from 'lucide-react';
import { ITEMS } from '../data/site';
import { useLang } from '../i18n';

/** ⌘K / Ctrl+K launcher: type to jump to any command, agent or hook source. */
export default function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const { t } = useLang();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(!open);
      } else if (e.key === 'Escape' && open) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, setOpen]);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return ITEMS;
    return ITEMS.filter((i) =>
      `${i.title} ${i.kind} ${i.description.en} ${i.description.th}`.toLowerCase().includes(needle),
    );
  }, [q]);

  if (!open) return null;

  const go = (url: string) => {
    setOpen(false);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      go(results[active].url);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center bg-surface-950/70 px-4 pt-[14vh] backdrop-blur-sm"
      onClick={() => setOpen(false)}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-surface-700 bg-surface-900 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-surface-800 px-4">
          <Search className="h-4 w-4 text-surface-500" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder={t({ en: 'Search commands, agents, hooks…', th: 'ค้นหา command, agent, hook…' })}
            className="h-12 flex-1 bg-transparent text-sm text-surface-100 placeholder:text-surface-500 focus:outline-none"
          />
          <kbd className="rounded border border-surface-700 px-1.5 text-[10px] text-surface-500">Esc</kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto py-2">
          {results.length === 0 ? (
            <li className="px-4 py-6 text-center text-sm text-surface-500">{t({ en: 'No match.', th: 'ไม่พบ' })}</li>
          ) : (
            results.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(item.url)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm ${
                    i === active ? 'bg-surface-800 text-surface-100' : 'text-surface-300'
                  }`}
                >
                  <span className="flex-1 truncate font-mono">{item.title}</span>
                  <span className="text-xs text-surface-500">{item.kind}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-surface-500" />
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
