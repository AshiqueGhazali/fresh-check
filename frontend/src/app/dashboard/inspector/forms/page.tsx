'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ClipboardList, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import api from '@/lib/api';
import DashboardHeader from '@/components/ui/DashboardHeader';


interface Form {
  id: number;
  title: string;
  version: number;
  questions: string;
  createdBy: {
    name: string;
  };
}

export default function InspectorFormsPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await api.get('/forms');
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
    }
  };

  const handleStartInspection = async (formId: number, formTitle: string) => {
    setLoading(true);
    try {
      // Create a draft report
      const response = await api.post('/reports', {
        formId,
        data: JSON.stringify({}),
        remarks: '',
      });
      
      // Navigate to the report filling page
      router.push(`/dashboard/inspector/reports/${response.data.id}/fill`);
    } catch (error: any) {
      console.error('Error starting inspection:', error);
      toast.error(error.response?.data?.message || 'Error starting inspection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <DashboardHeader title='Inspection Forms' description='Choose a form to begin your inspection'/>

        <Card>
          <CardHeader>
            <CardTitle>Available Forms</CardTitle>
            <CardDescription>Choose a form to begin your inspection</CardDescription>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <div className="text-center py-12">
                <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 text-lg mb-2">No forms available</p>
                <p className="text-sm text-gray-400">Contact your administrator to create inspection forms</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forms.map((form) => (
                  <motion.div
                    key={form.id}
                    whileHover={{ scale: 1.02 }}
                    className="p-6 border-2 rounded-lg hover:border-[#047857] transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{form.title}</h4>
                        <p className="text-sm text-gray-600">Version {form.version}</p>
                        <p className="text-xs text-gray-500 mt-2">Created by: {form.createdBy.name}</p>
                      </div>
                    </div>
                    <Button
                      className="w-full bg-linear-to-r from-[#047857] to-[#10b981] hover:from-[#10b981] hover:to-[#047857]"
                      onClick={() => handleStartInspection(form.id, form.title)}
                      disabled={loading}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {loading ? 'Starting...' : 'Start Inspection'}
                    </Button>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </DashboardLayout>
  );
}
