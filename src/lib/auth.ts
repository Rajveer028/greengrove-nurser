// Simple authentication system for development
export interface User {
  id: string;
  name: string;
  email: string;
}

// Mock user for development
export const mockUser: User = {
  id: "dev-user-1",
  name: "Demo User",
  email: "demo@greengrove.com"
};

// Simple auth functions
export async function getCurrentUser(): Promise<User | null> {
  // For development, always return the mock user
  // In production, this would check session/token
  return mockUser;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Authentication required");
  }
  return user;
}
