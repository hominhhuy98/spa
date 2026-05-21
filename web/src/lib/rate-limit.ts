import { adminDb } from './firebase-admin';

/**
 * Rate limiter dùng Firestore — hợp với serverless (Cloud Run).
 * Mỗi key (IP, phone, uid...) có 1 document đếm số request trong cửa sổ thời gian.
 *
 * @param key      Định danh (vd: "book:1.2.3.4", "otp:0901234567")
 * @param limit    Số request tối đa trong cửa sổ
 * @param windowMs Độ dài cửa sổ (ms)
 * @returns        { allowed, remaining, retryAfterSec }
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): Promise<{ allowed: boolean; remaining: number; retryAfterSec: number }> {
  const now = Date.now();
  const ref = adminDb.collection('rate_limits').doc(encodeURIComponent(key));

  try {
    return await adminDb.runTransaction(async (tx) => {
      const doc = await tx.get(ref);
      const data = doc.exists ? doc.data() : null;

      // Cửa sổ đã hết hạn hoặc chưa có → reset
      if (!data || (data.reset_at as number) < now) {
        tx.set(ref, { count: 1, reset_at: now + windowMs });
        return { allowed: true, remaining: limit - 1, retryAfterSec: 0 };
      }

      const count = (data.count as number) || 0;
      if (count >= limit) {
        const retryAfterSec = Math.ceil(((data.reset_at as number) - now) / 1000);
        return { allowed: false, remaining: 0, retryAfterSec };
      }

      tx.update(ref, { count: count + 1 });
      return { allowed: true, remaining: limit - count - 1, retryAfterSec: 0 };
    });
  } catch {
    // Fail-open: nếu Firestore lỗi, không chặn user hợp lệ
    return { allowed: true, remaining: limit, retryAfterSec: 0 };
  }
}

/** Lấy IP client từ request headers (Cloud Run dùng x-forwarded-for) */
export function getClientIp(req: Request): string {
  const xff = req.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return req.headers.get('x-real-ip') || 'unknown';
}

/** Response 429 chuẩn */
export function tooManyRequests(retryAfterSec: number, message = 'Quá nhiều yêu cầu, vui lòng thử lại sau.') {
  return new Response(JSON.stringify({ error: message, retryAfter: retryAfterSec }), {
    status: 429,
    headers: {
      'Content-Type': 'application/json',
      'Retry-After': String(retryAfterSec),
    },
  });
}
