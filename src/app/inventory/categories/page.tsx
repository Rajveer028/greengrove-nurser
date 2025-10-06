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

export default async function CategoriesPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const plants = await fetchPlants();
  const categories: Record<string, { count: number; stock: number }> = {};
  for (const p of plants) {
    const key = p.category || 'Uncategorized';
    if (!categories[key]) categories[key] = { count: 0, stock: 0 };
    categories[key].count += 1;
    categories[key].stock += Number(p.stock) || 0;
  }
  const entries = Object.entries(categories);

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {entries.map(([name, info]) => (
                <div key={name} className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>{name}</span>
                  <span className="font-medium">{info.count} items • {info.stock} in stock</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


