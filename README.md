# Xclusive Glow

Headless e-commerce storefront: Next.js (App Router, TypeScript) + Shopify
(Storefront API for catalog/cart, Customer Account API for authenticated
accounts) + Blanka fulfillment via Shopify + Vercel hosting. No application
database — Shopify is the single source of truth for commerce data. See the
full architecture and scope in the project PRD.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in real values, see below
npm run dev
```

Open <http://localhost:3000>.

## Environment variables

All variables are documented in [.env.example](.env.example). Summary:

| Variable | Purpose |
| --- | --- |
| `SHOPIFY_STORE_DOMAIN` | `*.myshopify.com` domain used for the Storefront API |
| `SHOPIFY_STOREFRONT_API_TOKEN` | Public Storefront API access token (catalog + cart) |
| `SHOPIFY_STOREFRONT_API_VERSION` | Storefront API version, e.g. `2025-01` |
| `SHOPIFY_SHOP_ID` | Numeric shop id, used for Customer Account API OAuth endpoints |
| `SHOPIFY_CUSTOMER_ACCOUNT_API_CLIENT_ID` | Client id of the Customer Account API application |
| `SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION` | Customer Account API version |
| `SHOPIFY_CUSTOMER_ACCOUNT_REDIRECT_URI` | Must match a redirect URI registered on that application (`/account/callback`) |
| `SESSION_SECRET` | Random 32+ byte secret that encrypts the customer session cookie |
| `NEXT_PUBLIC_SITE_URL` | Public site URL, used for OAuth logout redirect |

Until the Storefront variables are set, catalog/cart pages render a
"not configured" placeholder instead of failing the build. Until the
Customer Account variables are set, `/account/login` returns a clear error
rather than a broken redirect.

**Never commit real values** — `.env.local` is gitignored; `.env.example`
should only ever contain placeholders.

## Architecture

- `src/lib/shopify/` — the entire Shopify integration layer:
  - `storefront-client.ts`, `products.ts`, `cart.ts`, `cart-actions.ts`, `cart-query.ts` — Storefront API (catalog, cart). Cart id is stored in a cookie; no server-side cart state.
  - `customer-auth.ts`, `customer-session*.ts`, `customer-account-client.ts`, `customer.ts` — Customer Account API OAuth (Authorization Code + PKCE) and authenticated customer/order queries.
  - `env.ts` — reads/validates configuration; nothing here is a secret store, it just centralizes `process.env` access.
- `src/proxy.ts` — guards `/account/*`: redirects to `/account/login` when there's no session, and silently refreshes the access token (via the stored refresh token) when it's close to expiring. This exists because Next.js only allows writing cookies from a Route Handler, Server Action, or Proxy — not during page rendering.
- `src/app/account/login`, `/callback`, `/logout` — the three OAuth route handlers.
- `src/components/` — presentation only; no direct Shopify calls (all data comes from Server Components in `app/`).

All Shopify credentials are read server-side only (`import "server-only"` enforces this at build time) and never sent to the browser.

## Design system

The storefront follows a luxury beauty/fashion visual direction (cream
background, maroon primary, gold accent, serif display headings) defined in
`src/app/globals.css` (Tailwind v4 `@theme` tokens) and loaded fonts in
`src/app/layout.tsx` (Instrument Serif + Work Sans). Nav departments (Beauty,
Women, Men, Kids) link to Shopify collections at `/collections/<handle>` —
create matching collections in Shopify Admin with handles `beauty`, `women`,
`men`, `kids` for those to resolve.

**Photography is currently placeholder** (`src/components/placeholder-art.tsx`,
a gradient block) — no real campaign images were available while building
this. Swap it for `next/image` once brand photography exists for: the
homepage hero, the four department tiles, the promo banner, and the story
section.

## Known assumption to verify before launch

The Customer Account API OAuth endpoints and GraphQL field names in
`customer-auth.ts` and `customer.ts` follow Shopify's publicly documented
Customer Account API shape, but that API evolves independently of this
codebase and wasn't tested against a live store while scaffolding this
project (no Shopify credentials were available yet). Before relying on
customer login/orders in production, verify the endpoints and query fields
against the current Shopify docs / GraphQL explorer for the configured
`SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION`.

## Outstanding client decisions (from the PRD)

These block a production launch and should be confirmed before Phase 6/7:

- [ ] Final brand/domain name and domain ownership/access
- [ ] Final approved UI/UX designs (current pages use placeholder styling)
- [ ] Shopify store plan confirmed to support the Customer Account API and (if wanted) a checkout subdomain
- [ ] Payment provider / Shopify payment configuration
- [ ] Shipping/delivery rules and service areas
- [ ] Blanka connected and configured with Shopify
- [ ] Transactional sender email (e.g. `orders@brandname.com`) and its hosting provider
- [ ] Final list of storefront pages/features included in the approved design

## Deployment

Deploys to Vercel. Set the same environment variables above in the Vercel
project settings (per environment). Do not commit secrets to source control.
