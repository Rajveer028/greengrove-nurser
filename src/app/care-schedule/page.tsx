import { getCurrentUser } from "@/lib/auth";
import CareScheduleTable from "@/components/CareScheduleTable";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Mock data for care schedules - in a real app, this would come from your database
const mockCareSchedules = [
  {
    id: "1",
    plant: {
      name: "Monstera Deliciosa",
      imageUrl: "/616pW-u9fxL._AC_UF1000,1000_QL80_.jpg"
    },
    taskType: "watering",
    frequency: "Weekly",
    lastPerformed: new Date("2024-02-15"),
    nextDue: new Date("2024-02-22"),
    isCompleted: false,
    notes: "Water thoroughly, allow soil to dry between waterings"
  },
  {
    id: "2",
    plant: {
      name: "Fiddle Leaf Fig",
      imageUrl: "/616pW-u9fxL._AC_UF1000,1000_QL80_.jpg"
    },
    taskType: "fertilizing",
    frequency: "Monthly",
    lastPerformed: new Date("2024-01-20"),
    nextDue: new Date("2024-02-20"),
    isCompleted: false,
    notes: "Use balanced liquid fertilizer"
  },
  {
    id: "3",
    plant: {
      name: "Snake Plant",
      imageUrl: "/616pW-u9fxL._AC_UF1000,1000_QL80_.jpg"
    },
    taskType: "watering",
    frequency: "Bi-weekly",
    lastPerformed: new Date("2024-02-10"),
    nextDue: new Date("2024-02-24"),
    isCompleted: false,
    notes: "Minimal watering required"
  },
  {
    id: "4",
    plant: {
      name: "Pothos Golden",
      imageUrl: "/616pW-u9fxL._AC_UF1000,1000_QL80_.jpg"
    },
    taskType: "pruning",
    frequency: "Monthly",
    lastPerformed: new Date("2024-01-15"),
    nextDue: new Date("2024-02-15"),
    isCompleted: true,
    notes: "Trim back leggy growth"
  }
];

export default async function CareSchedulePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              Please sign in to access the care schedule system.
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
            <Calendar className="h-8 w-8 text-green-600" />
            <div>
              <h1 className="text-3xl font-bold text-green-800 dark:text-green-300">
                Plant Care Schedule
              </h1>
              <p className="text-green-600 dark:text-green-400">
                Track and manage plant care tasks
              </p>
            </div>
          </div>
          <Button asChild>
            <Link href="/care-schedule/new">
              <Plus className="h-4 w-4 mr-2" />
              Add Care Task
            </Link>
          </Button>
        </div>

        <Card className="rounded-2xl bg-white/70 dark:bg-[#152a1e]/70 shadow-xl border border-green-200 dark:border-green-900 backdrop-blur-lg">
          <CardContent className="p-6">
            <CareScheduleTable careSchedules={mockCareSchedules} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
