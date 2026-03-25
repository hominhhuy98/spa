import Link from 'next/link';

const PHAC_DO = [
  {
    id: 1,
    slug: 'mun-trung-ca',
    name: 'Mụn Trứng Cá (Acne Vulgaris)',
    icon: '🔬',
    grade: 'Độ I – IV (Nhẹ đến Nặng)',
    icd: 'ICD-10: L70',
    mo_ta: 'Bệnh lý viêm nang lông - tuyến bã phổ biến nhất, ảnh hưởng 80% người độ tuổi 11–30. Nguyên nhân do vi khuẩn Cutibacterium acnes, tăng tiết bã nhờn và bít tắc lỗ chân lông.',
    phac_do: [
      { cap_do: 'Độ I (Mụn không viêm)', dieu_tri: 'Retinoid bôi tại chỗ (Tretinoin 0.025–0.05% / Adapalene 0.1%) + Azelaic Acid 15–20%' },
      { cap_do: 'Độ II (Viêm nhẹ – vừa)', dieu_tri: 'Benzoyl Peroxide 2.5–5% + Kháng sinh bôi (Clindamycin 1%) + Retinoid bôi' },
      { cap_do: 'Độ III (Viêm vừa – nặng)', dieu_tri: 'Kháng sinh uống (Doxycycline 100mg/ngày × 3 tháng) + Retinoid bôi + BPO' },
      { cap_do: 'Độ IV (Nặng/Nang bọc)', dieu_tri: 'Isotretinoin uống 0.5–1mg/kg/ngày × 4–6 tháng (theo dõi gan, lipid máu)' },
    ],
    cong_nghe: ['Laser CO₂ Fractional (điều trị sẹo)', 'IPL (giảm viêm)', 'Lăn kim RF vi điểm', 'Peel hóa học BHA/AHA'],
    nguon: 'Hướng dẫn Bộ Y Tế Việt Nam',
  },
  {
    id: 2,
    slug: 'nam-tan-nhang',
    name: 'Nám Da & Tàn Nhang (Melasma / Ephelides)',
    icon: '🌿',
    grade: 'Thượng bì – Hạ bì – Hỗn hợp',
    icd: 'ICD-10: L81.1',
    mo_ta: 'Rối loạn tăng sắc tố da, phổ biến ở phụ nữ tuổi sinh sản (95%). Yếu tố nguy cơ: tia UV, thay đổi nội tiết, di truyền. Cần phân loại dưới đèn Wood trước điều trị.',
    phac_do: [
      { cap_do: 'Bước 1 (Nền tảng)', dieu_tri: 'Chống nắng SPF 50+ PA++++ mỗi 2–3 giờ (BẮT BUỘC suốt liệu trình)' },
      { cap_do: 'Bước 2 (Điều trị tại chỗ)', dieu_tri: 'Hydroquinone 2–4% (không quá 3 tháng liên tục) HOẶC Kojic Acid + Niacinamide 5–10% + Tranexamic Acid bôi' },
      { cap_do: 'Bước 3 (Công nghệ)', dieu_tri: 'Laser Toning (Nd:YAG 1064nm) 1 lần/tháng × 6 lần + Mesotherapy (Glutathione, Vitamin C)' },
      { cap_do: 'Bước 4 (Duy trì)', dieu_tri: 'Retinol ban đêm + Tranexamic Acid uống 250mg × 2/ngày (6 tháng)' },
    ],
    cong_nghe: ['Laser Toning Nd:YAG 1064nm', 'PicoSure 755nm', 'Mesotherapy Glutathione', 'Peel Lactic Acid / Mandelic Acid'],
    nguon: 'Bộ Y Tế VN, Hội Da Liễu Việt Nam',
  },
  {
    id: 3,
    slug: 'viem-da-co-dia',
    name: 'Viêm Da Cơ Địa / Chàm (Atopic Dermatitis)',
    icon: '🛡️',
    grade: 'Nhẹ – Vừa – Nặng (SCORAD)',
    icd: 'ICD-10: L20',
    mo_ta: 'Bệnh da mãn tính tái phát chu kỳ, liên quan rối loạn hàng rào da và miễn dịch Th2. Hay gặp ở trẻ em (20%) và người lớn (3%). Cần kiểm soát yếu tố khởi phát.',
    phac_do: [
      { cap_do: 'Nền tảng (mọi cấp độ)', dieu_tri: 'Dưỡng ẩm liên tục (Ceramide-based) ≥ 2 lần/ngày, tắm nước ấm ≤ 5 phút, tránh xà phòng kiềm' },
      { cap_do: 'Nhẹ (SCORAD < 25)', dieu_tri: 'Corticosteroid bôi nhẹ (Hydrocortisone 1%) ngắn hạn + Kem dưỡng ẩm Ceramide' },
      { cap_do: 'Vừa (SCORAD 25–50)', dieu_tri: 'Corticosteroid bôi vừa (Mometasone, Betamethasone) + Ức chế Calcineurin (Tacrolimus 0.03/0.1%)' },
      { cap_do: 'Nặng (SCORAD > 50)', dieu_tri: 'Dupilumab (sinh học kháng IL-4Rα) 300mg/2 tuần + Corticosteroid toàn thân ngắn hạn nếu cần' },
    ],
    cong_nghe: ['Ánh sáng NB-UVB (308nm)', 'Laser Excimer cho mảng khu trú', 'Điện di dưỡng chất (Iontophoresis)'],
    nguon: 'Hội Da Liễu Việt Nam, Bộ Y Tế VN',
  },
  {
    id: 4,
    slug: 'vay-nen',
    name: 'Vảy Nến (Psoriasis)',
    icon: '🔷',
    grade: 'Nhẹ (BSA <3%) – Vừa – Nặng (BSA >10%)',
    icd: 'ICD-10: L40',
    mo_ta: 'Bệnh viêm da tự miễn mãn tính, tăng sinh tế bào keratinocyte quá mức, biểu hiện mảng đỏ có vảy trắng bạc. Ảnh hưởng 2–3% dân số toàn cầu. Liên quan bệnh khớp vảy nến (PsA).',
    phac_do: [
      { cap_do: 'Tại chỗ (BSA < 10%)', dieu_tri: 'Corticosteroid bôi (Clobetasol 0.05%) + Vitamin D3 analog (Calcipotriol) phối hợp' },
      { cap_do: 'Quang trị liệu', dieu_tri: 'NB-UVB 3 lần/tuần (hiệu quả 70–80%) hoặc PUVA cho thể nặng' },
      { cap_do: 'Toàn thân truyền thống', dieu_tri: 'Methotrexate 7.5–25mg/tuần HOẶC Cyclosporine 2.5–5mg/kg/ngày (≤ 1 năm) HOẶC Acitretin' },
      { cap_do: 'Sinh học (Nặng / kháng trị)', dieu_tri: 'Anti-TNF (Adalimumab, Etanercept) HOẶC Anti-IL17 (Secukinumab) HOẶC Anti-IL23 (Guselkumab)' },
    ],
    cong_nghe: ['NB-UVB (Narrow Band UVB)', 'Laser Excimer 308nm cho mảng khu trú', 'PUVA'],
    nguon: 'Hội Da Liễu Việt Nam',
  },
  {
    id: 5,
    slug: 'me-day-man-tinh',
    name: 'Mề Đay Mãn Tính (Chronic Urticaria)',
    icon: '⚡',
    grade: 'Cấp tính (< 6 tuần) / Mãn tính (> 6 tuần)',
    icd: 'ICD-10: L50',
    mo_ta: 'Phản ứng dị ứng của mast cells gây phù Quincke và sẩn phù ngứa. Mãn tính 40% không rõ nguyên nhân (CIU). Cần loại trừ nguyên nhân thứ phát (nhiễm trùng, tự miễn, ký sinh trùng).',
    phac_do: [
      { cap_do: 'Bước 1', dieu_tri: 'Kháng Histamine H1 thế hệ 2 (Cetirizine / Loratadine / Fexofenadine) × 4 tuần' },
      { cap_do: 'Bước 2', dieu_tri: 'Tăng liều kháng H1 lên 4 lần liều chuẩn (nếu bước 1 thất bại sau 2–4 tuần)' },
      { cap_do: 'Bước 3', dieu_tri: 'Omalizumab (Anti-IgE) 300mg/4 tuần tiêm dưới da' },
      { cap_do: 'Bước 4', dieu_tri: 'Cyclosporine 3mg/kg/ngày (kháng Omalizumab) + Tìm và điều trị nguyên nhân thứ phát' },
    ],
    cong_nghe: ['Test dị ứng trong da (Skin Prick Test)', 'Xét nghiệm IgE đặc hiệu', 'Test tự huyết thanh (ASST)'],
    nguon: 'Hội Da Liễu Việt Nam, Bộ Y Tế VN',
  },
  {
    id: 6,
    slug: 'rung-toc',
    name: 'Rụng Tóc (Alopecia)',
    icon: '💇',
    grade: 'Areata / Androgenetic / Telogen Effluvium',
    icd: 'ICD-10: L63–L66',
    mo_ta: 'Phân biệt rụng tóc sẹo (không hồi phục) và không sẹo (hồi phục). Rụng tóc androgen (AGA) phổ biến nhất. Rụng tóc vòng (AA) do cơ chế tự miễn. Cần sinh thiết da đầu khi chẩn đoán khó.',
    phac_do: [
      { cap_do: 'AGA Nam giới', dieu_tri: 'Finasteride 1mg/ngày (uống) + Minoxidil 5% (bôi) 2 lần/ngày – dùng lâu dài' },
      { cap_do: 'AGA Nữ giới', dieu_tri: 'Minoxidil 2–5% (bôi) + Spironolactone 50–200mg/ngày (nếu có tăng androgen) + Bổ sung sắt/Biotin' },
      { cap_do: 'Rụng tóc vòng (AA)', dieu_tri: 'Corticosteroid tiêm nội thương (Triamcinolone 2.5–10mg/ml) mỗi 4–6 tuần + Minoxidil bôi' },
      { cap_do: 'AA nặng (>50% da đầu)', dieu_tri: 'JAK inhibitor: Baricitinib 2–4mg/ngày hoặc Ritlecitinib 50mg/ngày ' },
    ],
    cong_nghe: ['PRP (Platelet-Rich Plasma) tiêm da đầu', 'Low Level Laser Therapy (LLLT)', 'Mesotherapy tóc', 'Phi kim vi điểm'],
    nguon: 'Hội Da Liễu Việt Nam, Bộ Y Tế VN',
  },
  {
    id: 7,
    slug: 'nam-da',
    name: 'Nấm Da (Dermatophytosis / Tinea)',
    icon: '🦠',
    grade: 'Tinea corporis / capitis / pedis / unguium',
    icd: 'ICD-10: B35',
    mo_ta: 'Nhiễm nấm da do Dermatophytes (Trichophyton, Microsporum, Epidermophyton). Chẩn đoán bằng soi trực tiếp KOH và nuôi cấy nấm. Dễ nhầm với chàm, vảy nến, bạch biến.',
    phac_do: [
      { cap_do: 'Nấm thân/bẹn/chân (bôi)', dieu_tri: 'Clotrimazole 1% / Terbinafine 1% bôi 2 lần/ngày × 2–4 tuần' },
      { cap_do: 'Nấm móng (onychomycosis)', dieu_tri: 'Terbinafine uống 250mg/ngày × 6 tuần (tay) / 12 tuần (chân) – kiểm tra men gan' },
      { cap_do: 'Nấm đầu (tinea capitis)', dieu_tri: 'Griseofulvin uống 20–25mg/kg/ngày × 6–8 tuần (ưu tiên trẻ em) hoặc Itraconazole' },
      { cap_do: 'Nấm kháng trị', dieu_tri: 'Itraconazole 200mg/ngày × 2–3 tháng hoặc Fluconazole 150mg/tuần × 4–6 tháng' },
    ],
    cong_nghe: ['Soi KOH trực tiếp', 'Đèn Wood (Microsporum fluorescent)', 'Nuôi cấy Sabouraud', 'Laser Nd:YAG cho nấm móng'],
    nguon: 'ISHAM Guidelines 2023, Bộ Y Tế VN',
  },
  {
    id: 8,
    slug: 'trung-ca-do-rosacea',
    name: 'Trứng Cá Đỏ (Rosacea)',
    icon: '🌸',
    grade: 'Subtypes 1–4 (NRS Classification)',
    icd: 'ICD-10: L71',
    mo_ta: 'Bệnh da mãn tính ảnh hưởng vùng trung tâm mặt, gây đỏ da, giãn mạch, sẩn mụn mủ. Khác biệt với mụn trứng cá (không có nhân mụn, không ảnh hưởng vùng thái dương). Phổ biến ở người da sáng.',
    phac_do: [
      { cap_do: 'Subtype 1 (Đỏ da, giãn mạch)', dieu_tri: 'Brimonidine 0.33% gel (co mạch) + Chống nắng khoáng SPF50+ + Tránh trigger (rượu, cay, nhiệt)' },
      { cap_do: 'Subtype 2 (Sẩn mụn mủ)', dieu_tri: 'Ivermectin 1% kem (anti-Demodex) × 12 tuần + Azelaic Acid 15% gel' },
      { cap_do: 'Kết hợp trung bình-nặng', dieu_tri: 'Doxycycline 40mg/ngày (sub-antimicrobial) × 12–16 tuần ' },
      { cap_do: 'Subtype 4 (Phồng mũi - Rhinophyma)', dieu_tri: 'Laser CO₂ / Er:YAG phẫu thuật tạo hình (thẩm mỹ – chuyên khoa phối hợp)' },
    ],
    cong_nghe: ['IPL (Intense Pulsed Light) giảm đỏ da', 'Laser KTP 532nm (giãn mạch)', 'Laser PDL 585/595nm', 'Điều trị Demodex'],
    nguon: 'Hội Da Liễu Việt Nam',
  },
  {
    id: 9,
    slug: 'viem-da-tiep-xuc',
    name: 'Viêm Da Tiếp Xúc (Contact Dermatitis)',
    icon: '🧪',
    grade: 'Dị ứng (ACD) / Kích ứng (ICD)',
    icd: 'ICD-10: L23–L25',
    mo_ta: 'Phân loại: Kích ứng (ICD – tiếp xúc trực tiếp hóa chất, chiếm 80%) và Dị ứng (ACD – phản ứng miễn dịch qua trung gian tế bào T, chiếm 20%). Chẩn đoán ACD bằng Patch Test (chuẩn vàng).',
    phac_do: [
      { cap_do: 'Bước 1 (Cấp tính)', dieu_tri: 'Loại bỏ ngay tác nhân gây bệnh + Rửa vùng da bằng nước sạch + Đắp gạc lạnh' },
      { cap_do: 'Viêm da cấp nhẹ–vừa', dieu_tri: 'Corticosteroid bôi trung bình (Betamethasone valerate 0.1%) × 1–2 tuần + Kháng Histamine uống' },
      { cap_do: 'Viêm da cấp nặng (lan rộng)', dieu_tri: 'Prednisolone uống 0.5–1mg/kg/ngày × 7–14 ngày (giảm liều dần)' },
      { cap_do: 'Mãn tính – dự phòng', dieu_tri: 'Ức chế Calcineurin (Tacrolimus 0.1%) dài hạn + Dưỡng ẩm Ceramide + Patch Test xác định tác nhân' },
    ],
    cong_nghe: ['Patch Test (Test áp) chuẩn Châu Âu (TRUE Test)', 'Prick Test', 'Xét nghiệm IgE đặc hiệu RAST'],
    nguon: 'ESCD Guidelines 2022, CONTACT Journal',
  },
  {
    id: 10,
    slug: 'seo-loi-phì-dai',
    name: 'Sẹo Lồi & Sẹo Phì Đại (Keloid / Hypertrophic Scar)',
    icon: '✨',
    grade: 'Sẹo phì đại (ở ranh giới vết thương) / Sẹo lồi (vượt ranh giới)',
    icd: 'ICD-10: L91.0',
    mo_ta: 'Tăng sinh collagen type I/III bất thường sau chấn thương da. Sẹo lồi lan rộng hơn vết thương ban đầu và tái phát sau cắt. Vị trí thường gặp: vai, xương ức, vành tai, cằm.',
    phac_do: [
      { cap_do: 'Bước 1 (Điều trị đầu tay)', dieu_tri: 'Tiêm Triamcinolone acetonide 10–40mg/ml nội thương mỗi 4–6 tuần × 4–6 mũi' },
      { cap_do: 'Bước 2 (Phối hợp)', dieu_tri: 'Silicone gel/sheet dán 12–24 giờ/ngày × 3–6 tháng + Áp lực (Compression therapy)' },
      { cap_do: 'Bước 3 (Kháng trị)', dieu_tri: 'Laser Pulsed Dye (PDL 585/595nm) × 3–5 lần + Tiêm Bleomycin 1U/ml nội thương' },
      { cap_do: 'Bước 4 (Sẹo lồi lớn)', dieu_tri: 'Phẫu thuật cắt sẹo (nội sẹo) + Tia xạ liều thấp 24h sau mổ + Tiếp tục Triamcinolone' },
    ],
    cong_nghe: ['Laser PDL (Pulsed Dye Laser)', 'Laser CO₂ Fractional', 'Tiêm nội thương (Intralesional Injection)', 'Cryotherapy (Áp lạnh N₂)'],
    nguon: 'International Scar Management Guidelines 2023, JSDR',
  },
];

