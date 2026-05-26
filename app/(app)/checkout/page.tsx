"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronDown, ChevronUp, CheckCircle, Clock, GraduationCap } from "lucide-react";
import { useStudents, useCreateOrder } from "@/lib/hooks/queries";
import { useCartStore } from "@/lib/store/cart";
import { useUiStore } from "@/lib/store/ui";
import { formatPrice, getProductImage, getLocalizedName } from "@/lib/utils";
import { getApiError } from "@/lib/api/client";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import type { Order } from "@/types";

export default function CheckoutPage() {
  const { locale } = useUiStore();
  const router = useRouter();
  const { items, subtotal, clearCart } = useCartStore();
  const { data: students, isLoading: loadingStudents } = useStudents();
  const createOrder = useCreateOrder();

  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [address, setAddress] = useState("");
  const [paymentRef, setPaymentRef] = useState("");
  const [notes, setNotes] = useState("");
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const sub = subtotal();

  async function handlePlaceOrder() {
    if (!selectedStudent) {
      toast(locale === "ar" ? "اختر الطالب أولاً" : "Please select a student", "error");
      return;
    }
    if (!paymentRef.trim()) {
      toast(locale === "ar" ? "أدخل مرجع الدفع (InstaPay)" : "Enter your InstaPay payment reference", "error");
      return;
    }
    try {
      const order = await createOrder.mutateAsync({
        student_id: selectedStudent,
        lines: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
          size: i.size,
        })),
        payment_method: "instapay",
        downpayment_amount: sub,
        payment_reference: paymentRef.trim(),
        notes: [address.trim() && `${locale === "ar" ? "عنوان التوصيل" : "Delivery address"}: ${address.trim()}`, notes.trim()].filter(Boolean).join(" | ") || undefined,
      });
      clearCart();
      setCompletedOrder(order);
    } catch (err) {
      toast(getApiError(err), "error");
    }
  }

  // ── Success screen ────────────────────────────────────────────────────────
  if (completedOrder) {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto mb-5 flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-500" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
          {locale === "ar" ? "تم الطلب بنجاح!" : "Order Placed!"}
        </h1>
        <p className="text-gray-400 text-sm mb-6">
          {locale === "ar" ? "سيتم التواصل معك قريباً" : "We'll be in touch soon"}
        </p>

        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 text-start space-y-2 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
              {locale === "ar" ? "بانتظار الدفع" : "Pending Payment"}
            </span>
          </div>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-500">{locale === "ar" ? "رقم الطلب" : "Order #"}</span>
              <span className="font-bold text-gray-900 dark:text-white">{completedOrder.order_number ?? completedOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{locale === "ar" ? "الإجمالي" : "Total"}</span>
              <span className="font-bold text-[#318B9B]">{formatPrice(completedOrder.total ?? sub)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">{locale === "ar" ? "مرجع الدفع" : "Payment Ref"}</span>
              <span className="font-mono text-xs text-gray-700 dark:text-gray-300">{paymentRef}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/order/${completedOrder.id}`)}
            className="flex-1 border border-[#318B9B] text-[#318B9B] font-bold py-3 rounded-2xl text-sm hover:bg-[#318B9B]/5 transition-colors"
          >
            {locale === "ar" ? "تفاصيل الطلب" : "View Order"}
          </button>
          <button
            onClick={() => router.push("/")}
            className="flex-1 bg-[#318B9B] text-white font-bold py-3 rounded-2xl text-sm hover:bg-[#1a5f6b] transition-colors"
          >
            {locale === "ar" ? "مواصلة التسوق" : "Continue Shopping"}
          </button>
        </div>
      </div>
    );
  }

  // ── Empty cart ────────────────────────────────────────────────────────────
  if (items.length === 0) {
    router.push("/cart");
    return null;
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-36 md:pb-10 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {locale === "ar" ? "إتمام الطلب" : "Checkout"}
      </h1>

      {/* Order Summary */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
        <button
          onClick={() => setSummaryOpen(!summaryOpen)}
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl transition-colors"
        >
          <span className="font-bold text-gray-900 dark:text-white text-sm">
            {locale === "ar" ? "ملخص الطلب" : "Order Summary"} ({items.length})
          </span>
          {summaryOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {summaryOpen && (
          <div className="border-t border-gray-100 dark:border-gray-800 p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <div className="relative w-14 h-14 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <Image src={getProductImage(item.product)} alt={getLocalizedName(item.product.name, locale)} fill className="object-cover" sizes="56px" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{getLocalizedName(item.product.name, locale)}</p>
                  {item.size && <p className="text-xs text-gray-400">{locale === "ar" ? "المقاس:" : "Size:"} {item.size}</p>}
                  <div className="flex justify-between mt-1">
                    <span className="text-xs text-gray-400">×{item.quantity}</span>
                    <span className="text-sm font-bold text-[#318B9B]">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between text-sm font-bold">
              <span className="text-gray-900 dark:text-white">{locale === "ar" ? "الإجمالي" : "Total"}</span>
              <span className="text-[#318B9B]">{formatPrice(sub)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Student selection */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex items-center gap-2 mb-3">
          <GraduationCap className="w-4 h-4 text-[#318B9B]" />
          <h2 className="font-bold text-gray-900 dark:text-white text-sm">
            {locale === "ar" ? "الطالب *" : "Student *"}
          </h2>
        </div>
        {loadingStudents ? (
          <div className="space-y-2">
            {[...Array(2)].map((_, i) => <div key={i} className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />)}
          </div>
        ) : students && students.length > 0 ? (
          <div className="space-y-2">
            {students.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStudent(s.id)}
                className={cn(
                  "w-full text-start p-3 rounded-xl border-2 transition-colors",
                  selectedStudent === s.id
                    ? "border-[#318B9B] bg-[#318B9B]/5"
                    : "border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700"
                )}
              >
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{s.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {s.grade && `${s.grade} · `}
                  {s.school ? getLocalizedName(s.school.name, locale) : ""}
                </p>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-gray-400 mb-3">
              {locale === "ar" ? "لا يوجد طلاب. أضف طالباً أولاً." : "No students found. Add one first."}
            </p>
            <a href="/students/add" className="text-sm text-[#318B9B] font-medium hover:underline">
              + {locale === "ar" ? "إضافة طالب" : "Add Student"}
            </a>
          </div>
        )}
      </div>

      {/* Delivery Address */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
        <h2 className="font-bold text-gray-900 dark:text-white text-sm">
          {locale === "ar" ? "عنوان التوصيل" : "Delivery Address"}
        </h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          rows={3}
          placeholder={locale === "ar" ? "المدينة، الحي، الشارع، رقم المبنى..." : "City, district, street, building number..."}
          className={inputCls + " resize-none"}
        />
      </div>

      {/* Payment — InstaPay reference */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
        <h2 className="font-bold text-gray-900 dark:text-white text-sm">
          {locale === "ar" ? "الدفع عبر InstaPay" : "Payment via InstaPay"}
        </h2>
        <div className="p-3 bg-[#318B9B]/5 rounded-xl text-sm text-[#318B9B]">
          {locale === "ar"
            ? "حوّل المبلغ عبر InstaPay إلى حساب سكولا، ثم أدخل مرجع العملية."
            : "Transfer via InstaPay to Schoola's account, then enter your transaction reference."}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
            {locale === "ar" ? "مرجع العملية *" : "Transaction Reference *"}
          </label>
          <input
            value={paymentRef}
            onChange={(e) => setPaymentRef(e.target.value)}
            placeholder={locale === "ar" ? "أدخل رقم العملية من InstaPay" : "Enter InstaPay transaction ID"}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block">
            {locale === "ar" ? "ملاحظات (اختياري)" : "Notes (optional)"}
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder={locale === "ar" ? "أي تعليمات إضافية..." : "Any additional instructions..."}
            className={inputCls + " resize-none"}
          />
        </div>
      </div>

      {/* Desktop place order */}
      <div className="hidden md:block bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
        <div className="flex justify-between text-sm mb-4">
          <span className="text-gray-500">{locale === "ar" ? "الإجمالي" : "Total"}</span>
          <span className="font-bold text-[#318B9B] text-lg">{formatPrice(sub)}</span>
        </div>
        <button
          onClick={handlePlaceOrder}
          disabled={!selectedStudent || !paymentRef.trim() || createOrder.isPending}
          className={cn(
            "w-full py-3.5 rounded-2xl font-bold text-sm transition-all active:scale-95",
            selectedStudent && paymentRef.trim() && !createOrder.isPending
              ? "bg-[#318B9B] text-white hover:bg-[#1a5f6b]"
              : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
          )}
        >
          {createOrder.isPending
            ? (locale === "ar" ? "جاري الطلب..." : "Placing order...")
            : (locale === "ar" ? "تأكيد الطلب" : "Place Order")}
        </button>
      </div>

      {/* Sticky mobile bar */}
      <div className="fixed bottom-16 start-0 end-0 z-50 md:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-t border-gray-100 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <div className="flex-shrink-0">
            <p className="text-xs text-gray-500">{locale === "ar" ? "الإجمالي" : "Total"}</p>
            <p className="text-base font-bold text-[#318B9B]">{formatPrice(sub)}</p>
          </div>
          <button
            onClick={handlePlaceOrder}
            disabled={!selectedStudent || !paymentRef.trim() || createOrder.isPending}
            className={cn(
              "flex-1 py-3 rounded-2xl font-bold text-sm transition-all active:scale-95",
              selectedStudent && paymentRef.trim() && !createOrder.isPending
                ? "bg-[#318B9B] text-white hover:bg-[#1a5f6b]"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed"
            )}
          >
            {createOrder.isPending
              ? (locale === "ar" ? "جاري الطلب..." : "Placing order...")
              : (locale === "ar" ? "تأكيد الطلب" : "Place Order")}
          </button>
        </div>
      </div>
    </div>
  );
}
