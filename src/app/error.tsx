"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <h1 className="font-serif text-3xl text-foreground">Something went wrong</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {error.message || "An unexpected error occurred. Please try again."}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
      >
        Try again
      </button>
    </div>
  );
}
