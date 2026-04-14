import Link from 'next/link';
import { adminDb } from '@/lib/firebase-admin';

interface TreatmentService {
  id: string;
  name: string;
  icon: string;
  category: string;
  mo_ta: string;
}

const CATEGORY_INFO: Record<string, { name: string; icon: string; color: string; bg: string; light: string; border: string; desc: string }> = {
  'cham-soc-da': {
    name: 'Chăm Sóc Da', icon: '💆',
    color: 'text-teal-700', bg: 'bg-teal-600', light: 'bg-teal-50', border: 'border-teal-200',
    desc: 'Dành cho mọi loại da cần thư giãn, phục hồi và duy trì sức khỏe làn da',
  },
  'cham-soc-da-toan-dien': {
    name: 'Chăm Sóc Da Toàn Diện', icon: '✨',
    color: 'text-purple-700', bg: 'bg-purple-600', light: 'bg-purple-50', border: 'border-purple-200',
    desc: 'Dành cho khách hàng muốn trẻ hóa, cấp ẩm sâu hoặc sáng da chuyên sâu',
  },
  'da-mun-face': {
    name: 'Điều Trị Mụn (Face)', icon: '🔬',
    color: 'text-orange-700', bg: 'bg-orange-500', light: 'bg-orange-50', border: 'border-orange-200',
    desc: 'Dành cho da mụn ẩn, mụn cám, mụn đầu đen, mụn viêm vùng mặt',
  },
  'da-mun-body': {
    name: 'Điều Trị Mụn (Body)', icon: '🫁',
    color: 'text-amber-800', bg: 'bg-amber-600', light: 'bg-amber-50', border: 'border-amber-200',
    desc: 'Dành cho mụn lưng, mụn ngực, mụn body cần xử lý chuyên sâu',
  },
  'da-nhay-cam': {
    name: 'Da Nhạy Cảm', icon: '🌸',
    color: 'text-pink-700', bg: 'bg-rose-500', light: 'bg-rose-50', border: 'border-rose-200',
    desc: 'Dành cho da kích ứng, da mỏng yếu, da sau điều trị cần phục hồi nhẹ nhàng',
  },
  'chemical-peel': {
    name: 'Chemical Peel', icon: '💎',
    color: 'text-blue-700', bg: 'bg-blue-600', light: 'bg-blue-50', border: 'border-blue-200',
    desc: 'Dành cho da cần tái tạo, trị thâm mụn, sáng da, trẻ hóa bằng peel hóa học',
  },
};

// Bỏ qua nhóm "quy-trinh-co-dinh" vì không phải gói dịch vụ cho khách
const SKIP_CATEGORIES = ['quy-trinh-co-dinh'];

async function getTreatments(): Promise<TreatmentService[]> {
  const snapshot = await adminDb.collection('treatment_services')
    .where('is_active', '==', true)
    .orderBy('sort_order', 'asc')
    .get();
  return snapshot.docs.map(doc => {
    const data = doc.data();
    return { id: doc.id, name: data.name, icon: data.icon, category: data.category, mo_ta: data.mo_ta || '' };
  });
}

export default async function GoiDichVu() {
  const treatments = await getTreatments();

  const grouped = new Map<string, TreatmentService[]>();
  treatments.forEach(t => {
    if (SKIP_CATEGORIES.includes(t.category)) return;
    if (!grouped.has(t.category)) grouped.set(t.category, []);
    grouped.get(t.category)!.push(t);
  });

  const categories = Array.from(grouped.entries()).map(([cat, services]) => ({
    id: cat,
    info: CATEGORY_INFO[cat] || { name: cat, icon: '📋', color: 'text-gray-700', bg: 'bg-gray-600', light: 'bg-gray-50', border: 'border-gray-200', desc: '' },
    services,
  }));

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
          {categories.map((cat) => (
            <a key={cat.id} href={`#${cat.id}`}
              className="bg-white/10 border border-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors">
              {cat.info.icon} {cat.info.name}
            </a>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 space-y-10">

        {categories.map((cat) => (
          <section key={cat.id} id={cat.id}>
            {/* Category Header */}
            <div className={`${cat.info.bg} text-white rounded-2xl px-6 py-4 mb-5`}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{cat.info.icon}</span>
                <div>
                  <h2 className="text-xl font-black tracking-tight">{cat.info.name}</h2>
                  <p className="text-white/75 text-xs mt-0.5">{cat.info.desc}</p>
                </div>
              </div>
            </div>

            {/* Service Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.services.map((svc) => (
                <Link key={svc.id} href={`/dat-lich?dich-vu=${encodeURIComponent(svc.name)}`}
                  className={`bg-white rounded-xl border ${cat.info.border} shadow-sm p-5 hover:shadow-md hover:border-primary/30 transition group flex flex-col`}>
                  <div className="flex items-start gap-3 mb-3">
                    <span className="text-2xl shrink-0">{svc.icon}</span>
                    <h3 className={`font-black text-sm ${cat.info.color} leading-snug group-hover:text-primary transition`}>
                      {svc.name}
                    </h3>
                  </div>
                  {svc.mo_ta && (
                    <p className="text-xs text-gray-500 leading-relaxed flex-1">{svc.mo_ta}</p>
                  )}
                  <div className={`mt-4 text-center text-xs font-bold py-2.5 rounded-lg ${cat.info.bg} text-white group-hover:opacity-90 transition-opacity`}>
                    Đặt Lịch Gói Này
                  </div>
                </Link>
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
              Đặt Lịch Tư Vấn
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
