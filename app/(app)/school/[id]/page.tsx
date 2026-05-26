"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import { useSchool, useCatalog } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { useProductCache } from "@/lib/store/productCache";
import { formatPrice, getLocalizedName, getProductImage, getInitials, fixImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function SchoolDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useUiStore();
  const cacheProduct = useProductCache((s) => s.set);
  const { data: school, isLoading: loadingSchool } = useSchool(id);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);

  const { data: catalog, isLoading: loadingProducts } = useCatalog({
    school_id: Number(id),
    grade_level: selectedGrade ?? undefined,
    per_page: 50,
  });
  const products = catalog?.data ?? [];

  if (loadingSchool) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6 animate-pulse space-y-4">
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="flex gap-2">{[...Array(4)].map((_, i) => <div key={i} className="h-8 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />)}</div>
        <div className="grid grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  if (!school) return (
    <div className="text-center py-20 text-gray-400">
      <p>{locale === "ar" ? "المدرسة غير موجودة" : "School not found"}</p>
    </div>
  );

  const schoolName = getLocalizedName(school.name, locale);
  const grades = school.grades ?? [];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-sm font-medium mb-4">
        <ArrowLeft className="w-4 h-4" />
        {locale === "ar" ? "رجوع" : "Back"}
      </button>

      {/* School card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 mb-5 flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0 overflow-hidden"
          style={{ background: school.logo_url ? "transparent" : "#0D9488" }}
        >
          {school.logo_url
            ? <Image src={fixImageUrl(school.logo_url)} alt={schoolName} width={64} height={64} className="w-full h-full object-contain" />
            : getInitials(schoolName)
          }
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{schoolName}</h1>
          {school.curriculum && (
            <span className="inline-block mt-1 text-xs bg-[#0D9488]/10 text-[#0D9488] px-3 py-0.5 rounded-full font-medium">
              {school.curriculum}
            </span>
          )}
          {school.address && (
            <div className="flex items-center gap-1.5 mt-2 text-xs text-gray-400">
              <MapPin className="w-3.5 h-3.5" />
              {school.address}
            </div>
          )}
          {school.products_count != null && (
            <p className="mt-1 text-xs text-gray-400">{school.products_count} {locale === "ar" ? "منتج" : "products"}</p>
          )}
        </div>
      </div>

      {/* Grade tabs */}
      {grades.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 mb-5">
          <button
            onClick={() => setSelectedGrade(null)}
            className={cn(
              "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors",
              selectedGrade === null
                ? "bg-[#0D9488] text-white border-[#0D9488]"
                : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
            )}
          >
            {locale === "ar" ? "الكل" : "All"}
          </button>
          {grades.map((grade) => (
            <button
              key={grade}
              onClick={() => setSelectedGrade(selectedGrade === grade ? null : grade)}
              className={cn(
                "flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold border transition-colors",
                selectedGrade === grade
                  ? "bg-[#0D9488] text-white border-[#0D9488]"
                  : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              )}
            >
              {grade}
            </button>
          ))}
        </div>
      )}

      {/* Products */}
      <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
        {selectedGrade
          ? `${locale === "ar" ? "زي" : "Uniforms —"} ${selectedGrade}`
          : locale === "ar" ? "الزي المدرسي" : "School Uniforms"}
      </h2>

      {loadingProducts ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">
            {selectedGrade
              ? (locale === "ar" ? "لا توجد منتجات لهذه المرحلة" : "No uniforms for this grade yet")
              : (locale === "ar" ? "لا توجد منتجات لهذه المدرسة بعد" : "No products for this school yet")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {products.map((product) => (
            <Link
              key={product.id}
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
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
                {product.rating && (
                  <div className="absolute bottom-2 end-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm rounded-full px-2 py-0.5 text-xs font-bold text-amber-600">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    {product.rating.toFixed(1)}
                  </div>
                )}
                {product.grade_level && (
                  <span className="absolute top-2 start-2 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#0D9488]/90 text-white">
                    {product.grade_level}
                  </span>
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-semibold text-gray-900 dark:text-white line-clamp-2">{getLocalizedName(product.name, locale)}</p>
                <p className="text-sm font-bold mt-1.5" style={{ color: "#318B9B" }}>{formatPrice(product.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
