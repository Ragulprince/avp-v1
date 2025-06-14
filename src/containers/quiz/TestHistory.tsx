
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, Calendar, Target, TrendingUp, RotateCcw, Eye } from 'lucide-react';

interface TestHistoryEntry {
  id: string;
  title: string;
  subject: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: string;
  date: string;
  rank: number;
  totalParticipants: number;
  status: 'completed' | 'ongoing' | 'missed';
}

interface TestHistoryProps {
  entries: TestHistoryEntry[];
  onRetakeTest: (testId: string) => void;
  onViewDetails: (testId: string) => void;
}

const TestHistory: React.FC<TestHistoryProps> = ({ entries, onRetakeTest, onViewDetails }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-blue-100 text-blue-800';
      case 'missed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Test History</h2>
        <Badge variant="outline">{entries.length} Tests</Badge>
      </div>

      <div className="grid gap-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900 mb-1 sm:mb-0">{entry.title}</h3>
                    <Badge className={getStatusColor(entry.status)} variant="secondary">
                      {entry.status}
                    </Badge>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-3">
                    <Badge variant="outline" className="text-xs">{entry.subject}</Badge>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {entry.date}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {entry.timeSpent}
                    </div>
                  </div>

                  {entry.status === 'completed' && (
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className={`text-2xl font-bold ${getScoreColor(entry.score)}`}>
                              {entry.score}%
                            </div>
                            <div className="text-xs text-gray-600">Score</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-gray-900">
                              {entry.correctAnswers}/{entry.totalQuestions}
                            </div>
                            <div className="text-xs text-gray-600">Correct</div>
                          </div>
                          <div className="text-center">
                            <div className="text-lg font-semibold text-blue-600">
                              #{entry.rank}
                            </div>
                            <div className="text-xs text-gray-600">Rank</div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>Performance</span>
                          <span>{entry.score}%</span>
                        </div>
                        <Progress value={entry.score} className="h-2" />
                      </div>

                      <div className="text-sm text-gray-600">
                        Ranked {entry.rank} out of {entry.totalParticipants} participants
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-2 md:flex-col">
                  {entry.status === 'completed' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onViewDetails(entry.id)}
                        className="flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onRetakeTest(entry.id)}
                        className="flex items-center gap-2"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Retake
                      </Button>
                    </>
                  )}
                  {entry.status === 'missed' && (
                    <Button
                      size="sm"
                      onClick={() => onRetakeTest(entry.id)}
                      className="flex items-center gap-2"
                    >
                      <Target className="w-4 h-4" />
                      Take Now
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {entries.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tests taken yet</h3>
            <p className="text-gray-600">Start taking tests to see your history here.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestHistory;
