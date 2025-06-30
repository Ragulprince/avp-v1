import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, BookOpen } from 'lucide-react';
import { useSubjects, useCreateSubject, useUpdateSubject, useDeleteSubject } from '@/hooks/api/useSubjects';
import { CreateSubjectData } from '@/services/subject/subjectService';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog as RelatedCoursesDialog, DialogContent as RelatedCoursesDialogContent, DialogHeader as RelatedCoursesDialogHeader, DialogTitle as RelatedCoursesDialogTitle } from '@/components/ui/dialog';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api';

// Debug: Log component mount
console.debug('[SubjectManagement] Component mounted');
const SubjectManagement = () => {
  const { data: subjectsResponse, isLoading } = useSubjects();
  const createSubjectMutation = useCreateSubject();
  const updateSubjectMutation = useUpdateSubject();
  const deleteSubjectMutation = useDeleteSubject();
  const { toast } = useToast();

  // Debug: log API response
  console.debug('[SubjectManagement] subjectsResponse:', subjectsResponse);
  console.debug('[SubjectManagement] isLoading:', isLoading);

  // Defensive array handling for subjects
  const subjects = Array.isArray(subjectsResponse?.data)
    ? subjectsResponse.data
    : Array.isArray(subjectsResponse)
      ? subjectsResponse
      : [];

  // Debug: log parsed subjects array
  console.debug('[SubjectManagement] subjects:', subjects);

  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<any>(null);

  const [newSubject, setNewSubject] = useState<CreateSubjectData>({
    name: '',
    description: '',
  });

  const [showCoursesDialog, setShowCoursesDialog] = useState(false);
  const [coursesForSubject, setCoursesForSubject] = useState<any[]>([]);
  const [coursesDialogSubject, setCoursesDialogSubject] = useState<any>(null);

  const [showCourseDetailDialog, setShowCourseDetailDialog] = useState(false);
  const [courseDetail, setCourseDetail] = useState<any>(null);

  // Debug: log dialog state changes
  React.useEffect(() => {
    console.debug('[SubjectManagement] isAddDialogOpen:', isAddDialogOpen);
  }, [isAddDialogOpen]);
  React.useEffect(() => {
    console.debug('[SubjectManagement] isEditDialogOpen:', isEditDialogOpen, 'selectedSubject:', selectedSubject);
  }, [isEditDialogOpen, selectedSubject]);
  React.useEffect(() => {
    console.debug('[SubjectManagement] isDeleteDialogOpen:', isDeleteDialogOpen, 'selectedSubject:', selectedSubject);
  }, [isDeleteDialogOpen, selectedSubject]);

  const filteredSubjects = subjects.filter((subject: any) => {
    return (
      subject.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subject.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Debug: log search term and filtered subjects
  React.useEffect(() => {
    console.debug('[SubjectManagement] searchTerm:', searchTerm);
    console.debug('[SubjectManagement] filteredSubjects:', filteredSubjects);
  }, [searchTerm, filteredSubjects]);

  const handleAddSubject = async () => {
    console.debug('[SubjectManagement] handleAddSubject called with:', newSubject);
    if (!newSubject.name || !newSubject.description) {
      toast({
        title: 'Error',
        description: 'Name and description are required',
        variant: 'destructive',
      });
      return;
    }
    try {
      const result = await createSubjectMutation.mutateAsync(newSubject);
      console.debug('[SubjectManagement] Subject created:', result);
      setNewSubject({ name: '', description: '' });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('[SubjectManagement] Failed to create subject:', error);
    }
  };

  const openEditDialog = (subject: any) => {
    console.debug('[SubjectManagement] openEditDialog called with:', subject);
    setSelectedSubject(subject);
    setNewSubject({
      name: subject.name || '',
      description: subject.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubject = async () => {
    console.debug('[SubjectManagement] handleEditSubject called with:', selectedSubject, newSubject);
    if (!selectedSubject) return;
    try {
      const result = await updateSubjectMutation.mutateAsync({ id: selectedSubject.subject_id, values: newSubject });
      console.debug('[SubjectManagement] Subject updated:', result);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('[SubjectManagement] Failed to update subject:', error);
    }
  };

  const handleDeleteSubject = async () => {
    console.debug('[SubjectManagement] handleDeleteSubject called with:', selectedSubject);
    if (!selectedSubject) return;
    try {
      const result = await deleteSubjectMutation.mutateAsync(selectedSubject.subject_id);
      console.debug('[SubjectManagement] Subject deleted:', result);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('[SubjectManagement] Failed to delete subject:', error);
    }
  };

  const handleShowCourses = async (subject: any) => {
    setCoursesDialogSubject(subject);
    setShowCoursesDialog(true);
    // Fetch courses for this subject
    try {
      const res = await apiClient.get(`/subjects/${subject.subject_id}/courses`);
      setCoursesForSubject(res.data || []);
      console.log(res.data);
    } catch (e) {
      setCoursesForSubject([]);
    }
  };

  const handleShowCourseDetail = async (course: any) => {
    try {
      // Fetch full course details if needed
      const res = await apiClient.get(`/admin/courses/${course.course_id}`);
      setCourseDetail(res.data.data || course);
      
    } catch (e) {
      setCourseDetail(course);
    }
    setShowCourseDetailDialog(true);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Subject Management</h1>
          <p className="text-gray-600 mt-1">Manage academy subjects</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Subject
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>Add New Subject</DialogTitle>
              <DialogDescription>
                Fill in the subject details below. Fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <div className="overflow-y-auto pr-6 -mr-6">
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <Label htmlFor="name">Subject Name *</Label>
                  <Input
                    id="name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="Subject name"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    placeholder="Subject description"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddSubject} disabled={createSubjectMutation.isPending}>
                {createSubjectMutation.isPending ? 'Adding...' : 'Add Subject'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Subjects</p>
                <p className="text-2xl font-bold">{subjects.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subject List */}
      <div className="flex items-center mb-4">
        <div className="relative w-full max-w-xs">
          <Input
            type="text"
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject: any) => (
          <Card key={subject.subject_id} className="flex flex-col cursor-pointer" onClick={() => handleShowCourses(subject)}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {subject.name?.split(' ').map((n: string) => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{subject.name}</h3>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditDialog(subject);
                    }}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSubject(subject);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="text-sm text-gray-600">
                  {subject.description}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Edit Subject</DialogTitle>
            <DialogDescription>
              Update subject information below.
            </DialogDescription>
          </DialogHeader>
          {selectedSubject && (
            <div className="overflow-y-auto pr-6 -mr-6">
              <div className="grid grid-cols-1 gap-4 mt-4">
                <div>
                  <Label htmlFor="edit-name">Subject Name *</Label>
                  <Input
                    id="edit-name"
                    value={newSubject.name}
                    onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                    placeholder="Subject name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-description">Description *</Label>
                  <Textarea
                    id="edit-description"
                    value={newSubject.description}
                    onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                    placeholder="Subject description"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSubject} disabled={updateSubjectMutation.isPending}>
              {updateSubjectMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the subject.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteSubject} disabled={deleteSubjectMutation.isPending}>
              {deleteSubjectMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <RelatedCoursesDialog open={showCoursesDialog} onOpenChange={setShowCoursesDialog}>
        <RelatedCoursesDialogContent>
          <RelatedCoursesDialogHeader>
            <RelatedCoursesDialogTitle>Courses for {coursesDialogSubject?.name}</RelatedCoursesDialogTitle>
          </RelatedCoursesDialogHeader>
          <div className="space-y-2 mt-4">
            {coursesForSubject.length === 0 ? (
              <div className="text-gray-500">No courses found for this subject.</div>
            ) : (
              coursesForSubject.map((course: any) => (
                <div
                  key={course.course_id}
                  className="p-2 border rounded bg-gray-50 cursor-pointer hover:bg-blue-100"
                  onClick={() => handleShowCourseDetail(course)}
                >
                  {course.name}
                </div>
              ))
            )}
          </div>
        </RelatedCoursesDialogContent>
      </RelatedCoursesDialog>

      <RelatedCoursesDialog open={showCourseDetailDialog} onOpenChange={setShowCourseDetailDialog}>
        <RelatedCoursesDialogContent>
          <RelatedCoursesDialogHeader>
            <RelatedCoursesDialogTitle>Course Details</RelatedCoursesDialogTitle>
          </RelatedCoursesDialogHeader>
          {courseDetail ? (
            <div className="space-y-2 mt-4">
              <div><strong>Name:</strong> {courseDetail.name}</div>
              <div><strong>Description:</strong> {courseDetail.description}</div>
              <div><strong>Duration:</strong> {courseDetail.duration}</div>
              <div><strong>Fees:</strong> {courseDetail.fees}</div>
              {/* Show subjects if present */}
              {courseDetail.subjects && courseDetail.subjects.length > 0 && (
                <div>
                  <strong>Subjects:</strong>
                  <ul className="list-disc ml-6">
                    {courseDetail.subjects.map((subj: any) => (
                      <li key={subj.subject_id}>{subj.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </RelatedCoursesDialogContent>
      </RelatedCoursesDialog>
    </div>
  );
};

export default SubjectManagement; 