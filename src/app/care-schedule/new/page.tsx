"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function NewCareTaskPage() {
  const router = useRouter();
  const [plants, setPlants] = useState<any[]>([]);
  const [form, setForm] = useState({ plantId: "", taskType: "watering", frequency: "Weekly", lastPerformed: "", nextDue: "", notes: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/plants");
      const data = await res.json().catch(() => ({}));
      setPlants(data.plants || []);
    })();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/care-schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to create task");
      }
      router.push("/care-schedule");
      router.refresh();
    } catch (e: any) {
      setError(e.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d]">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Card>
          <CardHeader>
            <CardTitle>New Care Task</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={submit} className="grid gap-4">
              <select className="border rounded px-3 py-2" value={form.plantId} onChange={(e) => setForm({ ...form, plantId: e.target.value })}>
                <option value="">Select plant</option>
                {plants.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <select className="border rounded px-3 py-2" value={form.taskType} onChange={(e) => setForm({ ...form, taskType: e.target.value })}>
                  <option value="watering">Watering</option>
                  <option value="fertilizing">Fertilizing</option>
                  <option value="pruning">Pruning</option>
                  <option value="repotting">Repotting</option>
                </select>
                <select className="border rounded px-3 py-2" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
                  <option>Daily</option>
                  <option>Weekly</option>
                  <option>Bi-weekly</option>
                  <option>Monthly</option>
                </select>
              </div>
              <input className="border rounded px-3 py-2" type="date" placeholder="Last performed" value={form.lastPerformed} onChange={(e) => setForm({ ...form, lastPerformed: e.target.value })} />
              <input className="border rounded px-3 py-2" type="date" placeholder="Next due" value={form.nextDue} onChange={(e) => setForm({ ...form, nextDue: e.target.value })} />
              <textarea className="border rounded px-3 py-2" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
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


