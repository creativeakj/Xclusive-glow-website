"use client";

import { useState, type FormEvent } from "react";

// Front-end only until an email marketing integration (e.g. Klaviyo via
// Shopify) is wired up in a later phase — see README.
export function Newsletter() {
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <section className="border-t border-border bg-muted px-4 py-16 text-center">
      <p className="eyebrow">Stay in the glow</p>
      <h2 className="mt-3 font-serif text-3xl sm:text-4xl">Get 10% off your first order</h2>
      <p className="mx-auto mt-3 max-w-md text-sm text-muted-foreground">
        Join the list for early access to new arrivals, offers and restocks.
      </p>
      <form onSubmit={submit} className="mx-auto mt-8 flex max-w-lg border-b border-border">
        <input
          required
          type="email"
          aria-label="Email address"
          className="h-12 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground"
          placeholder="Your email address"
        />
        <button
          type="submit"
          className="px-4 text-xs font-medium uppercase tracking-[0.14em] text-primary"
        >
          {sent ? "Welcome" : "Subscribe"}
        </button>
      </form>
    </section>
  );
}
