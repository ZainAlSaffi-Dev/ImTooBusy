// Quiet, editorial about — no terminal gate, no "WHO_AM_I?".
// Two columns: a short prose paragraph + a sparse "currently" list.
// More warmth than the v2.0 cut without losing the minimal frame.

const CURRENTLY = [
  { k: 'Working on',  v: 'GLP-1 narrative monitoring at Eucalyptus' },
  { k: 'Researching', v: 'Algorithmic governance & engagement on Meta platforms' },
  { k: 'Teaching',    v: 'COMP3710 — Pattern Recognition (UQ)' },
  { k: 'Reading',     v: '“Advances in Financial Machine Learning” — López de Prado' },
  { k: 'Playing',     v: '7-string · Ibanez Prestige into a Neural DSP Gojira' },
  { k: 'Listening',   v: 'BabyMetal · In Flames · Electric Callboy · low-tuned things' },
  { k: 'Wearing',     v: 'PDM Althair in winter, Pacific Chill in summer' },
];

const About = () => {
  return (
    <div className="px-6 py-28 md:py-36">
      <div className="max-w-5xl mx-auto">

        <div className="grid md:grid-cols-12 gap-12 md:gap-16">

          {/* Left — the prose */}
          <div className="md:col-span-7">
            <span className="eyebrow">About</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-serif italic font-normal text-ink-900 leading-tight tracking-tightish">
              Beyond the resume.
            </h2>

            <div className="mt-8 space-y-5 text-ink-800 text-lg leading-relaxed max-w-reading">
              <p>
                I'm still in the&nbsp;
                <span className="text-ink-900">figuring-it-out</span> phase — an engineering student at UQ
                spending my undergrad sampling industries that look hard from the outside. Trading desks,
                healthtech, autonomous racing, a stint in insolvency law. Most of what I do lives somewhere
                between markets, models and machines.
              </p>
              <p>
                Outside the terminal I play 7-string guitar (mostly metal — BabyMetal, In Flames,
                Electric Callboy, plus whatever's tuned the lowest that week), spend more time than is
                probably reasonable on niche fragrances, and have a real soft spot for pro bono law —
                there's a thrill in standing up for people who can't defend themselves. The
                long-term plan involves bionics and Alzheimer's, but that's a conversation for another day.
              </p>
            </div>
          </div>

          {/* Right — "currently" list */}
          <div className="md:col-span-5">
            <span className="eyebrow">Currently</span>
            <ul className="mt-4 divide-y divide-ink-300/60 border-t border-b border-ink-300/60">
              {CURRENTLY.map((row) => (
                <li key={row.k} className="py-4 flex flex-col gap-1 group">
                  <span className="font-mono text-[11px] uppercase tracking-widest text-ink-600">
                    {row.k}
                  </span>
                  <span className="text-ink-900 text-base group-hover:text-accent transition-colors">
                    {row.v}
                  </span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
