export function ShopifyNotConfigured({ feature }: { feature: string }) {
  return (
    <div className="mx-auto max-w-xl border border-dashed border-border bg-muted px-6 py-10 text-center">
      <p className="text-sm font-medium text-foreground">
        {feature} isn&apos;t available yet.
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Connect this storefront to Shopify by setting SHOPIFY_STORE_DOMAIN and
        SHOPIFY_STOREFRONT_API_TOKEN in your environment (see .env.example).
      </p>
    </div>
  );
}
