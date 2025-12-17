'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';

interface Report {
  id: number;
  status: string;
  form: {
    title: string;
  };
  inspector: {
    name: string;
  };
  createdAt: string;
  submittedAt: string | null;
}

export default function KitchenReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await api.get('/reports');
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-600" />
            Inspection Reports
          </h2>
          <p className="text-gray-600 mt-2">View approved inspection reports</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Approved Reports</CardTitle>
            <CardDescription>Read-only access to approved inspection reports</CardDescription>
          </CardHeader>
          <CardContent>
            {reports.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No approved reports available</p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{report.form.title}</h4>
                          <Badge className="bg-green-500">Approved</Badge>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Inspector: {report.inspector.name}</p>
                          <p>Date: {new Date(report.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
