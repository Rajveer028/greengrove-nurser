import { getCurrentUser } from "@/lib/auth";
import OrderTable from "@/components/OrderTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for orders - in a real app, this would come from your database
const mockOrders = [
  {
    id: "1",
    orderNumber: "ORD-001",
    customer: {
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@email.com"
    },
    status: "delivered",
    totalAmount: 8999, // ₹8,999
    orderDate: new Date("2024-01-15"),
    deliveryDate: new Date("2024-01-18"),
    orderItems: [
      {
        plant: { name: "Monstera Deliciosa" },
        quantity: 1,
        price: 4599 // ₹4,599
      },
      {
        plant: { name: "Fiddle Leaf Fig" },
        quantity: 1,
        price: 4400 // ₹4,400
      }
    ]
  },
  {
    id: "2",
    orderNumber: "ORD-002",
    customer: {
      firstName: "Michael",
      lastName: "Chen",
      email: "michael.chen@email.com"
    },
    status: "processing",
    totalAmount: 15675, // ₹15,675
    orderDate: new Date("2024-02-03"),
    orderItems: [
      {
        plant: { name: "Snake Plant" },
        quantity: 2,
        price: 2550 // ₹2,550
      },
      {
        plant: { name: "Pothos Golden" },
        quantity: 3,
        price: 3525 // ₹3,525
      }
    ]
  },
  {
    id: "3",
    orderNumber: "ORD-003",
    customer: {
      firstName: "Emily",
      lastName: "Rodriguez",
      email: "emily.rodriguez@email.com"
    },
    status: "pending",
    totalAmount: 6750, // ₹6,750
    orderDate: new Date("2024-02-20"),
    orderItems: [
      {
        plant: { name: "Peace Lily" },
        quantity: 1,
        price: 3250 // ₹3,250
      },
      {
        plant: { name: "Spider Plant" },
        quantity: 1,
        price: 3500 // ₹3,500
      }
    ]
  }
];

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please sign in to access the order management system.
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
            <ShoppingCart className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
                Order Management
              </h1>
              <p className="text-green-600 dark:text-green-400">
                Track and manage customer orders
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/orders/new">
              <Plus className="h-4 w-4 mr-2" />
              New Order
            </Link>
          </Button>
        </div>

        <Card className="rounded-2xl bg-white/70 dark:bg-[#152a1e]/70 shadow-xl border border-green-200 dark:border-green-900 backdrop-blur-lg">
          <CardContent className="p-6">
            <OrderTable orders={mockOrders} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
