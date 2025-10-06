import { getCurrentUser } from "@/lib/auth";
import CustomerTable from "@/components/CustomerTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for customers - in a real app, this would come from your database
const mockCustomers = [
  {
    id: "1",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@email.com",
    phone: "+1 (555) 123-4567",
    city: "Portland",
    state: "OR",
    createdAt: new Date("2024-01-15"),
    orders: [
      { id: "1", totalAmount: 8999, status: "delivered" }, // ₹8,999
      { id: "2", totalAmount: 4550, status: "processing" } // ₹4,550
    ]
  },
  {
    id: "2",
    firstName: "Michael",
    lastName: "Chen",
    email: "michael.chen@email.com",
    phone: "+1 (555) 987-6543",
    city: "Seattle",
    state: "WA",
    createdAt: new Date("2024-02-03"),
    orders: [
      { id: "3", totalAmount: 15675, status: "delivered" } // ₹15,675
    ]
  },
  {
    id: "3",
    firstName: "Emily",
    lastName: "Rodriguez",
    email: "emily.rodriguez@email.com",
    phone: "+1 (555) 456-7890",
    city: "San Francisco",
    state: "CA",
    createdAt: new Date("2024-02-20"),
    orders: []
  }
];

export default async function CustomersPage() {
  const user = await getCurrentUser();

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
            <CustomerTable customers={mockCustomers} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
