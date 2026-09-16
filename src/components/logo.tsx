import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-3">
      <span className="xg-mark" aria-hidden="true">
        <span>X</span>
        <span>G</span>
      </span>
      <span className="hidden leading-none sm:block">
        <strong className="font-serif text-xl font-normal">Xclusive Glow</strong>
        <small className="mt-1 block text-[9px] uppercase tracking-[0.28em] text-muted-foreground">
          Beauty &middot; Fashion &middot; Lifestyle
        </small>
      </span>
    </Link>
  );
}
