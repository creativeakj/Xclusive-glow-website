import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Price } from "@/components/price";
import { getCustomerOrder } from "@/lib/shopify/customer";

export const metadata: Metadata = {
  title: "Order details",
};

export default async function OrderDetailPage(
  props: PageProps<"/account/orders/[id]">
) {
  const { id } = await props.params;
  // Route params can't contain the `/` in a Shopify GID, so the route only
  // carries the numeric legacy id and we rebuild the full GID here. This is
  // never exposed to other customers: the Customer Account API only ever
  // returns orders that belong to the signed-in customer, so an id a
  // customer doesn't own simply resolves to null below.
  const order = await getCustomerOrder(`gid://shopify/Order/${id}`);

  if (!order) notFound();

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-serif text-3xl text-foreground">{order.name}</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Placed on {new Date(order.processedAt).toLocaleDateString()}
          {order.financialStatus ? ` · ${order.financialStatus}` : ""}
        </p>
      </div>

      {order.fulfillments.length > 0 ? (
        <div className="border border-border p-4">
          <h2 className="mb-2 text-sm font-medium text-foreground">Fulfillment</h2>
          <ul className="flex flex-col gap-2">
            {order.fulfillments.map((fulfillment, i) => (
              <li key={i} className="text-sm text-muted-foreground">
                {fulfillment.status || "Processing"}
                {fulfillment.trackingNumber ? (
                  <>
                    {" · "}
                    {fulfillment.trackingUrl ? (
                      <a
                        href={fulfillment.trackingUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="underline"
                      >
                        Track package{fulfillment.carrier ? ` (${fulfillment.carrier})` : ""}
                      </a>
                    ) : (
                      `Tracking: ${fulfillment.trackingNumber}`
                    )}
                  </>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="border border-border p-4 text-sm text-muted-foreground">
          Fulfillment and tracking information will appear here once available.
        </div>
      )}

      <div>
        <h2 className="mb-3 text-sm font-medium text-foreground">Items</h2>
        <ul className="divide-y divide-border border-y border-border">
          {order.lineItems.map((item, i) => (
            <li key={i} className="flex gap-4 py-4">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden bg-muted">
                {item.image ? (
                  <Image
                    src={item.image.url}
                    alt={item.image.altText || item.title}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.variantTitle ? `${item.variantTitle} · ` : ""}Qty {item.quantity}
                  </p>
                </div>
                <Price amount={item.price} className="text-sm" />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="ml-auto flex w-full max-w-xs flex-col gap-2 text-sm">
        {order.subtotal ? (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <Price amount={order.subtotal} />
          </div>
        ) : null}
        {order.totalShipping ? (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <Price amount={order.totalShipping} />
          </div>
        ) : null}
        {order.totalTax ? (
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <Price amount={order.totalTax} />
          </div>
        ) : null}
        <div className="flex justify-between border-t border-border pt-2 font-medium">
          <span>Total</span>
          <Price amount={order.totalPrice} />
        </div>
      </div>
    </div>
  );
}
