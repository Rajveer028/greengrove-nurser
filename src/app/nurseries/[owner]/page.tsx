import { headers } from "next/headers";

async function fetchOwner(ownerStackId: string) {
  const hdrs = headers();
  const host = hdrs.get('host');
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/nurseries`, { cache: 'no-store' });
  if (!res.ok) return null;
  const data = await res.json();
  return (data.owners || []).find((o: any) => o.stackUserId === ownerStackId) || null;
}

async function fetchPlants(ownerStackId: string) {
  const hdrs = headers();
  const host = hdrs.get('host');
  const protocol = process.env.VERCEL ? 'https' : 'http';
  const base = host ? `${protocol}://${host}` : '';
  const res = await fetch(`${base}/api/plants`, { cache: 'no-store' });
  if (!res.ok) return [] as any[];
  const data = await res.json();
  // Filter client-side by owner stackUserId via nested user
  return data.plants?.filter((p: any) => p.user?.stackUserId === ownerStackId) || [];
}

export default async function OwnerNurseryPage({ params }: { params: { owner: string } }) {
  const owner = await fetchOwner(params.owner);
  const plants = await fetchPlants(params.owner);
  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {owner ? (
          <>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300 mb-2">{owner.displayName}</h1>
            <p className="text-sm text-gray-600 mb-6">{owner.email}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.map((p: any) => (
                <div key={p.id} className="p-4 rounded-xl bg-white/70 dark:bg-[#152a1e]/70 border border-green-200 dark:border-green-900">
                  <div className="font-semibold text-green-800 dark:text-green-200">{p.name}</div>
                  <div className="text-sm text-gray-600">Category: {p.category}</div>
                  <div className="text-sm text-gray-600">Price: ₹{Number(p.price).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Stock: {p.stock}</div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-center text-gray-600">Nursery not found.</p>
        )}
      </div>
    </main>
  );
}


