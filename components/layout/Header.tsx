"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ShoppingCart, Package, Globe, Moon, Sun, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

export function Header() {
  const itemCount = useCartStore((s) => s.itemCount());
  const { isAuthenticated } = useAuthStore();
  const { locale, darkMode, setLocale, toggleDarkMode } = useUiStore();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-14 md:h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center flex-shrink-0">
          {darkMode ? (
            <Image
              src="/assets/images/schoola-logo-egypt-dark-transparent.svg"
              alt="Schoola"
              width={160}
              height={52}
              className="h-9 md:h-16"
              style={{ width: "auto" }}
              priority
            />
          ) : (
            <Image
              src="/assets/images/schoola-logo-egypt.svg"
              alt="Schoola"
              width={160}
              height={52}
              className="h-9 md:h-16"
              style={{ width: "auto" }}
              priority
            />
          )}
        </Link>

        {/* Nav links — desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-300">
          <Link href="/schools" className="hover:text-[#318B9B] transition-colors">{locale === "ar" ? "المدارس" : "Schools"}</Link>
          <Link href="/uniforms" className="hover:text-[#7C3AED] transition-colors">{locale === "ar" ? "الزي" : "Uniforms"}</Link>
          <Link href="/supplies" className="hover:text-[#059669] transition-colors">{locale === "ar" ? "الأدوات" : "Supplies"}</Link>
          <Link href="/stores" className="hover:text-[#EA580C] transition-colors">{locale === "ar" ? "المتاجر" : "Stores"}</Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {/* Language */}
          <button
            onClick={() => setLocale(locale === "ar" ? "en" : "ar")}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition-all"
            title="Switch language"
          >
            <Globe className="w-5 h-5" />
          </button>

          {/* Dark mode */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition-all"
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Orders */}
          <Link
            href={isAuthenticated ? "/orders" : "/auth/login"}
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition-all"
          >
            <Package className="w-5 h-5" />
          </Link>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition-all">
            <ShoppingCart className="w-5 h-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-0.5 -end-0.5 min-w-[18px] h-[18px] rounded-full bg-[#318B9B] text-white text-[10px] font-bold flex items-center justify-center px-1">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Account */}
          <Link
            href="/account"
            className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-white transition-all"
          >
            <User className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
