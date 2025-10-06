import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import { getCurrentUser } from "@/lib/auth";

// Mock data for dashboard - in a real app, this would come from your database
const mockDashboardStats = {
  totalPlants: 156,
  totalCustomers: 89,
  totalOrders: 234,
  totalRevenue: 4567890, // ₹45,67,890
  lowStockPlants: 12,
  pendingOrders: 8,
  upcomingCareTasks: 15,
  completedCareTasks: 42,
};

export default async function Home() {
  const user = await getCurrentUser();

  return (
    <div className="min-h-screen">
      {user ? (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <Dashboard stats={mockDashboardStats} />
        </div>
      ) : (
        <Hero />
      )}
    </div>
  );
}
