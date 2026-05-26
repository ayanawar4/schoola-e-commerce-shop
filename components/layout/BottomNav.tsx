"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, GraduationCap, Shirt, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/store/cart";
import { useUiStore } from "@/lib/store/ui";
import { cn } from "@/lib/utils";

export function BottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.itemCount());
  const { locale } = useUiStore();

  const links = [
    { href: "/", icon: Home, label: locale === "ar" ? "الرئيسية" : "Home" },
    { href: "/schools", icon: GraduationCap, label: locale === "ar" ? "المدارس" : "Schools" },
    { href: "/uniforms", icon: Shirt, label: locale === "ar" ? "الزي" : "Uniforms" },
    {
      href: "/cart",
      icon: ShoppingCart,
      label: locale === "ar" ? "السلة" : "Cart",
      badge: itemCount > 0 ? itemCount : undefined,
    },
    { href: "/account", icon: User, label: locale === "ar" ? "حسابي" : "Account" },
  ];

  return (
    <nav className="fixed bottom-0 start-0 end-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 md:hidden">
      <div className="flex items-center justify-around h-16 px-2">
        {links.map(({ href, icon: Icon, label, badge }) => {
          const active =
            pathname === href ||
            (href !== "/" && pathname.startsWith(href)) ||
            (href === "/uniforms" && (pathname.startsWith("/product/") || pathname.startsWith("/uniforms"))) ||
            (href === "/schools" && (pathname.startsWith("/school/") || pathname.startsWith("/schools")));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all min-w-[60px]",
                active
                  ? "text-[#318B9B]"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              )}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge !== undefined && (
                  <span className="absolute -top-1.5 -end-1.5 min-w-[16px] h-4 rounded-full bg-[#318B9B] text-white text-[9px] font-bold flex items-center justify-center px-0.5">
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
