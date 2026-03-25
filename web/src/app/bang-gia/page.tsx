import Link from 'next/link';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */

const LAY_MUN = [
  {
    ten: 'Lấy mụn (ngừa viêm nhiễm)',
    congDung: 'Loại bỏ cối mụn chứa bã nhờn và vi khuẩn, ngăn mụn phát triển và lan rộng, giảm nguy cơ chuyển thành mụn viêm và để lại sẹo.',
    phuHop: 'Mụn không viêm (mụn ẩn, mụn đầu đen), mụn viêm đã gom cối.',
    gia: '420.000 đ',
  },
];

const OXY_JET = [
  {
    ten: 'Rửa mặt làm sạch sâu',
    congDung: 'Làm sạch sâu lỗ chân lông, giúp da thông thoáng.',
    phuHop: 'Da nhờn có tuyến bã hoạt động mạnh, da nhiều sợi bã nhờn, da mụn.',
    gia: '110.000 đ',
  },
  {
    ten: 'Mặt nạ Oxy cho da mụn',
    congDung: 'Cung cấp oxy giúp da tăng cường hấp thu dưỡng chất.',
    phuHop: 'Da nhạy cảm, nhiều mụn viêm, đặc biệt da mụn nốt, nang.',
    gia: '110.000 đ',
  },
];

const ANH_SANG = [
  {
    ten: 'Ánh sáng xanh dương (415nm)',
    congDung: 'Diệt khuẩn C.Acnes, giảm viêm, hỗ trợ gom khô nhân mụn, kiểm soát bã nhờn, ngừa hình thành nhân mụn mới.',
    phuHop: 'Da nhờn, da hỗn hợp kèm mụn viêm.',
    gia: '110.000 đ',
  },
  {
    ten: 'Ánh sáng đỏ (650nm)',
    congDung: 'Làm dịu tình trạng mụn viêm, đỏ da, hỗ trợ giảm thâm, phục hồi da sau mụn hoặc sau thủ thuật. Thúc đẩy nhanh quá trình lành thương. Cải thiện độ đàn hồi và săn chắc da nhờ kích thích tăng sinh collagen, elastin.',
    phuHop: 'Da có mụn viêm, thâm mụn, da tổn thương, da tối màu, da lão hóa.',
    gia: '110.000 đ',
  },
  {
    ten: 'Ánh sáng vàng (585nm)',
    congDung: 'Làm dịu da, giảm triệu chứng nhạy cảm, kích ứng, đỏ da và hồng ban sau mụn. Kích thích tái tạo tế bào hỗ trợ quá trình phục hồi da sau mụn hoặc thủ thuật.',
    phuHop: 'Da nhạy cảm, dễ kích ứng, da thâm mụn, da trong quá trình phục hồi.',
    gia: '110.000 đ',
  },
];

const MAT_NA = [
  {
    ten: 'Giảm viêm và kiểm soát nhờn',
    congDung: 'Giảm viêm, giảm nhờn, gom khô nhân mụn.',
    phuHop: 'Da nhờn, da hỗn hợp kèm mụn viêm.',
    sanPham: 'Mặt nạ Jean D\'Arcel (Đức), hoặc sản phẩm tương đương.',
    gia: '110.000 đ',
  },
  {
    ten: 'Cấp ẩm, làm dịu và giảm kích ứng da',
    congDung: 'Cấp ẩm, làm dịu nhanh, giảm tình trạng đỏ ngứa và khô căng da.',
    phuHop: 'Da nhạy cảm, da khô, kích ứng, da sau thủ thuật.',
    sanPham: 'Mặt nạ Beauty Med (Pháp), hoặc sản phẩm tương đương.',
    gia: '110.000 đ',
  },
  {
    ten: 'Phục hồi da thương tổn',
    congDung: 'Phục hồi da tổn thương, giúp tế bào da và sợi đàn hồi (collagen/elastin) được tái tạo nhanh hơn.',
    phuHop: 'Da tổn thương hoặc da cần tăng cường phục hồi sau thủ thuật.',
    sanPham: 'Mặt nạ Jean D\'Arcel (Đức), hoặc sản phẩm tương đương.',
    gia: '110.000 đ',
  },
  {
    ten: 'Trắng sáng da đều màu',
    congDung: 'Giảm thâm mụn, da không đều màu.',
    phuHop: 'Da thâm mụn, da không đều màu, tối màu.',
    sanPham: 'Mặt nạ Beauty Med (Pháp), hoặc sản phẩm tương đương.',
    gia: '110.000 đ',
  },
];

