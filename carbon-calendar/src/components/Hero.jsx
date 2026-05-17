import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

// Each word slides up out of a clip-mask. Stagger between words.
const wordVariants = {
  hidden:  { y: '110%' },
  visible: (i) => ({
    y: 0,
    transition: { delay: 0.08 + i * 0.07, duration: 0.95, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Word = ({ children, index, className = '' }) => (
  <span className="inline-block overflow-hidden align-bottom" style={{ lineHeight: 1.05 }}>
    <motion.span
      className={`inline-block ${className}`}
      variants={wordVariants}
      custom={index}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.span>
  </span>
);

const Hero = ({ onOpenBooking }) => {
  return (
    <section className="relative min-h-[100svh] flex items-center px-6 pt-28 pb-24">
      <div className="max-w-6xl mx-auto w-full">

        {/* Massive name — word-mask reveal */}
        <h1 className="text-6xl md:text-8xl lg:text-[8.5rem] leading-[1.02] tracking-tighter2 text-ink-900">
          <Word index={0} className="font-serif italic font-normal">Zain</Word>
          {' '}
          <Word index={1} className="font-sans font-medium">Al-Saffi.</Word>
        </h1>

        {/* Subtitle — masked too, slightly later */}
        <h2 className="mt-3 md:mt-5 text-3xl md:text-5xl lg:text-6xl leading-[1.08] tracking-tightish text-ink-700 font-light">
          <Word index={3} className="font-sans">Engineering&nbsp;</Word>
          <Word index={4} className="font-sans">student&nbsp;</Word>
          <Word index={5} className="font-sans">at&nbsp;</Word>
          <Word index={6} className="font-sans text-ink-900">UQ.</Word>
        </h2>

        {/* Paragraph fades in after the words land */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 max-w-reading text-lg md:text-xl text-ink-700 leading-relaxed"
        >
          Currently studying Engineering &amp; Software at the&nbsp;
          <span className="text-ink-900">University of Queensland</span> —
          bouncing between <span className="text-ink-900">quant research</span>,&nbsp;
          <span className="text-ink-900">ML</span>,&nbsp;
          <span className="text-ink-900">autonomous systems</span>&nbsp;
          <span className="font-serif italic text-accent">and the odd legal detour</span>.
          Off to <span className="text-ink-900">Optiver</span> in Sydney at the end of
          the year, growth-engineering at <span className="text-ink-900">Eucalyptus</span>{' '}
          in between, and tutoring deep learning on the side. I like difficult problems
          with real numbers attached — and the occasional break from staring at them.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.7 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <button
            onClick={onOpenBooking}
            className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-ink-900 text-ink-0 text-sm font-medium hover:bg-accent transition-colors"
          >
            Book a chat
            <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
          <span className="text-sm text-ink-600">or just keep scrolling.</span>
        </motion.div>

        {/* Quiet facts row — counters animate when in view */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.35, duration: 0.7 }}
          className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-10 max-w-3xl"
        >
          <Fact
            label="GPA"
            value={<AnimatedCounter to={7} decimals={2} suffix=" / 7.00" />}
            sub="Dean’s Excellence 2025"
          />
          <Fact
            label="Next stop"
            value="Optiver"
            sub="Sydney · Dec 2026"
          />
          <Fact
            label="Society"
            value="UQCS"
            sub="President 2026"
          />
          <Fact
            label="Shipped"
            value={<AnimatedCounter to={1000} suffix="+ DL" />}
            sub="BlackBoxLabs · VSCode"
          />
        </motion.div>
      </div>
    </section>
  );
};

const Fact = ({ label, value, sub }) => (
  <div className="group">
    <div className="eyebrow mb-2">{label}</div>
    <div className="text-ink-900 text-2xl tracking-tightish group-hover:text-accent transition-colors">
      {value}
    </div>
    <div className="text-ink-600 text-xs mt-0.5">{sub}</div>
  </div>
);

export default Hero;
