import { useEffect, useState } from 'react';

const NAV_LINKS = [
  { href: '#work',     label: 'Work' },
  { href: '#projects', label: 'Projects' },
  { href: '#about',    label: 'About' },
  { href: '#contact',  label: 'Contact' },
];

const Navbar = ({ onOpenBooking }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'border-b border-ink-300/60 bg-ink-0/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Mark */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className="font-serif italic text-xl text-ink-900 hover:text-accent transition-colors"
        >
          Zain Al-Saffi
        </a>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-ink-700 hover:text-ink-900 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={onOpenBooking}
            className="text-sm px-3.5 py-1.5 rounded-full border border-ink-400/70 text-ink-900 hover:border-accent hover:text-accent transition-colors"
          >
            Book a chat
          </button>
        </div>

        {/* Mobile — single CTA */}
        <button
          onClick={onOpenBooking}
          className="md:hidden text-xs px-3 py-1.5 rounded-full border border-ink-400/70 text-ink-900 hover:border-accent hover:text-accent transition-colors"
        >
          Book
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
