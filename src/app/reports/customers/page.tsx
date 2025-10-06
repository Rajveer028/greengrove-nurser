import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

async function fetchCustomers() {
  const hdrs = headers();
  const host = hdrs.get('host');
  const cookie = hdrs.get('cookie') || '';
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/customers`, { cache: 'no-store', headers: { cookie } });
  if (!res.ok) return [] as any[];
  const data = await res.json();
  return data.customers || [];
}

export default async function CustomersReportPage() {
  const user = await getCurrentUser();
  if (!user) return null;
  const customers = await fetchCustomers();

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Customer Report</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-sm text-gray-600">Total customers: {customers.length}</p>
            <div className="space-y-3">
              {customers.map((c: any) => (
                <div key={c.id} className="flex justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded">
                  <span>{c.firstName} {c.lastName}</span>
                  <span className="text-gray-600 text-sm">{c.email}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


