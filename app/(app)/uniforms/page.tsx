"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, SlidersHorizontal, Star, X } from "lucide-react";
import { useCatalog, useSchools } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { useProductCache } from "@/lib/store/productCache";
import { formatPrice, getProductImage, getLocalizedName } from "@/lib/utils";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Shirts", "Pants", "Skirts", "Shoes", "Jackets", "Dresses", "Ties", "Bags"];
const GENDERS = [
  { value: "male", ar: "ولادي", en: "Boys" },
  { value: "female", ar: "بنادي", en: "Girls" },
  { value: "unisex", ar: "مختلط", en: "Unisex" },
];

export default function UniformsPage() {
  const { locale } = useUiStore();
  const [search, setSearch] = useState("");
  const [schoolId, setSchoolId] = useState<number | undefined>();
  const [category, setCategory] = useState<string | undefined>();
  const [gender, setGender] = useState<string | undefined>();
  const [showFilters, setShowFilters] = useState(false);

  // Fetch just 1 school to get the first ID for the catalog — no 422, no blocking
  const { data: firstSchoolData } = useSchools({ per_page: 1 });
  // Fetch full list only when the filter panel is open
  const { data: allSchoolsData } = useSchools({ per_page: 50 });

  const { data, isLoading: isLoadingCatalog } = useCatalog({ search: search || undefined, school_id: schoolId, category, gender, per_page: 30 });

  const products = data?.data ?? [];
  const schools = allSchoolsData?.data ?? [];
  const firstSchoolId = firstSchoolData?.data?.[0]?.id;
  const isLoading = isLoadingCatalog || (!schoolId && !firstSchoolId);

  // Auto-select first school from the fast per_page=1 call
  useEffect(() => {
    if (!schoolId && firstSchoolId) setSchoolId(firstSchoolId);
  }, [firstSchoolId, schoolId]);

  // Only count manually-changed filters (not the auto-selected first school)
  const hasFilters = !!(category || gender || (schoolId && schoolId !== firstSchoolId));

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {locale === "ar" ? "الزي المدرسي" : "Uniforms"}
        </h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors",
            hasFilters
              ? "bg-[#318B9B] text-white border-[#318B9B]"
              : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
          )}
        >
          <SlidersHorizontal className="w-4 h-4" />
          {locale === "ar" ? "تصفية" : "Filter"}
          {hasFilters && <span className="w-2 h-2 rounded-full bg-white" />}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={locale === "ar" ? "ابحث عن منتج..." : "Search products..."}
          className="w-full ps-10 pe-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute end-3 top-1/2 -translate-y-1/2">
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 mb-4 space-y-4">
          {/* School */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
              {locale === "ar" ? "المدرسة" : "School"}
            </label>
            <select
              value={schoolId ?? ""}
              onChange={(e) => setSchoolId(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30"
            >
              <option value="">{locale === "ar" ? "كل المدارس" : "All Schools"}</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>{getLocalizedName(s.name, locale)}</option>
              ))}
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
              {locale === "ar" ? "النوع" : "Gender"}
            </label>
            <div className="flex gap-2">
              {GENDERS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGender(gender === g.value ? undefined : g.value)}
                  className={cn(
                    "flex-1 py-2 rounded-lg text-sm font-medium border transition-colors",
                    gender === g.value
                      ? "bg-[#318B9B] text-white border-[#318B9B]"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  {g[locale]}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2 block">
              {locale === "ar" ? "الفئة" : "Category"}
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(category === cat ? undefined : cat)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
                    category === cat
                      ? "bg-[#7C3AED] text-white border-[#7C3AED]"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {hasFilters && (
            <button
              onClick={() => { setSchoolId(firstSchoolId); setCategory(undefined); setGender(undefined); }}
              className="text-sm text-red-500 hover:text-red-700 font-medium"
            >
              {locale === "ar" ? "مسح التصفية" : "Clear Filters"}
            </button>
          )}
        </div>
      )}

      {/* Results count */}
      {!isLoading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {products.length} {locale === "ar" ? "منتج" : "products"}
        </p>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-72 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
          <p className="font-medium">{locale === "ar" ? "لا توجد منتجات" : "No products found"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, locale }: { product: any; locale: "ar" | "en" }) {
  const cacheProduct = useProductCache((s) => s.set);
  return (
    <Link
      href={`/product/${product.id}`}
      onClick={() => cacheProduct(product)}
      className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all hover:-translate-y-0.5 group"
    >
      <div className="relative h-44 bg-gray-100 dark:bg-gray-800">
        <Image
          src={getProductImage(product)}
          alt={getLocalizedName(product.name, locale)}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 50vw, 33vw"
        />
        {product.category && (
          <span className="absolute top-2 start-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#7C3AED]/90 text-white">
            {product.category}
          </span>
        )}
        {product.rating && (
          <div className="absolute bottom-2 end-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-bold text-amber-600">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </div>
        )}
      </div>
      <div className="p-3">
        {product.school && (
          <p className="text-xs text-gray-400 dark:text-gray-500 truncate mb-1">
            {getLocalizedName(product.school.name, locale)}
          </p>
        )}
        <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2 leading-snug">{getLocalizedName(product.name, locale)}</p>
        <p className="text-sm font-bold mt-2" style={{ color: "#318B9B" }}>
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
