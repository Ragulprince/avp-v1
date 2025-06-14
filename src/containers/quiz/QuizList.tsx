
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, BookOpen, Award, Play } from 'lucide-react';

interface Quiz {
  id: string;
  title: string;
  subject: string;
  difficulty: string;
  questions: number;
  duration: number;
  attempts: number;
  bestScore?: number;
}

interface QuizListProps {
  quizzes: Quiz[];
  category: string;
  onQuizSelect: (quizId: string) => void;
}

const QuizList: React.FC<QuizListProps> = ({ quizzes, category, onQuizSelect }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filterQuizzes = () => {
    if (category === 'all') return quizzes;
    if (category === 'mock') return quizzes.filter(q => q.title.includes('Mock'));
    if (category === 'daily') return quizzes.filter(q => q.title.includes('Daily'));
    if (category === 'subject') return quizzes.filter(q => !q.title.includes('Mock') && !q.title.includes('Daily'));
    return quizzes;
  };

  const filteredQuizzes = filterQuizzes();

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900">Available Tests</h3>
        <span className="text-sm text-gray-600">{filteredQuizzes.length} tests</span>
      </div>
      
      <div className="space-y-3">
        {filteredQuizzes.map((quiz) => (
          <Card key={quiz.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-2">{quiz.title}</h4>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="outline" className="text-xs">
                      {quiz.subject}
                    </Badge>
                    <Badge className={`text-xs ${getDifficultyColor(quiz.difficulty)}`}>
                      {quiz.difficulty}
                    </Badge>
                  </div>
                </div>
                <Button 
                  size="sm"
                  onClick={() => onQuizSelect(quiz.id)}
                  className="ml-4"
                >
                  <Play className="w-4 h-4 mr-1" />
                  {quiz.attempts > 0 ? 'Retry' : 'Start'}
                </Button>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center">
                  <BookOpen className="w-4 h-4 mr-1" />
                  {quiz.questions} Questions
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {quiz.duration} mins
                </span>
                {quiz.bestScore && (
                  <span className="flex items-center text-green-600">
                    <Award className="w-4 h-4 mr-1" />
                    Best: {quiz.bestScore}%
                  </span>
                )}
              </div>
              
              {quiz.attempts > 0 && (
                <div className="mt-2 text-xs text-gray-500">
                  Attempted {quiz.attempts} time{quiz.attempts > 1 ? 's' : ''}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default QuizList;
