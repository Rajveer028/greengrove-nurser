import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, DollarSign, Package, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function fetchStats() {
  const hdrs = headers();
  const host = hdrs.get('host');
  const cookie = hdrs.get('cookie') || '';
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/dashboard`, { cache: 'no-store', headers: { cookie } });
  if (!res.ok) return null;
  const data = await res.json();
  return data.stats;
}

export default async function ReportsPage() {
  const user = await getCurrentUser();
  const stats = user ? await fetchStats() : null;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please sign in to access the reports system.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d] transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <BarChart3 className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
              Reports & Analytics
            </h1>
            <p className="text-green-600 dark:text-green-400">
              Business insights and performance metrics
            </p>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{(stats?.totalRevenue || 0).toLocaleString()}
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                Updated from live orders
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Orders This Month
              </CardTitle>
              <Package className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.totalOrders ?? 0}</div>
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Total orders (all time)
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Customers
              </CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.totalCustomers ?? 0}</div>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                Customers in your database
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Plants</CardTitle>
              <TrendingUp className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats?.totalPlants ?? 0}</div>
              <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                From live inventory
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Report Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                Sales Report
              </CardTitle>
              <CardDescription>
                Monthly sales performance and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                  <span className="font-semibold">₹{(stats?.totalRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Orders</span>
                  <span className="font-semibold">{stats?.totalOrders ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</span>
                  <span className="font-semibold">{stats?.pendingOrders ?? 0}</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/reports/sales">View Detailed Report</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5 text-blue-600" />
                Inventory Report
              </CardTitle>
              <CardDescription>
                Stock levels and inventory insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Plants</span>
                  <span className="font-semibold">{stats?.totalPlants ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Low Stock (&lt;10)</span>
                  <span className="text-red-600 font-semibold">{stats?.lowStockPlants ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Upcoming Care (7d)</span>
                  <span className="text-emerald-600 font-semibold">{stats?.upcomingCareTasks ?? 0}</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/reports/inventory">View Inventory Report</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-purple-600" />
                Customer Report
              </CardTitle>
              <CardDescription>
                Customer acquisition and retention metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Customers</span>
                  <span className="font-semibold">{stats?.totalCustomers ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Completed Care (30d)</span>
                  <span className="font-semibold">{stats?.completedCareTasks ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Pending Orders</span>
                  <span className="text-green-600 font-semibold">{stats?.pendingOrders ?? 0}</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/reports/customers">View Customer Report</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Growth Report
              </CardTitle>
              <CardDescription>
                Business growth and expansion metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Total Revenue</span>
                  <span className="text-green-600 font-semibold">₹{(stats?.totalRevenue || 0).toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Orders</span>
                  <span className="text-green-600 font-semibold">{stats?.totalOrders ?? 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Customers</span>
                  <span className="text-green-600 font-semibold">{stats?.totalCustomers ?? 0}</span>
                </div>
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/reports/growth">View Growth Report</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
