'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';
import { FileText, Send, Edit } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface Report {
  id: number;
  status: string;
  form: {
    title: string;
  };
  createdAt: string;
  submittedAt: string | null;
}

export default function InspectorReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(false);
  const [reportToSubmit, setReportToSubmit] = useState<number | null>(null);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
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
      toast.success('Report submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error submitting report');
    } finally {
      setLoading(false);
      setShowConfirmSubmit(false);
      setReportToSubmit(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return <Badge className="bg-gray-500">Draft</Badge>;
      case 'SUBMITTED':
        return <Badge className="bg-orange-500">Under Review</Badge>;
      case 'APPROVED':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const draftReports = reports.filter((r) => r.status === 'DRAFT');
  const submittedReports = reports.filter((r) => r.status !== 'DRAFT');

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-purple-600" />
            My Reports
          </h2>
          <p className="text-gray-600 mt-2">View and manage your inspection reports</p>
        </div>

        {/* Draft Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Draft Reports ({draftReports.length})</CardTitle>
            <CardDescription>Reports not yet submitted - click Edit to fill in details</CardDescription>
          </CardHeader>
          <CardContent>
            {draftReports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No draft reports</p>
            ) : (
              <div className="space-y-4">
                {draftReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{report.form.title}</h4>
                          {getStatusBadge(report.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Created: {new Date(report.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(report.id)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          onClick={() => initiateSubmit(report.id)}
                          disabled={loading}
                        >
                          <Send className="h-4 w-4 mr-1" />
                          Submit
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Submitted Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Submitted Reports ({submittedReports.length})</CardTitle>
            <CardDescription>Reports under review or completed</CardDescription>
          </CardHeader>
          <CardContent>
            {submittedReports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No submitted reports</p>
            ) : (
              <div className="space-y-4">
                {submittedReports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{report.form.title}</h4>
                          {getStatusBadge(report.status)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Created: {new Date(report.createdAt).toLocaleDateString()}</p>
                          {report.submittedAt && (
                            <p>Submitted: {new Date(report.submittedAt).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
    </DashboardLayout>
  );
}

