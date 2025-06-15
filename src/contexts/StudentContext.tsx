
import React, { createContext, useContext, ReactNode } from 'react';
import { useProfile } from '@/hooks/api/useAuth';

interface StudentContextType {
  student: {
    id: string;
    name: string;
    email: string;
    batch: string;
    avatar?: string;
  };
  isLoading: boolean;
}

const StudentContext = createContext<StudentContextType | undefined>(undefined);

export const useStudent = () => {
  const context = useContext(StudentContext);
  if (!context) {
    throw new Error('useStudent must be used within a StudentProvider');
  }
  return context;
};

interface StudentProviderProps {
  children: ReactNode;
}

export const StudentProvider: React.FC<StudentProviderProps> = ({ children }) => {
  const { data: profileData, isLoading } = useProfile();
  
  const student = {
    id: profileData?.data?.id || '',
    name: profileData?.data?.name || 'Student',
    email: profileData?.data?.email || '',
    batch: profileData?.data?.studentProfile?.batch?.name || 'NEET 2025',
    avatar: profileData?.data?.avatar,
  };

  return (
    <StudentContext.Provider value={{ student, isLoading }}>
      {children}
    </StudentContext.Provider>
  );
};
