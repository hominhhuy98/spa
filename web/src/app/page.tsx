import Image from 'next/image';
import Link from 'next/link';

const DICH_VU = [
  {
    id: 'mun-trung-ca', name: 'Mụn Trứng Cá', icon: '🔬', icd: 'L70',
    mo_ta: 'Retinoid · BPO · Kháng sinh · Isotretinoin. Laser CO₂ Fractional trị sẹo rỗ chuyên sâu.',
    border: 'border-l-4 border-orange-400', icon_bg: 'bg-orange-50', icon_text: 'text-orange-500',
    badge_bg: 'bg-orange-50', badge_text: 'text-orange-600', link_text: 'text-orange-500',
  },
  {
    id: 'nam-tan-nhang', name: 'Nám & Tàn Nhang', icon: '🌿', icd: 'L81.1',
    mo_ta: 'Laser Toning Nd:YAG · Mesotherapy Glutathione · Tranexamic Acid · SPF 50+ bắt buộc.',
    border: 'border-l-4 border-purple-400', icon_bg: 'bg-purple-50', icon_text: 'text-purple-500',
    badge_bg: 'bg-purple-50', badge_text: 'text-purple-600', link_text: 'text-purple-500',
  },
  {
    id: 'viem-da-co-dia', name: 'Viêm Da Cơ Địa', icon: '🛡️', icd: 'L20',
    mo_ta: 'Ceramide · Tacrolimus · đến sinh học Dupilumab. NB-UVB cho thể nặng kháng trị.',
    border: 'border-l-4 border-blue-400', icon_bg: 'bg-blue-50', icon_text: 'text-blue-500',
    badge_bg: 'bg-blue-50', badge_text: 'text-blue-600', link_text: 'text-blue-500',
  },
  {
    id: 'vay-nen', name: 'Vảy Nến', icon: '🔷', icd: 'L40',
    mo_ta: 'NB-UVB quang trị liệu · Methotrexate · sinh học Anti-IL17/IL23 cho thể trung bình–nặng.',
    border: 'border-l-4 border-indigo-400', icon_bg: 'bg-indigo-50', icon_text: 'text-indigo-500',
    badge_bg: 'bg-indigo-50', badge_text: 'text-indigo-600', link_text: 'text-indigo-500',
  },
  {
    id: 'rung-toc', name: 'Rụng Tóc', icon: '💇', icd: 'L63–66',
    mo_ta: 'PRP tiêm da đầu · Minoxidil · Finasteride · JAK inhibitor cho Alopecia Areata.',
    border: 'border-l-4 border-teal-400', icon_bg: 'bg-teal-50', icon_text: 'text-teal-500',
    badge_bg: 'bg-teal-50', badge_text: 'text-teal-600', link_text: 'text-teal-500',
  },
  {
    id: 'seo', name: 'Sẹo Lồi & Sẹo Rỗ', icon: '✨', icd: 'L91.0',
    mo_ta: 'Triamcinolone · Laser PDL · CO₂ Fractional · Lăn kim RF vi điểm chuyên sâu.',
    border: 'border-l-4 border-rose-400', icon_bg: 'bg-rose-50', icon_text: 'text-rose-500',
    badge_bg: 'bg-rose-50', badge_text: 'text-rose-600', link_text: 'text-rose-500',
  },
];

const TIN_NOI_BAT = [
  { id: '8', title: 'Isotretinoin: 10 Điều Cần Biết Trước Khi Dùng', tag: 'Mụn Trứng Cá', date: '2026-01-30' },
  { id: '3', title: 'Nám Da: Phân Biệt Thượng Bì & Hạ Bì Để Điều Trị Đúng', tag: 'Nám Da', date: '2026-03-05' },
  { id: '4', title: 'Retinoid: Vàng Ròng Của Da Liễu Và Cách Dùng An Toàn', tag: 'Kiến Thức Da', date: '2026-02-28' },
];

