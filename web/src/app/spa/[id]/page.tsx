import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';

export default async function SpaDetailPage({ params }: { params: { id: string } }) {
  const filePath = path.join(process.cwd(), 'src/data/spa-posts.json');
  let posts: any[] = [];
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    posts = JSON.parse(fileContents);
  } catch (error) {
    posts = [];
  }

  const post = posts.find((p) => p.id === params.id);

  if (!post) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Không tìm thấy bài viết</h1>
        <Link href="/spa" className="text-primary hover:underline">&larr; Quay lại danh sách dịch vụ SPA</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <Link href="/spa" className="text-primary font-medium hover:underline inline-block mb-6">&larr; Quay lại SPA</Link>
      
      <img src={post.imageUrl} alt={post.title} className="w-full h-[400px] object-cover rounded-xl shadow-lg mb-8" />
      
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
      <p className="text-sm text-gray-500 mb-8 pb-4 border-b">
        Đăng ngày: {new Date(post.publishedAt).toLocaleDateString('vi-VN')}
      </p>

      <div 
        className="prose prose-lg max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: post.description }}
      />
    </div>
  );
}
