import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

export type Lang = 'en' | 'th';
export type Text = { en: string; th: string };

const KEY = 'kasidit-lang';

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: 'en',
  setLang: () => {},
});

function initialLang(): Lang {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved === 'en' || saved === 'th') return saved;
  } catch {
    /* storage blocked — fall back to browser language */
  }
  return typeof navigator !== 'undefined' && navigator.language.startsWith('th') ? 'th' : 'en';
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  };

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

/** Returns the language and a `t({en, th})` picker. */
export function useLang() {
  const { lang, setLang } = useContext(LangContext);
  const t = (text: Text) => text[lang];
  return { lang, setLang, t };
}
