'use client';

/**
 * Lấy reCAPTCHA v3 token phía client.
 * Trả về undefined nếu chưa cấu hình site key (không chặn flow).
 */
declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, opts: { action: string }) => Promise<string>;
    };
  }
}

export async function getRecaptchaToken(action: string): Promise<string | undefined> {
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  if (!siteKey || typeof window === 'undefined' || !window.grecaptcha) return undefined;

  return new Promise((resolve) => {
    window.grecaptcha!.ready(async () => {
      try {
        const token = await window.grecaptcha!.execute(siteKey, { action });
        resolve(token);
      } catch {
        resolve(undefined);
      }
    });
  });
}
