'use server';

import { cookies } from 'next/headers';

const SESSION_COOKIE = 'gg_session';

// Sign out by clearing session cookie
export async function signOut() {
  cookies().delete(SESSION_COOKIE);
  return { success: true };
}

