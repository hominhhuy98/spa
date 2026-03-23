import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

// Webhook xử lý push từ Trello (khi card chuyển cột sang "SPA")
export async function POST(req: Request) {
  try {
    const payload = await req.json();

    // Trong Trello: khi 1 action updateCard xảy ra và chuyển cột, `payload.action.data.listAfter.name` sẽ chứa tên cột
    // Hoặc khi có Webhook gửi tới, ta kiểm tra board, cột và attachment
    const isSpaList = payload?.action?.data?.listAfter?.name?.toUpperCase() === 'SPA' || 
                      payload?.action?.data?.list?.name?.toUpperCase() === 'SPA';

    if (!isSpaList) {
      return NextResponse.json({ message: 'Không phải cột SPA, bỏ qua.' }, { status: 200 });
    }

    // Tiêu chí: Chỉ đăng bài viết đã CÓ HÌNH (cover image hoặc attachments)
    // Trello gửi URL qua `payload.action.data.card.cover.scaled` (hoặc ta có thể mock logic tại đây)
    // Để mock theo request thực, ta check `payload.coverUrl` từ test
    const coverUrl = payload.coverUrl || (payload?.action?.data?.card?.cover?.scaled ? payload.action.data.card.cover.scaled[0].url : null);
    
    if (!coverUrl) {
      return NextResponse.json({ message: 'Thẻ chưa có hình ảnh đính kèm (cover). Sẽ bỏ qua và không đăng lên CMS.' }, { status: 200 });
    }

    // Mapping Data
    const title = payload.title || payload?.action?.data?.card?.name || 'Bài viết mới từ Trello';
    const description = payload.description || payload?.action?.data?.card?.desc || '<p>Đang cập nhật nội dung...</p>';
    const id = payload.id || payload?.action?.data?.card?.id || `card-${Date.now()}`;

    const newPost = {
      id,
      title,
      description,
      imageUrl: coverUrl,
      publishedAt: new Date().toISOString()
    };

    // Lưu vào JSON làm mock CMS Data
    const filePath = path.join(process.cwd(), 'src/data/spa-posts.json');
    let posts = [];
    try {
      const fileContents = await fs.readFile(filePath, 'utf8');
      posts = JSON.parse(fileContents);
    } catch(err) {
      posts = [];
    }

    // Xóa card cũ nếu trùng ID (Update), hoặc thêm mới
    posts = posts.filter((p: any) => p.id !== id);
    posts.unshift(newPost); // Thêm lên đầu trang

    await fs.writeFile(filePath, JSON.stringify(posts, null, 2));

    return NextResponse.json({ message: 'Đã đồng bộ Trello bài viết lên CMS thành công!', post: newPost }, { status: 200 });
  } catch (error) {
    console.error("Lỗi Webhook Trello:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Hàm xử lý Webhook validation của Trello (Head req)
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
