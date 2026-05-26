"use client";
import { MapPin, Clock, Phone } from "lucide-react";
import { useUiStore } from "@/lib/store/ui";
import { ComingSoon } from "@/components/ui/ComingSoon";

const MOCK_STORES = [
  { id: 1, name: { ar: "فرع الرياض - العليا", en: "Riyadh - Olaya Branch" }, address: { ar: "شارع العليا، الرياض", en: "Olaya Street, Riyadh" }, hours: "9:00 AM – 10:00 PM", phone: "+966 11 234 5678" },
  { id: 2, name: { ar: "فرع جدة - الحمراء", en: "Jeddah - Hamra Branch" }, address: { ar: "حي الحمراء، جدة", en: "Al-Hamra District, Jeddah" }, hours: "9:00 AM – 11:00 PM", phone: "+966 12 345 6789" },
  { id: 3, name: { ar: "فرع الدمام", en: "Dammam Branch" }, address: { ar: "الكورنيش، الدمام", en: "Corniche Road, Dammam" }, hours: "10:00 AM – 10:00 PM", phone: "+966 13 456 7890" },
];

export default function StoresPage() {
  const { locale } = useUiStore();

  return (
    <div className="relative max-w-4xl mx-auto px-4 py-6">
      <ComingSoon
        icon="🏪"
        color="#EA580C"
        messageAr="نعمل على إطلاق خاصية المتاجر قريباً. ترقّبوا!"
        messageEn="We're working on launching Stores. Stay tuned!"
      />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {locale === "ar" ? "المتاجر" : "Our Stores"}
      </h1>
      <div className="space-y-4">
        {MOCK_STORES.map((store) => (
          <div key={store.id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5">
            <h2 className="font-bold text-gray-900 dark:text-white text-base mb-3">
              {store.name[locale]}
            </h2>
            <div className="space-y-2">
              <div className="flex items-start gap-2 text-sm text-gray-500 dark:text-gray-400">
                <MapPin className="w-4 h-4 mt-0.5 text-[#EA580C] flex-shrink-0" />
                <span>{store.address[locale]}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Clock className="w-4 h-4 text-[#EA580C]" />
                <span>{store.hours}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <Phone className="w-4 h-4 text-[#EA580C]" />
                <span dir="ltr">{store.phone}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
