'use server';

import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function getUserDetails(userId: string | undefined) {
  const user = await getCurrentUser();
  return user;
}

export async function getUserId() {
  try {
    const dbUser = await getDbUser();
    return dbUser?.id;
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

// Sync user with database
export async function syncUserWithDatabase() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) return null;

    // Check if user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { stackUserId: sessionUser.id }
    });

    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          stackUserId: sessionUser.id,
          displayName: sessionUser.displayName || 'User',
          email: sessionUser.primaryEmail,
          profileImageUrl: sessionUser.profileImageUrl,
        }
      });
    } else {
      dbUser = await prisma.user.update({
        where: { stackUserId: sessionUser.id },
        data: {
          displayName: sessionUser.displayName || dbUser.displayName,
          email: sessionUser.primaryEmail,
          profileImageUrl: sessionUser.profileImageUrl,
        }
      });
    }

    return dbUser;
  } catch (error) {
    console.error('Error syncing user with database:', error);
    return null;
  }
}

// Get user from database
export async function getDbUser() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) return null;

    const dbUser = await prisma.user.findUnique({
      where: { stackUserId: sessionUser.id }
    });

    return dbUser;
  } catch (error) {
    console.error('Error getting database user:', error);
    return null;
  }
}