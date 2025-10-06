import { getCurrentUser } from "@/lib/auth";

export async function getUserDetails(userId?: string) {
  const user = await getCurrentUser();
  return user;
}
