import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Phòng khám Chuyên khoa Da liễu & Spa | CTCP BV Y dược Sài Gòn",
  description: "Trang thông tin Y khoa, Dịch vụ Da liễu và Chăm sóc Thẩm mỹ (Spa)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <nav className="bg-white shadow-md w-full sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <img src="/assets/logo.png" alt="Logo" className="h-10 w-auto" />
                <span className="ml-3 font-bold text-xl text-primary">BV Y dược Sài Gòn</span>
              </div>
              <div className="flex items-center space-x-6 text-sm font-medium">
                <a href="/" className="text-gray-700 hover:text-primary">Trang chủ</a>
                <a href="/dich-vu-da-lieu" className="text-gray-700 hover:text-primary">Da liễu</a>
                <a href="/spa" className="text-gray-700 hover:text-primary">Thẩm mỹ Spa</a>
                <a href="/tin-tuc" className="text-gray-700 hover:text-primary">Kiến thức</a>
                <a href="/dat-lich" className="bg-primary text-white px-4 py-2 rounded hover:bg-blue-800 transition">Đặt lịch khám</a>
              </div>
            </div>
          </div>
        </nav>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-gray-800 text-white py-8 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm">
            <p>&copy; 2026 CTCP Bệnh viện Y dược Sài Gòn. Đã đăng ký bản quyền.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
