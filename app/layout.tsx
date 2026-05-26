import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/layout/Providers";

export const metadata: Metadata = {
  title: { default: "Schoola | سكولا", template: "%s | Schoola" },
  description: "Egypt's #1 platform for official school uniforms & supplies | المنصة الأولى للزي المدرسي الرسمي والأدوات الدراسية في مصر",
  icons: { icon: "/icon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" dir="ltr" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `try{var s=JSON.parse(localStorage.getItem('schoola_ui')||'{}');var st=s.state||{};if(st.darkMode)document.documentElement.classList.add('dark');if(st.locale){document.documentElement.lang=st.locale;document.documentElement.dir=st.locale==='ar'?'rtl':'ltr';}}catch(e){}` }} />
      </head>
      <body className="antialiased bg-gray-50 dark:bg-gray-950" style={{ fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
