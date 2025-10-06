import { getCurrentUser } from "@/lib/auth";
import { headers } from "next/headers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type LowStockPlant = {
  name: string;
  currentStock: number;
  minStock: number;
  category: string;
};

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

export default async function InventoryPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please sign in to access the inventory management system.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const plants = await fetchPlants();
  const totalPlants = plants.length;
  const lowStock = plants.filter((p: any) => (p.stock ?? 0) < 10).length;
  const outOfStock = plants.filter((p: any) => (p.stock ?? 0) === 0).length;
  const totalValue = plants.reduce((sum: number, p: any) => sum + (Number(p.price) || 0) * (Number(p.stock) || 0), 0);
  const categoriesMap: Record<string, { count: number; value: number }> = {};
  for (const p of plants) {
    const key = p.category || 'Uncategorized';
    const price = Number(p.price) || 0;
    const stock = Number(p.stock) || 0;
    if (!categoriesMap[key]) categoriesMap[key] = { count: 0, value: 0 };
    categoriesMap[key].count += 1;
    categoriesMap[key].value += price * stock;
  }
  const categories = Object.entries(categoriesMap).map(([name, info]) => ({ name, count: info.count, value: info.value }));
  const lowStockPlants: LowStockPlant[] = plants
    .filter((p: any) => (p.stock ?? 0) < 10)
    .map((p: any): LowStockPlant => ({
      name: p.name,
      currentStock: Number(p.stock) || 0,
      minStock: 10,
      category: p.category || 'Uncategorized',
    }));

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 via-white to-green-100 dark:from-[#0e281a] dark:via-[#000000] dark:to-[#112d1d] transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-8">
          <Package className="h-8 w-8 text-green-600" />
          <div>
            <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
              Inventory Management
            </h1>
            <p className="text-green-600 dark:text-green-400">
              Track stock levels and manage inventory
            </p>
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Plants
              </CardTitle>
              <Package className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {totalPlants}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Plants in inventory
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Low Stock Alert
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {lowStock}
              </div>
              <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                Need restocking
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Out of Stock
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {outOfStock}
              </div>
              <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                Urgent restock needed
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Value
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                ₹{totalValue.toLocaleString()}
              </div>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                Inventory value
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Low Stock Alert
              </CardTitle>
              <CardDescription>
                Plants that need immediate restocking
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockPlants.map((plant, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {plant.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {plant.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-red-600">
                        {plant.currentStock} / {plant.minStock}
                      </p>
                      <Badge className="bg-red-100 text-red-800">
                        {plant.currentStock === 0 ? "Out of Stock" : "Low Stock"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/inventory/low-stock">View All Low Stock Items</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Category Breakdown
              </CardTitle>
              <CardDescription>
                Inventory distribution by category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categories.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {category.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {category.count} plants
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">
                        ₹{category.value.toLocaleString()}
                      </p>
                      <Badge className="bg-green-100 text-green-800">
                        In Stock
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="w-full mt-4" variant="outline" asChild>
                <Link href="/inventory/categories">View Category Details</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
