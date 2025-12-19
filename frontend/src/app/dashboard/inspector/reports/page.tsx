"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { toast } from "sonner";
import { FileText, Send, Edit, Eye } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";

import ReportDetailsPanel from "@/components/ReportDetailsPanel";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
import DashboardHeader from "@/components/ui/DashboardHeader";
import Skeleton from "@/components/ui/Skeleton";

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
  aiSummary?: string | null;
}

const ReportCardSkeleton = () => {
  return (
    <div className="p-4 border rounded-lg">
      <div className="flex items-start flex-col lg:flex-row gap-3 lg:justify-between">
        <div className="flex-1 w-full">
          <div className="flex items-center gap-2 mb-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-6 w-24 rounded-md" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>
        <div className="flex gap-2 lg:ml-4">
          <Skeleton className="h-7 w-20" />
        </div>
      </div>
    </div>
  );
};

const ReportsListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <ReportCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default function InspectorReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportToSubmit, setReportToSubmit] = useState<number | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [page, search]);

  const fetchReports = async () => {
    setLoadingReports(true);
    try {
      const response = await api.get("/reports", {
        params: { page, limit: 10, search },
      });
      setReports(response.data.data);
      setTotalPages(response.data.meta.totalPages);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoadingReports(false);
    }
  };

  const handleEdit = (reportId: number) => {
    router.push(`/dashboard/inspector/reports/${reportId}/fill`);
  };

  const initiateSubmit = (reportId: number) => {
    setReportToSubmit(reportId);
    setShowConfirmSubmit(true);
  };

  const handleConfirmSubmit = async () => {
    if (!reportToSubmit) return;

    setLoading(true);
    try {
      await api.put(`/reports/${reportToSubmit}/submit`);
      fetchReports();
      toast.success("Report submitted successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error submitting report");
    } finally {
      setLoading(false);
      setShowConfirmSubmit(false);
      setReportToSubmit(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "DRAFT":
        return <Badge className="bg-gray-500 rounded-md">Draft</Badge>;
      case "SUBMITTED":
        return <Badge className="bg-orange-500 rounded-md">Under Review</Badge>;
      case "APPROVED":
        return <Badge className="bg-green-500 rounded-md">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500 rounded-md">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <DashboardHeader
            title="My Reports"
            description="View and manage your inspection reports"
          />
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Reports</CardTitle>
            <CardDescription>
              Drafts, Submitted, and Reviewed Reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loadingReports? (
              <ReportsListSkeleton count={4} />
            ):reports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No reports found</p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between flex-wrap gap-4">
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h4 className="font-semibold text-lg">
                            {report.form.title}
                          </h4>
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>
                            Created:{" "}
                            {new Date(report.createdAt).toLocaleString()}
                          </p>
                          {report.submittedAt && (
                            <p>
                              Submitted:{" "}
                              {new Date(
                                report.submittedAt
                              ).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        {report.status === "DRAFT" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(report.id);
                              }}
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-[#047857] to-[#10b981] hover:from-[#10b981] hover:to-[#047857]"
                              onClick={(e) => {
                                e.stopPropagation();
                                initiateSubmit(report.id);
                              }}
                              disabled={loading}
                            >
                              <Send className="h-4 w-4 mr-1" />
                              Submit
                            </Button>
                          </>
                        )}
                        {/* Only show View button if NOT draft, or maybe always? 
                            Drafts are editable, others are viewable details panel.
                            Actually, DetailsPanel works for drafts too (shows current state).
                        */}
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> Details
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={showConfirmSubmit}
          onOpenChange={setShowConfirmSubmit}
          title="Submit Report"
          description="Are you sure you want to submit this report for review?"
          onConfirm={handleConfirmSubmit}
          confirmText="Yes, Submit"
        />
      </motion.div>

      <ReportDetailsPanel
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </DashboardLayout>
  );
}
