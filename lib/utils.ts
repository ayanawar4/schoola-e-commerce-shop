import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "EGP", locale = "en-EG") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getLocalizedName(
  name: { ar: string; en: string } | string,
  locale: "ar" | "en"
): string {
  if (typeof name === "string") return name;
  return name[locale] ?? name.en ?? name.ar ?? "";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function fixImageUrl(url: string): string {
  return url.replace("http://137.184.57.162", "https://schoola.serveftp.com");
}

export function getProductImage(product: { images?: ({ url: string; is_primary: boolean } | string)[] }): string {
  if (!product.images || product.images.length === 0)
    return "https://via.placeholder.com/400x400?text=No+Image";
  const first = product.images[0];
  if (typeof first === "string") return fixImageUrl(first);
  const primary = (product.images as { url: string; is_primary: boolean }[]).find((img) => img.is_primary);
  return fixImageUrl(primary?.url ?? (first as { url: string }).url ?? "https://via.placeholder.com/400x400");
}

export function genderLabel(gender: string | undefined, locale: "ar" | "en"): string {
  const map: Record<string, { ar: string; en: string }> = {
    male: { ar: "ولادي", en: "Boys" },
    female: { ar: "بنادي", en: "Girls" },
    unisex: { ar: "مختلط", en: "Unisex" },
  };
  if (!gender) return "";
  return map[gender]?.[locale] ?? gender;
}

export function statusLabel(status: string, locale: "ar" | "en"): string {
  const map: Record<string, { ar: string; en: string }> = {
    pending: { ar: "قيد الانتظار", en: "Pending" },
    pending_payment: { ar: "بانتظار الدفع", en: "Pending Payment" },
    processing: { ar: "قيد المعالجة", en: "Processing" },
    shipped: { ar: "تم الشحن", en: "Shipped" },
    delivered: { ar: "تم التوصيل", en: "Delivered" },
    cancelled: { ar: "ملغي", en: "Cancelled" },
  };
  return map[status]?.[locale] ?? status;
}

export function statusColor(status: string): string {
  const map: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800",
    pending_payment: "bg-orange-100 text-orange-800",
    processing: "bg-blue-100 text-blue-800",
    shipped: "bg-purple-100 text-purple-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };
  return map[status] ?? "bg-gray-100 text-gray-800";
}
