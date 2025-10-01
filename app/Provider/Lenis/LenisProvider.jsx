"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from "react";
import Lenis from "@studio-freight/lenis";

const LenisContext = createContext({
  lenis: null,
});

export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  const raf = useCallback((time) => {
    if (lenisRef.current) {
      lenisRef.current.raf(time);
    }
    rafRef.current = requestAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const lenis = new Lenis({
      duration: isMobile ? 0.6 : 1,
      easing: (t) => t, // lightweight easing
      smoothWheel: !prefersReducedMotion,
      syncTouch: true,
      touchMultiplier: isMobile ? 1.2 : 1.5,
      wheelMultiplier: isMobile ? 0.8 : 1,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

    rafRef.current = requestAnimationFrame(raf);

    const handleResize = () => {
      lenisRef.current?.resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (lenisRef.current) lenisRef.current.destroy();
    };
  }, [raf]);

  return (
    <LenisContext.Provider
      value={{
        lenis: lenisRef.current,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
}
