import Image from "next/image";
import Link from "next/link";

export function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-1.5">
      <Image
        src="/logo/xclusive-glow-icon.png"
        alt="Xclusive Glow"
        width={120}
        height={54}
        priority
        className="h-11 w-auto sm:h-12"
      />
      <span className="hidden leading-none sm:block">
        <strong className="font-serif text-2xl uppercase tracking-wide">Xclusive Glow</strong>
        <small className="mt-1.5 block text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Beauty &middot; Fashion &middot; Lifestyle
        </small>
      </span>
    </Link>
  );
}
