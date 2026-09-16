import type {
  Cart,
  CartLine,
  Money,
  Product,
  ProductListItem,
  ProductOption,
  ProductVariant,
  SelectedOption,
  ShopifyImage,
} from "./types";

type RawImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
} | null;

function normalizeImage(image: RawImage): ShopifyImage | null {
  if (!image) return null;
  return {
    url: image.url,
    altText: image.altText,
    width: image.width,
    height: image.height,
  };
}

export type RawProductListItem = {
  id: string;
  handle: string;
  title: string;
  availableForSale: boolean;
  featuredImage: RawImage;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  variants: { nodes: { id: string; availableForSale: boolean }[] };
};

export function normalizeProductListItem(
  raw: RawProductListItem
): ProductListItem {
  const firstVariant = raw.variants.nodes[0] ?? null;

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    availableForSale: raw.availableForSale,
    featuredImage: normalizeImage(raw.featuredImage),
    priceRange: raw.priceRange,
    quickAddVariantId: firstVariant?.id ?? null,
    quickAddAvailable: firstVariant?.availableForSale ?? false,
    hasMultipleVariants: raw.variants.nodes.length > 1,
  };
}

export type RawProduct = Omit<RawProductListItem, "variants"> & {
  description: string;
  descriptionHtml: string;
  images: { nodes: RawImage[] };
  options: {
    id: string;
    name: string;
    optionValues: { name: string }[];
  }[];
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      selectedOptions: SelectedOption[];
      price: Money;
      compareAtPrice: Money | null;
      image: RawImage;
    }[];
  };
  seo: { title: string | null; description: string | null } | null;
};

export function normalizeProduct(raw: RawProduct): Product {
  const options: ProductOption[] = raw.options.map((opt) => ({
    id: opt.id,
    name: opt.name,
    values: opt.optionValues.map((v) => v.name),
  }));

  const variants: ProductVariant[] = raw.variants.nodes.map((variant) => ({
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    selectedOptions: variant.selectedOptions ?? [],
    price: variant.price,
    compareAtPrice: variant.compareAtPrice ?? null,
    image: normalizeImage(variant.image),
  }));

  return {
    id: raw.id,
    handle: raw.handle,
    title: raw.title,
    description: raw.description,
    descriptionHtml: raw.descriptionHtml,
    availableForSale: raw.availableForSale,
    featuredImage: normalizeImage(raw.featuredImage),
    images: raw.images.nodes.map((img) => normalizeImage(img)!),
    options,
    variants,
    priceRange: raw.priceRange,
    seo: {
      title: raw.seo?.title ?? null,
      description: raw.seo?.description ?? null,
    },
  };
}

type RawCartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: SelectedOption[];
    image: RawImage;
    product: { handle: string; title: string };
  };
};

export function normalizeCartLine(raw: RawCartLine): CartLine {
  return {
    id: raw.id,
    quantity: raw.quantity,
    cost: raw.cost,
    merchandise: {
      id: raw.merchandise.id,
      title: raw.merchandise.title,
      selectedOptions: raw.merchandise.selectedOptions ?? [],
      image: normalizeImage(raw.merchandise.image),
      product: raw.merchandise.product,
    },
  };
}

export type RawCart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: Cart["cost"];
  lines: { nodes: RawCartLine[] };
};

export function normalizeCart(raw: RawCart): Cart {
  return {
    id: raw.id,
    checkoutUrl: raw.checkoutUrl,
    totalQuantity: raw.totalQuantity,
    cost: raw.cost,
    lines: raw.lines.nodes.map(normalizeCartLine),
  };
}
