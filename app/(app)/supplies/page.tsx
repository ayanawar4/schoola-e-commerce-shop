"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Search, X, Star } from "lucide-react";
import { useCatalog } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { formatPrice, getProductImage, getLocalizedName } from "@/lib/utils";
import { ComingSoon } from "@/components/ui/ComingSoon";

const SUPPLY_CATEGORIES = ["Pens", "Notebooks", "Bags", "Art Supplies", "Calculators", "Rulers", "Scissors", "Erasers"];

export default function SuppliesPage() {
  const { locale } = useUiStore();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | undefined>();

  const { data, isLoading } = useCatalog({ search: search || undefined, category, per_page: 30 });
  const products = data?.data ?? [];

  return (
    <div className="relative max-w-7xl mx-auto px-4 py-6">
      <ComingSoon
        icon="📚"
        color="#059669"
        messageAr="نعمل على إطلاق خاصية الأدوات المدرسية قريباً. ترقّبوا!"
        messageEn="We're working on launching School Supplies. Stay tuned!"
      />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {locale === "ar" ? "الأدوات المدرسية" : "School Supplies"}
      </h1>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={locale === "ar" ? "ابحث عن أداة..." : "Search supplies..."}
          className="w-full ps-10 pe-10 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
        />
        {search && <button onClick={() => setSearch("")} className="absolute end-3 top-1/2 -translate-y-1/2"><X className="w-4 h-4 text-gray-400" /></button>}
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4 -mx-4 px-4">
        <button
          onClick={() => setCategory(undefined)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${!category ? "bg-[#059669] text-white border-[#059669]" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"}`}
        >
          {locale === "ar" ? "الكل" : "All"}
        </button>
        {SUPPLY_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(category === cat ? undefined : cat)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors ${category === cat ? "bg-[#059669] text-white border-[#059669]" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p>{locale === "ar" ? "لا توجد أدوات" : "No supplies found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group"
            >
              <div className="relative h-44 bg-[#059669]/5">
                <Image
                  src={getProductImage(product)}
                  alt={product.name as string}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {product.category && (
                  <span className="absolute top-2 start-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#059669]/90 text-white">
                    {product.category}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{getLocalizedName(product.name, locale)}</p>
                <p className="text-sm font-bold mt-1.5 text-[#059669]">{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
