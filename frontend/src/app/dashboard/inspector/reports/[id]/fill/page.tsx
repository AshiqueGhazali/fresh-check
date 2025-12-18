'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';
import { FileText, Save, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';


interface Question {
  id: number;
  text: string;
  type: string;
  unit?: string;
  required?: boolean;
}

interface Report {
  id: number;
  formId: number;
  data: string;
  remarks: string;
  status: string;
  form: {
    title: string;
    questions: string;
  };
}

export default function FillReportPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<Report | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [remarks, setRemarks] = useState('');
  const [loading, setLoading] = useState(false);

  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  useEffect(() => {
    fetchReport();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const response = await api.get(`/reports/${reportId}`);
      const reportData = response.data;
      setReport(reportData);
      
      // Parse questions
      const parsedQuestions = JSON.parse(reportData.form.questions);
      setQuestions(parsedQuestions);
      
      // Parse existing answers if any
      if (reportData.data) {
        try {
          const parsedData = JSON.parse(reportData.data);
          setAnswers(parsedData);
        } catch (e) {
          setAnswers({});
        }
      }
      
      setRemarks(reportData.remarks || '');
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Error loading report');
      router.push('/dashboard/inspector/reports');
    }
  };

  const handleAnswerChange = (questionId: number, value: any) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleSaveDraft = async () => {
    setLoading(true);
    try {
      await api.put(`/reports/${reportId}`, {
        data: JSON.stringify(answers),
        remarks,
      });
      toast.success('Draft saved successfully!');
      router.push('/dashboard/inspector/reports');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error saving draft');
    } finally {
      setLoading(false);
    }
  };

  const validateAndPromptSubmit = () => {
    // Validate required fields
    const missingRequired = questions.filter(q => 
      q.required && (answers[q.id] === undefined || answers[q.id] === '' || answers[q.id] === false)
    );

    if (missingRequired.length > 0) {
      toast.error('Please fill in required fields', {
        description: missingRequired.map(q => `- ${q.text}`).join('\n')
      });
      return;
    }
    
    setShowConfirmSubmit(true);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // First update the data
      await api.put(`/reports/${reportId}`, {
        data: JSON.stringify(answers),
        remarks,
      });
      
      // Then submit
      await api.put(`/reports/${reportId}/submit`);
      toast.success('Report submitted successfully!');
      router.push('/dashboard/inspector/reports');
    } catch (error: any) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Error submitting report');
    } finally {
      setLoading(false);
      setShowConfirmSubmit(false);
    }
  };

  if (!report) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 max-w-4xl"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            {report.form.title}
          </h2>
          <p className="text-gray-600 mt-2">Fill in the inspection details below</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Inspection Questions</CardTitle>
            <CardDescription>Answer all required questions marked with *</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((question, index) => (
              <div key={question.id} className="space-y-2">
                <Label htmlFor={`question-${question.id}`} className="text-base">
                  {index + 1}. {question.text}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {question.type === 'text' && (
                  <Textarea
                    id={`question-${question.id}`}
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Enter your answer..."
                    rows={3}
                  />
                )}
                
                {question.type === 'number' && (
                  <div className="flex gap-2 items-center">
                    <Input
                      id={`question-${question.id}`}
                      type="number"
                      value={answers[question.id] || ''}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      placeholder="Enter value..."
                      className="max-w-xs"
                    />
                    {question.unit && <span className="text-gray-600">{question.unit}</span>}
                  </div>
                )}
                
                {question.type === 'checkbox' && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id={`question-${question.id}`}
                      checked={answers[question.id] || false}
                      onCheckedChange={(checked) => handleAnswerChange(question.id, checked)}
                    />
                    <label
                      htmlFor={`question-${question.id}`}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Confirmed
                    </label>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Additional Remarks</CardTitle>
            <CardDescription>Add any additional observations or notes</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter any additional remarks, observations, or issues found during inspection..."
              rows={5}
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/inspector/reports')}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            onClick={validateAndPromptSubmit}
            disabled={loading}
            className="bg-gradient-to-r from-[#047857] to-[#10b981] hover:from-[#10b981] hover:to-[#047857]"
          >
            <Send className="h-4 w-4 mr-2" />
            Submit for Review
          </Button>
        </div>

        <ConfirmDialog
          open={showConfirmSubmit}
          onOpenChange={setShowConfirmSubmit}
          title="Submit Report"
          description="Are you sure you want to submit this report? You won't be able to make changes after submission."
          onConfirm={handleSubmit}
          confirmText="Yes, Submit"
        />
      </motion.div>
    </DashboardLayout>
  );
}
