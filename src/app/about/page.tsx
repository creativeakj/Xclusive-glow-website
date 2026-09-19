import Image from "next/image";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Story",
  description: "Discover the story and values behind Xclusive Glow.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src="/images/story.jpg"
          alt="Our craft"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>
      <div>
        <p className="eyebrow">The maison</p>
        <h1 className="mt-4 font-serif text-5xl">Beauty beyond borders.</h1>
        <p className="mt-7 max-w-xl text-lg leading-8 text-muted-foreground">
          Xclusive Glow brings together beauty, fashion and lifestyle essentials selected for
          people who value quality, confidence and timeless style.
        </p>
        <p className="mt-5 max-w-xl leading-7 text-muted-foreground">
          From radiant skincare to occasion dressing for women, men and children, every
          collection is chosen to make exceptional style feel personal.
        </p>
      </div>
    </section>
  );
}
