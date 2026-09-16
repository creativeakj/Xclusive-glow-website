import type { Money } from "./types";

export function formatMoney(money: Money): string {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: money.currencyCode,
  }).format(Number(money.amount));
}
