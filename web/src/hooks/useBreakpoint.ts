import { useState, useEffect } from 'react';

export function useBreakpoint(breakpoint: number) {
  const [isBelowBreakpoint, setIsBelowBreakpoint] = useState(
    false
  );

  useEffect(() => {
    if(!window) return;
    
    const handleResize = () =>
      setIsBelowBreakpoint(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [breakpoint]);

  return isBelowBreakpoint;
}