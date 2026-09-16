"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export function SearchForm({ className }: { className?: string }) {
  const [value, setValue] = useState("");
  const router = useRouter();

  function submit(event: FormEvent) {
    event.preventDefault();
    const query = value.trim();
    router.push(query ? `/shop?q=${encodeURIComponent(query)}` : "/shop");
  }

  return (
    <form
      onSubmit={submit}
      className={`flex items-center border-b border-border ${className ?? ""}`}
    >
      <Search className="size-4 text-muted-foreground" aria-hidden="true" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        aria-label="Search products"
        className="h-10 w-full bg-transparent px-3 text-sm outline-none placeholder:text-muted-foreground"
        placeholder="Search products, categories..."
      />
    </form>
  );
}
