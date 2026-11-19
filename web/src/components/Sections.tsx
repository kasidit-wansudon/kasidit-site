import { Languages, RefreshCw, ShieldCheck } from 'lucide-react';
import { BENCHMARK } from '../data/site';
import { useLang } from '../i18n';

function Kicker({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-brand-500">{children}</p>;
}

export function PinnedRules() {
  const { t } = useLang();
  const steps = [
    {
      icon: Languages,
      when: { en: 'First run', th: 'ใช้ครั้งแรก' },
      title: { en: 'Asks your language first', th: 'ถามภาษาก่อนเป็นอย่างแรก' },
      body: {
        en: 'Before any other work the AI asks which language to reply in, and saves it. 18 languages. Then it offers to import rules from your existing CLAUDE.md.',
        th: 'ก่อนทำงานอื่น AI จะถามว่าให้ตอบภาษาอะไรแล้วบันทึกไว้ รองรับ 18 ภาษา จากนั้นเสนอดึงกฎจาก CLAUDE.md เดิมมาใช้',
      },
    },
    {
      icon: RefreshCw,
      when: { en: 'Every prompt', th: 'ทุก prompt' },
      title: { en: 'Re-sent every turn', th: 'ส่งซ้ำทุก prompt' },
      body: {
        en: 'Your language rule and ## Always lines ride on every prompt. The whole file is re-sent after every compact.',
        th: 'กฎภาษาและส่วน ## Always แนบไปกับทุก prompt และส่งไฟล์เต็มซ้ำทุกครั้งหลัง compact',
      },
    },
    {
      icon: ShieldCheck,
      when: { en: 'Before the turn ends', th: 'ก่อนจบรอบ' },
      title: { en: 'Language is checked', th: 'ตรวจภาษาก่อนจบ' },
      body: {
        en: 'A reply in a foreign script is blocked once and rewritten. Code and quoted text are ignored; English code terms always pass.',
        th: 'ถ้าคำตอบมีอักษรภาษาอื่น จะถูก block แล้วให้เขียนใหม่ ไม่นับโค้ดและข้อความที่ quote คำศัพท์โค้ดภาษาอังกฤษผ่านเสมอ',
      },
    },
  ];

  return (
    <section id="pinned" className="scroll-mt-24 px-4 py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Kicker>{t({ en: 'New · pinned rules', th: 'ใหม่ · กฎที่ปักหมุด' })}</Kicker>
          <h2 className="mt-3 text-4xl font-medium tracking-[-0.045em] md:text-6xl">
            {t({ en: 'Your AI stops', th: 'AI เลิก' })}
            <br />
            <span className="text-gradient">{t({ en: 'ignoring your rules.', th: 'ลืมกฎของคุณ' })}</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-surface-400">
            {t({
              en: 'You write "reply in Thai" in CLAUDE.md. It works — until the session gets long or Claude compacts, and the AI drifts back to its defaults. CLAUDE.md is loaded once; nothing re-sends it. Kasidit\'s main.md does.',
              th: 'คุณเขียนว่า "ตอบภาษาไทย" ไว้ใน CLAUDE.md ก็ได้ผลอยู่พักหนึ่ง พอคุยยาวหรือ Claude compact บริบท AI ก็กลับไปตอบแบบเดิม เพราะ CLAUDE.md โหลดแค่ครั้งเดียว ไม่มีอะไรส่งซ้ำ main.md ของ Kasidit ทำหน้าที่นั้น',
            })}
          </p>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="tool-card min-h-0">
                <span className="tool-card-spot" aria-hidden="true" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="grid h-11 w-11 place-items-center rounded-2xl border border-brand-500/30 bg-brand-500/10 text-brand-400">
                      <Icon className="h-5 w-5" strokeWidth={1.7} />
                    </span>
                    <span className="font-mono text-xs text-surface-500">0{i + 1}</span>
                  </div>
                  <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.22em] text-surface-500">{t(s.when)}</p>
                  <h3 className="mt-2 text-xl font-medium tracking-tight text-surface-100">{t(s.title)}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-surface-400">{t(s.body)}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_1fr]">
          <pre className="overflow-x-auto rounded-[28px] border border-surface-800 bg-[#0a0d12] p-6 font-mono text-[13px] leading-relaxed text-surface-300">
{`---
reply_language: th      `}<span className="text-surface-500"># set by onboarding</span>{`
allow_scripts: chinese  `}<span className="text-surface-500"># optional</span>{`
---
`}<span className="text-brand-400">## Always</span>{`              `}<span className="text-surface-500"># every prompt, 3-7 lines</span>{`
- One mission at a time.
- Never commit without asking.

`}<span className="text-brand-400">## Context</span>{`             `}<span className="text-surface-500"># start + after compact</span>{`
- Prefers tables over prose.`}
          </pre>
          <div className="flex flex-col justify-center rounded-[28px] border border-surface-800 p-6 text-sm leading-relaxed text-surface-400">
            <p>
              <span className="font-medium text-surface-200">{t({ en: 'Manage with ', th: 'จัดการด้วย ' })}</span>
              <code className="font-mono text-brand-400">/kasi-main</code>
              <span className="font-mono text-surface-500"> show · language · add · allow · import</span>
            </p>
            <p className="mt-4">
              {t({
                en: 'Honest limit: re-sending a rule makes the AI see it every turn — it does not force compliance. Only the reply language is enforced, because only that can be checked by code.',
                th: 'ข้อจำกัดตามจริง: การส่งกฎซ้ำทำให้ AI เห็นกฎทุกรอบ แต่ไม่ได้บังคับให้ทำตาม ข้อที่บังคับได้จริงมีแค่ภาษาที่ตอบ เพราะเป็นข้อเดียวที่ตรวจด้วยโค้ดได้',
              })}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Benchmark() {
  const { t } = useLang();
  return (
    <section id="benchmark" className="scroll-mt-24 px-4 pb-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <Kicker>Benchmark</Kicker>
          <h2 className="mt-3 text-4xl font-medium tracking-[-0.045em] md:text-6xl">
            {t({ en: 'Measured,', th: 'วัดผลจริง' })}
            <br />
            <span className="text-surface-500">{t({ en: 'not claimed.', th: 'ไม่ใช่แค่อ้าง' })}</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed text-surface-400">
            {t({
              en: '12 tasks — 6 SWE-bench Lite + 6 SWE-bench Verified "1-4 hours" — on Haiku and Fable, scored by the official swebench Docker harness. Same prompt, same restricted permissions, each arm isolated.',
              th: '12 task (SWE-bench Lite 6 + SWE-bench Verified ระดับ "1-4 hours" 6) รันบน Haiku และ Fable ตรวจด้วย swebench Docker harness ทางการ prompt เดียวกัน สิทธิ์เท่ากัน แต่ละฝั่งแยกจากกัน',
            })}
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-[28px] border border-surface-800">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-surface-800 text-[11px] uppercase tracking-[0.18em] text-surface-500">
              <tr>
                <th className="px-6 py-4 font-medium">{t({ en: 'Resolved', th: 'แก้ผ่าน' })}</th>
                <th className="px-6 py-4 font-medium">Haiku</th>
                <th className="px-6 py-4 font-medium">Fable</th>
                <th className="px-6 py-4 font-medium">{t({ en: 'Total (24)', th: 'รวม (24)' })}</th>
                <th className="px-6 py-4 font-medium">{t({ en: 'Cost', th: 'ค่าใช้จ่าย' })}</th>
                <th className="px-6 py-4 font-medium">{t({ en: '$ / resolved', th: '$ / ข้อที่ผ่าน' })}</th>
              </tr>
            </thead>
            <tbody>
              {BENCHMARK.rows.map((r) => (
                <tr key={r.name} className={`border-b border-surface-800 last:border-0 ${r.highlight ? 'bg-brand-500/[0.06]' : ''}`}>
                  <td className={`px-6 py-4 font-medium ${r.highlight ? 'text-brand-400' : 'text-surface-200'}`}>{r.name}</td>
                  <td className="px-6 py-4 font-mono text-surface-300">{r.haiku}</td>
                  <td className="px-6 py-4 font-mono text-surface-300">{r.fable}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-surface-100">{r.total}</span>
                      <span className="h-1.5 w-24 overflow-hidden rounded-full bg-surface-800">
                        <span
                          className={`block h-full rounded-full ${r.highlight ? 'bg-brand-500' : 'bg-surface-500'}`}
                          style={{ width: `${r.pct}%` }}
                        />
                      </span>
                      <span className="font-mono text-xs text-surface-500">{r.pct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-mono text-surface-300">{r.cost}</td>
                  <td className="px-6 py-4 font-mono text-surface-300">{r.perSolved}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-5 max-w-3xl text-sm leading-relaxed text-surface-500">
          {t({
            en: 'On Haiku, Kasidit resolved the most and was the cheapest. On Fable, Superpowers resolved the most and both frameworks cost more than none. One run per arm — Kasidit vs Superpowers is a 1-task gap, a tie within noise. The clear signal: both frameworks beat no framework.',
            th: 'บน Haiku Kasidit แก้ผ่านมากที่สุดและถูกที่สุด บน Fable Superpowers แก้ผ่านมากที่สุด และทั้งสอง framework แพงกว่าไม่ใช้ รันฝั่งละรอบเดียว ส่วนต่าง Kasidit กับ Superpowers คือ 1 task ถือว่าเสมอภายใน noise สิ่งที่ชัดคือทั้งสอง framework ชนะการไม่ใช้ framework',
          })}
        </p>
      </div>
    </section>
  );
}
