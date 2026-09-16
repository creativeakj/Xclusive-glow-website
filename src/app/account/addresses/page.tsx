import type { Metadata } from "next";
import { getCustomerAddresses } from "@/lib/shopify/customer";

export const metadata: Metadata = {
  title: "Addresses",
};

export default async function AddressesPage() {
  const addresses = await getCustomerAddresses();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-foreground">Addresses</h1>

      {addresses.length === 0 ? (
        <p className="text-sm text-muted-foreground">You don&apos;t have any saved addresses yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <div
              key={address.id}
              className="relative border border-border p-4 text-sm text-foreground"
            >
              {address.isDefault ? (
                <span className="absolute right-3 top-3 bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                  Default
                </span>
              ) : null}
              <p>{address.address1}</p>
              {address.address2 ? <p>{address.address2}</p> : null}
              <p>
                {[address.city, address.province, address.zip].filter(Boolean).join(", ")}
              </p>
              <p>{address.country}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