const DIEN_DI = [
  {
    ten: 'Hỗ trợ giảm mụn',
    congDung: 'Ức chế vi khuẩn C. acnes, giảm viêm. Điều hòa hoạt động tuyến bã nhờn, giảm nhờn, gom khô nhân mụn.',
    phuHop: 'Da nhờn, da hỗn hợp kèm mụn viêm.',
    sanPham: 'Serum Fusion (Tây Ban Nha), hoặc sản phẩm tương đương.',
    gia: '430.000 đ',
  },
  {
    ten: 'Giảm thâm mụn và trắng sáng da',
    congDung: 'Giúp làm mờ các vết thâm do mụn, hỗ trợ làm sáng và đều màu da hơn.',
    phuHop: 'Da thâm mụn, da không đều màu, tối màu.',
    sanPham: 'Serum Fusion (Tây Ban Nha), hoặc sản phẩm tương đương.',
    gia: '430.000 đ',
  },
  {
    ten: 'Giảm hồng ban mụn',
    congDung: 'Giảm viêm, giảm đỏ da và hồng ban sau viêm.',
    phuHop: 'Da mụn viêm, hồng ban sau mụn, da ứng đỏ do giãn mao mạch.',
    sanPham: 'Serum Germain De Capuccini (Tây Ban Nha), hoặc sản phẩm tương đương.',
    gia: '430.000 đ',
  },
  {
    ten: 'Phục hồi da tổn thương',
    congDung: 'Giúp phục hồi tổn thương, tái tạo mô da, giảm phản ứng viêm và hạn chế hình thành sẹo sau mụn.',
    phuHop: 'Da tổn thương, viêm, kích ứng hoặc sau các thủ thuật.',
    sanPham: 'Serum Jean D\'Arcel (Đức), hoặc sản phẩm tương đương.',
    gia: '430.000 đ',
  },
  {
    ten: 'Cấp ẩm, làm dịu và giảm kích ứng da',
    congDung: 'Cấp ẩm sâu và giữ nước cho da. Giúp làm dịu nhanh tình trạng khô da, giảm đỏ, ngứa và kích ứng.',
    phuHop: 'Da khô, bong tróc, da nhạy cảm, dễ bị kích ứng.',
    sanPham: 'Serum Germain De Capuccini (Tây Ban Nha), hoặc sản phẩm tương đương.',
    gia: '430.000 đ',
  },
];

const DDM = [
  {
    ten: 'Cấp ẩm, phục hồi da mụn đang kích ứng',
    congDung: 'Phục hồi da yếu thương tổn, da tai biến corticoid. Giảm viêm, làm dịu tình trạng kích ứng.',
    phuHop: 'Da tai biến corticoid cấp và mãn tính, da khô, nhạy cảm, kích ứng.',
    gia: '970.000 đ',
  },
  {
    ten: 'Cấp ẩm, phục hồi da sau thủ thuật',
    congDung: 'Phục hồi da, giảm đỏ nhanh sau thủ thuật và vết thương hở.',
    phuHop: 'Da sau thủ thuật, da có vết thương hở.',
    gia: '970.000 đ',
  },
];

