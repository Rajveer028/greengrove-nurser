import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function fetchStats() {
  const hdrs = headers();
  const host = hdrs.get('host');
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/dashboard`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return data.stats;
}

export default async function GrowthReportPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const stats = await fetchStats();

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Growth Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Pending Orders</p>
                <p className="text-2xl font-semibold">{stats?.pendingOrders ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Upcoming Care (7d)</p>
                <p className="text-2xl font-semibold">{stats?.upcomingCareTasks ?? 0}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Completed Care (30d)</p>
                <p className="text-2xl font-semibold">{stats?.completedCareTasks ?? 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


