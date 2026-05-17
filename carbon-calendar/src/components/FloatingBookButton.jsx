import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';

// Single, persistent CTA in the bottom-right. Fades in shortly after load so
// the hero's own button is the user's first reach; takes over once they scroll.

const FloatingBookButton = ({ onClick }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1400);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0,  scale: 1 }}
          exit={{    opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          onClick={onClick}
          className="
            fixed bottom-5 right-5 md:bottom-7 md:right-7 z-50
            group inline-flex items-center gap-2
            px-5 py-3 rounded-full
            bg-ink-100/90 backdrop-blur-md
            border border-ink-300/70
            text-ink-900 text-sm font-medium
            shadow-[0_8px_30px_rgba(0,0,0,0.45)]
            hover:bg-accent hover:text-ink-0 hover:border-accent
            transition-colors
          "
          aria-label="Book a chat"
        >
          <Calendar size={16} className="opacity-80 group-hover:opacity-100 transition-opacity" />
          <span>Book a chat</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default FloatingBookButton;
