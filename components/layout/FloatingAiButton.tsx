"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";

export function FloatingAiButton() {
  const pathname = usePathname();
  if (pathname === "/ai-chat") return null;

  return (
    <Link
      href="/ai-chat"
      className="fixed bottom-[84px] end-4 md:bottom-8 z-50 w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shadow-lg text-white transition-transform hover:scale-110 active:scale-95"
      style={{ background: "linear-gradient(135deg, #318B9B, #7C3AED)" }}
      aria-label="AI Assistant"
    >
      <Sparkles className="w-6 h-6" />
    </Link>
  );
}
