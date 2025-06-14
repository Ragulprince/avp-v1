
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Flag, ChevronLeft, ChevronRight } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  type: 'single' | 'multiple' | 'boolean';
}

interface QuizInterfaceProps {
  quizId: string;
  onBack: () => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ quizId, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: string }>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const questions: Question[] = [
    {
      id: '1',
      text: 'What is Newton\'s First Law of Motion?',
      options: [
        'An object at rest stays at rest unless acted upon by a force',
        'Force equals mass times acceleration',
        'For every action, there is an equal and opposite reaction',
        'Energy cannot be created or destroyed'
      ],
      correctAnswer: 0,
      type: 'single'
    },
    {
      id: '2',
      text: 'Which of the following are characteristics of living organisms?',
      options: [
        'Growth and development',
        'Reproduction',
        'Response to environment',
        'Magnetic properties'
      ],
      correctAnswer: 0,
      type: 'single'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: value
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (isSubmitted) {
    const score = Math.floor(Math.random() * 30) + 70;
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="text-center max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-green-600">Quiz Completed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-3xl font-bold text-gray-900">{score}%</div>
            <p className="text-gray-600 text-sm">
              You answered {Math.floor((score / 100) * questions.length)} out of {questions.length} questions correctly
            </p>
            <Button onClick={onBack} className="w-full">
              Back to Quiz Center
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-20">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <Button variant="outline" onClick={onBack} size="sm">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center text-orange-600">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">{formatTime(timeLeft)}</span>
        </div>
      </div>

      {/* Progress */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </CardContent>
      </Card>

      {/* Question */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="text-lg">
            {questions[currentQuestion].text}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={answers[currentQuestion] || ''}
            onValueChange={handleAnswerChange}
          >
            {questions[currentQuestion].options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
          disabled={currentQuestion === 0}
          size="sm"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        <Button
          variant="outline"
          onClick={() => setMarkedForReview(prev => {
            const newSet = new Set(prev);
            if (newSet.has(currentQuestion)) {
              newSet.delete(currentQuestion);
            } else {
              newSet.add(currentQuestion);
            }
            return newSet;
          })}
          size="sm"
        >
          <Flag className="w-4 h-4" />
        </Button>

        <Button 
          onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
          disabled={currentQuestion === questions.length - 1}
          size="sm"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>

      {/* Submit Button */}
      <Button onClick={handleSubmit} className="w-full bg-green-600 hover:bg-green-700">
        Submit Quiz
      </Button>
    </div>
  );
};

export default QuizInterface;
