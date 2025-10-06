"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<any[]>([]);
  const [plants, setPlants] = useState<any[]>([]);
  const [items, setItems] = useState<{ plantId: string; quantity: number; price: number }[]>([]);
  const [form, setForm] = useState({ customerId: "", status: "pending", notes: "", deliveryDate: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const [cRes, pRes] = await Promise.all([
        fetch("/api/customers"),
        fetch("/api/plants"),
      ]);
      const cData = await cRes.json().catch(() => ({}));
      const pData = await pRes.json().catch(() => ({}));
      setCustomers(cData.customers || []);
      setPlants(pData.plants || []);
      setItems(pData.plants ? pData.plants.slice(0, 1).map((p: any) => ({ plantId: p.id, quantity: 1, price: p.price })) : []);
    })();
  }, []);

  const addItem = () => setItems([...items, { plantId: plants[0]?.id || "", quantity: 1, price: plants[0]?.price || 0 }]);
  const updateItem = (idx: number, patch: Partial<{ plantId: string; quantity: number; price: number }>) => {
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };
  const removeItem = (idx: number) => setItems(items.filter((_, i) => i !== idx));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, orderItems: items })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create order");
      }
      router.push("/orders");
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>New Order</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4">
              <select className="border rounded px-3 py-2" value={form.customerId} onChange={(e) => setForm({ ...form, customerId: e.target.value })}>
                <option value="">Select customer</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>{c.firstName} {c.lastName}</option>
                ))}
              </select>
              <select className="border rounded px-3 py-2" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              <input className="border rounded px-3 py-2" type="date" placeholder="Delivery date" value={form.deliveryDate} onChange={(e) => setForm({ ...form, deliveryDate: e.target.value })} />
              <textarea className="border rounded px-3 py-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />

              <div className="space-y-3">
                {items.map((it, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-3 items-center">
                    <select className="border rounded px-3 py-2" value={it.plantId} onChange={(e) => updateItem(idx, { plantId: e.target.value, price: plants.find(p => p.id === e.target.value)?.price || 0 })}>
                      {plants.map((p) => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                    <input className="border rounded px-3 py-2" type="number" min={1} value={it.quantity} onChange={(e) => updateItem(idx, { quantity: Number(e.target.value) })} />
                    <input className="border rounded px-3 py-2" type="number" step="0.01" value={it.price} onChange={(e) => updateItem(idx, { price: Number(e.target.value) })} />
                    <Button type="button" variant="outline" onClick={() => removeItem(idx)}>Remove</Button>
                  </div>
                ))}
                <Button type="button" variant="secondary" onClick={addItem}>Add Item</Button>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Create"}</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}


