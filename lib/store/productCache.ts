import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types";

interface ProductCacheStore {
  cache: Record<number, Product>;
  set: (product: Product) => void;
}

export const useProductCache = create<ProductCacheStore>()(
  persist(
    (set) => ({
      cache: {},
      set: (product) =>
        set((s) => ({ cache: { ...s.cache, [product.id]: product } })),
    }),
    { name: "product-cache" }
  )
);
