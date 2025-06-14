
import React, { useState } from 'react';
import { useStudent } from '@/contexts/StudentContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Award, BookOpen, Play, Target } from 'lucide-react';
import QuizInterface from './QuizInterface';

const QuizCenter = () => {
  const { quizzes } = useStudent();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);

  if (selectedQuiz) {
    return <QuizInterface quizId={selectedQuiz} onBack={() => setSelectedQuiz(null)} />;
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const mockTests = quizzes.filter(q => q.title.includes('Mock'));
  const dailyTests = quizzes.filter(q => q.title.includes('Daily'));
  const subjectTests = quizzes.filter(q => !q.title.includes('Mock') && !q.title.includes('Daily'));

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Practice Center</h1>
        <p className="text-gray-600">Test your knowledge and track your progress</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">28</p>
            <p className="text-sm text-gray-600">Tests Taken</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Award className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">85%</p>
            <p className="text-sm text-gray-600">Avg Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">#42</p>
            <p className="text-sm text-gray-600">Rank</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <p className="text-2xl font-bold text-gray-900">45h</p>
            <p className="text-sm text-gray-600">Practice Time</p>
          </CardContent>
        </Card>
      </div>

      {/* Quiz Categories */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All Tests</TabsTrigger>
          <TabsTrigger value="mock">Mock Exams</TabsTrigger>
          <TabsTrigger value="daily">Daily Tests</TabsTrigger>
          <TabsTrigger value="subject">Subject Tests</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4">
            {quizzes.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{quiz.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{quiz.subject}</Badge>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
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
                    </div>
                    <Button onClick={() => setSelectedQuiz(quiz.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      {quiz.attempts > 0 ? 'Retry' : 'Start'}
                    </Button>
                  </div>
                  {quiz.attempts > 0 && (
                    <div className="text-sm text-gray-600">
                      Attempted {quiz.attempts} time{quiz.attempts > 1 ? 's' : ''}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="mock" className="space-y-4">
          <div className="grid gap-4">
            {mockTests.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{quiz.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{quiz.subject}</Badge>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{quiz.questions} Questions</span>
                        <span>{quiz.duration} mins</span>
                      </div>
                    </div>
                    <Button onClick={() => setSelectedQuiz(quiz.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="daily" className="space-y-4">
          <div className="grid gap-4">
            {dailyTests.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{quiz.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{quiz.subject}</Badge>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{quiz.questions} Questions</span>
                        <span>{quiz.duration} mins</span>
                      </div>
                    </div>
                    <Button onClick={() => setSelectedQuiz(quiz.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="subject" className="space-y-4">
          <div className="grid gap-4">
            {subjectTests.map((quiz) => (
              <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{quiz.title}</h3>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline">{quiz.subject}</Badge>
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{quiz.questions} Questions</span>
                        <span>{quiz.duration} mins</span>
                      </div>
                    </div>
                    <Button onClick={() => setSelectedQuiz(quiz.id)}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Test
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuizCenter;
