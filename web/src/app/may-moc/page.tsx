import Image from 'next/image';
import Link from 'next/link';

const MAY_MOC = [
  {
    id: 'laser-nd-yag',
    ten: 'Laser Nd:YAG Q-Switched',
    loai: 'Laser Điều Trị',
    anh: '/assets/may-moc/laser-ipl.jpg',
    mo_ta: 'Hệ thống laser Nd:YAG 1064nm / 532nm Q-Switched thế hệ mới, xung ngắn nanosecond đến picosecond. Phá vỡ hạt sắc tố chọn lọc mà không tổn thương mô xung quanh.',
    chi_dinh: [
      'Nám da thượng bì & hỗn hợp (Melasma)',
      'Tàn nhang, đốm nâu (Solar lentigines)',
      'Xóa xăm tattoo đa màu sắc',
      'Giãn mao mạch, đỏ da (Telangiectasia)',
      'Trẻ hóa da (Laser Toning)',
    ],
    phac_do: [
      { buoc: 'Đánh giá da & test patch 2 tuần trước', mo_ta: 'Kiểm tra phản ứng da, chọn thông số phù hợp' },
      { buoc: 'Liệu trình chuẩn: 6–10 buổi', mo_ta: 'Mỗi buổi cách nhau 3–4 tuần. Tần số 2–5Hz, fluence 2–4 J/cm²' },
      { buoc: 'Chăm sóc sau điều trị', mo_ta: 'Làm mát da 15 phút, chống nắng SPF50+ bắt buộc trong 4 tuần' },
      { buoc: 'Duy trì', mo_ta: '1 buổi/2–3 tháng sau khi đạt kết quả mong muốn' },
    ],
    ket_qua: '70–85% cải thiện sau 6 buổi',
    luuy: 'Không thực hiện khi đang dùng thuốc nhạy cảm ánh sáng. Cần tránh nắng nghiêm ngặt.',
    mau: 'border-blue-500',
    mau_badge: 'bg-blue-50 text-blue-700',
  },
  {
    id: 'laser-co2-fractional',
    ten: 'Laser CO₂ Fractional',
    loai: 'Laser Bóc Tách',
    anh: '/assets/may-moc/laser-co2.jpg',
    mo_ta: 'Laser CO₂ phân đoạn (Fractional) tạo vi chùm tia 10,600nm xuyên sâu vào trung bì, kích thích tổng hợp collagen mới và bóc tách đáy sẹo. Hiệu quả nhất trong điều trị sẹo rỗ.',
    chi_dinh: [
      'Sẹo rỗ sau mụn (Atrophic acne scars – Ice pick, Boxcar, Rolling)',
      'Sẹo lõm, sẹo bỏng, sẹo phẫu thuật',
      'Nếp nhăn sâu, lão hóa da',
      'Tái tạo bề mặt da (Skin resurfacing)',
      'Thu nhỏ lỗ chân lông giãn rộng',
    ],
    phac_do: [
      { buoc: 'Chuẩn bị: Tẩy trắng da 4 tuần trước', mo_ta: 'Dùng Tretinoin + Hydroquinone để đồng đều sắc tố, giảm nguy cơ PIH' },
      { buoc: 'Gây tê tại chỗ 45–60 phút', mo_ta: 'Kem EMLA hoặc gây tê tiêm để đảm bảo thoải mái hoàn toàn' },
      { buoc: 'Thực hiện laser', mo_ta: 'Mật độ 10–20%, năng lượng 15–30mJ. Thời gian 20–45 phút tùy vùng' },
      { buoc: 'Phục hồi 5–7 ngày', mo_ta: 'Da đỏ, bong tróc. Dưỡng ẩm Vaseline, tránh nắng tuyệt đối 4 tuần' },
    ],
    ket_qua: '50–70% cải thiện sẹo sau 3 lần. Tối đa 3–5 lần cách 3 tháng/lần',
    luuy: 'Không thực hiện trong mùa nắng gắt. Chống chỉ định khi đang dùng Isotretinoin hoặc trong 6 tháng sau khi ngừng.',
    mau: 'border-orange-500',
    mau_badge: 'bg-orange-50 text-orange-700',
  },
  {
    id: 'ipl',
    ten: 'IPL – Ánh Sáng Xung Cường Độ Cao',
    loai: 'Quang Trị Liệu',
    anh: '/assets/may-moc/chemical-peel.jpg',
    mo_ta: 'Intense Pulsed Light (IPL) phát xung sáng đa bước sóng 500–1200nm qua bộ lọc chuyên dụng, tác động chọn lọc lên chromophore (melanin, hemoglobin). Đa năng, không xâm lấn.',
    chi_dinh: [
      'Đốm nâu, tàn nhang, dày sừng ánh nắng',
      'Đỏ da, giãn mao mạch, Rosacea subtype 1–2',
      'Trẻ hóa da toàn diện (Photorejuvenation)',
      'Triệt lông (kết hợp handpiece chuyên dụng)',
      'Giảm tuyến bã nhờn (điều trị mụn nhẹ)',
    ],
    phac_do: [
      { buoc: 'Tư vấn & phân loại Fitzpatrick', mo_ta: 'Người da tối (type IV–VI) cần thận trọng, chọn fluence thấp hơn' },
      { buoc: 'Liệu trình chuẩn: 3–5 buổi', mo_ta: 'Mỗi buổi cách nhau 3–4 tuần. Fluence 12–20 J/cm² tùy vùng' },
      { buoc: 'Chăm sóc sau điều trị', mo_ta: 'Làm mát ngay sau, chống nắng SPF50+ mỗi 2 giờ trong 2 tuần' },
      { buoc: 'Duy trì', mo_ta: '1–2 buổi/năm để duy trì kết quả lâu dài' },
    ],
    ket_qua: '60–80% cải thiện đốm nâu và đỏ da sau 3–5 buổi',
    luuy: 'Không thực hiện khi đang có tan sunburn, đang điều trị kháng sinh nhóm Tetracycline.',
    mau: 'border-yellow-500',
    mau_badge: 'bg-yellow-50 text-yellow-700',
  },
  {
    id: 'rf-microneedling',
    ten: 'RF Microneedling – Lăn Kim Sóng Radio',
    loai: 'Xâm Lấn Tối Thiểu',
    anh: '/assets/may-moc/rf-micro.jpg',
    mo_ta: 'Kết hợp vi kim (microneedles) xuyên vào trung bì với năng lượng sóng RF (radiofrequency) phát trực tiếp tại đầu kim. Kích thích tổng hợp collagen, elastin và tái cấu trúc mô sẹo từ bên trong.',
    chi_dinh: [
      'Sẹo rỗ sau mụn mức độ vừa–nặng',
      'Lỗ chân lông giãn rộng',
      'Da chảy xệ, mất đàn hồi (lão hóa)',
      'Căng da mặt không phẫu thuật',
      'Rạn da (Striae)',
    ],
    phac_do: [
      { buoc: 'Làm sạch & gây tê tại chỗ 60 phút', mo_ta: 'Kem EMLA dưới màng bọc, đảm bảo không đau trong suốt quá trình' },
      { buoc: 'Thực hiện RF Microneedling', mo_ta: 'Kim sâu 1.5–3.5mm tùy vùng, năng lượng RF 10–50W. 2–4 lần qua mỗi vùng' },
      { buoc: 'PRP huyết tương giàu tiểu cầu (tùy chọn)', mo_ta: 'Thoa PRP lên mặt ngay sau để tăng cường tái tạo và giảm đỏ' },
      { buoc: 'Liệu trình: 3–4 buổi cách 6–8 tuần', mo_ta: 'Phục hồi 1–3 ngày. Da đỏ nhẹ và sưng trong 24–48h' },
    ],
    ket_qua: '60–75% cải thiện sẹo rỗ sau 3 buổi. Kết quả tiếp tục cải thiện 3–6 tháng sau',
    luuy: 'Không thực hiện khi đang có viêm da cấp tính, herpes labialis hoặc mang thiết bị kim loại cấy ghép.',
    mau: 'border-teal-500',
    mau_badge: 'bg-teal-50 text-teal-700',
  },
  {
    id: 'chemical-peel',
    ten: 'Peel Hóa Học (Chemical Peel)',
    loai: 'Điều Trị Hóa Học',
    anh: '/assets/may-moc/mesotherapy.jpg',
    mo_ta: 'Ứng dụng acid hữu cơ nồng độ được kiểm soát lên bề mặt da để bóc tách lớp sừng và tế bào chết theo chiều sâu mong muốn. Phân 3 loại: Superficial, Medium, Deep peel.',
    chi_dinh: [
      'Mụn đầu đen, mụn bọc nông (Superficial peel – AHA/BHA)',
      'Nám da thượng bì, tăng sắc tố sau viêm (PIH)',
      'Da xỉn màu, không đều tone (Glycolic/Lactic acid)',
      'Nếp nhăn nông, lão hóa sớm (TCA 20–35%)',
      'Sẹo rỗ nhẹ (Medium peel – TCA + Jessner)',
    ],
    phac_do: [
      { buoc: 'Chuẩn bị da 2–4 tuần', mo_ta: 'Dùng Tretinoin 0.025% + AHA để chuẩn bị, tăng thẩm thấu đều' },
      { buoc: 'Làm sạch & degreasing', mo_ta: 'Rửa mặt + acetone để loại bỏ dầu, đảm bảo acid thẩm thấu đều' },
      { buoc: 'Áp dụng acid (2–5 phút)', mo_ta: 'AHA 30–70% / BHA 20–30% / TCA 20–35% tùy loại peel và mục tiêu' },
      { buoc: 'Trung hòa & phục hồi', mo_ta: 'Trung hòa bằng sodium bicarbonate, dưỡng ẩm Ceramide, tránh nắng' },
    ],
    ket_qua: 'AHA/BHA: Cải thiện ngay sau 1–3 buổi. TCA: Cải thiện rõ sau 7–14 ngày phục hồi',
    luuy: 'Không thực hiện khi đang dùng Isotretinoin (ngừng ≥6 tháng), da bị sunburn, nhiễm trùng hoạt động.',
    mau: 'border-pink-500',
    mau_badge: 'bg-pink-50 text-pink-700',
  },
  {
    id: 'skin-analysis',
    ten: 'Máy Phân Tích Da (VISIA / Dermoscope)',
    loai: 'Chẩn Đoán & Phân Tích',
    anh: '/assets/may-moc/skin-analysis.jpg',
    mo_ta: 'Hệ thống phân tích da đa phổ (UV, ánh sáng thường, cross-polarized) kết hợp dermoscopy kỹ thuật số cho phép định lượng chính xác 8 thông số da và phân tích tổn thương đến cấp độ vi thể.',
    chi_dinh: [
      'Đánh giá khách quan: nám, đốm ẩn (sub-surface pigmentation)',
      'Đo chỉ số: nếp nhăn, lỗ chân lông, đỏ da, UV damage',
      'Phân tích tổn thương sắc tố (nevus, melanoma screening)',
      'Theo dõi và so sánh hiệu quả điều trị theo thời gian',
      'Tư vấn liệu trình cá nhân hóa dựa trên dữ liệu thực',
    ],
    phac_do: [
      { buoc: 'Rửa sạch mặt, không trang điểm', mo_ta: 'Đảm bảo bề mặt da sạch để kết quả phân tích chính xác nhất' },
      { buoc: 'Chụp ảnh 8 chế độ ánh sáng', mo_ta: '3 góc chụp × 8 chế độ ánh sáng trong buồng tối chuẩn hóa. Thời gian 5 phút' },
      { buoc: 'Phân tích AI & so sánh', mo_ta: 'Hệ thống so sánh với cơ sở dữ liệu >1 triệu mẫu da cùng độ tuổi' },
      { buoc: 'Tư vấn lập phác đồ', mo_ta: 'Bác sĩ đọc kết quả, xác định ưu tiên điều trị và thiết kế liệu trình phù hợp' },
    ],
    ket_qua: 'Báo cáo định lượng 8 chỉ số da, baseline để đánh giá hiệu quả điều trị sau mỗi liệu trình',
    luuy: 'Không mang trang điểm, kem chống nắng hoặc serum trước khi phân tích ít nhất 2 giờ.',
    mau: 'border-purple-500',
    mau_badge: 'bg-purple-50 text-purple-700',
  },
];

