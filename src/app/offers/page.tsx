import Image from "next/image";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Offers",
  description: "Seasonal offers from Xclusive Glow.",
  path: "/offers",
});

export default function OffersPage() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 lg:grid-cols-2 lg:px-8">
      <div className="relative aspect-square w-full overflow-hidden">
        <Image
          src="/images/offer.jpg"
          alt="The Gilded Offer"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <p className="eyebrow">Limited time</p>
        <h1 className="mt-4 font-serif text-5xl sm:text-6xl">The Gilded Offer</h1>
        <p className="mt-6 max-w-lg text-lg leading-8 text-muted-foreground">
          Enjoy 10% off your first order with code WELCOME10, plus complimentary delivery on
          orders over $75.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-flex items-center bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
        >
          Shop the offer
        </Link>
      </div>
    </section>
  );
}
