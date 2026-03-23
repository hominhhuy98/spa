import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  publishedAt: string;
}

export default async function SpaPage() {
  const filePath = path.join(process.cwd(), 'src/data/spa-posts.json');
  let posts: Post[] = [];
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    posts = JSON.parse(fileContents);
  } catch (error) {
    console.error("Lỗi khi đọc file spa-posts.json", error);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-secondary mb-8 text-center">Dịch Vụ Chăm Sóc Thẩm Mỹ (SPA)</h1>
      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
        Các bài viết được tự động cập nhật và đồng bộ liên tục từ hệ thống Trello nội bộ.
      </p>

      {posts.length === 0 ? (
        <div className="text-center text-gray-500">Chưa có bài viết nào được đồng bộ.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link href={`/spa/${post.id}`} key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
              <img src={post.imageUrl} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
                <div 
                  className="text-gray-600 mb-4 line-clamp-3"
                  dangerouslySetInnerHTML={{ __html: post.description }}
                />
                <div className="mt-auto">
                  <span className="text-sm text-gray-400">
                    Đã đăng lúc: {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
