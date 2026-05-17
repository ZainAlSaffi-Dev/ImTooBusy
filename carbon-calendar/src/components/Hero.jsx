import { ArrowUpRight } from 'lucide-react';

const Hero = ({ onOpenBooking }) => {
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-32 pb-24">
      <div className="max-w-5xl mx-auto w-full">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="eyebrow">Brisbane, AU · Available Apr&nbsp;2026 →</span>
        </div>

        {/* Name + intro — editorial, mixed serif/sans */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tighter2 text-ink-900 max-w-4xl">
          <span className="font-serif italic font-normal text-ink-900">Zain</span>{' '}
          <span className="font-sans font-medium">Al-Saffi.</span>
          <br />
          <span className="text-ink-700 font-sans font-light">
            Quant &amp; software engineer building<br className="hidden md:block" /> systems that&nbsp;
            <span className="font-serif italic text-accent">think</span> in markets&nbsp;and&nbsp;data.
          </span>
        </h1>

        {/* One-paragraph intro */}
        <p className="mt-12 max-w-reading text-lg text-ink-700 leading-relaxed">
          Engineering &amp; software student at the University of Queensland — heading to{' '}
          <span className="text-ink-900">Optiver</span> as a Quantitative Researcher,
          and currently growth-engineering at{' '}
          <span className="text-ink-900">Eucalyptus</span>.
          I like difficult problems with real numbers attached.
        </p>

        {/* Quick CTAs */}
        <div className="mt-12 flex flex-wrap items-center gap-4">
          <button
            onClick={onOpenBooking}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink-900 text-ink-0 text-sm font-medium hover:bg-accent transition-colors"
          >
            Book a chat
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <a
            href="#work"
            className="text-sm text-ink-700 hover:text-ink-900 transition-colors border-b border-ink-400/60 hover:border-accent pb-0.5"
          >
            See the work
          </a>
        </div>

        {/* Quiet facts row */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8 max-w-3xl">
          <Fact label="GPA" value="7.00 / 7.00" sub="Dean's Excellence 2025" />
          <Fact label="Next stop" value="Optiver" sub="Quant Research · Dec 2026" />
          <Fact label="Society" value="UQCS" sub="President 2026" />
          <Fact label="Built" value="1,000+ DL" sub="BlackBoxLabs · VSCode" />
        </div>
      </div>
    </section>
  );
};

const Fact = ({ label, value, sub }) => (
  <div>
    <div className="eyebrow mb-2">{label}</div>
    <div className="text-ink-900 text-xl tracking-tightish">{value}</div>
    <div className="text-ink-600 text-xs mt-0.5">{sub}</div>
  </div>
);

export default Hero;
