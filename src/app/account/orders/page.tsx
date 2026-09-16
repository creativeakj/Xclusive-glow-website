import Link from "next/link";
import type { Metadata } from "next";
import { Price } from "@/components/price";
import { getCustomerOrders } from "@/lib/shopify/customer";

export const metadata: Metadata = {
  title: "Orders",
};

export default async function OrdersPage() {
  const orders = await getCustomerOrders(50);

  if (orders.length === 0) {
    return (
      <div>
        <h1 className="mb-4 font-serif text-3xl text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-foreground">Orders</h1>
      <ul className="divide-y divide-border border-y border-border">
        {orders.map((order) => (
          <li key={order.id}>
            <Link
              href={`/account/orders/${order.id.split("/").pop()}`}
              className="flex flex-col gap-1 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-medium text-foreground">{order.name}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(order.processedAt).toLocaleDateString()}
                  {order.fulfillmentStatus ? ` · ${order.fulfillmentStatus}` : ""}
                </p>
              </div>
              <Price amount={order.totalPrice} className="text-sm font-medium" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
