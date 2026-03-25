import Link from 'next/link';

const CATEGORIES = [
  {
    id: 'cham-soc-da',
    name: 'Chăm Sóc Da',
    icon: '💆',
    mau_bg: 'bg-teal-600',
    mau_light: 'bg-teal-50',
    mau_border: 'border-teal-200',
    mau_text: 'text-teal-700',
    mau_badge: 'bg-teal-100 text-teal-800',
    goi: [
      {
        name: 'Chăm Sóc Da Thư Giãn',
        muc: 'Cơ Bản',
        buoc: ['Massage mặt', 'Chiếu đèn thường', 'Mask', 'Điện di serum'],
      },
      {
        name: 'Chăm Sóc Da Massage Nâng Cơ',
        sub: 'Chuyên sâu',
        muc: 'Chuyên Sâu',
        buoc: ['Massage nâng cơ', 'Máy RF nâng cơ'],
      },
      {
        name: 'DETOX Thanh Lọc Da',
        sub: 'Da mụn · da thường · sáng da',
        muc: 'Chuyên Sâu',
        buoc: ['Thải độc', 'Điện di', 'Chiếu đèn', 'Mask'],
      },
    ],
  },
  {
    id: 'mun-face',
    name: 'Mụn Face',
    icon: '🔬',
    mau_bg: 'bg-orange-500',
    mau_light: 'bg-orange-50',
    mau_border: 'border-orange-200',
    mau_text: 'text-orange-700',
    mau_badge: 'bg-orange-100 text-orange-800',
    goi: [
      {
        name: 'Chăm Sóc Da Mụn Cơ Bản',
        muc: 'Cơ Bản',
        buoc: ['Nặn mụn', 'Điện di', 'Mask thường', 'Chiếu đèn thường'],
      },
      {
        name: 'Chăm Sóc Da Mụn Chuyên Sâu',
        sub: 'Điều trị mụn đèn LED chuyên sâu',
        muc: 'Chuyên Sâu',
        buoc: ['Nặn mụn', 'Điện di serum mụn', 'Chiếu đèn LED chuyên sâu', 'Điện di serum mụn (sau đèn)'],
      },
      {
        name: 'Aquapeel',
        sub: 'Mụn cám · đầu đen',
        muc: 'Chuyên Sâu',
        buoc: ['Nặn mụn', 'Sử dụng đầu Aquapeel', 'Chiếu đèn thường', 'Mask thường', 'Điện di serum'],
      },
    ],
  },
  {
    id: 'mun-body',
    name: 'Mụn Body',
    icon: '🫁',
    mau_bg: 'bg-amber-600',
    mau_light: 'bg-amber-50',
    mau_border: 'border-amber-200',
    mau_text: 'text-amber-700',
    mau_badge: 'bg-amber-100 text-amber-800',
    goi: [
      {
        name: 'Chăm Sóc Da Mụn Body Cơ Bản',
        muc: 'Cơ Bản',
        buoc: ['Nặn mụn', 'Điện di', 'Mask thường', 'Chiếu đèn thường'],
      },
      {
        name: 'Chăm Sóc Da Mụn Body Chuyên Sâu',
        sub: 'Điều trị mụn đèn LED chuyên sâu',
        muc: 'Chuyên Sâu',
        buoc: ['Nặn mụn', 'Điện di serum mụn', 'Chiếu đèn LED chuyên sâu', 'Điện di serum mụn (sau đèn)'],
      },
    ],
  },
  {
    id: 'da-nhay-cam',
    name: 'Da Nhạy Cảm',
    icon: '🌸',
    mau_bg: 'bg-rose-500',
    mau_light: 'bg-rose-50',
    mau_border: 'border-rose-200',
    mau_text: 'text-rose-700',
    mau_badge: 'bg-rose-100 text-rose-800',
    goi: [
      {
        name: 'Chăm Sóc Da Nhạy Cảm Cơ Bản',
        muc: 'Cơ Bản',
        buoc: ['Mask thường', 'Chiếu đèn thường', 'Điện di'],
      },
      {
        name: 'Chăm Sóc Da Nhạy Cảm Chuyên Sâu',
        sub: 'Bằng đèn LED chuyên sâu',
        muc: 'Chuyên Sâu',
        buoc: ['Chiếu đèn LED chuyên sâu', 'Mask giấy', 'Điện di'],
      },
    ],
  },
  {
    id: 'cham-soc-toan-dien',
    name: 'Chăm Sóc Da Toàn Diện',
    icon: '✨',
    mau_bg: 'bg-purple-600',
    mau_light: 'bg-purple-50',
    mau_border: 'border-purple-200',
    mau_text: 'text-purple-700',
    mau_badge: 'bg-purple-100 text-purple-800',
    goi: [
      {
        name: 'Trẻ Hoá Da · Cấp Ẩm · Phục Hồi Căng Bóng',
        muc: 'Toàn Diện',
        buoc: ['Massage mặt', 'Nano serum căng bóng', 'Mask thường', 'Phun oxy', 'Điện di serum cấp ẩm', 'Chiếu đèn thường'],
      },
      {
        name: 'Sáng Da · Mờ Thâm',
        muc: 'Toàn Diện',
        buoc: ['Massage mặt', 'Nano sáng da', 'Mask thường', 'Phun oxy', 'Điện di serum sáng da', 'Chiếu đèn thường'],
      },
    ],
  },
  {
    id: 'peel-face',
    name: 'Peel Da Face',
    icon: '💎',
    mau_bg: 'bg-blue-600',
    mau_light: 'bg-blue-50',
    mau_border: 'border-blue-200',
    mau_text: 'text-blue-700',
    mau_badge: 'bg-blue-100 text-blue-800',
    goi: [
      {
        name: 'Peel Da Mụn Cơ Bản',
        sub: '900.000đ',
        muc: 'Cơ Bản',
        buoc: ['Nặn mụn', 'Peel 1 lớp', 'Điện di', 'Mask thường', 'Chiếu đèn thường'],
        note: 'Đèn LED tính riêng nếu có nhu cầu.',
      },
      {
        name: 'Peel Da Mụn Chuyên Sâu',
        sub: 'Từ 1.000.000đ',
        muc: 'Chuyên Sâu',
        buoc: ['Nặn mụn', 'Peel 2 lớp', 'Điện di', 'Mask thường', 'Chiếu đèn thường'],
        note: 'Đèn LED có thể tính riêng hoặc gộp vào gói — tư vấn trực tiếp.',
      },
      {
        name: 'Peel Điều Trị Thâm Mụn · Sạm Nám',
        sub: 'Không bong',
        muc: 'Điều Trị',
        buoc: ['Nặn mụn cám (nếu có)', 'Peel 1 lớp', 'Điện di', 'Mask thường', 'Chiếu đèn thường'],
      },
      {
        name: 'Peel Trẻ Hoá Da Toàn Diện',
        sub: 'Có bong hoặc không bong',
        muc: 'Cao Cấp',
        buoc: ['Nặn mụn cám (nếu có)', 'Peel 2 lớp (không bong) hoặc SP Peel bong', 'Mask thường', 'Điện di', 'Chiếu đèn thường'],
        note: 'Đèn LED có thể tính riêng hoặc gộp vào gói — tư vấn trực tiếp.',
      },
    ],
  },
  {
    id: 'peel-body',
    name: 'Peel Da Body',
    icon: '🌿',
    mau_bg: 'bg-green-600',
    mau_light: 'bg-green-50',
    mau_border: 'border-green-200',
    mau_text: 'text-green-700',
    mau_badge: 'bg-green-100 text-green-800',
    goi: [
      {
        name: 'Peel Vi Tảo Lưng',
        sub: 'Có bong hoặc không bong',
        muc: 'Body',
        buoc: ['Nặn mụn', 'Peel da', 'Mask', 'Chiếu đèn', 'Điện di'],
      },
    ],
  },
];