export default function DichVuDaLieu() {
  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Chuyên Khoa Da Liễu</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Phác Đồ Điều Trị Chuẩn Y Khoa</h1>
          <p className="text-blue-100 max-w-3xl mx-auto text-lg leading-relaxed">
            Tất cả phác đồ điều trị được xây dựng theo hướng dẫn của <strong>Bộ Y Tế Việt Nam</strong> và
            Hội Da Liễu Việt Nam. Bác sĩ CKII trực tiếp thăm khám và cá thể hóa liệu trình cho từng bệnh nhân.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <div className="bg-white/10 backdrop-blur rounded-full px-5 py-2 text-sm font-semibold">✅ Phác đồ Bộ Y Tế VN</div>
            <div className="bg-white/10 backdrop-blur rounded-full px-5 py-2 text-sm font-semibold">✅ Bác sĩ CKII – Thạc sĩ Da liễu</div>
            <div className="bg-white/10 backdrop-blur rounded-full px-5 py-2 text-sm font-semibold">✅ Cá thể hóa phác đồ điều trị</div>
          </div>
        </div>
      </div>

      {/* Banner thiết bị */}
      <div className="max-w-7xl mx-auto px-4 pt-10">
        <div className="bg-primary/5 border border-primary/15 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="text-3xl">🔬</div>
          <div className="flex-1">
            <h3 className="font-black text-primary text-base mb-1">Trang Bị Máy Móc Tiên Tiến</h3>
            <p className="text-sm text-gray-600">
              Laser Nd:YAG Q-Switched · CO₂ Fractional · IPL · RF Microneedling · Peel Hóa Học · Máy Phân Tích Da VISIA.
              Tất cả phác đồ kết hợp công nghệ thiết bị và thuốc điều trị tối ưu cho từng bệnh nhân.
            </p>
          </div>
          <Link href="/may-moc"
            className="shrink-0 bg-primary text-white text-sm font-bold px-5 py-2.5 rounded-lg hover:bg-blue-900 transition-colors whitespace-nowrap">
            Xem tất cả thiết bị →
          </Link>
        </div>
      </div>

      {/* Cảnh báo y khoa */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 text-amber-800 text-sm">
          <strong>⚠️ Lưu ý:</strong> Thông tin trên mang tính tham khảo y khoa. Mọi phác đồ điều trị cần được bác sĩ chuyên khoa thăm khám
          trực tiếp, chỉ định và giám sát. Không tự ý dùng thuốc theo thông tin này.
        </div>
      </div>

      {/* Danh sách phác đồ */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-10">
        {PHAC_DO.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            {/* Header card */}
            <div className="bg-primary/5 border-b border-primary/10 px-8 py-5 flex flex-wrap items-start gap-4">
              <span className="text-3xl">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-black text-primary">{item.name}</h2>
                <div className="flex flex-wrap gap-3 mt-1">
                  <span className="text-xs bg-primary text-white px-3 py-0.5 rounded-full font-semibold">{item.icd}</span>
                  <span className="text-xs bg-secondary/10 text-secondary px-3 py-0.5 rounded-full font-semibold">{item.grade}</span>
                </div>
              </div>
              <Link href="/dat-lich" className="shrink-0 bg-primary text-white text-sm font-bold px-5 py-2 rounded-full hover:bg-blue-900 transition">
                Đặt lịch khám →
              </Link>
            </div>

            <div className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Mô tả */}
              <div className="lg:col-span-3">
                <p className="text-gray-600 leading-relaxed border-l-4 border-secondary pl-4">{item.mo_ta}</p>
              </div>

              {/* Phác đồ điều trị */}
              <div className="lg:col-span-2">
                <h3 className="text-base font-black text-gray-800 uppercase tracking-wider mb-4">Phác Đồ Điều Trị Bậc Thang</h3>
                <div className="space-y-3">
                  {item.phac_do.map((buoc, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="shrink-0 w-7 h-7 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4 flex-1 border border-gray-100">
                        <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-1">{buoc.cap_do}</div>
                        <div className="text-gray-700 text-sm leading-relaxed">{buoc.dieu_tri}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Công nghệ & Nguồn */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-black text-gray-800 uppercase tracking-wider mb-3">Công Nghệ Hỗ Trợ</h3>
                  <ul className="space-y-2">
                    {item.cong_nghe.map((cn, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-secondary font-bold mt-0.5">▸</span>
                        <span>{cn}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                  <div className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Nguồn tham chiếu</div>
                  <div className="text-xs text-blue-800">{item.nguon}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-primary text-white py-16 mt-10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Cần Tư Vấn Chuyên Sâu?</h2>
          <p className="text-blue-100 mb-8">Đội ngũ Bác sĩ Chuyên khoa II Da liễu sẵn sàng thăm khám, chẩn đoán và xây dựng phác đồ điều trị cá nhân hóa cho bạn.</p>
          <Link href="/dat-lich" className="bg-white text-primary font-black px-10 py-4 rounded-full text-lg hover:bg-blue-50 transition shadow-lg inline-block">
            Đặt Lịch Khám Ngay →
          </Link>
        </div>
      </div>
    </div>
  );
}
