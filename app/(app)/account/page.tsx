"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Lock, GraduationCap, Bell, Moon, Globe, LogOut, ChevronDown, ChevronUp, Package, ChevronRight } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useUiStore } from "@/lib/store/ui";
import { useStudents, useDeleteStudent } from "@/lib/hooks/queries";
import { getInitials, formatPrice } from "@/lib/utils";
import { authApi } from "@/lib/api/endpoints";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

function Section({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="w-5 h-5 text-[#318B9B]" />
          <span className="font-semibold text-gray-900 dark:text-white text-sm">{title}</span>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && <div className="border-t border-gray-100 dark:border-gray-800 p-4">{children}</div>}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { locale, darkMode, setLocale, toggleDarkMode } = useUiStore();
  const { data: students } = useStudents();
  const deleteMut = useDeleteStudent();
  const [confirmLogout, setConfirmLogout] = useState(false);

  async function handleLogout() {
    try { await authApi.logout(); } catch {}
    logout();
    toast(locale === "ar" ? "تم تسجيل الخروج" : "Logged out", "info");
    router.push("/");
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-gray-800 mx-auto mb-4 flex items-center justify-center">
          <User className="w-10 h-10 text-gray-300 dark:text-gray-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {locale === "ar" ? "مرحباً بك" : "Hello, Guest"}
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          {locale === "ar" ? "سجل دخولك للاستمتاع بكامل المميزات" : "Log in to enjoy all features"}
        </p>
        <Link href="/auth/login" className="inline-flex items-center gap-2 bg-[#318B9B] text-white font-bold px-8 py-3 rounded-2xl hover:bg-[#1a5f6b] transition-colors mb-3">
          {locale === "ar" ? "تسجيل الدخول" : "Log In"}
        </Link>
        <br />
        <Link href="/auth/register" className="text-sm text-[#318B9B] hover:underline">
          {locale === "ar" ? "إنشاء حساب جديد" : "Create Account"}
        </Link>
      </div>
    );
  }

  const initials = user ? getInitials(`${user.first_name} ${user.last_name}`) : "??";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-3">
      {/* Profile header */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-5 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold flex-shrink-0" style={{ background: "#318B9B" }}>
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{user?.first_name} {user?.last_name}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.phone}</p>
          {user?.email && <p className="text-sm text-gray-400">{user.email}</p>}
        </div>
      </div>

      {/* My Orders */}
      <Link
        href="/orders"
        className="flex items-center gap-3 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 hover:shadow-md transition-all"
      >
        <Package className="w-5 h-5 text-[#318B9B]" />
        <span className="flex-1 font-semibold text-gray-900 dark:text-white text-sm">
          {locale === "ar" ? "طلباتي" : "My Orders"}
        </span>
        <ChevronRight className="w-4 h-4 text-gray-400" />
      </Link>

      {/* Security */}
      <Section title={locale === "ar" ? "الأمان" : "Security"} icon={Lock}>
        <Link href="/auth/change-password" className="flex items-center justify-between py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-[#318B9B]">
          <span>{locale === "ar" ? "تغيير كلمة المرور" : "Change Password"}</span>
          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
        </Link>
      </Section>

      {/* Students */}
      <Section title={locale === "ar" ? "طلابي" : "My Students"} icon={GraduationCap}>
        {students && students.length > 0 ? (
          <div className="space-y-3">
            {students.map((s) => (
              <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">{s.name}</p>
                  <p className="text-xs text-gray-400">{s.grade} · {s.gender === "male" ? (locale === "ar" ? "ذكر" : "Male") : (locale === "ar" ? "أنثى" : "Female")}</p>
                </div>
                <div className="flex gap-2">
                  <Link href={`/students/${s.id}`} className="text-xs text-[#318B9B] hover:underline">{locale === "ar" ? "تعديل" : "Edit"}</Link>
                  <button onClick={() => deleteMut.mutate(s.id)} className="text-xs text-red-400 hover:text-red-600">{locale === "ar" ? "حذف" : "Delete"}</button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 mb-3">{locale === "ar" ? "لا يوجد طلاب" : "No students added"}</p>
        )}
        <Link href="/students/add" className="mt-3 inline-flex items-center gap-1.5 text-sm text-[#318B9B] font-medium hover:underline">
          + {locale === "ar" ? "إضافة طالب" : "Add Student"}
        </Link>
      </Section>


      {/* Notifications */}
      <Section title={locale === "ar" ? "الإشعارات" : "Notifications"} icon={Bell}>
        <p className="text-sm text-gray-400">{locale === "ar" ? "لا توجد إشعارات" : "No notifications yet"}</p>
      </Section>

      {/* Preferences */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Moon className="w-5 h-5 text-[#318B9B]" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{locale === "ar" ? "الوضع الداكن" : "Dark Mode"}</span>
          </div>
          <button
            onClick={toggleDarkMode}
            className={cn("w-12 h-6 rounded-full transition-colors relative", darkMode ? "bg-[#318B9B]" : "bg-gray-200 dark:bg-gray-700")}
          >
            <div className={cn("absolute top-1 w-4 h-4 rounded-full bg-white transition-transform", darkMode ? "end-1" : "start-1")} />
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[#318B9B]" />
            <span className="text-sm font-medium text-gray-900 dark:text-white">{locale === "ar" ? "اللغة" : "Language"}</span>
          </div>
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            {(["ar", "en"] as const).map((l) => (
              <button key={l} onClick={() => setLocale(l)} className={cn("px-3 py-1 rounded-md text-xs font-semibold transition-colors", locale === l ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm" : "text-gray-400")}>
                {l === "ar" ? "عربي" : "EN"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logout */}
      {confirmLogout ? (
        <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 text-center">
          <p className="text-sm text-red-700 dark:text-red-300 mb-3">{locale === "ar" ? "هل تريد تسجيل الخروج؟" : "Are you sure you want to log out?"}</p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => setConfirmLogout(false)} className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-sm font-medium">{locale === "ar" ? "إلغاء" : "Cancel"}</button>
            <button onClick={handleLogout} className="px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600">{locale === "ar" ? "تسجيل الخروج" : "Log Out"}</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setConfirmLogout(true)} className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-200 dark:border-red-900/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium text-sm transition-colors">
          <LogOut className="w-4 h-4" />
          {locale === "ar" ? "تسجيل الخروج" : "Log Out"}
        </button>
      )}
    </div>
  );
}