const PEEL_DA = [
  {
    ten: 'Điều trị mụn & kiểm soát nhờn',
    congDung: 'Làm sạch sâu, giảm bít tắc lỗ chân lông và điều hòa hoạt động tuyến bã nhờn, từ đó giảm nhờn, giảm mụn, kháng viêm.',
    phuHop: 'Da nhờn, mụn ẩn, mụn đầu đen, mụn viêm.',
    sanPham: 'Salicylic Acid, Glycolic Acid, Lactic Acid (Image Skincare – Mỹ). Nồng độ từ 10%–50% tuỳ chỉ định.',
    gia: '1.050.000 đ',
  },
  {
    ten: 'Điều trị thâm & đều màu da',
    congDung: 'Ức chế tăng sắc tố, làm mờ thâm mụn, giúp làm sáng và đều màu da.',
    phuHop: 'Da thâm mụn, không đều màu.',
    sanPham: 'Trichloroacetic Acid (Neova – Mỹ). Nồng độ từ 10%–50% tuỳ chỉ định.',
    gia: '1.050.000 đ',
  },
  {
    ten: 'Trị da không đều màu, dày sừng',
    congDung: 'Làm sáng và đều màu da. Kích thích tăng sinh collagen và elastin giúp trẻ hoá da.',
    phuHop: 'Da lão hóa, dày sừng, tối màu.',
    sanPham: 'Hoặc sản phẩm thay thế tương đương theo chỉ định bác sĩ.',
    gia: '1.050.000 đ',
  },
];

const IPL = [
  {
    ten: 'Điều trị mụn và kiểm soát nhờn',
    buocSong: '420nm – 520nm (Dải sáng xanh)',
    congDung: 'Giúp diệt khuẩn C. Acnes, giảm viêm, kiểm soát nhờn, làm khô nhanh nhân mụn. Hạn chế hình thành mụn mới và sẹo mụn.',
    phuHop: 'Da nhờn, da hỗn hợp (đặc biệt dạng mụn nốt, nang).',
    gia: '1.050.000 đ',
  },
  {
    ten: 'Điều trị hồng ban',
    buocSong: '500nm – 600nm (Dải sáng vàng–cam)',
    congDung: 'Giảm viêm, giảm hồng ban, đều màu da. Kích thích tăng sinh collagen và phục hồi da mỏng yếu.',
    phuHop: 'Da hồng ban do mụn hoặc sau thủ thuật, da nhạy cảm.',
    gia: '1.050.000 đ',
  },
];

const LAN_KIM = [
  {
    ten: 'Trắng sáng da, mờ thâm',
    congDung: 'Ức chế sản sinh các tế bào hắc tố melanin. Hỗ trợ làm mờ các vết thâm, sạm và cải thiện vùng da tối màu.',
    phuHop: 'Da không đều màu, tối màu, thâm do mụn.',
    sanPham: 'Serum Fusion (Tây Ban Nha), hoặc sản phẩm tương đương.',
    gia: '1.500.000 đ',
  },
  {
    ten: 'Trị mụn, kiểm soát nhờn',
    congDung: 'Giảm nhờn, đẩy mụn ẩn lên sớm, giảm dày sừng và hỗ trợ se khít lỗ chân lông.',
    phuHop: 'Da nhờn, da hỗn hợp, da dày sừng, mụn ẩn, mụn đầu đen.',
    sanPham: 'Serum Jean D\'Arcel (Đức), hoặc sản phẩm tương đương.',
    gia: '1.500.000 đ',
  },
  {
    ten: 'Trị da lão hoá, da khô',
    congDung: 'Tăng sinh collagen, elastin giúp trẻ hoá da và cấp ẩm sâu.',
    phuHop: 'Da có dấu hiệu lão hoá, da khô cần cấp ẩm và chăm sóc định kỳ.',
    sanPham: 'Serum Fusion (Tây Ban Nha), hoặc sản phẩm tương đương.',
    gia: '1.500.000 đ',
  },
];