export default function Home() {
  return (
    <div className="w-full">

      {/* Hero */}
      <section className="relative w-full overflow-hidden" style={{ height: '520px' }}>
        <div className="absolute inset-0">
          <Image
            src="/assets/banner.jpg"
            alt="Phòng khám Da liễu Y Dược Sài Gòn"
            fill priority quality={85}
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/85 via-blue-900/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 h-full flex items-center">
          <div className="max-w-xl text-white">
            <p className="text-secondary-light text-xs font-bold uppercase tracking-widest mb-4">
              Chuyên Khoa Da Liễu & Thẩm Mỹ
            </p>
            <h1 className="text-5xl md:text-6xl font-black leading-tight mb-5 tracking-tight">
              Điều Trị<br />Da Liễu
              <span className="font-serif italic font-normal text-secondary-light block mt-2 text-2xl md:text-3xl tracking-normal">
                Chuẩn Y Khoa Quốc Tế
              </span>
            </h1>
            <p className="text-blue-100 text-sm leading-relaxed mb-8 max-w-md border-l-3 border-secondary-light pl-4">
              Bác sĩ CKII trực tiếp thăm khám · Phác đồ chuẩn Bộ Y Tế<br />
              Trực thuộc CTCP Bệnh viện Y Dược Sài Gòn
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href="/dat-lich"
                className="bg-primary hover:bg-blue-800 text-white px-7 py-3 rounded-lg font-bold text-sm transition-colors flex items-center gap-2">
                Đặt Lịch Khám
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <Link href="/dich-vu-da-lieu"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/25 px-7 py-3 rounded-lg font-bold text-sm transition-colors">
                Phác Đồ Điều Trị
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-gray-100">
            {[
              { so: '20+', nhan: 'Năm Kinh Nghiệm' },
              { so: '10+', nhan: 'Phác Đồ Điều Trị Chuyên Sâu' },
              { so: '50k+', nhan: 'Bệnh Nhân Tin Tưởng' },
              { so: '100%', nhan: 'Bác Sĩ Chuyên Khoa' },
            ].map((item) => (
              <div key={item.nhan} className="px-2">
                <p className="text-2xl font-black text-primary">{item.so}</p>
                <p className="text-gray-500 text-xs font-medium mt-0.5">{item.nhan}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Dịch vụ Da Liễu */}
      <section className="bg-blue-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
            <div>
              <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Chuyên Khoa Da Liễu</p>
              <h2 className="text-3xl font-black text-primary tracking-tight mb-1">Phác Đồ Điều Trị Chuẩn Y Khoa</h2>
              <p className="text-gray-500 text-sm">Bác sĩ Chuyên khoa II · Phác đồ chuẩn Bộ Y Tế · Cá nhân hóa từng bệnh nhân</p>
            </div>
            <Link href="/dich-vu-da-lieu"
              className="shrink-0 border border-primary text-primary font-bold px-5 py-2.5 rounded-lg hover:bg-primary hover:text-white transition-colors text-sm self-start md:self-auto">
              Xem tất cả phác đồ →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {DICH_VU.map((dv) => (
              <Link key={dv.id} href="/dich-vu-da-lieu"
                className={`group bg-white rounded-2xl ${dv.border} shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col gap-3`}>
                {/* Card top: icon + title */}
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 ${dv.icon_bg} rounded-xl flex items-center justify-center text-2xl shrink-0`}>
                    {dv.icon}
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className={`text-xs font-semibold ${dv.badge_text} ${dv.badge_bg} px-2 py-0.5 rounded-full w-fit`}>
                      ICD-10 · {dv.icd}
                    </span>
                    <h3 className="font-black text-primary text-base leading-tight">{dv.name}</h3>
                  </div>
                </div>
                {/* Description */}
                <p className="text-gray-500 text-sm leading-relaxed flex-1">{dv.mo_ta}</p>
                {/* Link */}
                <span className={`text-sm font-semibold ${dv.link_text} group-hover:underline`}>
                  Xem phác đồ điều trị →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Da liễu & Spa */}
      <section className="bg-gray-50 py-14">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-8">Hai Lĩnh Vực Chuyên Sâu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-52 relative">
                <Image src="/assets/pic1.jpg" alt="Điều trị Da liễu" fill
                  sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-primary/20" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-900 mb-2">Điều Trị Da Liễu</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Chẩn đoán và điều trị bệnh lý da chuyên sâu. Mụn, Nám, Chàm, Vảy nến, Rụng tóc, Sẹo.
                </p>
                <Link href="/dich-vu-da-lieu" className="text-primary font-semibold text-sm hover:underline">
                  Xem phác đồ điều trị →
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="h-52 relative">
                <Image src="/assets/spa.jpg" alt="Thẩm mỹ Spa" fill
                  sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                <div className="absolute inset-0 bg-secondary/20" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-gray-900 mb-2">Thẩm Mỹ Spa</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  Laser, Lăn kim RF, IPL, Peel hóa học. Liệu trình phục hồi và trẻ hóa da công nghệ cao.
                </p>
                <Link href="/spa" className="text-secondary font-semibold text-sm hover:underline">
                  Khám phá dịch vụ Spa →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Kiến thức */}
      <section className="max-w-7xl mx-auto px-4 py-14">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-black text-gray-900">Kiến Thức Da Liễu</h2>
          <Link href="/tin-tuc" className="text-primary font-semibold text-sm hover:underline">Xem tất cả →</Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TIN_NOI_BAT.map((tin) => (
            <Link key={tin.id} href={`/tin-tuc/${tin.id}`}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-sm transition-shadow group">
              <span className="text-xs font-bold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full">{tin.tag}</span>
              <h3 className="font-bold text-gray-900 mt-3 mb-2 text-sm leading-snug group-hover:text-primary transition-colors">{tin.title}</h3>
              <p className="text-xs text-gray-400">{new Date(tin.date).toLocaleDateString('vi-VN')}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Khuyến mãi khách hàng mới */}
      <section className="bg-gradient-to-r from-primary to-blue-700 text-white py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-secondary-light text-xs font-bold uppercase tracking-widest mb-2">Ưu Đãi Có Hạn</p>
              <h2 className="text-2xl font-black mb-1 tracking-tight">Chương Trình Khách Hàng Mới</h2>
              <p className="text-blue-100 text-sm">Giảm ngay <strong>30K – 50K – 100K</strong> tùy gói dịch vụ cho lần khám đầu tiên.</p>
            </div>
            <div className="flex flex-wrap gap-3 shrink-0">
              <div className="flex gap-2">
                {['GIẢM 30K', 'GIẢM 50K', 'GIẢM 100K'].map((g) => (
                  <div key={g} className="bg-white/15 border border-white/25 rounded-xl px-3 py-2 text-center">
                    <p className="text-xs font-black tracking-tight">{g}</p>
                  </div>
                ))}
              </div>
              <Link href="/khuyen-mai"
                className="bg-secondary hover:bg-teal-500 text-white font-black px-6 py-3 rounded-lg transition-colors text-sm whitespace-nowrap">
                Xem Chi Tiết →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-white py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-3">Đặt Lịch Khám Hôm Nay</h2>
          <p className="text-blue-100 text-sm mb-8">
            Bác sĩ Chuyên khoa II thăm khám và xây dựng phác đồ điều trị cá nhân hóa cho bạn.
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
      </section>

    </div>
  );
}
