"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
import { useCartStore, TAX_RATE, SHIPPING_FEE } from "@/lib/store/cart";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { formatPrice, getProductImage, getLocalizedName } from "@/lib/utils";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const { locale } = useUiStore();
  const router = useRouter();

  const sub = subtotal();
  const tax = sub * TAX_RATE;
  const total = sub + tax + (sub > 0 ? SHIPPING_FEE : 0);

  function handleCheckout() {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=/checkout");
    } else {
      router.push("/checkout");
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {locale === "ar" ? "سلتك فارغة" : "Your cart is empty"}
        </h2>
        <p className="text-gray-400 mb-6">
          {locale === "ar" ? "أضف منتجات للمتابعة" : "Add some products to continue"}
        </p>
        <Link
          href="/uniforms"
          className="inline-flex items-center gap-2 bg-[#318B9B] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#1a5f6b] transition-colors"
        >
          {locale === "ar" ? "تسوق الآن" : "Shop Now"}
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {locale === "ar" ? "سلة التسوق" : "Shopping Cart"}
        <span className="ms-2 text-sm font-normal text-gray-400">({items.length})</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Items */}
        <div className="md:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex gap-4">
              <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                <Image
                  src={getProductImage(item.product)}
                  alt={getLocalizedName(item.product.name, locale)}
                  fill
                  className="object-cover"
                  sizes="80px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{getLocalizedName(item.product.name, locale)}</p>
                {item.size && (
                  <p className="text-xs text-gray-500 mt-0.5">
                    {locale === "ar" ? "المقاس:" : "Size:"} {item.size}
                  </p>
                )}
                <p className="text-sm font-bold text-[#318B9B] mt-1">{formatPrice(item.product.price)}</p>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Minus className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium text-gray-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-6 h-6 flex items-center justify-center rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Plus className="w-3 h-3 text-gray-700 dark:text-gray-300" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <span className="ms-auto text-sm font-bold text-gray-900 dark:text-white">
                    {formatPrice(item.product.price * item.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 h-fit space-y-3">
          <h2 className="font-bold text-gray-900 dark:text-white text-base">
            {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
          </h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatPrice(sub)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{locale === "ar" ? "ضريبة القيمة المضافة (15%)" : "VAT (15%)"}</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between text-gray-600 dark:text-gray-400">
              <span>{locale === "ar" ? "رسوم الشحن" : "Shipping"}</span>
              <span className="font-medium text-gray-900 dark:text-white">{formatPrice(SHIPPING_FEE)}</span>
            </div>
            <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold text-base">
              <span className="text-gray-900 dark:text-white">{locale === "ar" ? "الإجمالي" : "Total"}</span>
              <span className="text-[#318B9B]">{formatPrice(total)}</span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full bg-[#318B9B] text-white font-bold py-3.5 rounded-2xl hover:bg-[#1a5f6b] transition-colors active:scale-95"
          >
            {locale === "ar" ? "إتمام الطلب" : "Proceed to Checkout"}
          </button>
          <Link
            href="/uniforms"
            className="block text-center text-sm text-[#318B9B] hover:underline"
          >
            {locale === "ar" ? "مواصلة التسوق" : "Continue Shopping"}
          </Link>
        </div>
      </div>
    </div>
  );
}
