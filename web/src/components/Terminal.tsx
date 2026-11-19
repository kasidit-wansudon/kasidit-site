import { useEffect, useRef, useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { INSTALL_LINES } from '../data/site';

/** zsh-style window; lines type in once it scrolls into view, each command copyable. */
export default function Terminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(0);
  const [copied, setCopied] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setShown(INSTALL_LINES.length);
      return;
    }
    let timer = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      let n = 0;
      const tick = () => {
        n += 1;
        setShown(n);
        if (n < INSTALL_LINES.length) timer = window.setTimeout(tick, 320);
      };
      tick();
    });
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const copy = async (text: string, i: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(i);
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      /* clipboard blocked — the text is still selectable */
    }
  };

  return (
    <div ref={ref} className="relative overflow-hidden rounded-2xl border border-surface-700 bg-[#0a0d12] shadow-2xl">
      <div className="flex items-center gap-2 border-b border-surface-800 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
        <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
        <span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-xs text-surface-500">zsh — kasidit</span>
      </div>
      <div className="space-y-1.5 p-5 font-mono text-[13px] leading-relaxed sm:text-sm">
        {INSTALL_LINES.map((line, i) => (
          <div
            key={i}
            className={`flex items-center justify-between gap-4 transition-opacity duration-300 ${
              i < shown ? 'opacity-100' : 'opacity-0'
            } ${line.kind === 'comment' && i > 0 ? 'pt-3' : ''}`}
          >
            {line.kind === 'comment' ? (
              <span className="text-surface-500">{line.text}</span>
            ) : (
              <>
                <span className="min-w-0 break-all text-surface-100">
                  <span className="mr-2 select-none text-brand-500">$</span>
                  {line.text}
                </span>
                <button
                  type="button"
                  onClick={() => copy(line.text, i)}
                  className="shrink-0 rounded-md border border-surface-700 p-1.5 text-surface-400 transition hover:border-brand-500 hover:text-brand-400"
                  aria-label={`Copy: ${line.text}`}
                >
                  {copied === i ? <Check className="h-3.5 w-3.5 text-brand-400" /> : <Copy className="h-3.5 w-3.5" />}
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
