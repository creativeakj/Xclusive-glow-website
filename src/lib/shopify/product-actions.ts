"use server";

import { getProductByHandle } from "./products";
import type { Product } from "./types";

export async function getProductForQuickView(handle: string): Promise<Product | null> {
  return getProductByHandle(handle);
}
