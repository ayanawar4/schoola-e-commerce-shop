"use client";
import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight, ChevronLeft } from "lucide-react";
import { useCatalog, useSchools } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { useProductCache } from "@/lib/store/productCache";
import { formatPrice, getProductImage, getLocalizedName } from "@/lib/utils";

export function BestSellers() {
  const { locale } = useUiStore();
  const cacheProduct = useProductCache((s) => s.set);
  const { data: schoolsData } = useSchools({ per_page: 1 });
  const firstSchoolId = schoolsData?.data?.[0]?.id;
  const { data, isLoading } = useCatalog({ per_page: 10, school_id: firstSchoolId });
  const products = data?.data ?? [];
  const ChevronIcon = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-base font-bold text-gray-900 dark:text-white">
          {locale === "ar" ? "الأكثر مبيعاً" : "Best Sellers"}
        </h2>
        <Link href="/uniforms" className="flex items-center gap-0.5 text-sm font-medium text-[#318B9B] hover:underline">
          {locale === "ar" ? "الكل" : "See all"}
          <ChevronIcon className="w-4 h-4" />
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide -mx-4 px-4">
        {isLoading
          ? [...Array(5)].map((_, i) => (
              <div key={i} className="min-w-[150px] h-52 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse flex-shrink-0" />
            ))
          : products.map((product) => (
              <Link
                key={product.id}
                href={`/product/${product.id}`}
                onClick={() => cacheProduct(product)}
                className="group min-w-[148px] flex-shrink-0 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5"
              >
                <div className="relative h-36 bg-gray-50 dark:bg-gray-800 overflow-hidden">
                  <Image
                    src={getProductImage(product)}
                    alt={getLocalizedName(product.name, locale)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="150px"
                  />
                  {product.rating && (
                    <div className="absolute top-2 start-2 flex items-center gap-0.5 bg-white/95 rounded-full px-1.5 py-0.5 text-[10px] font-bold text-amber-500 shadow-sm">
                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                      {product.rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="p-2.5">
                  {product.school && (
                    <p className="text-[10px] text-gray-400 truncate mb-0.5">
                      {getLocalizedName(product.school.name, locale)}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-100 line-clamp-2 leading-snug">
                    {getLocalizedName(product.name, locale)}
                  </p>
                  <p className="text-sm font-extrabold text-[#318B9B] mt-1.5">
                    {formatPrice(product.price)}
                  </p>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
}
