"use client";
import Link from "next/link";
import { Package, ChevronRight, ChevronLeft } from "lucide-react";
import { useOrders } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { formatPrice, statusLabel, statusColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function OrdersPage() {
  const { locale } = useUiStore();
  const { data: orders, isLoading } = useOrders();
  const ChevronIcon = locale === "ar" ? ChevronLeft : ChevronRight;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {locale === "ar" ? "طلباتي" : "My Orders"}
      </h1>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : !orders || orders.length === 0 ? (
        <div className="text-center py-16">
          <Package className="w-14 h-14 mx-auto mb-4 text-gray-300 dark:text-gray-600" />
          <p className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
            {locale === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
          </p>
          <p className="text-sm text-gray-400 mb-6">
            {locale === "ar" ? "تسوق الآن وابدأ طلبك الأول" : "Start shopping to place your first order"}
          </p>
          <Link
            href="/uniforms"
            className="inline-flex items-center gap-2 bg-[#318B9B] text-white font-bold px-6 py-3 rounded-2xl hover:bg-[#1a5f6b] transition-colors"
          >
            {locale === "ar" ? "تسوق الآن" : "Shop Now"}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/order/${order.id}`}
              className="flex items-center gap-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-[#318B9B]/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#318B9B]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-gray-900 dark:text-white text-sm">
                    {locale === "ar" ? "طلب رقم" : "Order #"}{order.order_number ?? order.id}
                  </span>
                  <span className={cn("text-xs font-medium px-2 py-0.5 rounded-full", statusColor(order.status))}>
                    {statusLabel(order.status, locale)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                  {" · "}
                  {(order.items ?? order.lines)?.length ?? 0} {locale === "ar" ? "منتجات" : "items"}
                </p>
              </div>
              <div className="text-end flex-shrink-0">
                <p className="font-bold text-[#318B9B] text-sm">{formatPrice(Number(order.total))}</p>
                <ChevronIcon className="w-4 h-4 text-gray-300 dark:text-gray-600 mt-1 ms-auto" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
