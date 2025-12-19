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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { motion } from "framer-motion";
import api from "@/lib/api";
import DashboardHeader from "@/components/ui/DashboardHeader";

import ReportDetailsPanel from "@/components/ReportDetailsPanel";
import { SearchInput } from "@/components/ui/SearchInput";
import { Pagination } from "@/components/ui/Pagination";
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



// Report Card Skeleton Component
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
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-20" />
        </div>
      </div>
    </div>
  );
};

// Reports List Skeleton
const ReportsListSkeleton = ({ count = 3 }: { count?: number }) => {
  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <ReportCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default function ReportsApprovalPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  // Pagination & Search settings
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  // Approval states
  const [reportToApprove, setReportToApprove] = useState<number | null>(null);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);

  // Rejection states
  const [reportToReject, setReportToReject] = useState<number | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    fetchReports();
  }, [page, search]);

  const fetchReports = async () => {
    setIsLoadingReports(true);
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
      setIsLoadingReports(false);
    }
  };

  const initiateApprove = (reportId: number) => {
    setReportToApprove(reportId);
    setShowApproveConfirm(true);
  };

  const handleConfirmApprove = async () => {
    if (!reportToApprove) return;

    setLoading(true);
    try {
      await api.put(`/reports/${reportToApprove}/approve`, {
        remarks: "Approved",
      });
      fetchReports();
      toast.success("Report approved successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error approving report");
    } finally {
      setLoading(false);
      setShowApproveConfirm(false);
      setReportToApprove(null);
    }
  };

  const initiateReject = (reportId: number) => {
    setReportToReject(reportId);
    setRejectionReason("");
    setShowRejectDialog(true);
  };

  const handleConfirmReject = async () => {
    if (!reportToReject) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }

    setLoading(true);
    try {
      await api.put(`/reports/${reportToReject}/reject`, {
        remarks: rejectionReason,
      });
      fetchReports();
      toast.success("Report rejected successfully");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Error rejecting report");
    } finally {
      setLoading(false);
      setShowRejectDialog(false);
      setReportToReject(null);
      setRejectionReason("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return (
          <Badge className="bg-orange-500 rounded-md">Pending Review</Badge>
        );
      case "APPROVED":
        return <Badge className="bg-green-500 rounded-md">Approved</Badge>;
      case "REJECTED":
        return <Badge className="bg-red-500 rounded-md">Rejected</Badge>;
      case "DRAFT":
        return <Badge className="bg-gray-500 rounded-md">Draft</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const pendingReports = Array.isArray(reports)
    ? reports.filter((r) => r.status === "SUBMITTED")
    : [];
  const reviewedReports = Array.isArray(reports)
    ? reports.filter((r) => r.status !== "SUBMITTED" && r.status !== "DRAFT")
    : [];

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
          <DashboardHeader
            title="Report Approvals"
            description="Review and approve inspection reports - Click on a report to view details"
          />
          <SearchInput
            value={search}
            onChange={(val) => {
              setSearch(val);
              setPage(1);
            }}
          />
        </div>

        {/* Pending Reports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              Pending Approval {!isLoadingReports && `(${pendingReports.length})`}
            </CardTitle>
            <CardDescription>Reports awaiting your review</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <ReportsListSkeleton count={3} />
            ) : pendingReports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No pending reports
              </p>
            ) : (
              <div className="space-y-4">
                {pendingReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start flex-col lg:flex-row gap-3 lg:justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">
                            {report.form.title}
                          </h4>
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Inspector: {report.inspector.name}</p>
                          <p>
                            Submitted:{" "}
                            {report.submittedAt
                              ? new Date(report.submittedAt).toLocaleString()
                              : "N/A"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2 lg:ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedReport(report);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View
                        </Button>
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.stopPropagation();
                            initiateApprove(report.id);
                          }}
                          disabled={loading}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:bg-red-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            initiateReject(report.id);
                          }}
                          disabled={loading}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reviewed Reports */}
        <Card>
          <CardHeader>
            <CardTitle>
              Reviewed Reports {!isLoadingReports && `(${reviewedReports.length})`}
            </CardTitle>
            <CardDescription>Previously reviewed reports</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <ReportsListSkeleton count={3} />
            ) : reviewedReports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">
                No reviewed reports
              </p>
            ) : (
              <div className="space-y-4">
                {reviewedReports.map((report) => (
                  <div
                    key={report.id}
                    className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedReport(report)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{report.form.title}</h4>
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>Inspector: {report.inspector.name}</p>
                          <p>
                            Date:{" "}
                            {new Date(report.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedReport(report);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" /> View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Global Pagination for the list */}
            {!isLoadingReports && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>

        {/* Approval Confirmation */}
        <ConfirmDialog
          open={showApproveConfirm}
          onOpenChange={setShowApproveConfirm}
          title="Approve Report"
          description="Are you sure you want to approve this report?"
          onConfirm={handleConfirmApprove}
          confirmText="Approve"
          variant="default"
        />

        {/* Rejection Dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Report</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this report.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="rejection-reason" className="mb-2 block">
                Reason for Rejection
              </Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Enter details about why this report is being rejected..."
                rows={4}
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleConfirmReject}
                disabled={loading || !rejectionReason.trim()}
              >
                Reject Report
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>

      <ReportDetailsPanel
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </DashboardLayout>
  );
}