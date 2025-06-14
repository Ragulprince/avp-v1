
import React from 'react';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Target, Users } from 'lucide-react';

interface QuizCategoriesProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const QuizCategories: React.FC<QuizCategoriesProps> = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: 'All Tests', icon: BookOpen, count: 24 },
    { id: 'mock', label: 'Mock Exams', icon: Target, count: 8 },
    { id: 'daily', label: 'Daily Tests', icon: Clock, count: 12 },
    { id: 'subject', label: 'Subject Tests', icon: Users, count: 4 },
  ];

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
      <div className="grid grid-cols-2 gap-3">
        {categories.map((category) => {
          const Icon = category.icon;
          const isActive = activeCategory === category.id;
          
          return (
            <Button
              key={category.id}
              variant={isActive ? "default" : "outline"}
              onClick={() => onCategoryChange(category.id)}
              className={`flex flex-col h-auto p-4 ${
                isActive 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'hover:bg-gray-50'
              }`}
            >
              <Icon className={`w-6 h-6 mb-2 ${isActive ? 'text-white' : 'text-gray-600'}`} />
              <span className="font-medium text-sm">{category.label}</span>
              <span className={`text-xs ${isActive ? 'text-blue-100' : 'text-gray-500'}`}>
                {category.count} tests
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default QuizCategories;
