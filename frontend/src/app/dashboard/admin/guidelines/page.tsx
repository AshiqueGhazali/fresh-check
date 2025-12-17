'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, BookOpen } from 'lucide-react';
import api from '@/lib/api';

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

export default function GuidelinesManagementPage() {
  const [guidelines, setGuidelines] = useState<Guideline[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedGuideline, setSelectedGuideline] = useState<Guideline | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    severity: 'MINOR',
  });
  const [loading, setLoading] = useState(false);
  const [guidelineToDelete, setGuidelineToDelete] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchGuidelines();
  }, []);

  const fetchGuidelines = async () => {
    try {
      const response = await api.get('/guidelines');
      setGuidelines(response.data);
    } catch (error) {
      console.error('Error fetching guidelines:', error);
      toast.error('Failed to load guidelines');
    }
  };

  const handleCreateGuideline = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/guidelines', formData);
      setIsCreateDialogOpen(false);
      setFormData({ title: '', content: '', severity: 'MINOR' });
      fetchGuidelines();
      toast.success('Guideline created successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error creating guideline');
    } finally {
      setLoading(false);
    }
  };

  const handleEditGuideline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGuideline) return;

    setLoading(true);
    try {
      await api.put(`/guidelines/${selectedGuideline.id}`, formData);
      setIsEditDialogOpen(false);
      setSelectedGuideline(null);
      setFormData({ title: '', content: '', severity: 'MINOR' });
      fetchGuidelines();
      toast.success('Guideline updated successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error updating guideline');
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (guidelineId: number) => {
    setGuidelineToDelete(guidelineId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!guidelineToDelete) return;

    try {
      await api.delete(`/guidelines/${guidelineToDelete}`);
      fetchGuidelines();
      toast.success('Guideline deleted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Error deleting guideline');
    } finally {
      setShowDeleteConfirm(false);
      setGuidelineToDelete(null);
    }
  };

  const openEditDialog = (guideline: Guideline) => {
    setSelectedGuideline(guideline);
    setFormData({
      title: guideline.title,
      content: guideline.content,
      severity: guideline.severity,
    });
    setIsEditDialogOpen(true);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'MAJOR':
        return 'bg-orange-500';
      case 'MINOR':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Guidelines Management</h2>
            <p className="text-gray-600 mt-2">Manage food quality and safety guidelines</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Guideline
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleCreateGuideline}>
                <DialogHeader>
                  <DialogTitle>Create New Guideline</DialogTitle>
                  <DialogDescription>Add a new food quality guideline</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      rows={6}
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="severity">Severity</Label>
                    <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MINOR">Minor</SelectItem>
                        <SelectItem value="MAJOR">Major</SelectItem>
                        <SelectItem value="CRITICAL">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Guideline'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              All Guidelines
            </CardTitle>
            <CardDescription>Food quality and safety standards</CardDescription>
          </CardHeader>
          <CardContent>
            {guidelines.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No guidelines found. Create your first guideline!</p>
            ) : (
              <div className="space-y-4">
                {guidelines.map((guideline) => (
                  <div key={guideline.id} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold text-lg">{guideline.title}</h4>
                          <Badge className={getSeverityColor(guideline.severity)}>
                            {guideline.severity}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3 whitespace-pre-wrap">{guideline.content}</p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <span>Updated by: {guideline.updatedBy.name}</span>
                          <span>{new Date(guideline.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(guideline)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => initiateDelete(guideline.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Edit Guideline Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <form onSubmit={handleEditGuideline}>
              <DialogHeader>
                <DialogTitle>Edit Guideline</DialogTitle>
                <DialogDescription>Update guideline information</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-title">Title</Label>
                  <Input
                    id="edit-title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-content">Content</Label>
                  <Textarea
                    id="edit-content"
                    rows={6}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-severity">Severity</Label>
                  <Select value={formData.severity} onValueChange={(value) => setFormData({ ...formData, severity: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MINOR">Minor</SelectItem>
                      <SelectItem value="MAJOR">Major</SelectItem>
                      <SelectItem value="CRITICAL">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Guideline'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <ConfirmDialog
          open={showDeleteConfirm}
          onOpenChange={setShowDeleteConfirm}
          title="Delete Guideline"
          description="Are you sure you want to delete this guideline? This action cannot be undone."
          onConfirm={handleConfirmDelete}
          confirmText="Yes, Delete"
          variant="destructive"
        />
      </div>
    </DashboardLayout>
  );
}
