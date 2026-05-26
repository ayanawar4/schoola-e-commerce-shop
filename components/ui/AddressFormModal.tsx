"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { useCreateAddress } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { getApiError } from "@/lib/api/client";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";
import type { AddressPayload } from "@/types";

interface Props {
  onClose: () => void;
  onCreated?: () => void;
}

const LABELS = ["home", "work", "other"] as const;

export function AddressFormModal({ onClose, onCreated }: Props) {
  const { locale } = useUiStore();
  const createAddress = useCreateAddress();

  const [form, setForm] = useState<AddressPayload>({
    label: "home",
    full_name: "",
    phone: "",
    street: "",
    building_number: "",
    floor: "",
    apartment_number: "",
    city: "",
    country: "Egypt",
    is_default: false,
  });

  function set<K extends keyof AddressPayload>(key: K, value: AddressPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.full_name || !form.phone || !form.street || !form.city) {
      toast(locale === "ar" ? "يرجى تعبئة الحقول المطلوبة" : "Please fill required fields", "error");
      return;
    }
    try {
      await createAddress.mutateAsync(form);
      toast(locale === "ar" ? "تم إضافة العنوان" : "Address saved", "success");
      onCreated?.();
      onClose();
    } catch (err) {
      toast(getApiError(err), "error");
    }
  }

  const inputCls = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]";
  const labelCls = "text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1 block";

  return (
    <div className="fixed inset-0 z-[70] flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 w-full md:max-w-lg md:rounded-2xl rounded-t-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <h2 className="font-bold text-gray-900 dark:text-white">
            {locale === "ar" ? "إضافة عنوان جديد" : "Add New Address"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          {/* Label */}
          <div>
            <label className={labelCls}>{locale === "ar" ? "نوع العنوان" : "Label"}</label>
            <div className="flex gap-2">
              {LABELS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set("label", l)}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-sm font-medium border transition-colors capitalize",
                    form.label === l
                      ? "bg-[#318B9B] text-white border-[#318B9B]"
                      : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                  )}
                >
                  {l === "home" ? (locale === "ar" ? "منزل" : "Home") : l === "work" ? (locale === "ar" ? "عمل" : "Work") : (locale === "ar" ? "أخرى" : "Other")}
                </button>
              ))}
            </div>
          </div>

          {/* Full name */}
          <div>
            <label className={labelCls}>{locale === "ar" ? "الاسم الكامل *" : "Full Name *"}</label>
            <input
              value={form.full_name}
              onChange={(e) => set("full_name", e.target.value)}
              placeholder={locale === "ar" ? "الاسم الكامل" : "Full name"}
              className={inputCls}
            />
          </div>

          {/* Phone */}
          <div>
            <label className={labelCls}>{locale === "ar" ? "رقم الهاتف *" : "Phone *"}</label>
            <input
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
              placeholder="01xxxxxxxxx"
              type="tel"
              className={inputCls}
            />
          </div>

          {/* Street */}
          <div>
            <label className={labelCls}>{locale === "ar" ? "الشارع *" : "Street *"}</label>
            <input
              value={form.street}
              onChange={(e) => set("street", e.target.value)}
              placeholder={locale === "ar" ? "اسم الشارع" : "Street name"}
              className={inputCls}
            />
          </div>

          {/* Building / Floor / Apt */}
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className={labelCls}>{locale === "ar" ? "مبنى" : "Building"}</label>
              <input
                value={form.building_number ?? ""}
                onChange={(e) => set("building_number", e.target.value)}
                placeholder="12"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>{locale === "ar" ? "طابق" : "Floor"}</label>
              <input
                value={form.floor ?? ""}
                onChange={(e) => set("floor", e.target.value)}
                placeholder="3"
                className={inputCls}
              />
            </div>
            <div>
              <label className={labelCls}>{locale === "ar" ? "شقة" : "Apt"}</label>
              <input
                value={form.apartment_number ?? ""}
                onChange={(e) => set("apartment_number", e.target.value)}
                placeholder="5"
                className={inputCls}
              />
            </div>
          </div>

          {/* City */}
          <div>
            <label className={labelCls}>{locale === "ar" ? "المدينة *" : "City *"}</label>
            <input
              value={form.city}
              onChange={(e) => set("city", e.target.value)}
              placeholder={locale === "ar" ? "المدينة" : "City"}
              className={inputCls}
            />
          </div>

          {/* Default toggle */}
          <label className="flex items-center gap-3 cursor-pointer py-1">
            <input
              type="checkbox"
              checked={!!form.is_default}
              onChange={(e) => set("is_default", e.target.checked)}
              className="w-4 h-4 rounded accent-[#318B9B]"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              {locale === "ar" ? "تعيين كعنوان افتراضي" : "Set as default address"}
            </span>
          </label>

          <button
            type="submit"
            disabled={createAddress.isPending}
            className="w-full py-3.5 rounded-2xl bg-[#318B9B] text-white font-bold text-sm hover:bg-[#1a5f6b] transition-colors disabled:opacity-60"
          >
            {createAddress.isPending
              ? (locale === "ar" ? "جاري الحفظ..." : "Saving...")
              : (locale === "ar" ? "حفظ العنوان" : "Save Address")}
          </button>
        </form>
      </div>
    </div>
  );
}
