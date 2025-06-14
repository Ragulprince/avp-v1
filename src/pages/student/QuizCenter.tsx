
import React, { useState } from 'react';
import { useStudent } from '@/contexts/StudentContext';
import QuizHeader from '@/containers/quiz/QuizHeader';
import QuizCategories from '@/containers/quiz/QuizCategories';
import QuizList from '@/containers/quiz/QuizList';
import QuizInterface from '@/containers/quiz/QuizInterface';
import BottomNavigation from '@/components/common/BottomNavigation';

interface QuizCenterProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const QuizCenter: React.FC<QuizCenterProps> = ({ activeTab, onTabChange }) => {
  const { quizzes } = useStudent();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  if (selectedQuiz) {
    return (
      <QuizInterface
        quizId={selectedQuiz}
        onBack={() => setSelectedQuiz(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <QuizHeader />
      <div className="p-4 space-y-6">
        <QuizCategories activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
        <QuizList 
          quizzes={quizzes} 
          category={activeCategory}
          onQuizSelect={setSelectedQuiz}
        />
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default QuizCenter;
