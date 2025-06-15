
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Clock, BookOpen, Award, TrendingUp, Target } from 'lucide-react';
import QuizInterface from './QuizInterface';
import { useQuizzes, useQuizAttempts } from '@/hooks/api/useQuizzes';

const QuizCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

  const { data: quizzesData, isLoading: quizzesLoading } = useQuizzes({
    subject: selectedCategory === 'all' ? undefined : selectedCategory,
  });
  
  const { data: attemptsData } = useQuizAttempts();

  const quizzes = quizzesData?.data || [];
  const attempts = attemptsData?.data || [];

  const categories = [
    { id: 'all', name: 'All Tests', count: quizzes.length },
    { id: 'physics', name: 'Physics', count: quizzes.filter((q: any) => q.subject === 'Physics').length },
    { id: 'chemistry', name: 'Chemistry', count: quizzes.filter((q: any) => q.subject === 'Chemistry').length },
    { id: 'biology', name: 'Biology', count: quizzes.filter((q: any) => q.subject === 'Biology').length },
  ];

  if (selectedQuiz) {
    return <QuizInterface quizId={selectedQuiz} onBack={() => setSelectedQuiz(null)} />;
  }

  const handleQuizSelect = (quizId: string) => {
    setSelectedQuiz(quizId);
  };

  const getQuizProgress = (quizId: string) => {
    const attempt = attempts.find((a: any) => a.quizId === quizId);
    return attempt ? attempt.score : 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quiz Center</h1>
        <p className="text-gray-600">Test your knowledge and track your progress</p>
      </div>

      {/* Performance Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">{attempts.length}</p>
            <p className="text-sm text-gray-600">Tests Taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {attempts.length > 0 ? Math.round(attempts.reduce((acc: number, curr: any) => acc + curr.score, 0) / attempts.length) : 0}%
            </p>
            <p className="text-sm text-gray-600">Avg Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">
              {attempts.length > 0 ? Math.max(...attempts.map((a: any) => a.score)) : 0}%
            </p>
            <p className="text-sm text-gray-600">Best Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">7</p>
            <p className="text-sm text-gray-600">Day Streak</p>
          </CardContent>
        </Card>
      </div>

      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(category.id)}
            className="whitespace-nowrap"
          >
            {category.name} ({category.count})
          </Button>
        ))}
      </div>

      {/* Quiz List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Available Tests</h3>
          <span className="text-sm text-gray-600">
            {quizzes.filter((q: any) => selectedCategory === 'all' || q.subject.toLowerCase() === selectedCategory).length} tests
          </span>
        </div>
        
        {quizzesLoading ? (
          <div className="text-center py-8">Loading quizzes...</div>
        ) : (
          <div className="space-y-3">
            {quizzes
              .filter((quiz: any) => selectedCategory === 'all' || quiz.subject.toLowerCase() === selectedCategory)
              .map((quiz: any) => (
                <Card key={quiz.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{quiz.title}</h4>
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {quiz.subject}
                          </Badge>
                          <Badge className="text-xs bg-blue-100 text-blue-800">
                            {quiz.difficulty || 'Medium'}
                          </Badge>
                        </div>
                        {quiz.description && (
                          <p className="text-sm text-gray-600 mb-3">{quiz.description}</p>
                        )}
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => handleQuizSelect(quiz.id)}
                        className="ml-4"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        {getQuizProgress(quiz.id) > 0 ? 'Retry' : 'Start'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <span className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-1" />
                        {quiz.totalQuestions || 20} Questions
                      </span>
                      <span className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {quiz.duration || 30} mins
                      </span>
                      <span className="flex items-center">
                        <Award className="w-4 h-4 mr-1" />
                        {quiz.totalMarks || 100} marks
                      </span>
                    </div>
                    
                    {getQuizProgress(quiz.id) > 0 && (
                      <div className="mt-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Previous Score</span>
                          <span className="font-medium">{getQuizProgress(quiz.id)}%</span>
                        </div>
                        <Progress value={getQuizProgress(quiz.id)} className="h-2" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizCenter;
