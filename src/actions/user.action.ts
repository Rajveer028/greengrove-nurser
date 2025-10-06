'use server';

import { getCurrentUser } from '@/lib/auth';

export async function getUserDetails(userId: string | undefined) {
  const user = await getCurrentUser();
  return user;
}

export async function getUserId() {
  const user = await getCurrentUser();
  return user?.id;
}