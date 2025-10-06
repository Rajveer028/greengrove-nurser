import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function fetchStats() {
  const hdrs = headers();
  const host = hdrs.get('host');
  const cookie = hdrs.get('cookie') || '';
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/orders`, { cache: 'no-store', headers: { cookie } });
  if (!res.ok) return [] as any[];
  const data = await res.json();
  return data.orders || [];
}

export default async function SalesReportPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const orders = await fetchStats();
  const totalRevenue = orders.reduce((s: number, o: any) => s + (Number(o.totalAmount) || 0), 0);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Sales Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-semibold">{orders.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-2xl font-semibold">₹{totalRevenue.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Delivered Orders</p>
                <p className="text-2xl font-semibold">{orders.filter((o: any) => o.status?.toLowerCase() === 'delivered').length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


