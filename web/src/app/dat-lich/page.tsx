'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

const SERVICES = [
  { group: '🔬 Da Liễu – Bệnh Lý', items: [
    'Khám Mụn Trứng Cá (Acne)',
    'Điều Trị Nám / Tàn Nhang',
    'Khám Viêm Da Cơ Địa / Chàm',
    'Khám Vảy Nến (Psoriasis)',
    'Khám Mề Đay / Dị Ứng Da',
    'Điều Trị Rụng Tóc',
    'Khám Nấm Da / Nấm Móng',
    'Khám Trứng Cá Đỏ (Rosacea)',
    'Khám Viêm Da Tiếp Xúc',
    'Điều Trị Sẹo Lồi / Sẹo Phì Đại',
  ]},
  { group: '✨ Thẩm Mỹ Da – Laser', items: [
    'Laser Toning Trị Nám (Nd:YAG)',
    'Laser CO₂ Fractional Trị Sẹo Rỗ',
    'Laser PDL Trị Giãn Mạch / Rosacea',
    'Lăn Kim RF Vi Điểm (Microneedling RF)',
    'IPL Trẻ Hóa Da Toàn Diện',
    'Peel Hóa Học (Chemical Peel)',
    'PRP Tóc / Tái Tạo Da',
  ]},
  { group: '💆 Gói Spa – Chăm Sóc Da', items: [
    'Chăm Sóc Da Thư Giãn',
    'Chăm Sóc Da Massage Nâng Cơ',
    'DETOX Thanh Lọc Da',
    'Chăm Sóc Da Mụn Cơ Bản',
    'Chăm Sóc Da Mụn Chuyên Sâu',
    'Aquapeel',
    'Chăm Sóc Da Mụn Body Cơ Bản',
    'Chăm Sóc Da Mụn Body Chuyên Sâu',
    'Chăm Sóc Da Nhạy Cảm Cơ Bản',
    'Chăm Sóc Da Nhạy Cảm Chuyên Sâu',
    'Trẻ Hoá Da · Cấp Ẩm · Phục Hồi Căng Bóng',
    'Sáng Da · Mờ Thâm',
    'Peel Da Mụn Cơ Bản',
    'Peel Da Mụn Chuyên Sâu',
    'Peel Điều Trị Thâm Mụn · Sạm Nám',
    'Peel Trẻ Hoá Da Toàn Diện',
    'Peel Vi Tảo Lưng',
  ]},
];

