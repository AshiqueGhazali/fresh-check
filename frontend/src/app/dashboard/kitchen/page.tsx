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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BookOpen, Search } from "lucide-react";
import api from "@/lib/api";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Skeleton from "@/components/ui/Skeleton";

interface Guideline {
  id: number;
  title: string;
  content: string;
  severity: string;
  updatedBy: {
    name: string;
  };
  createdAt: string;
}

const GuideCardSkeleton = () => {
  return (
    <div className={`p-4 border rounded-lg`}>
      <div className="flex items-start justify-between mb-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-6 w-8" />
      </div>
      <Skeleton className="h-6 w-full" />
      <div className="flex mt-2 items-center justify-between text-sm text-gray-500">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-6 w-40" />
      </div>
    </div>
  );
};

const GuideListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <GuideCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default function KitchenManagerDashboard() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      const response = await api.get("/guidelines");
      setGuidelines(response.data);
    } catch (error) {
      console.error("Error fetching guidelines:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuidelines = guidelines.filter(
    (guideline) =>
      guideline.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      guideline.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-500";
      case "MAJOR":
        return "bg-orange-500";
      case "MINOR":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getBorderColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "border-l-6 border-l-red-500";
      case "MAJOR":
        return "border-l-6 border-l-orange-500";
      case "MINOR":
        return "border-l-6 border-l-yellow-500";
      default:
        return "border-l-6 border-l-gray-500";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <DashboardHeader
          title="Kitchen Manager Dashboard"
          description="Review guidelines and inspection reports"
        />

        {/* Guidelines Section */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Food Quality Guidelines
                </CardTitle>
                <CardDescription>
                  Reference standards and best practices
                </CardDescription>
              </div>
            </div>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search guidelines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <GuideListSkeleton count={3} />
            ) : filteredGuidelines.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No guidelines found
              </p>
            ) : (
              <div className="space-y-4">
                {filteredGuidelines.map((guideline) => (
                  <div
                    key={guideline.id}
                    className={`p-4 border rounded-lg hover:bg-gray-50 transition-colors ${getBorderColor(
                      guideline.severity
                    )}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">
                        {guideline.title}
                      </h4>
                      <Badge
                        className={`${getSeverityColor(
                          guideline.severity
                        )} rounded-md`}
                      >
                        {guideline.severity}
                      </Badge>
                    </div>
                    <p className="text-gray-700 mb-3 whitespace-pre-wrap">
                      {guideline.content}
                    </p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Updated by: {guideline.updatedBy.name}</span>
                      <span>
                        {new Date(guideline.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
