import type { Metadata } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";
import { getServerUser } from "@/lib/firebase-session";
import PublicShell from "@/components/PublicShell";

const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["vietnamese"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-be-vietnam",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["italic", "normal"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "Phòng Khám Chuyên Khoa Da Liễu & Spa | CTCP BV Y Dược Sài Gòn",
  description: "Phòng khám Da liễu & Spa – Điều trị mụn, nám, chàm, vảy nến, sẹo và các bệnh lý da liễu. Bác sĩ Chuyên khoa I trực tiếp thăm khám, phác đồ chuẩn Bộ Y Tế.",
  other: {
    "zalo-platform-site-verification": "JFg16QRMDmTatvyAcQiBFXEdq17_qGLECp8r",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let isLoggedIn  = false;
  let displayName = '';
  try {
    const user = await getServerUser();
    if (user) {
      isLoggedIn  = true;
      displayName = user.name as string || user.email || '';
    }
  } catch { /* ngoài portal, lỗi cookie là bình thường */ }

  return (
    <html lang="vi" className={`${beVietnamPro.variable} ${playfairDisplay.variable}`}>
      <body className="font-sans antialiased">
        <PublicShell isLoggedIn={isLoggedIn} displayName={displayName}>
          {children}
        </PublicShell>
      </body>
    </html>
  );
}
