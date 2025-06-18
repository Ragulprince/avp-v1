import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Plus, Search, Edit, Trash2, Users, UserCheck, GraduationCap, Phone, Mail, BookOpen } from 'lucide-react';
import { useStaff, useCreateStaff } from '@/hooks/api/useAdmin';
import { CreateStaffData, adminService } from '@/services/admin';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const StaffManagement = () => {
  const { data: staffResponse, isLoading } = useStaff();
  const createStaffMutation = useCreateStaff();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const staff = staffResponse?.data || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);
  
  const [newStaff, setNewStaff] = useState<CreateStaffData>({
    email: '',
    name: '',
    phone: '',
    role: 'TEACHER',
    department: '',
    designation: '',
    qualifications: [],
    years_of_experience: 0,
    specialization: [],
    subjects: [],
    salary: 0,
    bank_details: {},
    documents: {},
    emergency_contact: '',
    blood_group: '',
    medical_conditions: '',
    achievements: {},
    performance_rating: 0,
    is_teaching: true,
    is_administrative: false,
    office_location: '',
    working_hours: {},
    leaves_taken: 0,
    leaves_remaining: 0
  });

  const editStaffMutation = useMutation({
    mutationFn: async (data: { id: string; values: Partial<CreateStaffData> }) => {
      return adminService.updateStaff(data.id, data.values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({ title: 'Success', description: 'Staff updated successfully' });
      setIsEditDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update staff', variant: 'destructive' });
    },
  });

  const deleteStaffMutation = useMutation({
    mutationFn: async (id: string) => {
      return adminService.deleteStaff(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff'] });
      toast({ title: 'Success', description: 'Staff deleted successfully' });
      setIsDeleteDialogOpen(false);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete staff', variant: 'destructive' });
    },
  });

  const filteredStaff = staff.filter(staff => {
    return (staff.name?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
           (staff.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
  });

  const handleAddStaff = async () => {
    if (!newStaff.email || !newStaff.name) {
      toast({
        title: 'Error',
        description: 'Email and name are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createStaffMutation.mutateAsync(newStaff);
      setNewStaff({
        email: '',
        name: '',
        phone: '',
        role: 'TEACHER',
        department: '',
        designation: '',
        qualifications: [],
        years_of_experience: 0,
        specialization: [],
        subjects: [],
        salary: 0,
        bank_details: {},
        documents: {},
        emergency_contact: '',
        blood_group: '',
        medical_conditions: '',
        achievements: {},
        performance_rating: 0,
        is_teaching: true,
        is_administrative: false,
        office_location: '',
        working_hours: {},
        leaves_taken: 0,
        leaves_remaining: 0
      });
      setIsAddDialogOpen(false);
    } catch (error) {
      console.error('Failed to create staff:', error);
    }
  };

  const openEditDialog = (staff: any) => {
    setSelectedStaff(staff);
    setNewStaff({
      email: staff.email || '',
      name: staff.full_name || '',
      phone: staff.phone_number || '',
      role: staff.role || 'TEACHER',
      department: staff.staff?.department || '',
      designation: staff.staff?.designation || '',
      qualifications: staff.staff?.qualifications || [],
      years_of_experience: staff.staff?.years_of_experience || 0,
      specialization: staff.staff?.specialization || [],
      subjects: staff.staff?.subjects || [],
      salary: staff.staff?.salary || 0,
      bank_details: staff.staff?.bank_details || {},
      documents: staff.staff?.documents || {},
      emergency_contact: staff.staff?.emergency_contact || '',
      blood_group: staff.staff?.blood_group || '',
      medical_conditions: staff.staff?.medical_conditions || '',
      achievements: staff.staff?.achievements || {},
      performance_rating: staff.staff?.performance_rating || 0,
      is_teaching: staff.staff?.is_teaching || false,
      is_administrative: staff.staff?.is_administrative || false,
      office_location: staff.staff?.office_location || '',
      working_hours: staff.staff?.working_hours || {},
      leaves_taken: staff.staff?.leaves_taken || 0,
      leaves_remaining: staff.staff?.leaves_remaining || 0
    });
    setIsEditDialogOpen(true);
  };

  const handleEditStaff = async () => {
    if (!selectedStaff) return;
    const staffData = {
      full_name: newStaff.name,
      phone_number: newStaff.phone,
      role: newStaff.role,
      staff: {
        department: newStaff.department,
        designation: newStaff.designation,
        qualifications: newStaff.qualifications,
        years_of_experience: newStaff.years_of_experience,
        specialization: newStaff.specialization,
        subjects: newStaff.subjects,
        salary: newStaff.salary,
        bank_details: newStaff.bank_details,
        documents: newStaff.documents,
        emergency_contact: newStaff.emergency_contact,
        blood_group: newStaff.blood_group,
        medical_conditions: newStaff.medical_conditions,
        achievements: newStaff.achievements,
        performance_rating: newStaff.performance_rating,
        is_teaching: newStaff.is_teaching,
        is_administrative: newStaff.is_administrative,
        office_location: newStaff.office_location,
        working_hours: newStaff.working_hours,
        leaves_taken: newStaff.leaves_taken,
        leaves_remaining: newStaff.leaves_remaining
      }
    };
    await editStaffMutation.mutateAsync({ id: selectedStaff.user_id.toString(), values: staffData });
  };

  const handleDeleteStaff = async () => {
    if (!selectedStaff) return;
    await deleteStaffMutation.mutateAsync(selectedStaff.user_id.toString());
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
          <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
          <p className="text-gray-600 mt-1">Manage teaching and administrative staff</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle>Add New Staff</DialogTitle>
              <DialogDescription>
                Fill in the staff member's details below. Fields marked with * are required.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
              <div className="grid grid-cols-2 gap-4 py-4">
                {/* Basic Information */}
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Staff name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    placeholder="staff@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input
                    id="phone"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role *</Label>
                  <Select value={newStaff.role} onValueChange={(value) => setNewStaff({...newStaff, role: value as 'ADMIN' | 'TEACHER'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Professional Information */}
                <div>
                  <Label htmlFor="department">Department</Label>
                  <Input
                    id="department"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                    placeholder="Department"
                  />
                </div>
                <div>
                  <Label htmlFor="designation">Designation</Label>
                  <Input
                    id="designation"
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({...newStaff, designation: e.target.value})}
                    placeholder="Designation"
                  />
                </div>
                <div>
                  <Label htmlFor="qualifications">Qualifications</Label>
                  <Input
                    id="qualifications"
                    value={newStaff.qualifications?.join(', ')}
                    onChange={(e) => setNewStaff({...newStaff, qualifications: e.target.value.split(',').map(q => q.trim())})}
                    placeholder="Enter qualifications (comma-separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization</Label>
                  <Input
                    id="specialization"
                    value={newStaff.specialization?.join(', ')}
                    onChange={(e) => setNewStaff({...newStaff, specialization: e.target.value.split(',').map(s => s.trim())})}
                    placeholder="Enter specializations (comma-separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="subjects">Subjects</Label>
                  <Input
                    id="subjects"
                    value={newStaff.subjects?.join(', ')}
                    onChange={(e) => setNewStaff({...newStaff, subjects: e.target.value.split(',').map(s => s.trim())})}
                    placeholder="Enter subjects (comma-separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="years_of_experience">Years of Experience</Label>
                  <Input
                    id="years_of_experience"
                    type="number"
                    value={newStaff.years_of_experience}
                    onChange={(e) => setNewStaff({...newStaff, years_of_experience: parseInt(e.target.value)})}
                    placeholder="Years of Experience"
                  />
                </div>
                <div>
                  <Label htmlFor="salary">Salary</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={newStaff.salary}
                    onChange={(e) => setNewStaff({...newStaff, salary: parseFloat(e.target.value)})}
                    placeholder="Salary"
                  />
                </div>
                <div>
                  <Label htmlFor="performance_rating">Performance Rating</Label>
                  <Input
                    id="performance_rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={newStaff.performance_rating}
                    onChange={(e) => setNewStaff({...newStaff, performance_rating: parseFloat(e.target.value)})}
                    placeholder="Performance Rating (0-5)"
                  />
                </div>

                {/* Location and Hours */}
                <div>
                  <Label htmlFor="office_location">Office Location</Label>
                  <Input
                    id="office_location"
                    value={newStaff.office_location}
                    onChange={(e) => setNewStaff({...newStaff, office_location: e.target.value})}
                    placeholder="Office Location"
                  />
                </div>
                <div>
                  <Label htmlFor="working_hours">Working Hours</Label>
                  <Input
                    id="working_hours"
                    value={JSON.stringify(newStaff.working_hours)}
                    onChange={(e) => {
                      try {
                        const hours = JSON.parse(e.target.value);
                        setNewStaff({...newStaff, working_hours: hours});
                      } catch (error) {
                        // Handle invalid JSON
                      }
                    }}
                    placeholder="Working Hours (JSON format)"
                  />
                </div>

                {/* Leave Management */}
                <div>
                  <Label htmlFor="leaves_taken">Leaves Taken</Label>
                  <Input
                    id="leaves_taken"
                    type="number"
                    value={newStaff.leaves_taken}
                    onChange={(e) => setNewStaff({...newStaff, leaves_taken: parseInt(e.target.value)})}
                    placeholder="Leaves Taken"
                  />
                </div>
                <div>
                  <Label htmlFor="leaves_remaining">Leaves Remaining</Label>
                  <Input
                    id="leaves_remaining"
                    type="number"
                    value={newStaff.leaves_remaining}
                    onChange={(e) => setNewStaff({...newStaff, leaves_remaining: parseInt(e.target.value)})}
                    placeholder="Leaves Remaining"
                  />
                </div>

                {/* Personal Information */}
                <div>
                  <Label htmlFor="emergency_contact">Emergency Contact</Label>
                  <Input
                    id="emergency_contact"
                    value={newStaff.emergency_contact}
                    onChange={(e) => setNewStaff({...newStaff, emergency_contact: e.target.value})}
                    placeholder="Emergency Contact"
                  />
                </div>
                <div>
                  <Label htmlFor="blood_group">Blood Group</Label>
                  <Select value={newStaff.blood_group} onValueChange={(value) => setNewStaff({...newStaff, blood_group: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="medical_conditions">Medical Conditions</Label>
                  <Textarea
                    id="medical_conditions"
                    value={newStaff.medical_conditions}
                    onChange={(e) => setNewStaff({...newStaff, medical_conditions: e.target.value})}
                    placeholder="Medical Conditions"
                  />
                </div>

                {/* Staff Type */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_teaching"
                    checked={newStaff.is_teaching}
                    onChange={(e) => setNewStaff({...newStaff, is_teaching: e.target.checked})}
                  />
                  <Label htmlFor="is_teaching">Teaching Staff</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="is_administrative"
                    checked={newStaff.is_administrative}
                    onChange={(e) => setNewStaff({...newStaff, is_administrative: e.target.checked})}
                  />
                  <Label htmlFor="is_administrative">Administrative Staff</Label>
                </div>

                {/* Additional Information */}
                <div className="col-span-2">
                  <Label htmlFor="bank_details">Bank Details</Label>
                  <Textarea
                    id="bank_details"
                    value={JSON.stringify(newStaff.bank_details, null, 2)}
                    onChange={(e) => {
                      try {
                        const details = JSON.parse(e.target.value);
                        setNewStaff({...newStaff, bank_details: details});
                      } catch (error) {
                        // Handle invalid JSON
                      }
                    }}
                    placeholder="Bank Details (JSON format)"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="documents">Documents</Label>
                  <Textarea
                    id="documents"
                    value={JSON.stringify(newStaff.documents, null, 2)}
                    onChange={(e) => {
                      try {
                        const docs = JSON.parse(e.target.value);
                        setNewStaff({...newStaff, documents: docs});
                      } catch (error) {
                        // Handle invalid JSON
                      }
                    }}
                    placeholder="Documents (JSON format)"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="achievements">Achievements</Label>
                  <Textarea
                    id="achievements"
                    value={JSON.stringify(newStaff.achievements, null, 2)}
                    onChange={(e) => {
                      try {
                        const achievements = JSON.parse(e.target.value);
                        setNewStaff({...newStaff, achievements: achievements});
                      } catch (error) {
                        // Handle invalid JSON
                      }
                    }}
                    placeholder="Achievements (JSON format)"
                  />
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddStaff} disabled={createStaffMutation.isPending}>
                {createStaffMutation.isPending ? 'Adding...' : 'Add Staff'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Staff</p>
                <p className="text-2xl font-bold">{staff.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Staff</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.is_active).length}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Teaching Staff</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.is_teaching).length}</p>
              </div>
              <GraduationCap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admin Staff</p>
                <p className="text-2xl font-bold">{staff.filter(s => s.is_administrative).length}</p>
              </div>
              <Users className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Staff List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card key={staff.user_id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {staff.name?.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                    <Badge variant={staff.is_active ? "default" : "secondary"}>
                      {staff.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditDialog(staff)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedStaff(staff);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{staff.email}</span>
                </div>
                {staff.phone && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <span>{staff.phone}</span>
                  </div>
                )}
                {staff.department && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <BookOpen className="w-4 h-4" />
                    <span>{staff.department}</span>
                  </div>
                )}
                {staff.designation && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <GraduationCap className="w-4 h-4" />
                    <span>{staff.designation}</span>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Joined:</span>
                  <span className="font-medium">{new Date(staff.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Edit Staff</DialogTitle>
            <DialogDescription>
              Update staff information below.
            </DialogDescription>
          </DialogHeader>
          {selectedStaff && (
            <div className="flex-grow overflow-y-auto pr-4 -mr-4">
              <div className="grid grid-cols-2 gap-4 py-4">
                {/* Basic Information */}
                <div>
                  <Label htmlFor="edit-name">Full Name *</Label>
                  <Input
                    id="edit-name"
                    value={newStaff.name}
                    onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                    placeholder="Staff name"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email *</Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={newStaff.email}
                    onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                    placeholder="staff@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-phone">Phone *</Label>
                  <Input
                    id="edit-phone"
                    value={newStaff.phone}
                    onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                    placeholder="+91 9876543210"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-role">Role *</Label>
                  <Select value={newStaff.role} onValueChange={(value) => setNewStaff({...newStaff, role: value as 'ADMIN' | 'TEACHER'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TEACHER">Teacher</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Professional Information */}
                <div>
                  <Label htmlFor="edit-department">Department</Label>
                  <Input
                    id="edit-department"
                    value={newStaff.department}
                    onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                    placeholder="Department"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-designation">Designation</Label>
                  <Input
                    id="edit-designation"
                    value={newStaff.designation}
                    onChange={(e) => setNewStaff({...newStaff, designation: e.target.value})}
                    placeholder="Designation"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-qualifications">Qualifications</Label>
                  <Input
                    id="edit-qualifications"
                    value={newStaff.qualifications?.join(', ')}
                    onChange={(e) => setNewStaff({...newStaff, qualifications: e.target.value.split(',').map(q => q.trim())})}
                    placeholder="Enter qualifications (comma-separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-specialization">Specialization</Label>
                  <Input
                    id="edit-specialization"
                    value={newStaff.specialization?.join(', ')}
                    onChange={(e) => setNewStaff({...newStaff, specialization: e.target.value.split(',').map(s => s.trim())})}
                    placeholder="Enter specializations (comma-separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-subjects">Subjects</Label>
                  <Input
                    id="edit-subjects"
                    value={newStaff.subjects?.join(', ')}
                    onChange={(e) => setNewStaff({...newStaff, subjects: e.target.value.split(',').map(s => s.trim())})}
                    placeholder="Enter subjects (comma-separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-years-of-experience">Years of Experience</Label>
                  <Input
                    id="edit-years-of-experience"
                    type="number"
                    value={newStaff.years_of_experience}
                    onChange={(e) => setNewStaff({...newStaff, years_of_experience: parseInt(e.target.value)})}
                    placeholder="Years of Experience"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-salary">Salary</Label>
                  <Input
                    id="edit-salary"
                    type="number"
                    value={newStaff.salary}
                    onChange={(e) => setNewStaff({...newStaff, salary: parseFloat(e.target.value)})}
                    placeholder="Salary"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-performance-rating">Performance Rating</Label>
                  <Input
                    id="edit-performance-rating"
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={newStaff.performance_rating}
                    onChange={(e) => setNewStaff({...newStaff, performance_rating: parseFloat(e.target.value)})}
                    placeholder="Performance Rating (0-5)"
                  />
                </div>

                {/* Location and Hours */}
                <div>
                  <Label htmlFor="edit-office-location">Office Location</Label>
                  <Input
                    id="edit-office-location"
                    value={newStaff.office_location}
                    onChange={(e) => setNewStaff({...newStaff, office_location: e.target.value})}
                    placeholder="Office Location"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-working-hours">Working Hours</Label>
                  <Input
                    id="edit-working-hours"
                    value={JSON.stringify(newStaff.working_hours)}
                    onChange={(e) => {
                      try {
                        const hours = JSON.parse(e.target.value);
                        setNewStaff({...newStaff, working_hours: hours});
                      } catch (error) {
                        // Handle invalid JSON
                      }
                    }}
                    placeholder="Working Hours (JSON format)"
                  />
                </div>

                {/* Leave Management */}
                <div>
                  <Label htmlFor="edit-leaves-taken">Leaves Taken</Label>
                  <Input
                    id="edit-leaves-taken"
                    type="number"
                    value={newStaff.leaves_taken}
                    onChange={(e) => setNewStaff({...newStaff, leaves_taken: parseInt(e.target.value)})}
                    placeholder="Leaves Taken"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-leaves-remaining">Leaves Remaining</Label>
                  <Input
                    id="edit-leaves-remaining"
                    type="number"
                    value={newStaff.leaves_remaining}
                    onChange={(e) => setNewStaff({...newStaff, leaves_remaining: parseInt(e.target.value)})}
                    placeholder="Leaves Remaining"
                  />
                </div>

                {/* Personal Information */}
                <div>
                  <Label htmlFor="edit-emergency-contact">Emergency Contact</Label>
                  <Input
                    id="edit-emergency-contact"
                    value={newStaff.emergency_contact}
                    onChange={(e) => setNewStaff({...newStaff, emergency_contact: e.target.value})}
                    placeholder="Emergency Contact"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-blood-group">Blood Group</Label>
                  <Select value={newStaff.blood_group} onValueChange={(value) => setNewStaff({...newStaff, blood_group: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-medical-conditions">Medical Conditions</Label>
                  <Textarea
                    id="edit-medical-conditions"
                    value={newStaff.medical_conditions}
                    onChange={(e) => setNewStaff({...newStaff, medical_conditions: e.target.value})}
                    placeholder="Medical Conditions"
                  />
                </div>

                {/* Staff Type */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-is-teaching"
                    checked={newStaff.is_teaching}
                    onChange={(e) => setNewStaff({...newStaff, is_teaching: e.target.checked})}
                  />
                  <Label htmlFor="edit-is-teaching">Teaching Staff</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="edit-is-administrative"
                    checked={newStaff.is_administrative}
                    onChange={(e) => setNewStaff({...newStaff, is_administrative: e.target.checked})}
                  />
                  <Label htmlFor="edit-is-administrative">Administrative Staff</Label>
                </div>

                {/* Additional Information */}
                <div className="col-span-2">
                  <Label htmlFor="edit-bank-details">Bank Details</Label>
                  <Textarea
                    id="edit-bank-details"
                    value={JSON.stringify(newStaff.bank_details, null, 2)}
                    onChange={(e) => {
                      try {
                        const details = JSON.parse(e.target.value);
                        setNewStaff({...newStaff, bank_details: details});
                      } catch (error) {
                        // Handle invalid JSON
                      }
                    }}
                    placeholder="Bank Details (JSON format)"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-documents">Documents</Label>
                  <Textarea
                    id="edit-documents"
                    value={JSON.stringify(newStaff.documents, null, 2)}
                    onChange={(e) => {
                      try {
                        const docs = JSON.parse(e.target.value);
                        setNewStaff({...newStaff, documents: docs});
                      } catch (error) {
                        // Handle invalid JSON
                      }
                    }}
                    placeholder="Documents (JSON format)"
                  />
                </div>
                <div className="col-span-2">
                  <Label htmlFor="edit-achievements">Achievements</Label>
                  <Textarea
                    id="edit-achievements"
                    value={JSON.stringify(newStaff.achievements, null, 2)}
                    onChange={(e) => {
                      try {
                        const achievements = JSON.parse(e.target.value);
                        setNewStaff({...newStaff, achievements: achievements});
                      } catch (error) {
                        // Handle invalid JSON
                      }
                    }}
                    placeholder="Achievements (JSON format)"
                  />
                </div>
              </div>
            </div>
          )}
          <div className="flex-shrink-0 flex justify-end space-x-2 mt-6">
            <Button variant="outline" onClick={() => {
              setIsEditDialogOpen(false);
              setSelectedStaff(null);
            }}>
              Cancel
            </Button>
            <Button onClick={handleEditStaff} disabled={editStaffMutation.isPending}>
              {editStaffMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the staff member's account
              and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteStaff}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;