function DatLichContent() {
  const searchParams = useSearchParams();
  const initService = searchParams.get('dich-vu') || '';
  const [formData, setFormData] = useState({ name: '', phone: '', service: initService, date: '', notes: '' });
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const response = await fetch('/api/book-appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', phone: '', service: '', date: '', notes: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white py-12 text-center">
        <h1 className="text-4xl font-black mb-3 tracking-tight">Đặt Lịch Khám Trực Tuyến</h1>
        <p className="text-blue-100 max-w-xl mx-auto">
          Điền thông tin bên dưới — Đội ngũ lễ tân sẽ liên hệ xác nhận lịch hẹn trong vòng <strong>2 giờ làm việc</strong>.
        </p>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          {status === 'success' && (
            <div className="bg-green-50 border border-green-300 text-green-800 px-5 py-4 rounded-xl mb-6 text-center font-semibold">
              ✅ Đăng ký thành công! Bệnh viện sẽ liên hệ với bạn trong vòng 2 giờ.
            </div>
          )}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-5 py-4 rounded-xl mb-6 text-center font-semibold">
              ❌ Có lỗi xảy ra, vui lòng thử lại sau hoặc gọi trực tiếp hotline.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Họ và Tên <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="Nguyễn Văn A"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-sm"
                  value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Số Điện Thoại <span className="text-red-500">*</span></label>
                <input required type="tel" placeholder="0901 234 567"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-sm"
                  value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Dịch Vụ Quan Tâm <span className="text-red-500">*</span></label>
                <select required
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-sm bg-white"
                  value={formData.service} onChange={e => setFormData({...formData, service: e.target.value})}>
                  <option value="">-- Chọn dịch vụ --</option>
                  {SERVICES.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.items.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Ngày Dự Kiến <span className="text-red-500">*</span></label>
                <input required type="date"
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition text-sm"
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Mô Tả Tình Trạng / Ghi Chú Thêm</label>
              <textarea placeholder="Mô tả ngắn tình trạng da, câu hỏi muốn hỏi bác sĩ, thời gian muốn khám (sáng/chiều)..."
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none h-28 resize-none transition text-sm"
                value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>

            <button type="submit" disabled={status === 'loading'}
              className="w-full bg-primary text-white font-black py-3.5 rounded-xl hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed text-base tracking-wide">
              {status === 'loading' ? '⏳ Đang gửi...' : '📅 Gửi Đăng Ký Lịch Hẹn'}
            </button>
          </form>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">

          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <h3 className="font-black text-gray-900 mb-3 text-sm uppercase tracking-wide">Thông Tin Liên Hệ</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0 mt-0.5">📍</span>
                <span>405-407 Đỗ Xuân Hợp, Phước Long, TP.HCM</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0">☎️</span>
                <span>
                  <a href="tel:02862852727" className="font-bold hover:underline">028 6285 2727</a><br/>
                  <a href="tel:02862852929" className="font-bold hover:underline">028 6285 2929</a>
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary shrink-0 mt-0.5">🕐</span>
                <span>Thứ 2 – Chủ Nhật: 8:00–11:30 &amp; 13:30–17:00</span>
              </li>
            </ul>
          </div>

          {/* Lưu ý quan trọng */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <h3 className="font-black text-amber-800 mb-3 text-sm uppercase tracking-wide">⚠️ Lưu Ý Khi Đến Khám</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2.5">
                <span className="shrink-0 text-base">🪪</span>
                <div>
                  <p className="font-bold text-gray-800 leading-tight">Hồ Sơ Bệnh Án Điện Tử</p>
                  <p className="text-gray-600 text-xs mt-0.5">Mang theo <strong>CCCD hoặc VNeID</strong> để hoàn thiện hồ sơ</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="shrink-0 text-base">🧴</span>
                <div>
                  <p className="font-bold text-gray-800 leading-tight">Mang Sản Phẩm Đang Dùng</p>
                  <p className="text-gray-600 text-xs mt-0.5">Mang sản phẩm hoặc chụp ảnh thành phần để bác sĩ đánh giá</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="shrink-0 text-base">🚫</span>
                <div>
                  <p className="font-bold text-gray-800 leading-tight">Lưu Ý Điều Trị Mụn</p>
                  <ul className="text-gray-600 text-xs mt-0.5 space-y-0.5">
                    <li>• Không dùng sp trị mụn không rõ nguồn gốc</li>
                    <li>• Không tự ý điều trị khi chưa có chỉ định bác sĩ</li>
                  </ul>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="shrink-0 text-base">👨‍👧</span>
                <div>
                  <p className="font-bold text-gray-800 leading-tight">Khách Hàng Dưới 18 Tuổi</p>
                  <p className="text-gray-600 text-xs mt-0.5">Cần phụ huynh đi cùng hoặc cung cấp <strong>tên + SĐT người thân</strong> xác nhận</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="shrink-0 text-base">🅿️</span>
                <div>
                  <p className="font-bold text-gray-800 leading-tight">Lưu Ý Đỗ Xe</p>
                  <p className="text-gray-600 text-xs mt-0.5">Có bãi giữ xe tại cơ sở. Vui lòng đến đúng giờ để đảm bảo chỗ</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hủy lịch hẹn */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5">
            <h3 className="font-black text-red-700 mb-2 text-sm uppercase tracking-wide">📅 Chính Sách Hủy Hẹn</h3>
            <p className="text-xs text-gray-700 leading-relaxed">
              Nếu không thể đến đúng hẹn, vui lòng <strong>báo trước ít nhất 3 tiếng</strong> để bệnh viện sắp xếp lịch cho khách khác.
            </p>
            <p className="text-xs text-gray-500 mt-1.5">
              Giờ cao điểm có thể phải chờ trên 20 phút — xin quý khách thông cảm.
            </p>
            <a href="tel:02862852727"
              className="mt-3 block text-center text-xs font-bold py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
              Gọi Báo Hủy: 028 6285 2727
            </a>
          </div>

          {/* Hotline */}
          <div className="bg-secondary text-white rounded-2xl p-5 text-center">
            <p className="text-sm font-semibold mb-1">Hotline Tư Vấn</p>
            <a href="tel:02862852727" className="text-xl font-black tracking-wider hover:underline block">028 6285 2727</a>
            <a href="tel:02862852929" className="text-xl font-black tracking-wider hover:underline block">028 6285 2929</a>
          </div>
        </div>
      </div>

      {/* Bản đồ */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <span className="text-primary font-bold">📍</span>
            <div>
              <h3 className="font-black text-gray-900 text-sm">Vị Trí Phòng Khám</h3>
              <p className="text-xs text-gray-500">405-407 Đỗ Xuân Hợp, Phường Phước Long B, TP. Thủ Đức, TP.HCM</p>
            </div>
          </div>
          <iframe
            src="https://maps.google.com/maps?q=405+Do+Xuan+Hop,+Phuoc+Long+B,+Thu+Duc,+Ho+Chi+Minh&output=embed&hl=vi&z=16"
            width="100%"
            height="320"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bản đồ BV Y Dược Sài Gòn"
          />
          <div className="px-6 py-3 bg-gray-50 flex flex-wrap gap-4 text-xs text-gray-600">
            <span>🚌 Gần trạm xe buýt Đỗ Xuân Hợp</span>
            <span>🏫 Gần trường học khu vực Phước Long</span>
            <a
              href="https://maps.google.com/maps?q=405+Do+Xuan+Hop,+Phuoc+Long+B,+Thu+Duc,+Ho+Chi+Minh"
              target="_blank" rel="noopener noreferrer"
              className="ml-auto font-semibold text-primary hover:underline">
              Mở Google Maps →
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DatLich() {
  return (
    <Suspense>
      <DatLichContent />
    </Suspense>
  );
}
