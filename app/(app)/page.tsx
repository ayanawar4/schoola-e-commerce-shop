"use client";
import { Suspense } from "react";
import { HomeHero } from "@/components/home/HomeHero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { PromoBanner } from "@/components/home/PromoBanner";
import { BestSellers } from "@/components/home/BestSellers";
import { TopSchools } from "@/components/home/TopSchools";
import { StatsStrip } from "@/components/home/StatsStrip";
import { LandingPage } from "@/components/landing/LandingPage";
import { useAuthStore } from "@/lib/store/auth";

export default function HomePage() {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <LandingPage />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 space-y-6">
      <HomeHero />

      <Suspense fallback={<div className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />}>
        <StatsStrip />
      </Suspense>

      <CategoryGrid />

      <PromoBanner />

      <Suspense fallback={<SectionSkeleton />}>
        <BestSellers />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <TopSchools />
      </Suspense>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-3">
      <div className="h-5 w-36 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse" />
      <div className="flex gap-3 overflow-hidden">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="min-w-[148px] h-52 bg-gray-100 dark:bg-gray-800 rounded-2xl animate-pulse flex-shrink-0" />
        ))}
      </div>
    </div>
  );
}