// Bảng giá combo lấy nhân mụn
const COMBO_MUN_GOIS = [
  {
    ten: 'Gói Cơ Bản',
    chiTiet: ['Lấy nhân mụn', 'Điện di (*)'],
    phuHop: 'Da ít nhờn và ít mụn viêm.',
    giaGoc: '740K',
    gia: '660K',
    giam: '-80k',
    hieuQua: ['+++ ', '+ ', '+ ', '+ ', '+ ', '', '', '', '+', ''],
  },
  {
    ten: 'Gói Nâng Cao',
    chiTiet: ['Lấy nhân mụn', 'Đắp mặt nạ (*)', 'Chiếu ánh sáng', 'Điện di (*)'],
    phuHop: 'Da nhờn, da hỗn hợp hoặc da khô nhạy cảm. Và có mụn viêm, thâm mụn.',
    giaGoc: '940K',
    gia: '850K',
    giam: '-90k',
    hieuQua: ['+++', '++', '++', '++', '+', '', '', '', '+', '+'],
  },
  {
    ten: 'Gói Chuyên Sâu',
    chiTiet: ['Lấy nhân mụn', 'Peel (*)'],
    phuHop: 'Da nhờn, dày sừng. Có tăng sắc tố sau mụn và mụn viêm mức độ trung bình trở lên.',
    giaGoc: '1.470K',
    gia: '1.380K',
    giam: '-90k',
    hieuQua: ['+++', '+++', '+++', '+++', '+', '+++', '+++', '', '+++', '++'],
  },
  {
    ten: 'Gói Chuyên Sâu IPL',
    chiTiet: ['Lấy nhân mụn', 'IPL', 'Điện di hoặc Mặt nạ (*)'],
    phuHop: 'Da nhờn, da nhạy cảm. Và có nhiều mụn viêm, đặc biệt dạng mụn nốt nang. Da hồng ban, tăng sắc tố sau mụn.',
    giaGoc: '1.470K',
    gia: '1.380K',
    giam: '-90k',
    hieuQua: ['+++', '+++', '+++', '+++', '++', '', '+', '', '+', '++'],
  },
];

// Bảng giá ngừa mụn định kỳ
const NGUA_MUN_GOIS = [
  {
    ten: 'Cơ Bản',
    thoiGian: '60–75 phút',
    col: 'bg-primary',
    chiTiet: ['Lấy nhân mụn', 'Đi máy ánh sáng sát khuẩn', 'Điện di (*)'],
    phuHop: 'Ngừa mụn cho nền da khỏe, ít nhờn, mụn ẩn & mụn đầu đen mức độ ít, không có hoặc chỉ rải rác mụn viêm.',
    gia: '660.000 đ',
  },
  {
    ten: 'Nâng Cao',
    thoiGian: '70–90 phút',
    col: 'bg-primary',
    chiTiet: ['Rửa mặt Oxy Jet', 'Lấy nhân mụn', 'Đi máy ánh sáng sát khuẩn', 'Peel da nông (*)', 'Chăm trị mụn (<3 nốt)', 'Thoa dưỡng chất'],
    phuHop: 'Ngừa mụn cho da dễ bị mụn viêm (thường xuyên thức khuya, stress, căng thẳng, mụn nhiều hơn vào "ngày dâu"...).',
    gia: '1.200.000 đ',
  },
  {
    ten: 'Cao Cấp',
    thoiGian: '90–125 phút',
    col: 'bg-primary',
    chiTiet: ['Rửa mặt Oxy Jet', 'Lấy nhân mụn', 'Đi máy ánh sáng sát khuẩn', 'Peel da nông (*)', 'Lăn kim vi điểm (*)', 'DDM phục hồi', 'Thoa dưỡng chất'],
    phuHop: 'Ngừa mụn và làm căng bóng da, mụn ẩn & mụn đầu đen mức độ ít, không có mụn viêm.',
    gia: '1.750.000 đ',
  },
];

// Bảng giá trẻ hóa da & giảm thâm
const TRE_HOA_GOIS = [
  {
    ten: 'Gói Cơ Bản',
    chiTiet: ['Rửa mặt Oxy Jet', 'Đắp mặt nạ (*)', 'Chiếu ánh sáng', 'Điện di (*)'],
    phuHop: 'Da khô hoặc ít nhờn, không có mụn. Cần chăm sóc làm sạch và trắng sáng định kì.',
    gia: '620.000 đ',
  },
  {
    ten: 'Gói Nâng Cao',
    chiTiet: ['Rửa mặt Oxy Jet', 'Peel da nông (*)', 'Đắp mặt nạ (*)', 'Thoa dưỡng chất'],
    phuHop: 'Da thường hoặc ít nhờn, có dày sừng và thâm mụn mức độ nhẹ. Cần chăm sóc trẻ hóa và trắng sáng.',
    gia: '935.000 đ',
  },
  {
    ten: 'Gói Chuyên Sâu',
    chiTiet: ['Rửa mặt Oxy Jet', 'Lăn kim vi điểm (*)', 'Điện di (*)'],
    phuHop: 'Da dày sừng và thâm mụn mức độ nhẹ, lỗ chân lông to. Cần chăm sóc trắng sáng và cấp ẩm.',
    gia: '1.320.000 đ',
  },
  {
    ten: 'Gói Cao Cấp',
    chiTiet: ['Rửa mặt Oxy Jet', 'Peel da nông (*)', 'Lăn kim vi điểm (*)', 'Đắp mặt nạ (*)', 'Thoa dưỡng chất'],
    phuHop: 'Da dày sừng, thâm mụn mức độ nhẹ và lỗ chân lông to. Cần cấp ẩm căng bóng và tăng độ đàn hồi.',
    gia: '1.650.000 đ',
  },
];

