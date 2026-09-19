import Link from "next/link";
import type { Metadata } from "next";
import { getCustomerOrders, getCustomerProfile } from "@/lib/shopify/customer";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountOverviewPage() {
  const [profile, orders] = await Promise.all([
    getCustomerProfile(),
    getCustomerOrders(3),
  ]);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">
          {profile?.firstName ? `Welcome back, ${profile.firstName}` : "Your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{profile?.emailAddress}</p>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-foreground">Recent orders</h2>
          <Link href="/account/orders" className="text-sm text-muted-foreground hover:text-primary">
            View all
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {orders.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id.split("/").pop()}`}
                  className="flex items-center justify-between py-4 text-sm"
                >
                  <span className="font-medium text-foreground">{order.name}</span>
                  <span className="text-muted-foreground">
                    {new Date(order.processedAt).toLocaleDateString()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
