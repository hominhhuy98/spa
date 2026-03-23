import Link from 'next/link';

export default function TinTucDetail({ params }: { params: { id: string } }) {
  const kienThuc = [
    {
      id: "1",
      title: "Phòng ngừa mụn trong mùa hè nắng nóng",
      content: "<p>Nhiệt độ cao khiến tuyến bã nhờn hoạt động mạnh mẽ, kết hợp với bụi bẩn dễ gây bít tắc lỗ chân lông và sinh mụn. Để phòng ngừa hiệu quả, bạn cần:</p><ul><li>Rửa mặt 2 lần/ngày bằng sữa rửa mặt dịu nhẹ.</li><li>Sử dụng kem chống nắng không gây bít tắc (non-comedogenic).</li><li>Hạn chế chạm tay lên mặt và uống đủ nước.</li></ul>",
      nguon: "Hướng dẫn da liễu Bộ Y Tế",
      date: "2026-03-23"
    },
    {
      id: "2",
      title: "Hiểu đúng về Corticoid trong mỹ phẩm",
      content: "<p>Corticoid (hay Corticosteroid) là nhóm thuốc kháng viêm mạnh nhưng lại bị lạm dụng trong mỹ phẩm làm trắng da (kem trộn). Tác hại khi sử dụng lâu dài bao gồm:</p><ul><li>Làm mỏng da, teo da, giãn mao mạch.</li><li>Phụ thuộc thuốc: da nổi mụn ồ ạt khi ngừng sử dụng.</li><li>Nhiễm trùng da do giảm sức đề kháng cục bộ.</li></ul>",
      nguon: "Tổ chức Y tế Thế giới (WHO) - Dermatology Guidelines",
      date: "2026-03-10"
    }
  ];

  const post = kienThuc.find(p => p.id === params.id);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
        <Link href="/tin-tuc" className="text-primary hover:underline">&larr; Quay lại danh sách tin tức</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/tin-tuc" className="text-primary font-medium hover:underline inline-block mb-6">&larr; Quay lại danh sách</Link>
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      
      <div className="flex items-center gap-4 mb-8 pb-4 border-b">
        <span className="bg-blue-50 text-blue-800 text-sm px-3 py-1 rounded inline-block border border-blue-200">
          <strong>Nguồn:</strong> {post.nguon}
        </span>
        <span className="text-sm text-gray-500">
          Ngày: {new Date(post.date).toLocaleDateString('vi-VN')}
        </span>
      </div>

      <div 
        className="prose prose-lg max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
