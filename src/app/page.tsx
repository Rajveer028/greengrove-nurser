import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import { getCurrentUser } from "@/lib/auth";
import { syncUserWithDatabase } from "@/actions/user.action";
import { headers } from "next/headers";

// Mock data for dashboard - fallback when database is not available
const mockDashboardStats = {
  totalPlants: 0,
  totalCustomers: 0,
  totalOrders: 0,
  totalRevenue: 0,
  lowStockPlants: 0,
  pendingOrders: 0,
  upcomingCareTasks: 0,
  completedCareTasks: 0,
};

async function getDashboardStats() {
  try {
    const hdrs = headers();
    const host = hdrs.get('host');
    const cookie = hdrs.get('cookie') || '';
    const protocol = process.env.VERCEL ? 'https' : 'http';
    const base = host ? `${protocol}://${host}` : '';
    const response = await fetch(`${base}/api/dashboard`, { cache: 'no-store', headers: { cookie } });
    
    if (response.ok) {
      const data = await response.json();
      return data.stats;
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
  
  return mockDashboardStats;
}

export default async function Home() {
  const user = await getCurrentUser();

  // Sync user with database if authenticated
  if (user) {
    await syncUserWithDatabase();
  }

  // Get dashboard stats
  const stats = user ? await getDashboardStats() : mockDashboardStats;

  return (
    <div className="min-h-screen">
      {user ? (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Dashboard stats={stats} />
        </div>
      ) : (
        <Hero />
      )}
    </div>
  );
}
