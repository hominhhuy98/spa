import Link from 'next/link';

const UU_DAI = [
  {
    giam: 'GIẢM 30K',
    mau_bg: 'bg-primary',
    mo_ta: 'Khi khách hàng mới sử dụng dịch vụ lấy nhân mụn, chiếu ánh sáng và điện di.',
    icon: '✨',
  },
  {
    giam: 'GIẢM 50K',
    mau_bg: 'bg-secondary',
    mo_ta: 'Khi khách hàng mới sử dụng COMBO Điều Trị Mụn chuyên sâu (gói 1-2-3 buổi).',
    icon: '💎',
  },
  {
    giam: 'GIẢM 100K',
    mau_bg: 'bg-blue-800',
    mo_ta: 'Khi khách hàng mới khám bác sĩ và điều trị theo toa (thuốc, sản phẩm, dịch vụ bất kỳ).',
    icon: '🏆',
  },
];

const DIEU_KIEN = [
  'Chỉ cần đặt lịch hẹn trước qua hotline hoặc form trực tuyến',
  'Áp dụng cho hóa đơn đầu tiên của khách hàng mới',
  'Không cần check-in hay mã giới thiệu',
  'Có thể kết hợp với các chương trình khuyến mãi khác (nếu có)',
];

export default function KhuyenMai() {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}
      <div className="bg-primary text-white py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-white" style={{transform:'translate(-50%,-50%)'}} />
          <div className="absolute bottom-0 right-1/4 w-48 h-48 rounded-full bg-white" style={{transform:'translate(50%,50%)'}} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <p className="text-secondary-light text-xs font-bold uppercase tracking-widest mb-3">Ưu Đãi Đặc Biệt</p>
          <h1 className="text-5xl font-black mb-2 tracking-tight">
            KHÁCH HÀNG
            <span className="text-secondary-light block text-6xl">MỚI</span>
          </h1>
          <p className="text-blue-100 mt-3 text-sm leading-relaxed">
            Chương trình ưu đãi dành cho khách hàng lần đầu đến khám và điều trị tại
            Phòng Khám Da Liễu & Spa — CTCP Bệnh Viện Y Dược Sài Gòn
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Ưu đãi chính */}
        <div className="space-y-4 mb-12">
          {UU_DAI.map((ud) => (
            <div key={ud.giam}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex items-stretch">
              <div className={`${ud.mau_bg} text-white px-6 py-5 flex flex-col items-center justify-center min-w-[120px] shrink-0`}>
                <span className="text-2xl mb-1">{ud.icon}</span>
                <p className="text-2xl font-black leading-tight">{ud.giam}</p>
                <p className="text-xs opacity-80 font-medium mt-1">CHO MỖI KHÁCH</p>
              </div>
              <div className="flex-1 px-6 py-5 flex items-center">
                <p className="text-gray-700 leading-relaxed">{ud.mo_ta}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Điều kiện */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-7 mb-8">
          <h2 className="font-black text-primary text-lg mb-5 flex items-center gap-2">
            <span>📋</span> Điều Kiện Áp Dụng
          </h2>
          <ul className="space-y-3">
            {DIEU_KIEN.map((dk) => (
              <li key={dk} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-secondary/15 text-secondary flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">✓</span>
                <span>{dk}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Lưu ý */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
          <h3 className="font-bold text-amber-800 mb-2 text-sm">💡 Lưu Ý</h3>
          <p className="text-sm text-amber-900 leading-relaxed">
            Ưu đãi áp dụng từ ngày <strong>15/04/2024</strong> cho đến khi có thông báo mới.
            Bệnh viện có quyền điều chỉnh hoặc kết thúc chương trình mà không cần báo trước.
            Vui lòng liên hệ hotline để được xác nhận trước khi đến khám.
          </p>
        </div>

        {/* CTA */}
        <div className="bg-primary text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-black mb-2">Sẵn Sàng Trải Nghiệm?</h3>
          <p className="text-blue-100 text-sm mb-6">
            Đặt lịch ngay để nhận ưu đãi dành cho khách hàng mới. Bác sĩ Chuyên khoa I
            sẽ thăm khám và tư vấn phác đồ phù hợp nhất cho bạn.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dat-lich"
              className="bg-white text-primary font-black px-7 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm">
              Đặt Lịch Nhận Ưu Đãi →
            </Link>
            <a href="tel:02862852727"
              className="bg-white/10 border border-white/25 text-white font-bold px-7 py-3 rounded-lg hover:bg-white/20 transition-colors text-sm">
              028 6285 2727
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