export default function MayMoc() {
  return (
    <div className="bg-slate-50 min-h-screen">

      {/* Header */}
      <div className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-2">Trang Thiết Bị Y Tế</p>
          <h1 className="text-4xl font-black mb-3 tracking-tight">Hệ Thống Máy Móc Tiên Tiến</h1>
          <p className="text-blue-100 max-w-2xl text-sm leading-relaxed">
            Phòng khám trang bị hệ thống thiết bị da liễu thẩm mỹ thế hệ mới, được chứng nhận
            <strong className="text-white"> FDA Hoa Kỳ & CE Châu Âu</strong>. Mỗi liệu trình được
            bác sĩ chỉ định đúng thiết bị, đúng thông số và giám sát trực tiếp.
          </p>
          <div className="flex flex-wrap gap-3 mt-6 text-xs font-semibold">
            <span className="bg-white/15 px-4 py-1.5 rounded-full">✅ Chứng nhận FDA / CE</span>
            <span className="bg-white/15 px-4 py-1.5 rounded-full">✅ Kỹ thuật viên được đào tạo chuyên sâu</span>
            <span className="bg-white/15 px-4 py-1.5 rounded-full">✅ Bác sĩ giám sát trực tiếp</span>
            <span className="bg-white/15 px-4 py-1.5 rounded-full">✅ Hiệu chỉnh thông số cá nhân hóa</span>
          </div>
        </div>
      </div>

      {/* Danh sách máy */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {MAY_MOC.map((may) => (
          <div key={may.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

            <div className="grid grid-cols-1 lg:grid-cols-5">
              {/* Ảnh */}
              <div className={`lg:col-span-2 relative min-h-64 border-l-4 ${may.mau}`}>
                <Image
                  src={may.anh}
                  alt={may.ten}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${may.mau_badge}`}>
                    {may.loai}
                  </span>
                  <h2 className="text-white font-black text-xl mt-2 drop-shadow">{may.ten}</h2>
                </div>
              </div>

              {/* Nội dung */}
              <div className="lg:col-span-3 p-6 md:p-8">
                <p className="text-gray-600 text-sm leading-relaxed mb-6 border-l-4 border-gray-200 pl-4">
                  {may.mo_ta}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Chỉ định */}
                  <div>
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3">
                      Chỉ Định Điều Trị
                    </h3>
                    <ul className="space-y-1.5">
                      {may.chi_dinh.map((cd, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <span className="text-primary font-bold shrink-0 mt-0.5">✓</span>
                          <span>{cd}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Phác đồ */}
                  <div>
                    <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider mb-3">
                      Quy Trình Thực Hiện
                    </h3>
                    <div className="space-y-2">
                      {may.phac_do.map((buoc, i) => (
                        <div key={i} className="flex gap-2 items-start">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <div>
                            <div className="text-xs font-bold text-gray-800">{buoc.buoc}</div>
                            <div className="text-xs text-gray-500 leading-relaxed">{buoc.mo_ta}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Kết quả & lưu ý */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
                  <div className="bg-green-50 border border-green-100 rounded-xl p-3">
                    <div className="text-xs font-black text-green-700 uppercase tracking-wide mb-1">Kết Quả Kỳ Vọng</div>
                    <div className="text-xs text-green-800">{may.ket_qua}</div>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                    <div className="text-xs font-black text-amber-700 uppercase tracking-wide mb-1">⚠ Lưu Ý Quan Trọng</div>
                    <div className="text-xs text-amber-800">{may.luuy}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-primary text-white py-14 mt-4">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-3">Tư Vấn Chọn Thiết Bị Phù Hợp</h2>
          <p className="text-blue-100 text-sm mb-8">
            Bác sĩ sẽ thăm khám, phân tích da bằng máy VISIA và chỉ định đúng thiết bị,
            đúng thông số cho tình trạng da của bạn — không áp dụng công thức chung.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dat-lich"
              className="bg-white text-primary font-black px-8 py-3 rounded-lg hover:bg-blue-50 transition-colors">
              Đặt Lịch Khám →
            </Link>
            <a href="tel:02862852727"
              className="bg-white/10 border border-white/25 text-white font-bold px-8 py-3 rounded-lg hover:bg-white/20 transition-colors">
              028 6285 2727
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
