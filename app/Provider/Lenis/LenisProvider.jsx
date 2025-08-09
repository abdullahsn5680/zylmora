"use client";
import { useEffect, useRef, useCallback } from "react";
import Lenis from "@studio-freight/lenis";

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


    rafRef.current = requestAnimationFrame(raf);


    const handleResize = () => {
      if (lenisRef.current) {
        lenisRef.current.resize();
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      if (lenisRef.current) {
        lenisRef.current.destroy();
      }
    };
  }, [raf]);


  useEffect(() => {
    if (typeof window !== "undefined" && lenisRef.current) {
      window.lenis = lenisRef.current;
    }
    
    return () => {
      if (typeof window !== "undefined") {
        delete window.lenis;
      }
    };
  }, []);

  return <>{children}</>;
}