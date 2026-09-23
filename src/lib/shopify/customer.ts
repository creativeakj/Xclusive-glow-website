import "server-only";
import { customerAccountFetch } from "./customer-account-client";
import type { Money } from "./types";

/**
 * Customer Account API queries. Field names follow Shopify's documented
 * Customer Account API schema — before launch, verify these against the
 * live schema (Shopify Admin > Settings > Customer accounts > API
 * explorer) for the configured SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION, since
 * this schema evolves independently of the Next.js app.
 */

export type CustomerProfile = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: string | null;
  phoneNumber: string | null;
};

type RawCustomer = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  emailAddress: { emailAddress: string } | null;
  phoneNumber: { phoneNumber: string } | null;
};

const GET_CUSTOMER_QUERY = /* GraphQL */ `
  query GetCustomer {
    customer {
      id
      firstName
      lastName
      emailAddress {
        emailAddress
      }
      phoneNumber {
        phoneNumber
      }
    }
  }
`;

export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  const data = await customerAccountFetch<{ customer: RawCustomer | null }>(
    GET_CUSTOMER_QUERY
  );
  if (!data?.customer) return null;

  return {
    id: data.customer.id,
    firstName: data.customer.firstName,
    lastName: data.customer.lastName,
    emailAddress: data.customer.emailAddress?.emailAddress ?? null,
    phoneNumber: data.customer.phoneNumber?.phoneNumber ?? null,
  };
}

export type CustomerAddress = {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  country: string | null;
  isDefault: boolean;
};

type RawAddress = {
  id: string;
  address1: string | null;
  address2: string | null;
  city: string | null;
  province: string | null;
  zip: string | null;
  territoryCode: string | null;
};

type RawCustomerAddresses = {
  defaultAddress: { id: string } | null;
  addresses: { nodes: RawAddress[] };
};

const GET_CUSTOMER_ADDRESSES_QUERY = /* GraphQL */ `
  query GetCustomerAddresses {
    customer {
      defaultAddress {
        id
      }
      addresses(first: 20) {
        nodes {
          id
          address1
          address2
          city
          province
          zip
          territoryCode
        }
      }
    }
  }
`;

export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  const data = await customerAccountFetch<{
    customer: RawCustomerAddresses | null;
  }>(GET_CUSTOMER_ADDRESSES_QUERY);
  if (!data?.customer) return [];

  const defaultId = data.customer.defaultAddress?.id;
  return data.customer.addresses.nodes.map((address) => ({
    id: address.id,
    address1: address.address1,
    address2: address.address2,
    city: address.city,
    province: address.province,
    zip: address.zip,
    country: address.territoryCode ?? null,
    isDefault: address.id === defaultId,
  }));
}

export type OrderListItem = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillmentStatus: string | null;
  totalPrice: Money;
};

type RawOrderListItem = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  fulfillments: { nodes: { status: string | null }[] };
  totalPrice: Money;
};

const GET_ORDERS_QUERY = /* GraphQL */ `
  query GetCustomerOrders($first: Int!) {
    customer {
      orders(first: $first, sortKey: PROCESSED_AT, reverse: true) {
        nodes {
          id
          name
          processedAt
          financialStatus
          fulfillments(first: 1) {
            nodes {
              status
            }
          }
          totalPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`;

export async function getCustomerOrders(first = 20): Promise<OrderListItem[]> {
  const data = await customerAccountFetch<{
    customer: { orders: { nodes: RawOrderListItem[] } } | null;
  }>(GET_ORDERS_QUERY, { first });
  if (!data?.customer) return [];

  return data.customer.orders.nodes.map((order) => ({
    id: order.id,
    name: order.name,
    processedAt: order.processedAt,
    financialStatus: order.financialStatus ?? null,
    fulfillmentStatus: order.fulfillments?.nodes?.[0]?.status ?? null,
    totalPrice: order.totalPrice,
  }));
}

export type OrderLineItem = {
  /** Product name, falling back to the line item's own title for custom
   *  (non-product) line items — see normalization for why both are fetched. */
  title: string;
  quantity: number;
  variantTitle: string | null;
  price: Money;
  image: { url: string; altText: string | null } | null;
};

export type OrderFulfillment = {
  status: string | null;
  trackingNumber: string | null;
  trackingUrl: string | null;
  carrier: string | null;
};

export type OrderDetail = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  totalPrice: Money;
  subtotal: Money | null;
  totalShipping: Money | null;
  totalTax: Money | null;
  lineItems: OrderLineItem[];
  fulfillments: OrderFulfillment[];
};

type RawTrackingInfo = {
  number: string | null;
  url: string | null;
  company: string | null;
};

type RawOrder = {
  id: string;
  name: string;
  processedAt: string;
  financialStatus: string | null;
  totalPrice: Money;
  subtotal: Money | null;
  totalShipping: Money | null;
  totalTax: Money | null;
  lineItems: {
    nodes: {
      // `title` only applies to custom (non-product) line items per Shopify's
      // schema docs — `name` is "the name of the product" and is what real
      // orders actually populate. Fetch both, prefer `name`.
      title: string;
      name: string | null;
      quantity: number;
      variantTitle: string | null;
      price: Money;
      image: { url: string; altText: string | null } | null;
    }[];
  };
  fulfillments: {
    nodes: {
      status: string | null;
      trackingInformation: RawTrackingInfo[] | null;
    }[];
  } | null;
};

const GET_ORDER_QUERY = /* GraphQL */ `
  query GetCustomerOrder($id: ID!) {
    order(id: $id) {
      id
      name
      processedAt
      financialStatus
      totalPrice {
        amount
        currencyCode
      }
      subtotal {
        amount
        currencyCode
      }
      totalShipping {
        amount
        currencyCode
      }
      totalTax {
        amount
        currencyCode
      }
      lineItems(first: 50) {
        nodes {
          title
          name
          quantity
          variantTitle
          price {
            amount
            currencyCode
          }
          image {
            url
            altText
          }
        }
      }
      fulfillments(first: 10) {
        nodes {
          status
          trackingInformation {
            number
            url
            company
          }
        }
      }
    }
  }
`;

export async function getCustomerOrder(id: string): Promise<OrderDetail | null> {
  const data = await customerAccountFetch<{ order: RawOrder | null }>(
    GET_ORDER_QUERY,
    { id }
  );
  if (!data?.order) return null;

  const order = data.order;
  return {
    id: order.id,
    name: order.name,
    processedAt: order.processedAt,
    financialStatus: order.financialStatus ?? null,
    totalPrice: order.totalPrice,
    subtotal: order.subtotal ?? null,
    totalShipping: order.totalShipping ?? null,
    totalTax: order.totalTax ?? null,
    lineItems: order.lineItems.nodes.map((item) => ({
      title: item.name || item.title,
      quantity: item.quantity,
      variantTitle: item.variantTitle ?? null,
      price: item.price,
      image: item.image ?? null,
    })),
    fulfillments: (order.fulfillments?.nodes ?? []).flatMap((f) => {
      const trackingEntries: (RawTrackingInfo | null)[] = f.trackingInformation
        ?.length
        ? f.trackingInformation
        : [null];
      return trackingEntries.map((tracking) => ({
        status: f.status ?? null,
        trackingNumber: tracking?.number ?? null,
        trackingUrl: tracking?.url ?? null,
        carrier: tracking?.company ?? null,
      }));
    }),
  };
}
