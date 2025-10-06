import { getCurrentUser } from "@/lib/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  // Mock inventory data
  const inventoryStats = {
    totalPlants: 156,
    lowStock: 12,
    outOfStock: 3,
    totalValue: 1234567, // ₹12,34,567
    categories: [
      { name: "Indoor Plants", count: 89, value: 678950 }, // ₹6,78,950
      { name: "Outdoor Plants", count: 45, value: 345617 }, // ₹3,45,617
      { name: "Succulents", count: 22, value: 210000 } // ₹2,10,000
    ]
  };

  const lowStockPlants = [
    { name: "Monstera Deliciosa", currentStock: 2, minStock: 5, category: "Indoor Plants" },
    { name: "Fiddle Leaf Fig", currentStock: 1, minStock: 3, category: "Indoor Plants" },
    { name: "Snake Plant", currentStock: 0, minStock: 4, category: "Indoor Plants" },
    { name: "Pothos Golden", currentStock: 3, minStock: 6, category: "Indoor Plants" }
  ];

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
                {inventoryStats.totalPlants}
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
                {inventoryStats.lowStock}
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
                {inventoryStats.outOfStock}
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
                ₹{inventoryStats.totalValue.toLocaleString()}
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
              <Button className="w-full mt-4" variant="outline">
                View All Low Stock Items
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
                {inventoryStats.categories.map((category, index) => (
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
              <Button className="w-full mt-4" variant="outline">
                View Category Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
