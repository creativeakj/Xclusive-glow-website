import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description: "Contact the Xclusive Glow client care team.",
  path: "/contact",
});

// Mailto form: no backend/email service is configured yet (see README's
// outstanding client decisions), so this opens the visitor's mail client
// rather than silently pretending to submit somewhere.
const SUPPORT_EMAIL = "hello@xclusiveglow.com";

export default function ContactPage() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 lg:px-8">
      <p className="eyebrow">Client care</p>
      <h1 className="mt-4 font-serif text-5xl">How can we help?</h1>
      <p className="mt-6 text-muted-foreground">
        Send your order, styling or product enquiry and our team will get back to you at{" "}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
          {SUPPORT_EMAIL}
        </a>
        .
      </p>
      <form
        action={`mailto:${SUPPORT_EMAIL}`}
        method="post"
        encType="text/plain"
        className="mt-12 grid gap-6"
      >
        <label className="grid gap-2 text-sm">
          Name
          <input
            required
            name="name"
            className="h-12 border border-border bg-card px-4 outline-none focus:border-primary"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Email
          <input
            required
            type="email"
            name="email"
            className="h-12 border border-border bg-card px-4 outline-none focus:border-primary"
          />
        </label>
        <label className="grid gap-2 text-sm">
          Message
          <textarea
            required
            name="message"
            rows={6}
            className="border border-border bg-card p-4 outline-none focus:border-primary"
          />
        </label>
        <button
          type="submit"
          className="w-fit bg-primary px-6 py-3 text-xs font-medium uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/90"
        >
          Send message
        </button>
      </form>
    </section>
  );
}
