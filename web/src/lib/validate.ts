/**
 * Helpers validate & sanitize input cho public APIs.
 */

/** SĐT Việt Nam: 0xxxxxxxxx (10 số) hoặc +84xxxxxxxxx */
export function isValidVNPhone(phone: string): boolean {
  if (typeof phone !== 'string') return false;
  const digits = phone.replace(/\s/g, '');
  return /^(0|\+84)[0-9]{9,10}$/.test(digits);
}

/** Email hợp lệ */
export function isValidEmail(email: string): boolean {
  if (typeof email !== 'string') return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Kiểm tra string trong giới hạn độ dài */
export function isLenOk(value: unknown, min: number, max: number): boolean {
  if (typeof value !== 'string') return false;
  const len = value.trim().length;
  return len >= min && len <= max;
}

/** Cắt chuỗi về độ dài tối đa (chống payload khổng lồ) */
export function truncate(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, max);
}

/** Ngày YYYY-MM-DD hợp lệ */
export function isValidDate(date: string): boolean {
  if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const d = new Date(date);
  return !isNaN(d.getTime());
}

/** Giờ HH:MM hợp lệ (tuỳ chọn) */
export function isValidTime(time: string): boolean {
  if (!time) return true;
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(time);
}

/**
 * Loại bỏ ký tự control + giới hạn độ dài (sanitize text input).
 * React tự escape HTML khi render, nhưng vẫn loại control chars để sạch dữ liệu.
 */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== 'string') return '';
  const cleaned = Array.from(value)
    .filter(ch => {
      const code = ch.charCodeAt(0);
      // Giữ tab(9), newline(10); loại các control char khác (0-31, 127)
      return code === 9 || code === 10 || (code >= 32 && code !== 127);
    })
    .join('');
  return cleaned.trim().slice(0, max);
}

/** Mật khẩu: tối thiểu 6 ký tự (giữ tương thích), khuyến nghị mạnh hơn */
export function isValidPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 6 && password.length <= 128;
}