const MUC_COLOR: Record<string, string> = {
  'Cơ Bản': 'bg-gray-100 text-gray-600',
  'Chuyên Sâu': 'bg-blue-100 text-blue-700',
  'Toàn Diện': 'bg-purple-100 text-purple-700',
  'Điều Trị': 'bg-orange-100 text-orange-700',
  'Cao Cấp': 'bg-yellow-100 text-yellow-700',
  'Body': 'bg-green-100 text-green-700',
};

export default function GoiDichVu() {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Hero */}
      <div className="bg-primary text-white py-12 text-center">
        <h1 className="text-4xl font-black mb-3 tracking-tight">Gói Dịch Vụ Spa</h1>
        <p className="text-blue-100 max-w-xl mx-auto text-sm leading-relaxed">
          Đa dạng gói chăm sóc da từ cơ bản đến chuyên sâu — được thiết kế theo từng tình trạng da,
          thực hiện bởi kỹ thuật viên được đào tạo bài bản tại BV Y Dược Sài Gòn.
        </p>
        <div className="flex flex-wrap justify-center gap-2 mt-5">
          {CATEGORIES.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`}
              className="bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
              {cat.icon} {cat.name}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-14">

        {CATEGORIES.map((cat) => (
          <section key={cat.id} id={cat.id}>
            {/* Category Header */}
            <div className={`${cat.mau_bg} text-white rounded-2xl px-6 py-4 mb-6 flex items-center gap-3`}>
              <span className="text-2xl">{cat.icon}</span>
              <div>
                <h2 className="text-xl font-black tracking-tight">{cat.name}</h2>
                <p className="text-white/75 text-xs mt-0.5">{cat.goi.length} gói dịch vụ</p>
              </div>
            </div>

            {/* Package Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.goi.map((goi) => (
                <div key={goi.name}
                  className={`bg-white rounded-xl border ${cat.mau_border} shadow-sm flex flex-col`}>
                  {/* Card header */}
                  <div className={`${cat.mau_light} px-5 pt-5 pb-4 rounded-t-xl border-b ${cat.mau_border}`}>
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className={`font-black text-sm ${cat.mau_text} leading-snug flex-1`}>{goi.name}</h3>
                      <span className={`shrink-0 text-xs font-bold px-2 py-0.5 rounded-full ${MUC_COLOR[goi.muc] ?? 'bg-gray-100 text-gray-600'}`}>
                        {goi.muc}
                      </span>
                    </div>
                    {goi.sub && (
                      <p className="text-xs text-gray-500 italic">{goi.sub}</p>
                    )}
                  </div>

                  {/* Steps */}
                  <div className="px-5 py-4 flex-1">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Quy Trình</p>
                    <ol className="space-y-2">
                      {goi.buoc.map((buoc, idx) => (
                        <li key={buoc} className="flex items-start gap-2.5 text-sm text-gray-700">
                          <span className={`shrink-0 w-5 h-5 rounded-full ${cat.mau_bg} text-white text-xs flex items-center justify-center font-bold mt-0.5`}>
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{buoc}</span>
                        </li>
                      ))}
                    </ol>
                    {'note' in goi && goi.note && (
                      <div className="mt-4 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5">
                        <p className="text-xs text-amber-700">
                          <strong>💡 Lưu ý:</strong> {goi.note}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="px-5 pb-5">
                    <Link href={`/dat-lich?dich-vu=${encodeURIComponent(goi.name)}`}
                      className={`block text-center text-xs font-bold py-2.5 rounded-lg ${cat.mau_bg} text-white hover:opacity-90 transition-opacity`}>
                      Đặt Lịch Gói Này
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {/* Bottom CTA */}
        <div className="bg-primary text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-black mb-2">Chưa Biết Chọn Gói Nào?</h3>
          <p className="text-blue-100 text-sm mb-6 max-w-md mx-auto">
            Kỹ thuật viên sẽ tư vấn và đề xuất gói phù hợp nhất với tình trạng da của bạn — miễn phí tư vấn.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dat-lich"
              className="bg-white text-primary font-black px-7 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm">
              Đặt Lịch Tư Vấn →
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
