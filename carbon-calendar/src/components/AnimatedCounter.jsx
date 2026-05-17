import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

// Counts up from 0 to `to` once the element scrolls into view.
// Use `decimals` for floats (e.g. GPA 7.00) and prefix/suffix for $, %, "+", etc.

const AnimatedCounter = ({
  to,
  decimals = 0,
  prefix = '',
  suffix = '',
  duration = 1.6,
  className = '',
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const start = performance.now();
    let raf;

    const tick = (now) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      // ease-out-cubic — fast at first, settles at the end
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(eased * to);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => raf && cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

export default AnimatedCounter;
