"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  AlertTriangle, 
  Calendar,
  ShoppingCart,
  Leaf,
  Clock,
  CheckCircle
} from "lucide-react";
import Link from "next/link";

interface DashboardStats {
  totalPlants: number;
  totalCustomers: number;
  totalOrders: number;
  totalRevenue: number;
  lowStockPlants: number;
  pendingOrders: number;
  upcomingCareTasks: number;
  completedCareTasks: number;
}

interface DashboardProps {
  stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
  const statCards = [
    {
      title: "Total Plants",
      value: stats.totalPlants,
      icon: Leaf,
      description: "Plants in inventory",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Customers",
      value: stats.totalCustomers,
      icon: Users,
      description: "Registered customers",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
      description: "Orders placed",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Total Revenue",
      value: `₹${stats.totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "Total sales revenue",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
  ];

  const alertCards = [
    {
      title: "Low Stock Alert",
      value: stats.lowStockPlants,
      icon: AlertTriangle,
      description: "Plants need restocking",
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/plants?filter=low-stock",
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
      description: "Orders awaiting processing",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      href: "/orders?status=pending",
    },
    {
      title: "Care Tasks Due",
      value: stats.upcomingCareTasks,
      icon: Calendar,
      description: "Plants need attention",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      href: "/care-schedule",
    },
    {
      title: "Completed Tasks",
      value: stats.completedCareTasks,
      icon: CheckCircle,
      description: "Care tasks completed",
      color: "text-green-600",
      bgColor: "bg-green-50",
      href: "/care-schedule?status=completed",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
            🌿 Dashboard Overview
          </h1>
          <p className="text-green-600 dark:text-green-400 mt-2">
            Welcome back! Here's what's happening in your nursery.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href="/plants">Manage Plants</Link>
          </Button>
          <Button asChild>
            <Link href="/orders">View Orders</Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {stat.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Alerts and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {alertCards.map((alert, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {alert.title}
              </CardTitle>
              <alert.icon className={`h-4 w-4 ${alert.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {alert.value}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {alert.description}
              </p>
              {alert.href && (
                <Button asChild variant="link" className="p-0 h-auto mt-2">
                  <Link href={alert.href} className="text-xs">
                    View Details →
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-green-600" />
              Inventory Management
            </CardTitle>
            <CardDescription>
              Manage your plant inventory and stock levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/plants">View All Plants</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/plants/new">Add New Plant</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              Customer Management
            </CardTitle>
            <CardDescription>
              Manage customer information and relationships
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/customers">View Customers</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/customers/new">Add New Customer</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              Care Schedule
            </CardTitle>
            <CardDescription>
              Track plant care tasks and schedules
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/care-schedule">View Schedule</Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link href="/care-schedule/new">Add Care Task</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Recent Activity
          </CardTitle>
          <CardDescription>
            Latest updates from your nursery management system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New plant added to inventory</p>
                <p className="text-xs text-gray-500">Monstera Deliciosa - 2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New order received</p>
                <p className="text-xs text-gray-500">Order #1234 - 4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Care reminder due</p>
                <p className="text-xs text-gray-500">Water Fiddle Leaf Fig - 6 hours ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
