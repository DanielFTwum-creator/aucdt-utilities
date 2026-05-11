import { motion, useInView } from "framer-motion";
import React, { useEffect, useState } from "react";
import { STATS } from "../constants";

const Counter: React.FC<{ value: number; suffix: string }> = ({ value, suffix }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const step = Math.ceil(value / 60);
      const timer = setInterval(() => {
        start = Math.min(start + step, value);
        setCount(start);
        if (start >= value) clearInterval(timer);
      }, 25);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <span ref={ref} className="font-display text-4xl font-black text-gold block leading-none mb-2">
      {count.toLocaleString()}{suffix}
    </span>
  );
};

export const StatsBoard: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.6 }}
      className="w-full max-w-4xl mx-auto flex flex-wrap border border-gold/20 bg-black/60 backdrop-blur-xl z-20 overflow-hidden rounded-lg shadow-2xl relative"
    >
      {STATS.map((stat, i) => (
        <div key={i} className="flex-1 min-w-[200px] py-10 px-6 text-center relative">
          {i > 0 && <div className="absolute left-0 top-1/4 bottom-1/4 w-[1px] bg-gold/20 hidden md:block" />}
          <Counter value={stat.value} suffix={stat.suffix} />
          <span className="text-[10px] tracking-[0.25em] uppercase text-cream/50 font-bold">{stat.label}</span>
        </div>
      ))}
    </motion.div>
  );
};
