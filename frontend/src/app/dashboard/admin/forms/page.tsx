'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, FileText, X } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '@/lib/api';
import DashboardHeader from '@/components/ui/DashboardHeader';

interface Question {
  id: number;
  text: string;
  type: string;
  unit?: string;
  required: boolean;
}

interface Form {
  id: number;
  title: string;
  version: number;
  questions: string;
  isActive: boolean;
  createdBy: {
    name: string;
  };
  createdAt: string;
}

export default function FormsManagementPage() {
  const [forms, setForms] = useState<Form[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<Form | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    questions: [] as Question[],
  });
  const [loading, setLoading] = useState(false);
  const [formToDelete, setFormToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      const response = await api.get('/forms');
      setForms(response.data);
    } catch (error) {
      console.error('Error fetching forms:', error);
      toast.error('Failed to load forms');
    }
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now(),
      text: '',
      type: 'text',
      required: true,
    };
    setFormData({
      ...formData,
      questions: [...formData.questions, newQuestion],
    });
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setFormData({
      ...formData,
      questions: formData.questions.map(q =>
        q.id === id ? { ...q, [field]: value } : q
      ),
    });
  };

  const removeQuestion = (id: number) => {
    setFormData({
      ...formData,
      questions: formData.questions.filter(q => q.id !== id),
    });
  };

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    const emptyQuestions = formData.questions.filter(q => !q.text.trim());
    if (emptyQuestions.length > 0) {
      toast.error('Please fill in all question texts');
      return;
    }

    setLoading(true);
    try {
      await api.post('/forms', {
        title: formData.title,
        questions: formData.questions,
      });
      setIsCreateDialogOpen(false);
      setFormData({ title: '', questions: [] });
      fetchForms();
      toast.success('Form created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error creating form');
    } finally {
      setLoading(false);
    }
  };

  const handleEditForm = (form: Form) => {
    setSelectedForm(form);
    const parsedQuestions = JSON.parse(form.questions);
    setFormData({
      title: form.title,
      questions: parsedQuestions,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedForm) return;

    if (formData.questions.length === 0) {
      toast.error('Please add at least one question');
      return;
    }

    setLoading(true);
    try {
      await api.put(`/forms/${selectedForm.id}`, {
        title: formData.title,
        questions: formData.questions,
      });
      setIsEditDialogOpen(false);
      setSelectedForm(null);
      setFormData({ title: '', questions: [] });
      fetchForms();
      toast.success('Form updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating form');
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (formId: number) => {
    setFormToDelete(formId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!formToDelete) return;

    try {
      await api.delete(`/forms/${formToDelete}`);
      fetchForms();
      toast.success('Form deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error deleting form');
    } finally {
      setShowDeleteConfirm(false);
      setFormToDelete(null);
    }
  };

  const QuestionBuilder = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-semibold">Questions</Label>
        <Button type="button" onClick={addQuestion} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          Add Question
        </Button>
      </div>

      {formData.questions.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed rounded-lg">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-500">No questions added yet</p>
          <p className="text-sm text-gray-400">Click "Add Question" to start building your form</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 custom-scrollbar overflow-y-auto">
          {formData.questions.map((question, index) => (
            <div key={question.id} className="p-4 border rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <span className="font-semibold text-sm">Question {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeQuestion(question.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid gap-3">
                <div>
                  <Label className="text-sm">Question Text *</Label>
                  <Input
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, 'text', e.target.value)}
                    placeholder="e.g., Check refrigerator temperature"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-sm">Type</Label>
                    <Select
                      value={question.type}
                      onValueChange={(value) => updateQuestion(question.id, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text">Text</SelectItem>
                        <SelectItem value="number">Number</SelectItem>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {question.type === 'number' && (
                    <div>
                      <Label className="text-sm">Unit (optional)</Label>
                      <Input
                        value={question.unit || ''}
                        onChange={(e) => updateQuestion(question.id, 'unit', e.target.value)}
                        placeholder="e.g., °C, kg"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`required-${question.id}`}
                    checked={question.required}
                    onCheckedChange={(checked) => updateQuestion(question.id, 'required', checked)}
                  />
                  <label htmlFor={`required-${question.id}`} className="text-sm">
                    Required field
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <DashboardLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <DashboardHeader title='Inspection Forms' description='Create and manage inspection forms with custom questions' />
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-linear-to-r from-[#047857] to-[#10b981] hover:from-[#10b981] hover:to-[#047857]">
                <Plus className="h-4 w-4 mr-2" />
                Create Form
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] scrollbar-hide overflow-y-auto">
              <form onSubmit={handleCreateForm}>
                <DialogHeader>
                  <DialogTitle>Create Inspection Form</DialogTitle>
                  <DialogDescription>Build a custom inspection form with your own questions</DialogDescription>
                </DialogHeader>
                <div className="grid gap-6 py-4">
                  <div>
                    <Label htmlFor="title">Form Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g., Daily Kitchen Inspection"
                      required
                    />
                  </div>
                  <QuestionBuilder />
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading} className='bg-[#047857] hover:bg-[#047857]/90'>
                    {loading ? 'Creating...' : 'Create Form'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Forms</CardTitle>
            <CardDescription>Manage inspection form templates</CardDescription>
          </CardHeader>
          <CardContent>
            {forms.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No forms found. Create your first form!</p>
            ) : (
              <div className="space-y-4">
                {forms.map((form) => {
                  const questions = JSON.parse(form.questions);
                  return (
                    <div key={form.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold text-lg">{form.title}</h4>
                            {form.isActive && (
                              <span className="px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs font-medium">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{questions.length} questions</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Created by: {form.createdBy.name}</span>
                            <span>{new Date(form.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button variant="outline" size="sm" onClick={() => handleEditForm(form)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => initiateDelete(form.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Form Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] scrollbar-hide overflow-y-auto">
            <form onSubmit={handleUpdateForm}>
              <DialogHeader>
                <DialogTitle>Edit Inspection Form</DialogTitle>
                <DialogDescription>Update form title and questions</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div>
                  <Label htmlFor="edit-title">Form Title *</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <QuestionBuilder />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading} className='bg-[#047857] hover:bg-[#047857]/90'>
                  {loading ? 'Updating...' : 'Update Form'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Form"
          description="Are you sure you want to delete this form? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          confirmText="Yes, Delete"
          variant="destructive"
        />
      </motion.div>
    </DashboardLayout>
  );
}
