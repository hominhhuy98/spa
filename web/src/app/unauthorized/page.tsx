import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">🚫</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Không có quyền truy cập</h1>
        <p className="text-gray-500 mb-8">
          Tài khoản của bạn không có quyền truy cập vào trang này.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/"
            className="px-6 py-2.5 bg-primary text-white font-semibold rounded-xl hover:opacity-90 transition">
            Về trang chủ
          </Link>
          <Link href="/admin/login"
            className="px-6 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition">
            Đăng nhập lại
          </Link>
        </div>
      </div>
    </div>
  );
}
