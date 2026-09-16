import { formatMoney } from "@/lib/shopify/money";
import type { Money } from "@/lib/shopify/types";

export function Price({
  amount,
  compareAtAmount,
  className,
}: {
  amount: Money;
  compareAtAmount?: Money | null;
  className?: string;
}) {
  const isOnSale =
    compareAtAmount && Number(compareAtAmount.amount) > Number(amount.amount);

  return (
    <span className={className}>
      <span className={isOnSale ? "font-medium text-primary" : undefined}>
        {formatMoney(amount)}
      </span>
      {isOnSale ? (
        <span className="ml-2 text-muted-foreground line-through">
          {formatMoney(compareAtAmount)}
        </span>
      ) : null}
    </span>
  );
}
