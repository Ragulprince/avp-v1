
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Flag, ChevronLeft, ChevronRight, Move } from 'lucide-react';
import QuizResults from './QuizResults';

interface Question {
  id: string;
  text: string;
  type: 'mcq' | 'true-false' | 'drag-drop' | 'match';
  options?: string[];
  correctAnswer: number | string | string[];
  dragItems?: string[];
  matchPairs?: { left: string; right: string }[];
}

interface EnhancedQuizInterfaceProps {
  quizId: string;
  onBack: () => void;
}

const EnhancedQuizInterface: React.FC<EnhancedQuizInterfaceProps> = ({ quizId, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(1800);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [draggedItems, setDraggedItems] = useState<{ [key: number]: string[] }>({});
  const [matchAnswers, setMatchAnswers] = useState<{ [key: number]: { [key: string]: string } }>({});

  const questions: Question[] = [
    {
      id: '1',
      text: 'What is Newton\'s First Law of Motion?',
      type: 'mcq',
      options: [
        'An object at rest stays at rest unless acted upon by a force',
        'Force equals mass times acceleration',
        'For every action, there is an equal and opposite reaction',
        'Energy cannot be created or destroyed'
      ],
      correctAnswer: 0
    },
    {
      id: '2',
      text: 'The Earth revolves around the Sun.',
      type: 'true-false',
      options: ['True', 'False'],
      correctAnswer: 0
    },
    {
      id: '3',
      text: 'Arrange the following planets in order from the Sun:',
      type: 'drag-drop',
      dragItems: ['Mars', 'Venus', 'Earth', 'Mercury'],
      correctAnswer: ['Mercury', 'Venus', 'Earth', 'Mars']
    },
    {
      id: '4',
      text: 'Match the scientists with their discoveries:',
      type: 'match',
      matchPairs: [
        { left: 'Newton', right: 'Laws of Motion' },
        { left: 'Einstein', right: 'Theory of Relativity' },
        { left: 'Darwin', right: 'Evolution' }
      ],
      correctAnswer: { 'Newton': 'Laws of Motion', 'Einstein': 'Theory of Relativity', 'Darwin': 'Evolution' }
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

  const handleDragStart = (e: React.DragEvent, item: string) => {
    e.dataTransfer.setData('text/plain', item);
  };

  const handleDrop = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    const item = e.dataTransfer.getData('text/plain');
    const newOrder = [...(draggedItems[currentQuestion] || [])];
    newOrder[index] = item;
    setDraggedItems(prev => ({
      ...prev,
      [currentQuestion]: newOrder
    }));
  };

  const handleMatchSelect = (left: string, right: string) => {
    setMatchAnswers(prev => ({
      ...prev,
      [currentQuestion]: {
        ...prev[currentQuestion],
        [left]: right
      }
    }));
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

  if (isSubmitted) {
    const correctAnswers = Math.floor(Math.random() * questions.length) + 1;
    return (
      <QuizResults
        score={Math.round((correctAnswers / questions.length) * 100)}
        totalQuestions={questions.length}
        timeSpent={1800 - timeLeft}
        correctAnswers={correctAnswers}
        onRetry={() => {
          setIsSubmitted(false);
          setCurrentQuestion(0);
          setAnswers({});
          setTimeLeft(1800);
        }}
        onBackToCenter={onBack}
      />
    );
  }

  const renderQuestion = () => {
    switch (currentQ.type) {
      case 'mcq':
        return (
          <RadioGroup
            value={answers[currentQuestion] || ''}
            onValueChange={handleAnswerChange}
          >
            {currentQ.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 text-sm">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'true-false':
        return (
          <RadioGroup
            value={answers[currentQuestion] || ''}
            onValueChange={handleAnswerChange}
          >
            {currentQ.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-4 border rounded-lg">
                <RadioGroupItem value={index.toString()} id={`tf-${index}`} />
                <Label htmlFor={`tf-${index}`} className="flex-1 text-lg font-medium">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case 'drag-drop':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Items to arrange:</h4>
                <div className="space-y-2">
                  {currentQ.dragItems?.map((item, index) => (
                    <div
                      key={index}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item)}
                      className="p-3 bg-blue-100 border border-blue-300 rounded-lg cursor-move flex items-center"
                    >
                      <Move className="w-4 h-4 mr-2" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Drop in correct order:</h4>
                <div className="space-y-2">
                  {[0, 1, 2, 3].map((index) => (
                    <div
                      key={index}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => handleDrop(e, index)}
                      className="p-3 border-2 border-dashed border-gray-300 rounded-lg min-h-[50px] flex items-center"
                    >
                      {draggedItems[currentQuestion]?.[index] || `Position ${index + 1}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'match':
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Scientists</h4>
              <div className="space-y-2">
                {currentQ.matchPairs?.map((pair, index) => (
                  <div key={index} className="p-3 bg-gray-100 rounded-lg">
                    {pair.left}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Discoveries</h4>
              <div className="space-y-2">
                {currentQ.matchPairs?.map((pair, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full justify-start p-3"
                    onClick={() => {
                      const selectedLeft = currentQ.matchPairs?.[0]?.left || '';
                      handleMatchSelect(selectedLeft, pair.right);
                    }}
                  >
                    {pair.right}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

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
            {currentQ.text}
          </CardTitle>
          <div className="text-sm text-gray-600 bg-blue-50 px-3 py-1 rounded-full inline-block">
            {currentQ.type.replace('-', ' ').toUpperCase()}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {renderQuestion()}
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

export default EnhancedQuizInterface;
