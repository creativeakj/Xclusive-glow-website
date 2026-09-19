"use client";

import { useEffect, useRef, useState } from "react";

export function PromoBar() {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY;
      if (y <= 4) {
        setHidden(false);
      } else {
        setHidden(y > lastY.current);
      }
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={`hidden overflow-hidden bg-primary text-center text-[10px] uppercase tracking-[0.16em] text-primary-foreground transition-[max-height,opacity,padding] duration-300 ease-in-out sm:block ${
        hidden ? "max-h-0 py-0 opacity-0" : "max-h-10 py-2 opacity-100"
      }`}
    >
      Complimentary shipping on orders over $75 &middot; 10% off your first order &mdash; WELCOME10
    </div>
  );
}
