
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Trophy, Target, Clock, BookOpen, TrendingUp, Award, Star } from 'lucide-react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  timeSpent: number;
  correctAnswers: number;
  onRetry: () => void;
  onBackToCenter: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  timeSpent,
  correctAnswers,
  onRetry,
  onBackToCenter
}) => {
  const percentage = Math.round((correctAnswers / totalQuestions) * 100);
  const incorrectAnswers = totalQuestions - correctAnswers;
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Excellent! Outstanding performance!", color: "text-green-600", icon: Trophy };
    if (percentage >= 80) return { message: "Great job! You're doing well!", color: "text-blue-600", icon: Award };
    if (percentage >= 70) return { message: "Good work! Keep practicing!", color: "text-yellow-600", icon: Star };
    return { message: "Keep studying! You'll improve!", color: "text-orange-600", icon: Target };
  };

  const performance = getPerformanceMessage();
  const PerformanceIcon = performance.icon;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Main Results Card */}
        <Card className="text-center">
          <CardHeader className="pb-4">
            <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-blue-100 rounded-full">
              <PerformanceIcon className={`w-10 h-10 ${performance.color}`} />
            </div>
            <CardTitle className="text-2xl text-gray-900">Quiz Completed!</CardTitle>
            <p className={`text-lg ${performance.color} font-medium`}>
              {performance.message}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Circle */}
            <div className="relative w-32 h-32 mx-auto">
              <div className="w-full h-full rounded-full bg-gray-200 flex items-center justify-center">
                <div className="text-3xl font-bold text-gray-900">{percentage}%</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{correctAnswers}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{incorrectAnswers}</div>
                <div className="text-sm text-gray-600">Incorrect</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Performance Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Accuracy</span>
                <span className="font-medium">{percentage}%</span>
              </div>
              <Progress value={percentage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-500" />
                <div>
                  <div className="text-sm text-gray-600">Time Spent</div>
                  <div className="font-medium">{Math.floor(timeSpent / 60)}m {timeSpent % 60}s</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Target className="w-5 h-5 text-purple-500" />
                <div>
                  <div className="text-sm text-gray-600">Questions</div>
                  <div className="font-medium">{totalQuestions} total</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject-wise Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Subject Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {['Physics', 'Chemistry', 'Biology'].map((subject) => {
                const subjectScore = Math.floor(Math.random() * 40) + 60;
                return (
                  <div key={subject} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{subject}</span>
                      <span className="text-sm text-gray-600">{subjectScore}%</span>
                    </div>
                    <Progress value={subjectScore} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900">Strong Areas</h4>
                <p className="text-sm text-blue-700">Great performance in Physics concepts!</p>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <h4 className="font-medium text-orange-900">Areas for Improvement</h4>
                <p className="text-sm text-orange-700">Focus more on Chemistry organic reactions.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onRetry} variant="outline" className="flex-1">
            Retry Quiz
          </Button>
          <Button onClick={onBackToCenter} className="flex-1">
            Back to Quiz Center
          </Button>
        </div>
      </div>
    </div>
  );
};

export default QuizResults;
