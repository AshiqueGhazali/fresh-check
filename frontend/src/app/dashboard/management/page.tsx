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
import {
  BarChart3,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import api from "@/lib/api";
import DashboardHeader from "@/components/ui/DashboardHeader";

interface Stats {
  totalReports: number;
  submittedReports: number;
  approvedReports: number;
  rejectedReports: number;
  complianceScore: number;
}

export default function ManagementDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get("/stats/dashboard");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-100">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </DashboardLayout>
    );
  }

  const approvalRate = stats?.totalReports
    ? Math.round((stats.approvedReports / stats.totalReports) * 100)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Management Dashboard"
          description="Monitor food quality performance and compliance"
        />

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-b-6 border-b-[#064e3b] hover:border-b-[#eab308] transition-all duration-400 py-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Inspections
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.totalReports || 0}
              </div>
              <p className="text-xs text-muted-foreground">All time</p>
            </CardContent>
          </div>

          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-b-6 border-b-green-600 hover:border-b-[#eab308] transition-all duration-400 py-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Approved</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.approvedReports || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {approvalRate}% approval rate
              </p>
            </CardContent>
          </div>

          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-b-6 border-b-red-600 hover:border-b-[#eab308] transition-all duration-400 py-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rejected</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.rejectedReports || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {stats?.totalReports
                  ? Math.round(
                      (stats.rejectedReports / stats.totalReports) * 100
                    )
                  : 0}
                % rejection rate
              </p>
            </CardContent>
          </div>

          <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-b-6 border-b-blue-600 hover:border-b-[#eab308] transition-all duration-400 py-6 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Compliance Score
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats?.complianceScore || 0}%
              </div>
              <p className="text-xs text-green-600">
                {stats?.complianceScore && stats.complianceScore >= 80
                  ? "Excellent"
                  : "Needs improvement"}
              </p>
            </CardContent>
          </div>
        </div>

        <div className="text-card-foreground flex flex-col gap-6 mt-6 lg:mt-10 rounded-xl">
          <div data-slot="card-header">
            <CardTitle>Performance Overview</CardTitle>
            <CardDescription>
              Food quality monitoring statistics
            </CardDescription>
          </div>
          <div data-slot="card-content">
            <div className="space-y-4">
              <div className="flex relative group bg-card items-center overflow-hidden border-x-6 border-x-orange-600 justify-between p-4 border rounded-lg">
                <span className="absolute inset-0 bg-orange-600 -translate-x-full  group-hover:translate-x-0 transition-transform duration-500 ease-out" />

                <div className="z-10">
                  <h4 className="font-semibold group-hover:text-white">
                    Pending Review
                  </h4>
                  <p className="text-sm text-gray-600 group-hover:text-white">
                    Reports awaiting approval
                  </p>
                </div>
                <span className="text-2xl font-bold text-orange-600 group-hover:text-white z-10">
                  {stats?.submittedReports || 0}
                </span>
              </div>
              <div className="flex relative group  overflow-hidden bg-card items-center border-x-6 border-x-green-600 justify-between p-4 border rounded-lg">
                <span className="absolute inset-0 bg-green-600 -translate-x-full  group-hover:translate-x-0 transition-transform duration-500 ease-out" />

                <div className="z-10">
                  <h4 className="font-semibold group-hover:text-white">Quality Compliance</h4>
                  <p className="text-sm text-gray-600 group-hover:text-white">
                    Overall compliance rate
                  </p>
                </div>
                <span className="text-2xl font-bold text-green-600 group-hover:text-white z-10">
                  {stats?.complianceScore || 0}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
