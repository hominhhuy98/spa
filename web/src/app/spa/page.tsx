import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';

interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  status?: string;
  publishedAt: string;
}

export default async function SpaPage() {
  const filePath = path.join(process.cwd(), 'src/data/spa-posts.json');
  let posts: Post[] = [];
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const allPosts = JSON.parse(fileContents);
    // Chỉ lấy bài viết có status là published (hoặc không có trường status coi như public cho backwards-compatibility)
    posts = allPosts.filter((p: any) => !p.status || p.status === 'published');
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
          {posts.map((post, idx) => (
            <Link href={`/spa/${post.id}`} key={post.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-xl transition-shadow">
              <div className="relative w-full h-48 bg-gray-100">
                <Image src={post.imageUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" className="object-cover" priority={idx < 6} />
              </div>
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
