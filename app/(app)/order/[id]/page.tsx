"use client";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, Clock, Package, Truck, CheckCircle, XCircle, GraduationCap } from "lucide-react";
import { useOrder } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { formatPrice, getProductImage, getLocalizedName, statusLabel, statusColor } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STATUS_STEPS = ["pending_payment", "pending", "processing", "shipped", "delivered"];

const STATUS_ICONS: Record<string, any> = {
  pending: Clock,
  pending_payment: Clock,
  processing: Package,
  shipped: Truck,
  delivered: CheckCircle,
  cancelled: XCircle,
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { locale } = useUiStore();
  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded" />
        <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
        <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 text-gray-400">
        <p>{locale === "ar" ? "الطلب غير موجود" : "Order not found"}</p>
      </div>
    );
  }

  const StatusIcon = STATUS_ICONS[order.status] ?? Package;
  const stepIndex = STATUS_STEPS.indexOf(order.status);
  const lines = order.items ?? order.lines ?? [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-sm font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        {locale === "ar" ? "رجوع" : "Back"}
      </button>

      {/* Header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <p className="text-xs text-gray-400 mb-1">{locale === "ar" ? "رقم الطلب" : "Order Number"}</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">#{order.order_number ?? order.id}</p>
            <p className="text-xs text-gray-400 mt-1">
              {new Date(order.created_at).toLocaleDateString(locale === "ar" ? "ar-SA" : "en-US", {
                year: "numeric", month: "long", day: "numeric",
              })}
            </p>
          </div>
          <span className={cn("text-xs font-semibold px-3 py-1.5 rounded-full shrink-0", statusColor(order.status))}>
            {statusLabel(order.status, locale)}
          </span>
        </div>

        {/* Progress bar */}
        {order.status !== "cancelled" && (
          <div>
            <div className="flex items-center">
              {STATUS_STEPS.map((step, i) => (
                <div key={step} className="flex items-center flex-1">
                  <div className={cn(
                    "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 transition-colors",
                    i <= stepIndex
                      ? "bg-[#318B9B] text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                  )}>
                    {i + 1}
                  </div>
                  {i < STATUS_STEPS.length - 1 && (
                    <div className={cn("flex-1 h-0.5 transition-colors", i < stepIndex ? "bg-[#318B9B]" : "bg-gray-200 dark:bg-gray-700")} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-1.5">
              {STATUS_STEPS.map((step) => (
                <span key={step} className="text-[8px] text-gray-400 text-center leading-tight" style={{ width: `${100 / STATUS_STEPS.length}%` }}>
                  {statusLabel(step, locale)}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Student */}
      {order.student && (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#318B9B]/10 flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-[#318B9B]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{order.student.name}</p>
            <p className="text-xs text-gray-400">
              {order.student.grade && `${order.student.grade} · `}
              {order.student.school ? getLocalizedName(order.student.school.name, locale) : ""}
            </p>
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">
          {locale === "ar" ? "المنتجات" : "Items"} ({lines.length})
        </h2>
        <div className="space-y-4">
          {lines.map((line) => (
            <div key={line.id} className="flex gap-3">
              {line.product && (
                <div className="relative w-16 h-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image
                    src={getProductImage(line.product)}
                    alt={getLocalizedName(line.product.name, locale)}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {line.product ? getLocalizedName(line.product.name, locale) : `Product #${line.product_id}`}
                </p>
                {line.size_snapshot && Object.keys(line.size_snapshot).length > 0 && (
                  <p className="text-xs text-gray-400 mt-0.5">
                    {Object.entries(line.size_snapshot).map(([k, v]) => `${k}: ${v}`).join(" · ")}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs text-gray-400">×{line.quantity}</span>
                  <span className="text-sm font-bold text-[#318B9B]">
                    {formatPrice(Number(line.unit_price) * line.quantity)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 space-y-2">
        <h2 className="font-bold text-gray-900 dark:text-white text-sm mb-3">
          {locale === "ar" ? "ملخص الدفع" : "Payment Summary"}
        </h2>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-gray-600 dark:text-gray-400">
            <span>{locale === "ar" ? "المجموع الفرعي" : "Subtotal"}</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          {order.downpayment_amount && Number(order.downpayment_amount) !== Number(order.total) && (
            <div className="flex justify-between text-green-600 dark:text-green-400">
              <span>{locale === "ar" ? "الدفعة المقدمة" : "Down payment"}</span>
              <span>{formatPrice(Number(order.downpayment_amount))}</span>
            </div>
          )}
          <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex justify-between font-bold">
            <span className="text-gray-900 dark:text-white">{locale === "ar" ? "الإجمالي" : "Total"}</span>
            <span className="text-[#318B9B]">{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        <div className="pt-2 space-y-1.5 border-t border-gray-100 dark:border-gray-800 mt-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{locale === "ar" ? "طريقة الدفع:" : "Payment:"}</span>
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">{order.payment_method}</span>
          </div>
          {order.payment_reference && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{locale === "ar" ? "مرجع العملية:" : "Reference:"}</span>
              <span className="text-xs font-mono text-gray-700 dark:text-gray-300 break-all">{order.payment_reference}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
