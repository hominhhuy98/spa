export default function DichVuDaLieu() {
  const dichVu = [
    { id: 1, name: 'Điều trị Mụn Trứng Cá', desc: 'Phác đồ chuẩn y khoa trị tận gốc vi khuẩn P.acnes, không để lại sẹo thâm.' },
    { id: 2, name: 'Trị Nám & Tàn Nhang', desc: 'Sử dụng Laser Toning và các liệu trình Mesotherapy chuyên sâu.' },
    { id: 3, name: 'Điều trị Sẹo Rỗ', desc: 'Công nghệ phi kim RF, Laser Fractional bóc tách đáy sẹo.' },
    { id: 4, name: 'Khám Bệnh Lý Da Da', desc: 'Điều trị viêm da cơ địa, chàm, vảy nến, nấm da, rụng tóc.' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary text-center mb-8">Bệnh Lý Da Liễu</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Bệnh viện Y dược Sài Gòn tự hào mang đến các phác đồ điều trị chuẩn Y khoa,
        do đội ngũ Bác sĩ CKII, Thạc sĩ Da liễu trực tiếp thăm khám và tư vấn.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {dichVu.map(item => (
          <div key={item.id} className="bg-white p-8 rounded-lg shadow-md border-t-4 border-primary">
            <h3 className="text-2xl font-semibold mb-3">{item.name}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
