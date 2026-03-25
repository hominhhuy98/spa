import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import Image from 'next/image';

export async function generateStaticParams() {
  const filePath = path.join(process.cwd(), 'src/data/spa-posts.json');
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const posts: any[] = JSON.parse(fileContents);
    return posts
      .filter((post) => !post.status || post.status === 'published')
      .map((post) => ({
        id: post.id.toString(),
      }));
  } catch (error) {
    return [];
  }
}

export default async function SpaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const filePath = path.join(process.cwd(), 'src/data/spa-posts.json');
  let posts: any[] = [];
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    posts = JSON.parse(fileContents);
  } catch (error) {
    posts = [];
  }

  const post = posts.find((p) => p.id === id && (!p.status || p.status === 'published'));

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
      
      <div className="relative w-full h-[400px] bg-gray-100 rounded-xl shadow-lg mb-8 overflow-hidden">
        <Image src={post.imageUrl} alt={post.title} fill priority sizes="100vw" className="object-cover" />
      </div>
      
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
