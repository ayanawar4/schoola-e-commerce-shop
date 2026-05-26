"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, ChevronDown, ChevronUp, Ruler } from "lucide-react";
import { useCreateStudent, useSchools } from "@/lib/hooks/queries";
import { useUiStore } from "@/lib/store/ui";
import { getApiError } from "@/lib/api/client";
import { getLocalizedName } from "@/lib/utils";
import { toast } from "@/components/ui/Toaster";
import { cn } from "@/lib/utils";

export default function AddStudentPage() {
  const { locale } = useUiStore();
  const router = useRouter();
  const createMut = useCreateStudent();
  const { data: schoolsData } = useSchools({ per_page: 200 });
  const schools = schoolsData?.data ?? [];

  const [name, setName] = useState("");
  const [schoolId, setSchoolId] = useState<number | null>(null);
  const [grade, setGrade] = useState("");
  const [gender, setGender] = useState<"male" | "female">("male");
  const [sizes, setSizes] = useState({ shirt: "", pants: "", skirt: "", shoes: "", jacket: "" });
  const [schoolSearch, setSchoolSearch] = useState("");
  const [error, setError] = useState("");
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const filteredSchools = schools.filter((s) =>
    getLocalizedName(s.name, locale).toLowerCase().includes(schoolSearch.toLowerCase())
  );

  function updateSize(key: keyof typeof sizes, val: string) {
    setSizes((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolId) { setError(locale === "ar" ? "اختر المدرسة" : "Please select a school"); return; }
    setError("");
    try {
      await createMut.mutateAsync({
        name,
        school_id: schoolId,
        grade: grade || undefined,
        gender,
        sizes: Object.fromEntries(Object.entries(sizes).filter(([, v]) => v)) as any,
      });
      toast(locale === "ar" ? "تم إضافة الطالب" : "Student added", "success");
      router.push("/account");
    } catch (err) {
      setError(getApiError(err));
    }
  }

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#318B9B]/30 focus:border-[#318B9B]";
  const labelClass = "text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5";

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 dark:hover:text-white text-sm font-medium mb-6">
        <ArrowLeft className="w-4 h-4" />
        {locale === "ar" ? "رجوع" : "Back"}
      </button>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {locale === "ar" ? "إضافة طالب" : "Add Student"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className={labelClass}>{locale === "ar" ? "اسم الطالب" : "Student Name"} *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} />
        </div>

        {/* School */}
        <div>
          <label className={labelClass}>{locale === "ar" ? "المدرسة" : "School"} *</label>
          <div className="relative mb-2">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={schoolSearch}
              onChange={(e) => setSchoolSearch(e.target.value)}
              placeholder={locale === "ar" ? "ابحث عن مدرسة..." : "Search school..."}
              className={cn(inputClass, "ps-9")}
            />
          </div>
          <div className="max-h-40 overflow-y-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            {filteredSchools.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => { setSchoolId(s.id); setSchoolSearch(getLocalizedName(s.name, locale)); }}
                className={cn(
                  "w-full text-start px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors",
                  schoolId === s.id ? "bg-[#318B9B]/10 text-[#318B9B] font-medium" : "text-gray-700 dark:text-gray-300"
                )}
              >
                {getLocalizedName(s.name, locale)}
              </button>
            ))}
          </div>
        </div>

        {/* Grade & Gender */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>{locale === "ar" ? "الصف" : "Grade"}</label>
            <input type="text" value={grade} onChange={(e) => setGrade(e.target.value)} placeholder={locale === "ar" ? "مثال: الثالث الابتدائي" : "e.g. Grade 3"} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{locale === "ar" ? "النوع" : "Gender"}</label>
            <div className="flex gap-2">
              {(["male", "female"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGender(g)}
                  className={cn(
                    "flex-1 py-2.5 rounded-xl border text-xs font-semibold transition-colors",
                    gender === g ? "bg-[#318B9B] text-white border-[#318B9B]" : "border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                  )}
                >
                  {g === "male" ? (locale === "ar" ? "ذكر" : "Male") : (locale === "ar" ? "أنثى" : "Female")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              {locale === "ar" ? "المقاسات" : "Sizes"}
            </label>
            <button
              type="button"
              onClick={() => setShowSizeGuide(!showSizeGuide)}
              className="flex items-center gap-1.5 text-xs font-medium text-[#318B9B] hover:underline"
            >
              <Ruler className="w-3.5 h-3.5" />
              {locale === "ar" ? "دليل المقاسات" : "Size Guide"}
              {showSizeGuide ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>

          {showSizeGuide && (
            <div className="mb-4 rounded-2xl border border-[#318B9B]/20 bg-[#318B9B]/5 overflow-hidden">
              <div className="px-4 py-3 border-b border-[#318B9B]/10">
                <p className="text-xs font-bold text-[#318B9B]">{locale === "ar" ? "جدول المقاسات — الملابس المدرسية" : "Size Chart — School Uniforms"}</p>
              </div>

              {/* Clothing sizes */}
              <div className="p-4 space-y-4">
                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">{locale === "ar" ? "القميص / الجاكيت" : "Shirt / Jacket"}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-center">
                      <thead>
                        <tr className="bg-[#318B9B]/10">
                          <th className="py-1.5 px-2 text-gray-600 dark:text-gray-400 font-semibold text-start">{locale === "ar" ? "العمر" : "Age"}</th>
                          {["4-5", "6-7", "8-9", "10-11", "12-13", "14-15", "16+"].map(a => <th key={a} className="py-1.5 px-2 text-gray-600 dark:text-gray-400 font-semibold">{a}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-[#318B9B]/10">
                          <td className="py-1.5 px-2 text-gray-500 text-start font-medium">{locale === "ar" ? "المقاس" : "Size"}</td>
                          {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map(s => <td key={s} className="py-1.5 px-2 text-gray-700 dark:text-gray-300">{s}</td>)}
                        </tr>
                        <tr className="border-t border-[#318B9B]/10">
                          <td className="py-1.5 px-2 text-gray-500 text-start font-medium">{locale === "ar" ? "الصدر (سم)" : "Chest (cm)"}</td>
                          {["56", "60", "64", "68", "72", "76", "80+"].map(s => <td key={s} className="py-1.5 px-2 text-gray-700 dark:text-gray-300">{s}</td>)}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">{locale === "ar" ? "البنطلون / التنورة" : "Pants / Skirt"}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-center">
                      <thead>
                        <tr className="bg-[#318B9B]/10">
                          <th className="py-1.5 px-2 text-gray-600 dark:text-gray-400 font-semibold text-start">{locale === "ar" ? "المقاس" : "Size"}</th>
                          {["24", "26", "28", "30", "32", "34", "36"].map(a => <th key={a} className="py-1.5 px-2 text-gray-600 dark:text-gray-400 font-semibold">{a}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-[#318B9B]/10">
                          <td className="py-1.5 px-2 text-gray-500 text-start font-medium">{locale === "ar" ? "الخصر (سم)" : "Waist (cm)"}</td>
                          {["61", "66", "71", "76", "81", "86", "91"].map(s => <td key={s} className="py-1.5 px-2 text-gray-700 dark:text-gray-300">{s}</td>)}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div>
                  <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2">{locale === "ar" ? "الحذاء (EU)" : "Shoes (EU)"}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-center">
                      <thead>
                        <tr className="bg-[#318B9B]/10">
                          <th className="py-1.5 px-2 text-gray-600 dark:text-gray-400 font-semibold text-start">{locale === "ar" ? "العمر" : "Age"}</th>
                          {["4-5", "6-7", "8-9", "10-11", "12-13", "14+"].map(a => <th key={a} className="py-1.5 px-2 text-gray-600 dark:text-gray-400 font-semibold">{a}</th>)}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t border-[#318B9B]/10">
                          <td className="py-1.5 px-2 text-gray-500 text-start font-medium">EU</td>
                          {["28-29", "30-31", "32-33", "34-35", "36-37", "38-40"].map(s => <td key={s} className="py-1.5 px-2 text-gray-700 dark:text-gray-300">{s}</td>)}
                        </tr>
                        <tr className="border-t border-[#318B9B]/10">
                          <td className="py-1.5 px-2 text-gray-500 text-start font-medium">{locale === "ar" ? "القدم (سم)" : "Foot (cm)"}</td>
                          {["18-19", "19-20", "20-21", "22-23", "23-24", "24-26"].map(s => <td key={s} className="py-1.5 px-2 text-gray-700 dark:text-gray-300">{s}</td>)}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "shirt", ar: "القميص", en: "Shirt" },
              { key: "pants", ar: "البنطلون", en: "Pants" },
              { key: "skirt", ar: "التنورة", en: "Skirt" },
              { key: "shoes", ar: "الحذاء (EU)", en: "Shoes (EU)" },
              { key: "jacket", ar: "الجاكيت", en: "Jacket" },
            ].map(({ key, ar, en }) => (
              <div key={key}>
                <label className={labelClass}>{locale === "ar" ? ar : en}</label>
                <input
                  type="text"
                  value={sizes[key as keyof typeof sizes]}
                  onChange={(e) => updateSize(key as keyof typeof sizes, e.target.value)}
                  placeholder={locale === "ar" ? "مثال: M أو 32" : "e.g. M or 32"}
                  className={inputClass}
                />
              </div>
            ))}
          </div>
        </div>

        {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl text-sm">{error}</div>}

        <div className="flex gap-3 pt-2">
          <button type="button" onClick={() => router.back()} className="flex-1 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-bold py-3.5 rounded-2xl text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {locale === "ar" ? "إلغاء" : "Cancel"}
          </button>
          <button type="submit" disabled={createMut.isPending} className="flex-1 bg-[#318B9B] text-white font-bold py-3.5 rounded-2xl text-sm hover:bg-[#1a5f6b] disabled:opacity-60 transition-colors active:scale-95">
            {createMut.isPending ? "..." : (locale === "ar" ? "حفظ الطالب" : "Save Student")}
          </button>
        </div>
      </form>
    </div>
  );
}
