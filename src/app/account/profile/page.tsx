import type { Metadata } from "next";
import { getCustomerProfile } from "@/lib/shopify/customer";

export const metadata: Metadata = {
  title: "Profile",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const profile = await getCustomerProfile();

  return (
    <div>
      <h1 className="mb-6 font-serif text-3xl text-foreground">Profile</h1>
      <dl className="flex max-w-md flex-col divide-y divide-border border-y border-border">
        <div className="flex justify-between py-3 text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd className="text-foreground">
            {[profile?.firstName, profile?.lastName].filter(Boolean).join(" ") || "—"}
          </dd>
        </div>
        <div className="flex justify-between py-3 text-sm">
          <dt className="text-muted-foreground">Email</dt>
          <dd className="text-foreground">{profile?.emailAddress || "—"}</dd>
        </div>
        <div className="flex justify-between py-3 text-sm">
          <dt className="text-muted-foreground">Phone</dt>
          <dd className="text-foreground">{profile?.phoneNumber || "—"}</dd>
        </div>
      </dl>
    </div>
  );
}
