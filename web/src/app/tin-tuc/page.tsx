import Link from 'next/link';

const KIEN_THUC = [
  {
    id: "1",
    title: "Phòng Ngừa Mụn Trong Mùa Hè Nắng Nóng",
    desc: 'Nhiệt độ cao, mồ hôi nhiều và bụi bẩn là "công thức" bít tắc lỗ chân lông. Hướng dẫn chăm sóc da khoa học từ bác sĩ chuyên khoa.',
    tag: "Mụn Trứng Cá",
    nguon: "Hướng dẫn Da liễu Bộ Y Tế VN",
    date: "2026-03-23"
  },
  {
    id: "2",
    title: "Hiểu Đúng Về Corticoid Trong Mỹ Phẩm & Kem Trộn",
    desc: "Corticoid bị lạm dụng trong kem trộn làm trắng da gây teo da, giãn mạch, phụ thuộc thuốc. Bác sĩ phân tích tác hại và hướng điều trị phục hồi.",
    tag: "Cảnh Báo Y Khoa",
    nguon: "Hội Da Liễu Việt Nam",
    date: "2026-03-10"
  },
  {
    id: "3",
    title: "Nám Da: Phân Biệt Nám Thượng Bì Và Hạ Bì Để Điều Trị Đúng",
    desc: "Nám thượng bì (nâu đều) và nám hạ bì (xám xanh) có cơ chế bệnh sinh và phác đồ điều trị hoàn toàn khác nhau. Soi đèn Wood là bước bắt buộc.",
    tag: "Nám Da",
    nguon: "Hội Da Liễu Việt Nam",
    date: "2026-03-05"
  },
  {
    id: "4",
    title: "Retinoid: 'Vàng Ròng' Của Da Liễu Và Cách Dùng An Toàn",
    desc: "Tretinoin, Adapalene, Retinol có cơ chế và độ mạnh khác nhau. Hướng dẫn chi tiết cách bắt đầu, tần suất và xử lý khi da bị kích ứng.",
    tag: "Kiến Thức Chăm Sóc Da",
    nguon: "Hội Da Liễu VN, Bộ Y Tế",
    date: "2026-02-28"
  },
  {
    id: "5",
    title: "Chàm Dị Ứng (Atopic Dermatitis): Kiểm Soát Bệnh Lâu Dài",
    desc: "Chàm cơ địa là bệnh mãn tính tái phát. Hiểu đúng về yếu tố khởi phát, vai trò của dưỡng ẩm Ceramide và khi nào cần dùng thuốc kê đơn.",
    tag: "Bệnh Da Mãn Tính",
    nguon: "Bộ Y Tế Việt Nam",
    date: "2026-02-20"
  },
  {
    id: "6",
    title: "Chống Nắng Đúng Cách: SPF, PA, Khoáng Và Hóa Học",
    desc: "SPF chỉ bảo vệ UVB, PA++ đến PA++++ bảo vệ UVA. Phân tích chống nắng khoáng (zinc oxide) vs hóa học và cách lựa chọn phù hợp từng loại da.",
    tag: "Kiến Thức Chăm Sóc Da",
    nguon: "Bộ Y Tế Việt Nam",
    date: "2026-02-14"
  },
  {
    id: "7",
    title: "Vảy Nến Không Lây: Giải Oan Cho Bệnh Nhân",
    desc: "Vảy nến là bệnh tự miễn, không có khả năng lây từ người sang người qua tiếp xúc. Phân tích khoa học và hướng dẫn sống chung với bệnh.",
    tag: "Bệnh Da Mãn Tính",
    nguon: "Hội Da Liễu Việt Nam",
    date: "2026-02-08"
  },
  {
    id: "8",
    title: "Isotretinoin (Roaccutane) Và 10 Điều Cần Biết Trước Khi Dùng",
    desc: "Isotretinoin là thuốc trị mụn nặng mạnh nhất hiện nay nhưng cần theo dõi chặt chẽ. Các xét nghiệm bắt buộc, tác dụng phụ và chống chỉ định tuyệt đối.",
    tag: "Mụn Trứng Cá",
    nguon: "Hội Da Liễu VN, Cục Quản lý Dược",
    date: "2026-01-30"
  },
  {
    id: "9",
    title: "7 Thói Quen Chăm Sóc Da Khiến Mụn Ngày Càng Nặng Hơn",
    desc: "Tự nặn mụn tại nhà, thay đổi sản phẩm liên tục, tẩy da chết quá nhiều... Đây là những sai lầm phổ biến nhất khiến tình trạng mụn không cải thiện mà còn nghiêm trọng hơn.",
    tag: "Mụn Trứng Cá",
    nguon: "BV Y Dược Sài Gòn – Da Liễu Chuyên Sâu",
    date: "2026-03-25"
  },
];

const TAG_COLORS: Record<string, string> = {
  'Mụn Trứng Cá': 'bg-orange-100 text-orange-700',
  'Cảnh Báo Y Khoa': 'bg-red-100 text-red-700',
  'Nám Da': 'bg-purple-100 text-purple-700',
  'Kiến Thức Chăm Sóc Da': 'bg-green-100 text-green-700',
  'Bệnh Da Mãn Tính': 'bg-blue-100 text-blue-700',
};

export default function TinTuc() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-secondary text-sm font-bold uppercase tracking-widest mb-2">Thư Viện Y Khoa</p>
          <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Kiến Thức Da Liễu Chuẩn Y Khoa</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Tổng hợp kiến thức chuyên sâu về da liễu, được biên soạn bởi bác sĩ chuyên khoa
            và trích dẫn từ Hội Da Liễu Việt Nam, Bộ Y Tế và các chuyên gia chuyên khoa.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-12 space-y-6">
        {KIEN_THUC.map((bai) => (
          <article key={bai.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 hover:shadow-md transition group">
            <div className="flex flex-col md:flex-row md:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${TAG_COLORS[bai.tag] || 'bg-gray-100 text-gray-600'}`}>
                    {bai.tag}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(bai.date).toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                </div>
                <Link href={`/tin-tuc/${bai.id}`}>
                  <h2 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary transition leading-snug">
                    {bai.title}
                  </h2>
                </Link>
                <p className="text-gray-600 leading-relaxed mb-4">{bai.desc}</p>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 text-xs font-semibold px-3 py-1 rounded border border-blue-100">
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                    {bai.nguon}
                  </span>
                </div>
              </div>
              <Link href={`/tin-tuc/${bai.id}`} className="shrink-0 text-primary font-bold text-sm hover:underline self-center whitespace-nowrap">
                Đọc tiếp →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
