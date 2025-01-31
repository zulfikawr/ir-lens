// hooks/useRotatingIndex.ts
import { useState, useEffect } from 'react';

const useRotatingIndex = (items: string[], interval: number) => {
  const [indices, setIndices] = useState<Record<string, number>>({});

  useEffect(() => {
    const initialIndices = items.reduce((acc, item) => {
      acc[item] = 0;
      return acc;
    }, {} as Record<string, number>);
    setIndices(initialIndices);

    const timers = items.map(item =>
      setInterval(() => {
        setIndices(prev => ({
          ...prev,
          [item]: (prev[item] + 1) % 3
        }));
      }, interval)
    );

    return () => timers.forEach(clearInterval);
  }, [items, interval]);

  return indices;
};

export default useRotatingIndex;