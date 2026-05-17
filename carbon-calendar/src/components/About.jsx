import Reveal from './Reveal';

const CURRENTLY = [
  { k: 'Working on',  v: 'GLP-1 narrative monitoring at Eucalyptus' },
  { k: 'Researching', v: 'Algorithmic governance & engagement on Meta platforms' },
  { k: 'Teaching',    v: 'COMP3710 / Pattern Recognition (UQ)' },
  { k: 'Reading',     v: '“Advances in Financial Machine Learning” by López de Prado' },
  { k: 'Playing',     v: 'Legator Ninja Alex Terrible signature · Neural DSP Gojira' },
  { k: 'Listening',   v: 'BabyMetal · In Flames · Electric Callboy · low-tuned things' },
  { k: 'Wearing',     v: 'PDM Althair in winter, Pacific Chill in summer' },
];

const About = () => {
  return (
    <div id="about" className="px-6 py-36 md:py-48">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <span className="eyebrow">About</span>
        </Reveal>

        <Reveal delay={0.05}>
          <h2 className="mt-4 text-5xl md:text-7xl lg:text-[5.5rem] font-serif italic font-normal text-ink-900 leading-[1.04] tracking-tighter2">
            Beyond the resume.
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-12 gap-12 md:gap-16">

          {/* Prose */}
          <div className="md:col-span-7 space-y-6 text-ink-800 text-lg md:text-xl leading-relaxed max-w-reading">
            <Reveal delay={0.05}>
              <p>
                I'm still very much in the&nbsp;
                <span className="text-ink-900">figuring-it-out</span> phase: an engineering student at UQ
                spending my undergrad sampling industries that look hard from the outside. Trading desks,
                healthtech, autonomous racing, a recent stint in insolvency law. Most of what I do sits
                somewhere between markets, models and machines, and I'm pretty happy with that.
              </p>
            </Reveal>
            <Reveal delay={0.12}>
              <p>
                Outside the terminal I play 7-string guitar, mostly metal: BabyMetal, In Flames,
                Electric Callboy, plus whatever's tuned the lowest that week. I spend more time than
                is probably reasonable on niche fragrances, and I've got a real soft spot for pro bono law.
                There's a thrill in standing up for people who can't defend themselves. The long-term
                plan involves bionics and Alzheimer's, but that's a conversation for another day.
              </p>
            </Reveal>
          </div>

          {/* Currently list */}
          <div className="md:col-span-5">
            <Reveal>
              <span className="eyebrow">Currently</span>
            </Reveal>
            <ul className="mt-4 divide-y divide-ink-300/60 border-t border-b border-ink-300/60">
              {CURRENTLY.map((row, i) => (
                <Reveal key={row.k} delay={0.06 + i * 0.045} as="li">
                  <div className="py-4 flex flex-col gap-1 group">
                    <span className="font-mono text-[11px] uppercase tracking-widest text-ink-600">
                      {row.k}
                    </span>
                    <span className="text-ink-900 text-base group-hover:text-accent transition-colors">
                      {row.v}
                    </span>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
};

export default About;
