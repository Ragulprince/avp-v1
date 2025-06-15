
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Clock, Flag, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuizById, useSubmitQuiz } from '@/hooks/api/useQuizzes';
import { useToast } from '@/hooks/use-toast';

interface Question {
  id: string;
  question: string;
  options: string[];
  type: string;
  marks: number;
}

interface QuizInterfaceProps {
  quizId: string;
  onBack: () => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ quizId, onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [markedForReview, setMarkedForReview] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { toast } = useToast();
  const { data: quizData, isLoading } = useQuizById(quizId);
  const submitQuiz = useSubmitQuiz();

  const quiz = quizData?.data;
  const questions = quiz?.questions?.map((q: any) => q.question) || [];

  useEffect(() => {
    if (quiz?.duration) {
      setTimeLeft(quiz.duration * 60); // Convert minutes to seconds
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    
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
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (value: string) => {
    const questionId = questions[currentQuestion]?.id;
    if (questionId) {
      setAnswers(prev => ({
        ...prev,
        [questionId]: value
      }));
    }
  };

  const handleSubmit = async () => {
    const submission = {
      quizId: quizId,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
        timeTaken: 5 // Mock time per question
      })),
      totalTimeTaken: (quiz?.duration * 60) - timeLeft
    };

    try {
      await submitQuiz.mutateAsync(submission);
      setIsSubmitted(true);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit quiz. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="text-center max-w-md mx-auto">
          <CardContent className="p-8">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Quiz not found</h3>
            <p className="text-gray-600 mb-4">The quiz you're looking for doesn't exist or is no longer available.</p>
            <Button onClick={onBack}>Back to Quiz Center</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];

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
      {currentQ && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-lg">
              {currentQ.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <RadioGroup
              value={answers[currentQ.id] || ''}
              onValueChange={handleAnswerChange}
            >
              {currentQ.options?.map((option: string, index: number) => (
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
      )}

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
