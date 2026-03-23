export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="relative w-full h-[500px] bg-gray-200">
        <img src="/assets/banner.png" alt="Hero Banner" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Chăm Sóc Làn Da - Khơi Nguồn Vẻ Đẹp</h1>
            <p className="text-xl mb-8">Nền tảng Y khoa Da liễu & Thẩm mỹ chuẩn Quốc tế từ BV Y dược Sài Gòn</p>
            <a href="/dat-lich" className="bg-secondary text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-teal-700 transition">Nhận Tư Vấn Ngay</a>
          </div>
        </div>
      </section>

      {/* Dịch vụ nổi bật */}
      <section className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-primary mb-10">Dịch Vụ Của Chúng Tôi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-primary mb-4">Điều trị Da liễu</h3>
            <p className="text-gray-600 mb-6">Chẩn đoán và điều trị chuyên sâu các bệnh lý về da với đội ngũ bác sĩ chuyên khoa.</p>
            <a href="/dich-vu-da-lieu" className="text-primary font-medium hover:underline">Tìm hiểu thêm &rarr;</a>
          </div>
          <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition">
            <h3 className="text-2xl font-semibold text-secondary mb-4">Chăm sóc Thẩm mỹ (Spa)</h3>
            <p className="text-gray-600 mb-6">Các liệu trình chăm sóc da, phục hồi và làm đẹp da bằng công nghệ hiện đại.</p>
            <a href="/spa" className="text-secondary font-medium hover:underline">Tìm hiểu thêm &rarr;</a>
          </div>
        </div>
      </section>
    </div>
  );
}
