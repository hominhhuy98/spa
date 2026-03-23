export default function TinTuc() {
  const kienThuc = [
    {
      id: 1,
      title: "Phòng ngừa mụn trong mùa hè nắng nóng",
      desc: "Cách chăm sóc da và ngăn ngừa mụn khi thời tiết đổ nhiều mồ hôi.",
      nguon: "Hướng dẫn da liễu Bộ Y Tế",
      date: "2026-03-23"
    },
    {
      id: 2,
      title: "Hiểu đúng về Corticoid trong mỹ phẩm",
      desc: "Những tác hại khôn lường khi sử dụng kem trộn chứa Corticoid trôi nổi trên thị trường.",
      nguon: "Tổ chức Y tế Thế giới (WHO) - Dermatology Guidelines",
      date: "2026-03-10"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-primary text-center mb-8">Kiến Thức Y Khoa</h1>
      <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
        Tổng hợp các bài viết chuyên sâu về chăm sóc và điều trị da chuẩn y khoa.
      </p>

      <div className="space-y-8">
        {kienThuc.map((bai) => (
          <div key={bai.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-secondary flex flex-col md:flex-row md:items-center">
            <div className="flex-grow">
              <h2 className="text-2xl font-semibold mb-2">{bai.title}</h2>
              <p className="text-gray-700 mb-4">{bai.desc}</p>
              <div className="bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded inline-block">
                <strong>Nguồn xác thực:</strong> {bai.nguon}
              </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-6 text-gray-400 text-sm whitespace-nowrap">
              Đăng ngày: {new Date(bai.date).toLocaleDateString('vi-VN')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
