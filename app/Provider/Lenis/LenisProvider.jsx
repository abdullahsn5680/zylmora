"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useCallback,
  useState,
} from "react";
import Lenis from "@studio-freight/lenis";

const LenisContext = createContext({
  lenis: null,
  scrollY: 0,
  scrollDirection: "idle",
});

export const useLenis = () => useContext(LenisContext);

export default function LenisProvider({ children }) {
  const lenisRef = useRef(null);
  const rafRef = useRef(null);

  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("idle");

  const lastScrollY = useRef(0);

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
      duration: isMobile ? 0.8 : 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      syncTouch: true,
      touchMultiplier: isMobile ? 1.5 : 2,
      wheelMultiplier: isMobile ? 0.5 : 1,
      infinite: false,
      autoResize: true,
    });

    lenisRef.current = lenis;

   
    lenis.on("scroll", ({ scroll }) => {
      setScrollY(scroll);

      if (scroll > lastScrollY.current) {
        setScrollDirection("down");
      } else if (scroll < lastScrollY.current) {
        setScrollDirection("up");
      } else {
        setScrollDirection("idle");
      }
      lastScrollY.current = scroll;
    });

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
        scrollY,
        scrollDirection,
      }}
    >
      {children}
    </LenisContext.Provider>
  );
}
