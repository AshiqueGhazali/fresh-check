"use client";

import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, FileText, BookOpen, CheckSquare } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";
import DashboardHeader from "@/components/ui/DashboardHeader";

interface Stats {
  totalUsers: number;
  totalForms: number;
  totalGuidelines: number;
  pendingApprovals: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/stats/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const cards = [
    {
      title: "User Management",
      description: "Create and manage system users",
      icon: Users,
      value: stats?.totalUsers || 0,
      href: "/dashboard/admin/users",
      color: "from-blue-600 to-cyan-600",
    },
    {
      title: "Inspection Forms",
      description: "Create and manage inspection forms",
      icon: FileText,
      value: stats?.totalForms || 0,
      href: "/dashboard/admin/forms",
      color: "from-purple-600 to-pink-600",
    },
    {
      title: "Guidelines",
      description: "Manage food quality guidelines",
      icon: BookOpen,
      value: stats?.totalGuidelines || 0,
      href: "/dashboard/admin/guidelines",
      color: "from-green-600 to-teal-600",
    },
    {
      title: "Pending Approvals",
      description: "Review and approve reports",
      icon: CheckSquare,
      value: stats?.pendingApprovals || 0,
      href: "/dashboard/admin/reports",
      color: "from-orange-600 to-red-600",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Admin Dashboard"
          description="Manage users, forms, guidelines, and approvals"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={card.href}>
                <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-2 hover:border-gray-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl">{card.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {card.description}
                        </CardDescription>
                      </div>
                      <div
                        className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-lg flex items-center justify-center`}
                      >
                        <card.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gray-900">
                      {card.value}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
