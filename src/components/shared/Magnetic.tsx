"use client";

import React from "react";
import { motion, useSpring } from "motion/react";

interface MagneticProps {
  children: React.ReactElement;
  amount?: number;
}

export const Magnetic = ({ children, amount = 0.3 }: MagneticProps) => {
  const ref = React.useRef<HTMLDivElement>(null);

  const springConfig = { damping: 20, stiffness: 150, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    
    // Calculate relative mouse position from center
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    x.set(middleX * amount);
    y.set(middleY * amount);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};
