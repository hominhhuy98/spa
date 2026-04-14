import Link from 'next/link';
import { adminDb } from '@/lib/firebase-admin';

interface TreatmentService {
  id: string;
  name: string;
  icon: string;
  category: string;
  mo_ta: string;
}

const CATEGORY_INFO: Record<string, { title: string; color: string; bg: string; desc: string }> = {
  'quy-trinh-co-dinh': {
    title: 'Quy Trình Cố Định',
    color: 'text-slate-700',
    bg: 'bg-slate-50 border-slate-200',
    desc: 'Quy trình chuẩn áp dụng trước mọi liệu trình điều trị',
  },
  'cham-soc-da': {
    title: 'Chăm Sóc Da',
    color: 'text-teal-700',
    bg: 'bg-teal-50 border-teal-200',
    desc: 'Dành cho mọi loại da cần thư giãn, phục hồi và duy trì sức khỏe làn da',
  },
  'cham-soc-da-toan-dien': {
    title: 'Chăm Sóc Da Toàn Diện',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200',
    desc: 'Dành cho khách hàng muốn trẻ hóa, cấp ẩm sâu hoặc sáng da chuyên sâu',
  },
  'da-mun-face': {
    title: 'Điều Trị Mụn (Face)',
    color: 'text-orange-700',
    bg: 'bg-orange-50 border-orange-200',
    desc: 'Dành cho da mụn ẩn, mụn cám, mụn đầu đen, mụn viêm vùng mặt',
  },
  'da-mun-body': {
    title: 'Điều Trị Mụn (Body)',
    color: 'text-amber-800',
    bg: 'bg-amber-50 border-amber-200',
    desc: 'Dành cho mụn lưng, mụn ngực, mụn body cần xử lý chuyên sâu',
  },
  'da-nhay-cam': {
    title: 'Da Nhạy Cảm',
    color: 'text-pink-700',
    bg: 'bg-pink-50 border-pink-200',
    desc: 'Dành cho da kích ứng, da mỏng yếu, da sau điều trị cần phục hồi nhẹ nhàng',
  },
  'chemical-peel': {
    title: 'Chemical Peel',
    color: 'text-purple-700',
    bg: 'bg-purple-50 border-purple-200',
    desc: 'Dành cho da cần tái tạo, trị thâm mụn, sáng da, trẻ hóa bằng peel hóa học',
  },
};

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

export default async function DichVuDaLieu() {
  const treatments = await getTreatments();

  const grouped = new Map<string, TreatmentService[]>();
  treatments.forEach(t => {
    if (!grouped.has(t.category)) grouped.set(t.category, []);
    grouped.get(t.category)!.push(t);
  });

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">Bệnh Viện Y Dược Sài Gòn</p>
          <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">Dịch Vụ Da Liễu & Spa</h1>
          <p className="text-blue-100 max-w-3xl mx-auto text-lg leading-relaxed">
            Đa dạng dịch vụ chăm sóc da chuyên sâu, phù hợp với từng tình trạng da và nhu cầu của bạn.
          </p>
        </div>
      </div>

      {/* Danh sách dịch vụ theo nhóm */}
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        {Array.from(grouped.entries()).map(([category, services]) => {
          const cat = CATEGORY_INFO[category] || { title: category, color: 'text-gray-700', bg: 'bg-gray-50 border-gray-200', desc: '' };
          return (
            <div key={category} className={`rounded-2xl border p-6 ${cat.bg}`}>
              {/* Category header */}
              <div className="mb-4">
                <h2 className={`text-xl font-black ${cat.color}`}>{cat.title}</h2>
                {cat.desc && <p className="text-sm text-gray-500 mt-1">{cat.desc}</p>}
              </div>

              {/* Services grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {services.map(item => (
                  <Link key={item.id} href={`/dat-lich/?dich-vu=${encodeURIComponent(item.name)}`}
                    className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100 hover:border-primary/30 hover:shadow-sm transition group">
                    <span className="text-xl shrink-0">{item.icon}</span>
                    <span className="text-sm font-semibold text-gray-800 group-hover:text-primary transition">{item.name}</span>
                    <svg className="w-4 h-4 text-gray-300 group-hover:text-primary ml-auto shrink-0 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="bg-primary text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Không Biết Chọn Dịch Vụ Nào?</h2>
          <p className="text-blue-100 mb-8">Đội ngũ Bác sĩ chuyên khoa sẽ tư vấn và đề xuất liệu trình phù hợp nhất với tình trạng da của bạn.</p>
          <Link href="/dat-lich" className="bg-white text-primary font-black px-10 py-4 rounded-full text-lg hover:bg-blue-50 transition shadow-lg inline-block">
            Đặt Lịch Tư Vấn Miễn Phí
          </Link>
        </div>
      </div>
    </div>
  );
}
