import { motion } from 'framer-motion';

// Default scroll-triggered entrance — used everywhere for "section transitions".
// `delay` lets callers stagger siblings cheaply without a parent variant.

const Reveal = ({
  children,
  delay = 0,
  y = 28,
  duration = 0.7,
  className = '',
  once = true,
  as: As = 'div',
}) => {
  const MotionTag = motion[As] || motion.div;
  return (
    <MotionTag
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        delay,
        duration,
        ease: [0.16, 1, 0.3, 1], // smooth ease-out-quint
      }}
      viewport={{ once, margin: '-80px' }}
      className={className}
    >
      {children}
    </MotionTag>
  );
};

export default Reveal;
