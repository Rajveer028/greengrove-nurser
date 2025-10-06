"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Plus, CheckCircle, Clock, AlertCircle, Edit } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { useState } from "react";
import { Skeleton } from "./ui/skeleton";
import Link from "next/link";

interface CareSchedule {
  id: string;
  plant: {
    name: string;
    imageUrl?: string;
  };
  taskType: string;
  frequency: string;
  lastPerformed?: Date;
  nextDue: Date;
  isCompleted: boolean;
  notes?: string;
}

interface CareScheduleTableProps {
  careSchedules: CareSchedule[];
}

export default function CareScheduleTable({ careSchedules }: CareScheduleTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTaskType, setSelectedTaskType] = useState("");

  // Filter care schedules by plant name or task type
  const filteredSchedules = careSchedules?.filter(
    (schedule) =>
      schedule.plant.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedTaskType === "" || schedule.taskType === selectedTaskType)
  );

  if (!careSchedules) {
    return (
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 py-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead><Skeleton className="w-full h-4" /></TableHead>
              <TableHead><Skeleton className="w-full h-4" /></TableHead>
              <TableHead><Skeleton className="w-full h-4" /></TableHead>
              <TableHead><Skeleton className="w-full h-4" /></TableHead>
              <TableHead><Skeleton className="w-full h-4" /></TableHead>
              <TableHead><Skeleton className="w-full h-4" /></TableHead>
              <TableHead className="text-right"><Skeleton className="w-full h-4" /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell><Skeleton className="w-full h-4" /></TableCell>
                <TableCell><Skeleton className="w-full h-4" /></TableCell>
                <TableCell><Skeleton className="w-full h-4" /></TableCell>
                <TableCell><Skeleton className="w-full h-4" /></TableCell>
                <TableCell><Skeleton className="w-full h-4" /></TableCell>
                <TableCell><Skeleton className="w-full h-4" /></TableCell>
                <TableCell className="text-right"><Skeleton className="w-full h-4" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  const getTaskTypeBadge = (taskType: string) => {
    const taskConfig = {
      watering: { color: "bg-blue-100 text-blue-800", text: "Watering" },
      fertilizing: { color: "bg-green-100 text-green-800", text: "Fertilizing" },
      pruning: { color: "bg-orange-100 text-orange-800", text: "Pruning" },
      repotting: { color: "bg-purple-100 text-purple-800", text: "Repotting" },
      inspection: { color: "bg-gray-100 text-gray-800", text: "Inspection" },
    };
    
    const config = taskConfig[taskType as keyof typeof taskConfig] || taskConfig.inspection;
    return <Badge className={config.color}>{config.text}</Badge>;
  };

  const getStatusBadge = (isCompleted: boolean, nextDue: Date) => {
    const now = new Date();
    const isOverdue = new Date(nextDue) < now;
    
    if (isCompleted) {
      return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
    } else if (isOverdue) {
      return <Badge className="bg-red-100 text-red-800">Overdue</Badge>;
    } else {
      return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
    }
  };

  const getStatusIcon = (isCompleted: boolean, nextDue: Date) => {
    const now = new Date();
    const isOverdue = new Date(nextDue) < now;
    
    if (isCompleted) {
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    } else if (isOverdue) {
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    } else {
      return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilDue = (nextDue: Date) => {
    const now = new Date();
    const diffTime = new Date(nextDue).getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 py-4">
        <div className="relative max-w-sm w-full">
          <Input
            placeholder="Search care tasks..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute h-4 w-4 left-3 top-1/2 transform -translate-y-1/2" />
        </div>
        
        <Button asChild>
          <Link href="/care-schedule/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Care Task
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Plant</TableHead>
            <TableHead>Task Type</TableHead>
            <TableHead>Frequency</TableHead>
            <TableHead>Next Due</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Performed</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSchedules?.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  {schedule.plant.imageUrl && (
                    <img 
                      src={schedule.plant.imageUrl} 
                      alt={schedule.plant.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  )}
                  {schedule.plant.name}
                </div>
              </TableCell>
              <TableCell>
                {getTaskTypeBadge(schedule.taskType)}
              </TableCell>
              <TableCell>
                {schedule.frequency}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(schedule.isCompleted, schedule.nextDue)}
                  <div>
                    <div className="font-medium">
                      {formatDate(schedule.nextDue)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {getDaysUntilDue(schedule.nextDue)} days
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {getStatusBadge(schedule.isCompleted, schedule.nextDue)}
              </TableCell>
              <TableCell>
                {schedule.lastPerformed 
                  ? formatDate(schedule.lastPerformed)
                  : "Never"
                }
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
