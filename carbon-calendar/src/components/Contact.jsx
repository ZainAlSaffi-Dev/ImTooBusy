import { ArrowUpRight, Mail, Github, Linkedin } from 'lucide-react';
import Reveal from './Reveal';

const LINKS = [
  {
    label: 'Email',
    handle: 'zainalsaffi@gmail.com',
    href: 'mailto:zainalsaffi@gmail.com',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    handle: 'linkedin.com/zain-al-saffi',
    href: 'https://www.linkedin.com/in/zain-al-saffi-881492250/',
    icon: Linkedin,
  },
  {
    label: 'GitHub',
    handle: 'github.com/ZainAlSaffi-Dev',
    href: 'https://github.com/ZainAlSaffi-Dev',
    icon: Github,
  },
];

const Contact = ({ onOpenBooking }) => {
  return (
    <div id="contact" className="px-6 py-36 md:py-56">
      <div className="max-w-6xl mx-auto">

        <Reveal>
          <span className="eyebrow">Contact</span>
        </Reveal>

        {/* Massive closing line */}
        <Reveal delay={0.05}>
          <h2 className="mt-4 text-6xl md:text-8xl lg:text-[8rem] font-serif italic font-normal text-ink-900 leading-[1.0] tracking-tighter2">
            Say hello.
          </h2>
        </Reveal>

        <div className="mt-16 grid md:grid-cols-12 gap-12">
          <div className="md:col-span-6">
            <Reveal delay={0.08}>
              <p className="text-ink-800 text-lg md:text-xl leading-relaxed max-w-reading">
                Happy to chat about quant research, ML, software, or anything you've
                seen on this page. Easiest way is a quick 15-minute call, but email
                works too.
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <button
                onClick={onOpenBooking}
                className="mt-10 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-ink-900 text-ink-0 text-sm font-medium hover:bg-accent transition-colors group"
              >
                Book a chat
                <ArrowUpRight size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </Reveal>
          </div>

          <div className="md:col-span-6">
            <ul className="border-t border-b border-ink-300/60 divide-y divide-ink-300/60">
              {LINKS.map(({ label, handle, href, icon: Icon }, i) => (
                <Reveal key={label} delay={0.1 + i * 0.06} as="li">
                  <a
                    href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel={href.startsWith('http') ? 'noreferrer' : undefined}
                    className="flex items-center justify-between py-5 group"
                  >
                    <div className="flex items-center gap-4">
                      <Icon size={18} className="text-ink-600 group-hover:text-accent transition-colors" />
                      <div>
                        <div className="font-mono text-[11px] uppercase tracking-widest text-ink-600">
                          {label}
                        </div>
                        <div className="text-ink-900 group-hover:text-accent transition-colors">
                          {handle}
                        </div>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={16}
                      className="text-ink-600 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
                    />
                  </a>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Contact;
