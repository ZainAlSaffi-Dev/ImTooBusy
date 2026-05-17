import { ArrowUpRight } from 'lucide-react';

const Hero = ({ onOpenBooking }) => {
  return (
    <section className="relative min-h-screen flex items-center px-6 pt-32 pb-24">
      <div className="max-w-5xl mx-auto w-full">

        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span className="eyebrow">Brisbane, AU · Generally up for a chat</span>
        </div>

        {/* Name + intro — editorial, mixed serif/sans, no "quant" label */}
        <h1 className="text-5xl md:text-7xl lg:text-[5.5rem] leading-[1.02] tracking-tighter2 text-ink-900 max-w-4xl">
          <span className="font-serif italic font-normal text-ink-900">Zain</span>{' '}
          <span className="font-sans font-medium">Al-Saffi.</span>
          <br />
          <span className="text-ink-700 font-sans font-light">
            Engineering student at UQ, bouncing between<br className="hidden md:block" />{' '}
            <span className="text-ink-900">quant research</span>,&nbsp;
            <span className="text-ink-900">ML</span>,&nbsp;
            <span className="text-ink-900">autonomous systems</span>&nbsp;
            <span className="font-serif italic text-accent">and the odd legal detour</span>.
          </span>
        </h1>

        {/* One-paragraph intro */}
        <p className="mt-12 max-w-reading text-lg text-ink-700 leading-relaxed">
          Currently studying Engineering &amp; Software at the&nbsp;
          <span className="text-ink-900">University of Queensland</span>.
          Off to <span className="text-ink-900">Optiver</span> in Sydney at the end of
          the year, growth-engineering at <span className="text-ink-900">Eucalyptus</span>{' '}
          in between, and tutoring deep learning on the side. I like difficult problems
          with real numbers attached — and the occasional break from staring at them.
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
          <Fact label="GPA"       value="7.00 / 7.00" sub="Dean's Excellence 2025" />
          <Fact label="Next stop" value="Optiver"     sub="Sydney · Dec 2026" />
          <Fact label="Society"   value="UQCS"        sub="President 2026" />
          <Fact label="Shipped"   value="1,000+ DL"   sub="BlackBoxLabs · VSCode" />
        </div>
      </div>
    </section>
  );
};

const Fact = ({ label, value, sub }) => (
  <div className="group">
    <div className="eyebrow mb-2">{label}</div>
    <div className="text-ink-900 text-xl tracking-tightish group-hover:text-accent transition-colors">
      {value}
    </div>
    <div className="text-ink-600 text-xs mt-0.5">{sub}</div>
  </div>
);

export default Hero;
