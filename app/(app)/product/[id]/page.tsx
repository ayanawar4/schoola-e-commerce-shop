"use client";
import { useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Star, ShoppingCart, ArrowLeft, Plus, Minus, X, Ruler } from "lucide-react";
import { useProduct, useStudents } from "@/lib/hooks/queries";
import { useCartStore } from "@/lib/store/cart";
import { useUiStore } from "@/lib/store/ui";
import { useAuthStore } from "@/lib/store/auth";
import { formatPrice, getProductImage, getLocalizedName, genderLabel, fixImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";

const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38", "40"];

const SIZE_GUIDE = {
  clothing: [
    { size: "XS",  age: "4–5",   chest: "56–58", waist: "52–54" },
    { size: "S",   age: "6–7",   chest: "60–62", waist: "56–58" },
    { size: "M",   age: "8–9",   chest: "64–66", waist: "60–62" },
    { size: "L",   age: "10–11", chest: "68–70", waist: "64–66" },
    { size: "XL",  age: "12–13", chest: "72–74", waist: "68–70" },
    { size: "XXL", age: "14–15", chest: "76–80", waist: "72–76" },
  ],
  pants: [
    { size: "28", waist: "71",  hip: "83" },
    { size: "30", waist: "76",  hip: "88" },
    { size: "32", waist: "81",  hip: "93" },
    { size: "34", waist: "86",  hip: "98" },
    { size: "36", waist: "91",  hip: "103" },
    { size: "38", waist: "96",  hip: "108" },
    { size: "40", waist: "101", hip: "113" },
  ],
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useUiStore();
  const { isAuthenticated } = useAuthStore();
  const { data: product, isLoading, error } = useProduct(id);
  const { data: students } = useStudents();
  const addItem = useCartStore((s) => s.addItem);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);

  const images = product?.images ?? [];
  const activeImg = images[activeImage];
  const primaryImage = activeImg
    ? typeof activeImg === "string"
      ? fixImageUrl(activeImg)
      : fixImageUrl(activeImg.url)
    : getProductImage(product ?? { images: [] });

  function handleAddToCart() {
    if (!product || !selectedSize) return;
    addItem(product, selectedSize, quantity);
    toast(locale === "ar" ? "تمت الإضافة إلى السلة" : "Added to cart", "success");
  }

  if (isLoading) return <ProductSkeleton />;
  if (error || !product) return (
    <div className="text-center py-20 text-gray-400">
      <p>{locale === "ar" ? "المنتج غير موجود" : "Product not found"}</p>
    </div>
  );

  const schoolName = product.school ? getLocalizedName(product.school.name, locale) : null;
  const isInStock = (product.stock ?? 1) > 0;
  const availableSizes = product.sizes && product.sizes.length > 0 ? product.sizes : DEFAULT_SIZES;
  const hasClothingSizes = availableSizes.some((s) => ["XS","S","M","L","XL","XXL"].includes(s));
  const hasPantsSizes = availableSizes.some((s) => ["28","30","32","34","36","38","40"].includes(s));

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-40 md:pb-10">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-white mb-4 text-sm font-medium">
        <ArrowLeft className="w-4 h-4" />
        {locale === "ar" ? "رجوع" : "Back"}
      </button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div className="space-y-3">
          <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800">
            <Image src={primaryImage} alt={getLocalizedName(product.name, locale)} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" priority />
            {!isInStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {locale === "ar" ? "نفذت الكمية" : "Out of Stock"}
                </span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {images.map((img, i) => {
                const thumbSrc = typeof img === "string" ? fixImageUrl(img) : fixImageUrl(img.url);
                return (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all",
                      i === activeImage ? "border-[#318B9B]" : "border-transparent"
                    )}
                  >
                    <Image src={thumbSrc} alt="" width={64} height={64} className="object-cover w-full h-full" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-4">
          {/* Chips */}
          <div className="flex flex-wrap gap-2">
            {schoolName && (
              <span className="text-xs font-medium bg-[#318B9B]/10 text-[#318B9B] px-3 py-1 rounded-full">
                {schoolName}
              </span>
            )}
            <span className={cn(
              "text-xs font-medium px-3 py-1 rounded-full",
              isInStock ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {isInStock ? (locale === "ar" ? "متاح" : "In Stock") : (locale === "ar" ? "غير متاح" : "Out of Stock")}
            </span>
            {product.gender && (
              <span className="text-xs font-medium bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                {genderLabel(product.gender, locale)}
              </span>
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{getLocalizedName(product.name, locale)}</h1>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold" style={{ color: "#318B9B" }}>
              {formatPrice(product.price)}
            </span>
            {product.rating && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-gray-800 dark:text-gray-200">{product.rating.toFixed(1)}</span>
                {product.reviews_count && (
                  <span className="text-gray-400">({product.reviews_count})</span>
                )}
              </div>
            )}
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl text-sm">
            {product.category && (
              <>
                <span className="text-gray-500">{locale === "ar" ? "الفئة" : "Category"}</span>
                <span className="font-medium text-gray-900 dark:text-white">{product.category}</span>
              </>
            )}
            {product.grade_level && (
              <>
                <span className="text-gray-500">{locale === "ar" ? "المرحلة" : "Grade"}</span>
                <span className="font-medium text-gray-900 dark:text-white">{product.grade_level}</span>
              </>
            )}
            <span className="text-gray-500">SKU</span>
            <span className="font-medium text-gray-900 dark:text-white font-mono text-xs">{product.sku}</span>
          </div>

          {/* Size selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {locale === "ar" ? "اختر المقاس" : "Select Size"} *
              </span>
              <button
                onClick={() => setSizeGuideOpen(true)}
                className="flex items-center gap-1 text-xs text-[#318B9B] font-medium hover:underline"
              >
                <Ruler className="w-3.5 h-3.5" />
                {locale === "ar" ? "دليل المقاسات" : "Size Guide"}
              </button>
            </div>

            {/* Student size hints */}
            {isAuthenticated && students && students.length > 0 && (
              <div className="mb-3 p-3 bg-[#318B9B]/5 rounded-xl border border-[#318B9B]/20">
                <p className="text-xs text-[#318B9B] font-medium mb-2">
                  {locale === "ar" ? "مقاسات طلابك" : "Your students' sizes"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {students.map((student) => {
                    const size = student.sizes?.shirt;
                    if (!size) return null;
                    return (
                      <button
                        key={student.id}
                        onClick={() => setSelectedSize(size)}
                        className="text-xs bg-white dark:bg-gray-800 border border-[#318B9B]/30 text-[#318B9B] px-3 py-1 rounded-full font-medium hover:bg-[#318B9B] hover:text-white transition-colors"
                      >
                        {student.name} — {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {availableSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size === selectedSize ? null : size)}
                  className={cn(
                    "min-w-[48px] py-2 px-3 rounded-xl border text-sm font-medium transition-all",
                    selectedSize === size
                      ? "bg-[#318B9B] text-white border-[#318B9B]"
                      : "border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-[#318B9B] hover:text-[#318B9B]"
                  )}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
              {locale === "ar" ? "الكمية" : "Quantity"}
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Minus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
              <span className="text-lg font-bold min-w-[32px] text-center text-gray-900 dark:text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <Plus className="w-4 h-4 text-gray-700 dark:text-gray-300" />
              </button>
            </div>
          </div>

          {/* Description */}
          {product.description && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                {locale === "ar" ? "الوصف" : "Description"}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Desktop add to cart */}
          <div className="hidden md:flex items-center gap-4 pt-2">
            <div>
              <div className="text-xs text-gray-500">{locale === "ar" ? "الإجمالي" : "Total"}</div>
              <div className="text-2xl font-bold text-[#318B9B]">{formatPrice(product.price * quantity)}</div>
            </div>
            <button
              disabled={!selectedSize || !isInStock}
              onClick={handleAddToCart}
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-white text-base transition-all",
                selectedSize && isInStock
                  ? "bg-[#318B9B] hover:bg-[#1a5f6b] active:scale-95"
                  : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
              )}
            >
              <ShoppingCart className="w-5 h-5" />
              {locale === "ar" ? "إضافة للسلة" : "Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar — sits above BottomNav (h-16) */}
      <div className="fixed bottom-16 start-0 end-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 p-3 md:hidden">
        <div className="flex items-center gap-3 max-w-4xl mx-auto">
          <div className="flex-shrink-0">
            <div className="text-xs text-gray-500">{locale === "ar" ? "الإجمالي" : "Total"}</div>
            <div className="text-base font-bold text-[#318B9B]">{formatPrice(product.price * quantity)}</div>
          </div>
          <button
            disabled={!selectedSize || !isInStock}
            onClick={handleAddToCart}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-white transition-all text-sm",
              selectedSize && isInStock
                ? "bg-[#318B9B] hover:bg-[#1a5f6b] active:scale-95"
                : "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
            )}
          >
            <ShoppingCart className="w-5 h-5" />
            {locale === "ar" ? "إضافة للسلة" : "Add to Cart"}
          </button>
        </div>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSizeGuideOpen(false)} />
          <div className="relative bg-white dark:bg-gray-900 w-full md:max-w-lg md:rounded-2xl rounded-t-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900">
              <div className="flex items-center gap-2">
                <Ruler className="w-5 h-5 text-[#318B9B]" />
                <h2 className="font-bold text-gray-900 dark:text-white">
                  {locale === "ar" ? "دليل المقاسات" : "Size Guide"}
                </h2>
              </div>
              <button onClick={() => setSizeGuideOpen(false)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="p-4 space-y-5">
              {(hasClothingSizes || !hasPantsSizes) && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {locale === "ar" ? "قمصان / جاكيت" : "Shirts / Jackets"} <span className="text-xs font-normal text-gray-400">(cm)</span>
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <table className="w-full text-sm">
                      <thead className="bg-[#318B9B]/10 text-[#318B9B]">
                        <tr>
                          <th className="py-2 px-3 text-start font-semibold">{locale === "ar" ? "المقاس" : "Size"}</th>
                          <th className="py-2 px-3 text-start font-semibold">{locale === "ar" ? "العمر" : "Age"}</th>
                          <th className="py-2 px-3 text-start font-semibold">{locale === "ar" ? "الصدر" : "Chest"}</th>
                          <th className="py-2 px-3 text-start font-semibold">{locale === "ar" ? "الخصر" : "Waist"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SIZE_GUIDE.clothing.map((row, i) => (
                          <tr key={row.size} className={cn("border-t border-gray-100 dark:border-gray-800", i % 2 === 0 ? "" : "bg-gray-50 dark:bg-gray-800/50")}>
                            <td className="py-2 px-3 font-bold text-gray-900 dark:text-white">{row.size}</td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{row.age}</td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{row.chest}</td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{row.waist}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {hasPantsSizes && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    {locale === "ar" ? "بناطيل / تنانير" : "Pants / Skirts"} <span className="text-xs font-normal text-gray-400">(cm)</span>
                  </h3>
                  <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                    <table className="w-full text-sm">
                      <thead className="bg-[#318B9B]/10 text-[#318B9B]">
                        <tr>
                          <th className="py-2 px-3 text-start font-semibold">{locale === "ar" ? "المقاس" : "Size"}</th>
                          <th className="py-2 px-3 text-start font-semibold">{locale === "ar" ? "الخصر" : "Waist"}</th>
                          <th className="py-2 px-3 text-start font-semibold">{locale === "ar" ? "الحوض" : "Hip"}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SIZE_GUIDE.pants.map((row, i) => (
                          <tr key={row.size} className={cn("border-t border-gray-100 dark:border-gray-800", i % 2 === 0 ? "" : "bg-gray-50 dark:bg-gray-800/50")}>
                            <td className="py-2 px-3 font-bold text-gray-900 dark:text-white">{row.size}</td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{row.waist}</td>
                            <td className="py-2 px-3 text-gray-600 dark:text-gray-400">{row.hip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              <p className="text-xs text-gray-400 pb-2">
                {locale === "ar"
                  ? "* المقاسات تقريبية. قد تختلف حسب المصنّع."
                  : "* Measurements are approximate and may vary by manufacturer."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid md:grid-cols-2 gap-8 animate-pulse">
      <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      <div className="space-y-4">
        <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-8 w-3/4 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-6 w-1/3 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="flex gap-2">{[...Array(6)].map((_, i) => <div key={i} className="w-12 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl" />)}</div>
      </div>
    </div>
  );
}
