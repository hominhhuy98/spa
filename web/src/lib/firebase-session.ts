import { cookies } from "next/headers";
import { adminAuth } from "./firebase-admin";

const SESSION_COOKIE_NAME = "__session";
const SESSION_EXPIRY = 60 * 60 * 24 * 5 * 1000; // 5 days

export async function createSessionCookie(idToken: string) {
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_EXPIRY,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, sessionCookie, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_EXPIRY / 1000,
  });

  return sessionCookie;
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getServerUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionCookie) return null;

  try {
    const decoded = await adminAuth.verifySessionCookie(sessionCookie, true);
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Lightweight JWT decode for middleware (Edge Runtime compatible).
 * Does NOT verify signature — only decodes payload and checks expiry.
 * Full verification happens in getServerUser() within API routes/server components.
 */
export function decodeSessionCookie(sessionCookie: string) {
  try {
    const parts = sessionCookie.split(".");
    if (parts.length !== 3) return null;

    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf-8")
    );

    // Check expiry
    if (payload.exp && payload.exp * 1000 < Date.now()) return null;

    return {
      uid: payload.sub || payload.user_id,
      email: payload.email,
      role: payload.role,
    };
  } catch {
    return null;
  }
}
