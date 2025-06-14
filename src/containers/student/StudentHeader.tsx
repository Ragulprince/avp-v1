
import React from 'react';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import LanguageSelector from '@/components/common/LanguageSelector';

interface Student {
  name: string;
  batch: string;
}

interface StudentHeaderProps {
  student: Student;
}

const StudentHeader: React.FC<StudentHeaderProps> = ({ student }) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Hi {student.name} 👋
        </h1>
        <p className="text-gray-600 text-sm lg:text-base">{student.batch}</p>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            3
          </span>
        </Button>
        <LanguageSelector />
      </div>
    </div>
  );
};

export default StudentHeader;
