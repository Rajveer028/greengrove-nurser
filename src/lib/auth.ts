import { cookies } from "next/headers";

export interface User {
  id: string;
  displayName: string;
  primaryEmail: string;
  profileImageUrl?: string;
  role?: 'OWNER' | 'CUSTOMER';
}

const SESSION_COOKIE = "gg_session";

function parseBase64Json<T>(value: string | undefined): T | null {
  if (!value) return null;
  try {
    const json = Buffer.from(value, "base64").toString("utf-8");
    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

// Get current user from httpOnly cookie set by auth routes
export async function getCurrentUser(): Promise<User | null> {
  const store = cookies();
  const raw = store.get(SESSION_COOKIE)?.value;
  const session = parseBase64Json<{ id: string; displayName: string; email: string; profileImageUrl?: string; role?: 'OWNER' | 'CUSTOMER' }>(raw);
  if (!session) return null;
  return {
    id: session.id,
    displayName: session.displayName,
    primaryEmail: session.email,
    profileImageUrl: session.profileImageUrl,
    role: session.role,
  };
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
