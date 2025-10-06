import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function fetchPlants() {
  const hdrs = headers();
  const host = hdrs.get('host');
  const cookie = hdrs.get('cookie') || '';
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/plants`, { cache: 'no-store', headers: { cookie } });
  if (!res.ok) return [] as any[];
  const data = await res.json();
  return data.plants || [];
}

export default async function InventoryReportPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const plants = await fetchPlants();
  const lowStock = plants.filter((p: any) => (p.stock ?? 0) < 10);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">Low stock plants (&lt;10): {lowStock.length}</p>
            <div className="space-y-3">
              {lowStock.map((p: any) => (
                <div key={p.id} className="flex justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded">
                  <span>{p.name}</span>
                  <span className="font-medium">{p.stock}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


