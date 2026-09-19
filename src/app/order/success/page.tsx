import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderSuccessPage(
  props: PageProps<"/order/success">
) {
  const searchParams = await props.searchParams;
  const orderNumber =
    typeof searchParams.order === "string" ? searchParams.order : null;

  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <h1 className="font-serif text-3xl text-foreground">Thank you for your order</h1>
      {orderNumber ? (
        <p className="mt-3 text-muted-foreground">Order {orderNumber} has been received.</p>
      ) : (
        <p className="mt-3 text-muted-foreground">
          Your order has been received. You&apos;ll get an email confirmation shortly.
        </p>
      )}
      <p className="mt-1 text-sm text-muted-foreground">
        You can track fulfillment and order status any time from your account.
      </p>
      <div className="mt-6 flex justify-center gap-4">
        <Link
          href="/account/orders"
          className="bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
        >
          View orders
        </Link>
        <Link
          href="/shop"
          className="border border-border px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-foreground hover:border-primary hover:text-primary"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
