"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_LINKS } from "@/lib/nav-links";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="-mr-2 p-2"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      {open ? (
        <div className="fixed inset-0 z-60 flex flex-col bg-background p-6">
          <div className="flex items-center justify-between">
            <Logo />
            <button type="button" aria-label="Close menu" onClick={() => setOpen(false)}>
              <X className="size-5" />
            </button>
          </div>
          <nav className="mt-10 grid gap-1 overflow-y-auto">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="border-b border-border py-4 font-serif text-2xl"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Dark mode</span>
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </div>
  );
}
