import { apiClient } from '../api';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  studentProfile?: {
    batchId?: string;
    courseId?: string;
    address?: string;
    emergencyContact?: string;
    batch?: any;
    course?: any;
  };
  createdAt: string;
}

export interface CreateStudentData {
  email: string;
  full_name: string;
  phone_number?: string;
  batch_id?: string;
  course_id?: string;
  address?: string;
  emergency_contact?: string;
  date_of_birth?: string;
  gender?: string;
  city?: string;
  state?: string;
  country?: string;
  pincode?: string;
  avatar?: string;
  role?: 'STUDENT';
  is_active?: boolean;
  adhaar_num?: string;
  enrollment_number?: string;
  qualification?: string;
  guardian_name?: string;
  guardian_contact?: string;
  guardian_email?: string;
  guardian_relation?: string;
  mobile_number?: string;
  bio?: string;
  blood_group?: string;
  medical_conditions?: string;
  achievements?: any;
  documents?: any;
}

export interface Course {
  id: string;
  name: string;
  description?: string;
  duration: number;
  fees: number;
  subjects: string[];
  status: string;
  createdAt: string;
}

export interface CreateCourseData {
  name: string;
  description?: string;
  duration: number;
  fees: number;
  subjects: string[];
}

export interface Batch {
  id: string;
  name: string;
  timing: string;
  capacity: number;
  courseId: string;
  course?: Course;
  createdAt: string;
}

export interface CreateBatchData {
  name: string;
  timing: string;
  capacity: number;
  courseId: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

export interface CreateStaffData {
  email: string;
  name: string;
  phone?: string;
  role?: 'ADMIN' | 'TEACHER';
}

export interface User {
  user_id: number;
  email: string;
  full_name: string;
  phone_number?: string;
  avatar?: string;
  role: string;
  is_active: boolean;
  student_profile?: {
    batch?: {
      batch_name: string;
    };
    course?: {
      name: string;
    };
  };
}

export const adminService = {
  // Student Management
  getStudents: async (params: any = {}) => {
    return await apiClient.get('/admin/students', { params });
  },

  createStudent: async (data: CreateStudentData) => {
    return await apiClient.post('/admin/students', data);
  },

  updateStudent: async (id: string, data: Partial<CreateStudentData>) => {
    return await apiClient.put(`/admin/students/${id}`, data);
  },

  deleteStudent: async (id: string) => {
    return await apiClient.delete(`/admin/students/${id}`);
  },

  // Course Management
  getCourses: async () => {
    return await apiClient.get('/admin/courses');
  },

  createCourse: async (data: CreateCourseData) => {
    return await apiClient.post('/admin/courses', data);
  },

  updateCourse: async (id: string, data: Partial<CreateCourseData & { status: string }>) => {
    return await apiClient.put(`/admin/courses/${id}`, data);
  },

  deleteCourse: async (id: string) => {
    return await apiClient.delete(`/admin/courses/${id}`);
  },

  // Batch Management
  getBatches: async (params: any = {}) => {
    return await apiClient.get('/admin/batches', { params });
  },

  createBatch: async (data: CreateBatchData) => {
    return await apiClient.post('/admin/batches', data);
  },

  // Staff Management
  getStaff: async () => {
    return await apiClient.get('/admin/staff');
  },

  createStaff: async (data: CreateStaffData) => {
    return await apiClient.post('/admin/staff', data);
  },

  // Settings
  getAdminSettings: async () => {
    return await apiClient.get('/admin/settings');
  }
};
