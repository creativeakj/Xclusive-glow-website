import Link from "next/link";

const ACCOUNT_NAV = [
  { href: "/account", label: "Overview" },
  { href: "/account/orders", label: "Orders" },
  { href: "/account/profile", label: "Profile" },
  { href: "/account/addresses", label: "Addresses" },
];

export default function AccountLayout({ children }: LayoutProps<"/account">) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid grid-cols-1 gap-10 md:grid-cols-[200px_1fr]">
        <aside>
          <nav className="flex flex-row gap-4 overflow-x-auto md:flex-col md:gap-2">
            {ACCOUNT_NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="whitespace-nowrap text-sm text-foreground hover:text-primary"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/account/logout"
              className="whitespace-nowrap text-sm text-muted-foreground hover:text-primary"
            >
              Sign out
            </a>
          </nav>
        </aside>
        <div>{children}</div>
      </div>
    </div>
  );
}
