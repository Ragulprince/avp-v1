
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Trophy } from 'lucide-react';

const QuizHeader = () => {
  return (
    <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl font-bold flex items-center">
          <Target className="w-6 h-6 mr-2" />
          Practice Center
        </CardTitle>
        <p className="text-blue-100">Test your knowledge and track your progress</p>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="w-5 h-5 mr-2" />
            <span className="text-sm">Today's Goal: Complete 2 tests</span>
          </div>
          <div className="text-sm bg-white/20 px-3 py-1 rounded-full">
            Streak: 5 days
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizHeader;
