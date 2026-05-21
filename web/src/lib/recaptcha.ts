/**
 * Xác minh reCAPTCHA v3 token phía server.
 * Trả về true nếu hợp lệ (score >= threshold) hoặc nếu chưa cấu hình (fail-open để không chặn user thật).
 */
export async function verifyRecaptcha(token: string | undefined, action?: string): Promise<boolean> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // Chưa cấu hình → bỏ qua (không chặn). Cấu hình rồi mới bắt buộc.
  if (!secret) return true;

  if (!token) return false;

  try {
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token }),
    });
    const data = await res.json();

    if (!data.success) return false;
    // score: 0.0 (bot) → 1.0 (người thật). Ngưỡng 0.5.
    if (typeof data.score === 'number' && data.score < 0.5) return false;
    // Kiểm tra action khớp (nếu truyền)
    if (action && data.action && data.action !== action) return false;

    return true;
  } catch {
    // Lỗi mạng tới Google → fail-open để không chặn user thật
    return true;
  }
}