// Bảng giá body
const BODY_ROWS = [
  { dv: 'Đắp mặt nạ', v1: '200.000 đ', v2: '300.000 đ', v3: '400.000 đ', v4: '500.000 đ' },
  { dv: 'Lấy nhân mụn', v1: '695.000 đ', v2: '995.000 đ', v3: '1.250.000 đ', v4: '1.500.000 đ' },
  { dv: 'Chiếu ánh sáng kết hợp điện di', v1: '610.000 đ', v2: '850.000 đ', v3: '1.085.000 đ', v4: '–' },
  { dv: 'Chiếu ánh sáng', v1: '110.000 đ', v2: '220.000 đ', v3: '320.000 đ', v4: '420.000 đ' },
  { dv: 'IPL (xung ánh sáng cường độ cao)', v1: '1.600.000 đ', v2: '1.900.000 đ', v3: '2.400.000 đ', v4: '–' },
  { dv: 'Peel da', v1: '1.600.000 đ', v2: '1.900.000 đ', v3: '2.400.000 đ', v4: '2.900.000 đ' },
];

/* ─────────────────────────────────────────────
   COMPONENTS
───────────────────────────────────────────── */

const TH = ({ children, wide }: { children: React.ReactNode; wide?: boolean }) => (
  <th className={`bg-primary text-white text-sm font-bold px-4 py-3 text-left ${wide ? 'w-[28%]' : ''}`}>
    {children}
  </th>
);

const TD = ({ children, price }: { children: React.ReactNode; price?: boolean }) => (
  <td className={`px-4 py-3 text-sm border-b border-gray-100 align-top ${price ? 'text-primary font-bold whitespace-nowrap' : 'text-gray-700'}`}>
    {children}
  </td>
);

const SectionTitle = ({ id, children }: { id?: string; children: React.ReactNode }) => (
  <h2 id={id} className="text-xl font-black text-gray-800 uppercase tracking-wide mt-10 mb-3 pt-2">
    {children}
  </h2>
);

const PageTitle = ({ children }: { children: React.ReactNode }) => (
  <h3 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tight mb-6 pb-3 border-b-2 border-primary">
    {children}
  </h3>
);

