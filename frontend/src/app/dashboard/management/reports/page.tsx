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
import { CheckSquare, Eye, FileText } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import DashboardHeader from "@/components/ui/DashboardHeader";
import ReportDetailsPanel from "@/components/ReportDetailsPanel";

interface Report {
  id: number;
  status: string;
  data: string;
  remarks: string | null;
  form: {
    title: string;
    questions: string;
  };
  inspector: {
    name: string;
  };
  reviewedBy?: {
    name: string;
  };
  createdAt: string;
  submittedAt: string | null;
  reviewedAt: string | null;
}

export default function ManagementReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get("/reports");
      setReports(response.data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <DashboardHeader
          title="Approved Reports"
          description="View approved inspection reports"
        />

        <Card>
          <CardHeader>
            <CardTitle>Latest Approved Reports</CardTitle>
            <CardDescription>
              Quality assurance inspection reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No approved reports available
              </p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-50">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <FileText className="h-5 w-5 text-gray-400 shrink-0" />
                          <h4 className="font-semibold text-lg">
                            {report.form.title}
                          </h4>
                          <Badge className="bg-green-500 rounded-md">
                            Approved
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Inspector: {report.inspector.name}</p>
                          <p>
                            Submitted:{" "}
                            {report.submittedAt
                              ? new Date(
                                  report.submittedAt
                                ).toLocaleDateString()
                              : "N/A"}
                          </p>
                          {report.reviewedBy && (
                            <p>Reviewed by: {report.reviewedBy.name}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors shrink-0"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline">View Details</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ReportDetailsPanel
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </DashboardLayout>
  );
}
