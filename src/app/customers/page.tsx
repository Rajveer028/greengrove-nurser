import { getCurrentUser } from "@/lib/auth";
import CustomerTable from "@/components/CustomerTable";
import { headers } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

export default async function CustomersPage() {
  const user = await getCurrentUser();
  const customers = user ? await fetchCustomers() : [];

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please sign in to access the customer management system.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d] transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
                Customer Management
              </h1>
              <p className="text-green-600 dark:text-green-400">
                Manage your customer relationships and track their orders
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/customers/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Customer
            </Link>
          </Button>
        </div>

        <Card className="rounded-2xl bg-white/70 dark:bg-[#152a1e]/70 shadow-xl border border-green-200 dark:border-green-900 backdrop-blur-lg">
          <CardContent className="p-6">
            <CustomerTable customers={customers} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
