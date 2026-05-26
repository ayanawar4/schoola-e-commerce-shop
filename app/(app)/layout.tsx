"use client";
import { usePathname } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { FloatingAiButton } from "@/components/layout/FloatingAiButton";
import { useAuthStore } from "@/lib/store/auth";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const pathname = usePathname();

  // Hide nav on home page for guests — they see the full-screen landing page
  const isGuestHome = !isAuthenticated && pathname === "/";

  if (isGuestHome) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pb-20 md:pb-6">{children}</main>
      <FloatingAiButton />
      <BottomNav />
    </div>
  );
}
