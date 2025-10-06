import { headers } from "next/headers";
import Link from "next/link";

async function fetchNurseries() {
  const hdrs = headers();
  const host = hdrs.get('host');
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/nurseries`, { cache: 'no-store' });
  if (!res.ok) return [] as any[];
  const data = await res.json();
  return data.owners || [];
}

export default async function NurseriesPage() {
  const owners = await fetchNurseries();
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-6">Nursery Listings</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {owners.map((o: any) => (
            <Link key={o.id} href={`/nurseries/${o.stackUserId}`} className="block p-6 rounded-xl bg-white/70 dark:bg-[#152a1e]/70 border border-green-200 dark:border-green-900 hover:shadow-lg">
              <div className="font-semibold text-lg text-green-800 dark:text-green-200">{o.displayName}</div>
              <div className="text-sm text-gray-600">{o.email}</div>
              <div className="mt-2 text-sm text-green-700">{o._count?.plants ?? 0} plants</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}


