
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, BookOpen, Award, Play } from 'lucide-react';

const QuickStats = () => {
  const stats = [
    { icon: Clock, value: '24h', label: 'Study Time', color: 'text-blue-500' },
    { icon: BookOpen, value: '12', label: 'Videos Watched', color: 'text-green-500' },
    { icon: Award, value: '85%', label: 'Avg Score', color: 'text-yellow-500' },
    { icon: Play, value: '8', label: 'Tests Taken', color: 'text-purple-500' }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index}>
            <CardContent className="p-4 text-center">
              <Icon className={`w-6 h-6 lg:w-8 lg:h-8 ${stat.color} mx-auto mb-2`} />
              <p className="text-xl lg:text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs lg:text-sm text-gray-600">{stat.label}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default QuickStats;