function SimpleTable({ cols, rows, hasSanPham }: {
  cols: string[];
  rows: { ten: string; congDung: string; phuHop: string; sanPham?: string; buocSong?: string; gia: string }[];
  hasSanPham?: boolean;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {cols.map((c) => <TH key={c}>{c}</TH>)}
            <TH>Giá dịch vụ</TH>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-blue-50/40">
              <TD>
                <span className="inline-flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                  <strong>{r.ten}</strong>
                </span>
              </TD>
              {r.buocSong !== undefined && <TD>{r.buocSong}</TD>}
              <TD>{r.congDung}</TD>
              <TD>{r.phuHop}</TD>
              {hasSanPham && <TD><em className="text-gray-500">{r.sanPham}</em></TD>}
              <TD price>{r.gia}</TD>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */

export default function BangGia() {
  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <div className="bg-primary text-white py-14 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <p className="text-secondary-light text-xs font-bold uppercase tracking-widest mb-3">Phòng Khám Da Liễu & Spa</p>
          <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">BẢNG GIÁ DỊCH VỤ</h1>
          <p className="text-blue-100 text-sm max-w-xl mx-auto mb-6">
            CTCP Bệnh Viện Y Dược Sài Gòn — 405-407 Đỗ Xuân Hợp, Phước Long, TP.HCM
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-xs">
            {['Lấy nhân mụn', 'Chiếu ánh sáng', 'Peel da', 'IPL', 'Lăn kim', 'Gói combo', 'Chăm sóc thân'].map((s) => (
              <span key={s} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Note */}
      <div className="bg-amber-50 border-b border-amber-200 py-3">
        <p className="max-w-5xl mx-auto px-4 text-xs text-amber-800 text-center">
          ⚕️ Giá dịch vụ chưa bao gồm phí thăm khám bác sĩ. Bác sĩ Chuyên khoa II trực tiếp thăm khám và chỉ định phác đồ phù hợp.&nbsp;
          Sản phẩm sử dụng tuỳ thuộc vào tình trạng da và chỉ định lâm sàng của bác sĩ.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">

        {/* ── PHẦN 1: CHĂM SÓC DA & TRỊ MỤN ── */}
        <PageTitle>Bảng Giá Chăm Sóc Da & Trị Mụn</PageTitle>

        <SectionTitle id="lay-mun">Lấy Mụn (Ngừa Viêm Nhiễm)</SectionTitle>
        <SimpleTable
          cols={['Loại dịch vụ', 'Công dụng nổi bật', 'Phù hợp với']}
          rows={LAY_MUN}
        />

        <SectionTitle id="oxy-jet">Chăm Sóc Làm Sạch Sâu Oxy Jet</SectionTitle>
        <SimpleTable
          cols={['Loại dịch vụ', 'Công dụng nổi bật', 'Phù hợp với']}
          rows={OXY_JET}
        />

        <SectionTitle id="anh-sang">Chiếu Ánh Sáng</SectionTitle>
        <SimpleTable
          cols={['Loại ánh sáng', 'Công dụng nổi bật', 'Phù hợp với']}
          rows={ANH_SANG}
        />

        <SectionTitle id="mat-na">Đắp Mặt Nạ</SectionTitle>
        <SimpleTable
          cols={['Loại mặt nạ', 'Công dụng nổi bật', 'Phù hợp với', 'Sản phẩm']}
          rows={MAT_NA}
          hasSanPham
        />

        <SectionTitle id="dien-di">Chiếu Ánh Sáng Kết Hợp Đưa Dưỡng Chất</SectionTitle>
        <SimpleTable
          cols={['Loại dịch vụ', 'Công dụng nổi bật', 'Phù hợp với', 'Sản phẩm']}
          rows={DIEN_DI}
          hasSanPham
        />

        <SectionTitle id="ddm">DDM – Sóng Siêu Âm Đa Tầng</SectionTitle>
        <SimpleTable
          cols={['Loại DDM', 'Công dụng nổi bật', 'Phù hợp với']}
          rows={DDM}
        />

        <SectionTitle id="peel-da">Peel Da</SectionTitle>
        <SimpleTable
          cols={['Loại peel da', 'Công dụng nổi bật', 'Phù hợp với', 'Sản phẩm']}
          rows={PEEL_DA}
          hasSanPham
        />

        <SectionTitle id="ipl">IPL – Xung Ánh Sáng Cường Độ Cao</SectionTitle>
        <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <TH>Loại IPL</TH>
                <TH>Bước sóng</TH>
                <TH>Công dụng nổi bật</TH>
                <TH>Phù hợp với</TH>
                <TH>Giá dịch vụ</TH>
              </tr>
            </thead>
            <tbody>
              {IPL.map((r, i) => (
                <tr key={i} className="hover:bg-blue-50/40">
                  <TD>
                    <span className="inline-flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                      <strong>{r.ten}</strong>
                    </span>
                  </TD>
                  <TD>{r.buocSong}</TD>
                  <TD>{r.congDung}</TD>
                  <TD>{r.phuHop}</TD>
                  <TD price>{r.gia}</TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <SectionTitle id="lan-kim">Lăn Kim Nông</SectionTitle>
        <SimpleTable
          cols={['Loại lăn kim', 'Công dụng nổi bật', 'Phù hợp với', 'Sản phẩm']}
          rows={LAN_KIM}
          hasSanPham
        />

        {/* ── PHẦN 2: COMBO LẤY NHÂN MỤN ── */}
        <div className="border-t-2 border-gray-100 mt-12 pt-4" />
        <PageTitle>Bảng Giá Combo Lấy Nhân Mụn</PageTitle>
        <p className="text-xs text-gray-500 mb-2">(*) Hiệu quả tuỳ thuộc vào sản phẩm sử dụng.</p>
        <div className="flex flex-wrap gap-2 mb-6 text-xs">
          {['+ Hiệu quả ít', '++ Hiệu quả trung bình', '+++ Hiệu quả cao'].map((s) => (
            <span key={s} className="border border-gray-300 rounded-full px-3 py-1 text-gray-600">{s}</span>
          ))}
        </div>

        <div className="overflow-x-auto rounded-xl border border-gray-200 mb-8">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="bg-gray-100 text-gray-700 text-sm font-bold px-4 py-3 text-left w-[22%]">Chi tiết dịch vụ</th>
                {COMBO_MUN_GOIS.map((g) => (
                  <th key={g.ten} className="bg-primary text-white text-sm font-bold px-4 py-3 text-center uppercase">{g.ten}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-100">Dịch vụ bao gồm</td>
                {COMBO_MUN_GOIS.map((g) => (
                  <td key={g.ten} className="px-4 py-3 text-sm border-b border-gray-100 align-top">
                    <ul className="space-y-1">
                      {g.chiTiet.map((c) => (
                        <li key={c} className="flex items-start gap-1.5 text-gray-700">
                          <span className="text-primary mt-0.5">•</span>{c}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
              {[
                'Loại bỏ nhân mụn', 'Kiểm soát bã nhờn', 'Giảm mụn viêm, sưng', 'Diệt khuẩn C.acnes',
                'Phục hồi da nhạy cảm, viêm kích ứng', 'Giảm dày sừng nang lông', 'Đẩy nhân mụn dưới da lên sớm',
                'Giảm hồng ban (thâm đỏ)', 'Giảm tăng sắc tố (thâm đen)', 'Ngăn ngừa sẹo mụn',
              ].map((hq, idx) => (
                <tr key={hq} className="hover:bg-blue-50/30">
                  <td className="px-4 py-2.5 text-sm text-gray-700 border-b border-gray-100">{idx + 1}. {hq}</td>
                  {COMBO_MUN_GOIS.map((g) => (
                    <td key={g.ten} className={`px-4 py-2.5 text-sm text-center border-b border-gray-100 font-semibold ${g.hieuQua[idx]?.includes('+++') ? 'text-green-600' : g.hieuQua[idx]?.includes('++') ? 'text-blue-600' : 'text-gray-500'}`}>
                      {g.hieuQua[idx] || ''}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-gray-50">
                <td className="px-4 py-3 text-sm font-semibold text-gray-700 border-b border-gray-100">Phù hợp với tình trạng da</td>
                {COMBO_MUN_GOIS.map((g) => (
                  <td key={g.ten} className="px-4 py-3 text-sm text-gray-600 border-b border-gray-100 italic">{g.phuHop}</td>
                ))}
              </tr>
              <tr>
                <td className="px-4 py-4 text-sm font-bold text-gray-700">Giá dịch vụ</td>
                {COMBO_MUN_GOIS.map((g) => (
                  <td key={g.ten} className="px-4 py-4 text-center border-gray-100">
                    <div className="text-gray-400 line-through text-xs">{g.giaGoc}</div>
                    <div className="text-primary font-black text-lg">{g.gia}</div>
                    <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded">{g.giam}</span>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* ── PHẦN 3: NGỪA MỤN ĐỊNH KỲ ── */}
        <div className="border-t-2 border-gray-100 mt-12 pt-4" />
        <PageTitle>Bảng Giá Chăm Sóc Da Ngừa Mụn Tái Phát Định Kỳ</PageTitle>
        <p className="text-sm font-semibold text-gray-600 mb-1">Khuyến cáo sử dụng: 1 tháng/lần</p>
        <div className="flex flex-wrap gap-2 mb-6 text-xs">
          {['+ Hiệu quả ít', '++ Hiệu quả trung bình', '+++ Hiệu quả cao'].map((s) => (
            <span key={s} className="border border-gray-300 rounded-full px-3 py-1 text-gray-600">{s}</span>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {NGUA_MUN_GOIS.map((g) => (
            <div key={g.ten} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-primary text-white px-5 py-4">
                <p className="font-black text-lg uppercase">{g.ten}</p>
                <p className="text-blue-200 text-xs mt-0.5">{g.thoiGian}</p>
              </div>
              <div className="p-5">
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Chi tiết dịch vụ</p>
                <ul className="space-y-1.5 mb-4">
                  {g.chiTiet.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-primary font-bold mt-0.5">•</span>{c}
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Phù hợp với</p>
                <p className="text-sm text-gray-600 italic mb-4">{g.phuHop}</p>
                <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Giá dịch vụ</span>
                  <span className="text-primary font-black text-xl">{g.gia}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PHẦN 4: TRẺ HÓA DA ── */}
        <div className="border-t-2 border-gray-100 mt-12 pt-4" />
        <PageTitle>Bảng Giá Chăm Sóc Trẻ Hóa Da Và Giảm Thâm</PageTitle>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {TRE_HOA_GOIS.map((g) => (
            <div key={g.ten} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="bg-secondary text-white px-5 py-4">
                <p className="font-black uppercase text-sm">{g.ten}</p>
              </div>
              <div className="p-4">
                <ul className="space-y-1.5 mb-4">
                  {g.chiTiet.map((c) => (
                    <li key={c} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-secondary font-bold mt-0.5">•</span>{c}
                    </li>
                  ))}
                </ul>
                <p className="text-xs text-gray-500 italic mb-4 leading-relaxed">{g.phuHop}</p>
                <div className="border-t border-gray-100 pt-3 text-center">
                  <span className="text-secondary font-black text-xl">{g.gia}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── PHẦN 5: TRỊ MỤN CƠ THỂ ── */}
        <div className="border-t-2 border-gray-100 mt-12 pt-4" />
        <PageTitle>Bảng Giá Trị Mụn Các Vùng Da Trên Cơ Thể</PageTitle>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4 text-sm text-blue-900 space-y-1">
          <p><strong>Quy ước:</strong> 1 vùng da trên cơ thể ứng với: Nửa lưng / Ngực / 2 cánh tay.</p>
          <p><strong>Lưu ý:</strong> Điện di và IPL không điều trị vùng ngực.</p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-gray-200 mb-10">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <TH>Dịch vụ</TH>
                <TH>1 vùng da</TH>
                <TH>Combo 2 vùng</TH>
                <TH>Combo 3 vùng</TH>
                <TH>Combo 4 vùng</TH>
              </tr>
            </thead>
            <tbody>
              {BODY_ROWS.map((r, i) => (
                <tr key={i} className="hover:bg-blue-50/40">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800 border-b border-gray-100">{r.dv}</td>
                  <td className="px-4 py-3 text-sm text-primary font-bold border-b border-gray-100">{r.v1}</td>
                  <td className="px-4 py-3 text-sm text-primary font-bold border-b border-gray-100">{r.v2}</td>
                  <td className="px-4 py-3 text-sm text-primary font-bold border-b border-gray-100">{r.v3}</td>
                  <td className="px-4 py-3 text-sm text-primary font-bold border-b border-gray-100">{r.v4}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* CTA */}
        <div className="bg-primary text-white rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-black mb-2">Đặt Lịch Để Được Tư Vấn Miễn Phí</h3>
          <p className="text-blue-100 text-sm mb-6 max-w-xl mx-auto">
            Bác sĩ Chuyên khoa II sẽ thăm khám trực tiếp và chỉ định phác đồ phù hợp với tình trạng da của bạn.
            Khách hàng mới nhận ưu đãi giảm đến 100.000đ.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/dat-lich"
              className="bg-white text-primary font-black px-7 py-3 rounded-lg hover:bg-blue-50 transition-colors text-sm">
              Đặt Lịch Khám Ngay →
            </Link>
            <Link href="/khuyen-mai"
              className="bg-secondary hover:bg-teal-700 text-white font-bold px-7 py-3 rounded-lg transition-colors text-sm">
              🎁 Xem Ưu Đãi Khách Mới
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
