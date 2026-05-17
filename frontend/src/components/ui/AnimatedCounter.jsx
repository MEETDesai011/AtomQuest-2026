import React, { useEffect, useState } from 'react';

export function AnimatedCounter({ value, duration = 1000 }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const isString = typeof value === 'string';
    const numValue = isString ? parseFloat(value) : value;
    
    if (isNaN(numValue)) {
      setCount(value);
      return;
    }

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      const currentVal = Math.floor(progress * numValue);
      setCount(isString && value.includes('%') ? `${currentVal}%` : currentVal);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [value, duration]);

  return <span>{count}</span>;
}
