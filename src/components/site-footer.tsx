import Image from "next/image";
import Link from "next/link";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa6";
import { FaCcMastercard, FaCcVisa } from "react-icons/fa6";
import { DEPARTMENT_LINKS } from "@/lib/nav-links";

// No real social profile URLs yet (see README's outstanding client
// decisions) — these render as plain icons rather than dead "#" links.
const SOCIAL_ICONS = [
  { label: "Instagram", Icon: FaInstagram },
  { label: "Facebook", Icon: FaFacebookF },
  { label: "TikTok", Icon: FaTiktok },
];

export function SiteFooter() {
  return (
    <footer className="bg-footer text-footer-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <Image
            src="/logo/xclusive-glow-icon.png"
            alt="Xclusive Glow"
            width={120}
            height={54}
            className="h-10 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-6 text-footer-foreground/70">
            Luxury beauty, fashion and lifestyle, thoughtfully selected for every glow.
          </p>
        </div>
        <div>
          <p className="eyebrow mb-4">Shop</p>
          <div className="grid gap-2 text-sm text-footer-foreground/70">
            {DEPARTMENT_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="hover:text-footer-foreground">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4">Maison</p>
          <div className="grid gap-2 text-sm text-footer-foreground/70">
            <Link href="/about" className="hover:text-footer-foreground">
              Our story
            </Link>
            <Link href="/contact" className="hover:text-footer-foreground">
              Contact
            </Link>
            <Link href="/offers" className="hover:text-footer-foreground">
              Offers
            </Link>
            <Link href="/account/orders" className="hover:text-footer-foreground">
              Track an order
            </Link>
          </div>
        </div>
        <div>
          <p className="eyebrow mb-4">Follow us</p>
          <div className="flex gap-3">
            {SOCIAL_ICONS.map(({ label, Icon }) => (
              <span
                key={label}
                aria-label={label}
                className="grid size-9 place-items-center border border-footer-foreground/20 text-footer-foreground/70"
              >
                <Icon className="size-4" aria-hidden="true" />
              </span>
            ))}
          </div>
          <p className="mt-6 mb-2 text-xs text-footer-foreground/50">Secure checkout</p>
          <div className="flex items-center gap-2 text-2xl text-footer-foreground/70">
            <FaCcVisa aria-label="Visa" />
            <FaCcMastercard aria-label="Mastercard" />
          </div>
        </div>
      </div>
      <div className="border-t border-footer-foreground/10 px-4 py-5 text-center text-[10px] uppercase tracking-[0.15em] text-footer-foreground/60">
        &copy; {new Date().getFullYear()} Xclusive Glow. All rights reserved.
      </div>
    </footer>
  );
}
