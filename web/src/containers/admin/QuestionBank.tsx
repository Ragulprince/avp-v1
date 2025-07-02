import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Trash2, HelpCircle, FileText, Upload, Download, GripVertical, X, BookOpen } from 'lucide-react';
import { useQuestions } from '@/hooks/api/useQuestionBank';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { questionBankService, CreateQuestionData } from '@/services/questionBank';
import { useSubjects } from '@/hooks/api/useSubjects';

type MatchPair = {
  left: string;
  right: string;
  order: number;
};

const QuestionBank = () => {
  const { toast } = useToast();
  const { data: questionsResponse, isLoading } = useQuestions();
  const { data: subjectsResponse } = useSubjects();
  const queryClient = useQueryClient();
  
  const questions = questionsResponse?.data || [];
  const subjects = subjectsResponse || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState<any>(null);
  
  const questionTypes = ['MCQ', 'FILL_IN_THE_BLANK', 'TRUE_FALSE', 'MATCH', 'CHOICE_BASED'];
  const difficulties = ['EASY', 'MEDIUM', 'HARD'];

  const [newQuestion, setNewQuestion] = useState({
    question_text: '',
    question_image: '',
    type: 'MCQ' as string,
    subject_id: '',
    topic: '',
    difficulty: 'MEDIUM' as const,
    options: ['', '', '', ''],
    correct_answer: '',
    explanation: '',
    marks: 1,
    optionImages: ['', '', '', ''] as string[],
    numOptions: 4,
    matchPairs: [
      { left: '', right: '', order: 1 },
      { left: '', right: '', order: 2 },
    ] as MatchPair[],
  });

  const createQuestionMutation = useMutation({
    mutationFn: async (data: CreateQuestionData) => {
      return questionBankService.createQuestion(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Success', description: 'Question added successfully' });
      setNewQuestion({
        question_text: '',
        question_image: '',
        type: 'MCQ',
        subject_id: '',
        topic: '',
        difficulty: 'MEDIUM',
        options: ['', '', '', ''],
        correct_answer: '',
        explanation: '',
        marks: 1,
        optionImages: ['', '', '', ''],
        numOptions: 4,
        matchPairs: [
          { left: '', right: '', order: 1 },
          { left: '', right: '', order: 2 },
        ]
      });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to add question', variant: 'destructive' });
    },
  });

  const editQuestionMutation = useMutation({
    mutationFn: async (data: { id: string; values: Partial<CreateQuestionData> }) => {
      return questionBankService.updateQuestion(data.id, data.values);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      setSelectedQuestion(null);
      toast({ title: 'Success', description: 'Question updated successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update question', variant: 'destructive' });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: async (id: string) => {
      return questionBankService.deleteQuestion(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['questions'] });
      toast({ title: 'Success', description: 'Question deleted successfully' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete question', variant: 'destructive' });
    },
  });

  const filteredQuestions = questions.filter(question => {
    const [questionText] = question.question_text.split('_!_!_');
    const matchesSearch =
      (questionText && questionText.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (question.topic && question.topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = !selectedSubject || question.subject_id === selectedSubject;
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;
    const matchesType = !selectedType || question.type === selectedType;
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
  });

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text || !newQuestion.subject_id || !newQuestion.correct_answer) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive'
      });
      return;
    }

    if (newQuestion.type === 'MCQ' && newQuestion.options.some(opt => !opt.trim())) {
      toast({
        title: 'Error',
        description: 'Please fill all MCQ options',
        variant: 'destructive'
      });
      return;
    }

    if (newQuestion.type === 'MATCH' && newQuestion.matchPairs.some(pair => !pair.left.trim() || !pair.right.trim())) {
      toast({
        title: 'Error',
        description: 'Please fill all match pairs',
        variant: 'destructive'
      });
      return;
    }

    try {
      const questionText = newQuestion.question_image 
        ? `${newQuestion.question_text}_!_!_${newQuestion.question_image}`
        : newQuestion.question_text;

      const questionData: CreateQuestionData = {
        question_text: questionText,
        type: newQuestion.type as 'MCQ' | 'FILL_IN_THE_BLANK' | 'TRUE_FALSE' | 'MATCH' | 'CHOICE_BASED',
        subject_id: newQuestion.subject_id,
        topic: newQuestion.topic,
        difficulty: newQuestion.difficulty,
        options: newQuestion.type === 'MCQ'
          ? newQuestion.options.slice(0, newQuestion.numOptions).map((option, index) => {
              const image = newQuestion.optionImages[index];
              return image ? `${option}_!_!_${image}` : option;
            })
          : undefined,
        correct_answer: newQuestion.correct_answer.split('_!_!_')[0],
        explanation: newQuestion.explanation || undefined,
        marks: newQuestion.marks,
      };
      
      await createQuestionMutation.mutateAsync(questionData);
    } catch (error) {
      console.error('Failed to create question:', error);
    }
  };

  const openEditQuestion = (question: any) => {
    const [questionText, questionImage] = question.question_text.split('_!_!_');
    const options = question.options ? [...question.options] : ['', '', '', ''];
    const optionImages = ['', '', '', ''];
    if (question.type === 'MCQ' && question.options) {
      question.options.forEach((opt: string, index: number) => {
        const [text, image] = opt.split('_!_!_');
        options[index] = text || opt;
        optionImages[index] = image || '';
      });
    }
    
    setSelectedQuestion({
      question_id: question.question_id,
      question_text: questionText || '',
      question_image: questionImage || '',
      type: question.type || 'MCQ',
      subject_id: question.subject_id || '',
      topic: question.topic || '',
      difficulty: question.difficulty || 'MEDIUM',
      options,
      correct_answer: question.correct_answer || '',
      explanation: question.explanation || '',
      marks: question.marks || 1,
      optionImages,
      numOptions: question.options?.length || 4,
      matchPairs: question.matchPairs?.length ? question.matchPairs : [
        { left: '', right: '', order: 1 },
        { left: '', right: '', order: 2 },
      ]
    });
  };

  const handleEditQuestion = async () => {
    if (!selectedQuestion) return;
    
    const questionText = selectedQuestion.question_image 
      ? `${selectedQuestion.question_text}_!_!_${selectedQuestion.question_image}`
      : selectedQuestion.question_text;

    const questionData: Partial<CreateQuestionData> = {
      question_text: questionText,
      type: selectedQuestion.type as 'MCQ' | 'FILL_IN_THE_BLANK' | 'TRUE_FALSE' | 'MATCH' | 'CHOICE_BASED',
      subject_id: selectedQuestion.subject_id,
      topic: selectedQuestion.topic,
      difficulty: selectedQuestion.difficulty,
      options: selectedQuestion.type === 'MCQ'
        ? selectedQuestion.options.slice(0, selectedQuestion.numOptions).map((option, index) => {
            const image = selectedQuestion.optionImages[index];
            return image ? `${option}_!_!_${image}` : option;
          })
        : undefined,
      correct_answer: selectedQuestion.correct_answer,
      explanation: selectedQuestion.explanation || undefined,
      marks: selectedQuestion.marks,
    };

    await editQuestionMutation.mutateAsync({ id: selectedQuestion.question_id, values: questionData });
  };

  const handleDeleteQuestion = async (id: string) => {
    await deleteQuestionMutation.mutateAsync(id);
  };

  const handleImageUpload = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (selectedQuestion) {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const newOptionImages = [...selectedQuestion.optionImages];
          newOptionImages[index] = reader.result as string;
          setSelectedQuestion({...selectedQuestion, optionImages: newOptionImages});
        };
        reader.readAsDataURL(file);
      }
    } else {
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          const newOptionImages = [...newQuestion.optionImages];
          newOptionImages[index] = reader.result as string;
          setNewQuestion({...newQuestion, optionImages: newOptionImages});
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleQuestionImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (selectedQuestion) {
          setSelectedQuestion({...selectedQuestion, question_image: reader.result as string});
        } else {
          setNewQuestion({...newQuestion, question_image: reader.result as string});
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleMatchPairChange = (index: number, field: 'left' | 'right', value: string) => {
    if (selectedQuestion) {
      const newPairs = [...selectedQuestion.matchPairs];
      newPairs[index][field] = value;
      setSelectedQuestion({ ...selectedQuestion, matchPairs: newPairs });
    } else {
      const newPairs = [...newQuestion.matchPairs];
      newPairs[index][field] = value;
      setNewQuestion({ ...newQuestion, matchPairs: newPairs });
    }
  };

  const addMatchPair = () => {
    if (selectedQuestion) {
      if (selectedQuestion.matchPairs.length < 4) {
        setSelectedQuestion({
          ...selectedQuestion,
          matchPairs: [
            ...selectedQuestion.matchPairs,
            { left: '', right: '', order: selectedQuestion.matchPairs.length + 1 },
          ],
        });
      }
    } else {
      if (newQuestion.matchPairs.length < 4) {
        setNewQuestion({
          ...newQuestion,
          matchPairs: [
            ...newQuestion.matchPairs,
            { left: '', right: '', order: newQuestion.matchPairs.length + 1 },
          ],
        });
      }
    }
  };

  const removeMatchPair = (index: number) => {
    if (selectedQuestion) {
      if (selectedQuestion.matchPairs.length > 2) {
        const newPairs = selectedQuestion.matchPairs.filter((_, i) => i !== index);
        setSelectedQuestion({ ...selectedQuestion, matchPairs: newPairs });
      }
    } else {
      if (newQuestion.matchPairs.length > 2) {
        const newPairs = newQuestion.matchPairs.filter((_, i) => i !== index);
        setNewQuestion({ ...newQuestion, matchPairs: newPairs });
      }
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow- Sink';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MCQ': return 'bg-blue-100 text-blue-800';
      case 'FILL_IN_THE_BLANK': return 'bg-purple-100 text-purple-800';
      case 'TRUE_FALSE': return 'bg-green-100 text-green-800';
      case 'MATCH': return 'bg-orange-100 text-orange-800';
      case 'CHOICE_BASED': return 'bg-teal-100 text-teal-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6 bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Question Bank
            </h1>
            <p className="text-gray-600 mt-2">Manage questions for tests and quizzes</p>
          </div>
          <div className="flex gap-3">
          <div className="bg-blue-100 p-4 rounded-lg text-center">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-blue-800">{questions.length} Questions</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="manage" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-white shadow-md">
          <TabsTrigger value="create" className="data-[state=active]:bg-emerald-500 data-[state=active]:text-white">Create Question</TabsTrigger>
          <TabsTrigger value="manage" className="data-[state=active]:bg-teal-500 data-[state=active]:text-white">Manage Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-emerald-100">
            <CardHeader className="bg-emerald-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Question
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="subject_id" className="text-emerald-700 font-medium">Subject *</Label>
                  <Select value={newQuestion.subject_id} onValueChange={(value) => setNewQuestion({...newQuestion, subject_id: value})}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.filter(Boolean).map((subject_id) => (
                        <SelectItem key={subject_id.subject_id} value={subject_id.subject_id}>
                          {subject_id.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="topic" className="text-emerald-700 font-medium">Topic</Label>
                  <Input
                    id="topic"
                    value={newQuestion.topic}
                    onChange={(e) => setNewQuestion({...newQuestion, topic: e.target.value})}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="type" className="text-emerald-700 font-medium">Question Type *</Label>
                  <Select value={newQuestion.type} onValueChange={(value: any) => setNewQuestion({...newQuestion, type: value})}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {questionTypes.filter(Boolean).map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty" className="text-emerald-700 font-medium">Difficulty *</Label>
                  <Select value={newQuestion.difficulty} onValueChange={(value: any) => setNewQuestion({...newQuestion, difficulty: value})}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.filter(Boolean).map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="question" className="text-emerald-700 font-medium">Question *</Label>
                <Textarea
                  id="question"
                  value={newQuestion.question_text}
                  onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
                  placeholder="Enter your question..."
                  rows={3}
                  className="border-emerald-200 focus:border-emerald-500"
                />
                <div className="mt-2 flex items-center space-x-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleQuestionImageUpload}
                    className="text-sm border-emerald-200"
                  />
                  {newQuestion.question_image && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setNewQuestion({...newQuestion, question_image: ''})}
                      className="text-red-600 hover:bg-red-50"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                {newQuestion.question_image && (
                  <div className="mt-2">
                    <img
                      src={newQuestion.question_image}
                      alt="Question preview"
                      className="max-w-[200px] max-h-[200px] object-contain rounded-lg border border-emerald-200"
                    />
                  </div>
                )}
              </div>
              {newQuestion.type === 'MCQ' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-emerald-700 font-medium">Options * (2-5)</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (newQuestion.numOptions < 5) {
                            setNewQuestion({
                              ...newQuestion,
                              numOptions: newQuestion.numOptions + 1,
                              options: [...newQuestion.options, ''],
                              optionImages: [...newQuestion.optionImages, '']
                            });
                          }
                        }}
                        disabled={newQuestion.numOptions >= 5}
                        className="text-emerald-600 border-emerald-300"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (newQuestion.numOptions > 2) {
                            setNewQuestion({
                              ...newQuestion,
                              numOptions: newQuestion.numOptions - 1,
                              options: newQuestion.options.slice(0, -1),
                              optionImages: newQuestion.optionImages.slice(0, -1)
                            });
                          }
                        }}
                        disabled={newQuestion.numOptions <= 2}
                        className="text-red-600 border-red-300"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {newQuestion.options.slice(0, newQuestion.numOptions).map((option, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="flex-1 flex items-center space-x-2">
                          <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-medium text-sm">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <div className="flex-1 space-y-2">
                            <Input
                              value={option}
                              onChange={(e) => {
                                const newOptions = [...newQuestion.options];
                                newOptions[index] = e.target.value;
                                setNewQuestion({...newQuestion, options: newOptions});
                              }}
                              placeholder={`Option ${String.fromCharCode(65 + index)}`}
                              className="border-emerald-200 focus:border-emerald-500"
                            />
                            <div className="flex items-center space-x-2">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={(e) => handleImageUpload(index, e)}
                                className="text-sm border-emerald-200"
                              />
                              {newQuestion.optionImages[index] && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    const newOptionImages = [...newQuestion.optionImages];
                                    newOptionImages[index] = '';
                                    setNewQuestion({...newQuestion, optionImages: newOptionImages});
                                  }}
                                  className="text-red-600 hover:bg-red-50"
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                            {newQuestion.optionImages[index] && (
                              <div className="mt-2">
                                <img
                                  src={newQuestion.optionImages[index]}
                                  alt={`Option ${String.fromCharCode(65 + index)} preview`}
                                  className="max-w-[100px] max-h-[100px] object-contain rounded-lg border border-emerald-200"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                        <Button
                          variant={newQuestion.correct_answer === option ? "default" : "outline"}
                          onClick={() => setNewQuestion({...newQuestion, correct_answer: option})}
                          size="sm"
                          className={newQuestion.correct_answer === option ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}
                        >
                          Correct
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {newQuestion.type === 'TRUE_FALSE' && (
                <div className="space-y-3">
                  <Label className="text-emerald-700 font-medium">Correct Answer *</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={newQuestion.correct_answer === 'true' ? "default" : "outline"}
                      onClick={() => setNewQuestion({...newQuestion, correct_answer: 'true'})}
                      className={newQuestion.correct_answer === 'true' ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}
                    >
                      True
                    </Button>
                    <Button
                      variant={newQuestion.correct_answer === 'false' ? "default" : "outline"}
                      onClick={() => setNewQuestion({...newQuestion, correct_answer: 'false'})}
                      className={newQuestion.correct_answer === 'false' ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}
                    >
                      False
                    </Button>
                  </div>
                </div>
              )}
              {newQuestion.type === 'MATCH' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-emerald-700 font-medium">Matching Pairs * (2-4)</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addMatchPair}
                        disabled={newQuestion.matchPairs.length >= 4}
                        className="text-emerald-600 border-emerald-300"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Pair
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMatchPair(newQuestion.matchPairs.length - 1)}
                        disabled={newQuestion.matchPairs.length <= 2}
                        className="text-red-600 border-red-300"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove Pair
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {newQuestion.matchPairs.map((pair, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-emerald-200 rounded-lg">
                        <div>
                          <Label className="text-sm text-emerald-600">Left Item {index + 1}</Label>
                          <Input
                            value={pair.left}
                            onChange={(e) => handleMatchPairChange(index, 'left', e.target.value)}
                            placeholder="Enter left item"
                            className="border-emerald-200 focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <Label className="text-sm text-emerald-600">Right Item {index + 1}</Label>
                            <Input
                              value={pair.right}
                              onChange={(e) => handleMatchPairChange(index, 'right', e.target.value)}
                              placeholder="Enter right item"
                              className="border-emerald-200 focus:border-emerald-500"
                            />
                          </div>
                          {newQuestion.matchPairs.length > 2 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMatchPair(index)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {newQuestion.type === 'FILL_IN_THE_BLANK' && (
                <div className="space-y-4">
                  <Label className="text-emerald-700 font-medium">Correct Answer *</Label>
                  <Input
                    value={newQuestion.correct_answer}
                    onChange={(e) => setNewQuestion({...newQuestion, correct_answer: e.target.value})}
                    placeholder="Enter correct answer for blank"
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="marks" className="text-emerald-700 font-medium">Marks</Label>
                  <Input
                    id="marks"
                    type="number"
                    value={newQuestion.marks}
                    onChange={(e) => setNewQuestion({...newQuestion, marks: parseInt(e.target.value)})}
                    min="1"
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="explanation" className="text-emerald-700 font-medium">Explanation</Label>
                  <Textarea
                    id="explanation"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                    placeholder="Explain why this is the correct answer..."
                    rows={3}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              </div>
              <Button 
                onClick={handleAddQuestion} 
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={createQuestionMutation.isPending}
              >
                <Plus className="w-4 h-4 mr-2" />
                {createQuestionMutation.isPending ? 'Creating...' : 'Create Question'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          <Card className="shadow-lg border-0">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-emerald-200 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-[140px] border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="All subjects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All subjects</SelectItem>
                      {subjects.map((subject_id) => (
                        <SelectItem key={subject_id.subject_id} value={subject_id.subject_id}>
                          {subject_id.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                    <SelectTrigger className="w-[140px] border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="All difficulties" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All difficulties</SelectItem>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="w-[140px] border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="All types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All types</SelectItem>
                      {questionTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type.replace('_', ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" onClick={() => {
                    setSearchTerm('');
                    setSelectedSubject('');
                    setSelectedDifficulty('');
                    setSelectedType('');
                  }} className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                    Clear Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredQuestions.map((question) => {
              const [questionText, questionImage] = question.question_text.split('_!_!_');
              return (
                <Card key={question.question_id || questionText} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 mb-3 text-lg">{questionText}</p>
                        {questionImage && (
                          <div className="mb-3">
                            <img
                              src={questionImage}
                              alt="Question preview"
                              className="max-w-[200px] max-h-[200px] object-contain rounded-lg border border-emerald-200"
                            />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge className={getTypeColor(question.type)}>
                            {question.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                          <Badge variant="outline">{subjects.find(subject => subject.subject_id === question.subject_id)?.name || ''}</Badge>
                          {question.topic && (
                            <Badge variant="outline">{question.topic}</Badge>
                          )}
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty.toUpperCase()}
                          </Badge>
                          <Badge variant="outline">
                            {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-blue-600 hover:bg-blue-50"
                          onClick={() => openEditQuestion(question)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteQuestion(question.question_id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {question.type === 'MCQ' && Array.isArray(question.options) && question.options.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.options.map((option, index) => {
                            const [optionText, optionImage] = option.split('_!_!_');
                            return (
                              <div key={index} className={`p-2 rounded text-sm ${optionText === question.correct_answer ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-50'}`}>
                                <div className="flex items-center">
                                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                                  <span>{optionText}</span>
                                </div>
                                {optionImage && (
                                  <div className="mt-2">
                                    <img
                                      src={optionImage}
                                      alt={`Option ${String.fromCharCode(65 + index)} preview`}
                                      className="max-w-[100px] max-h-[100px] object-contain rounded-lg border border-emerald-200"
                                    />
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {question.type === 'TRUE_FALSE' && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</p>
                        <Badge className="bg-green-100 text-green-800">
                          {question.correct_answer}
                        </Badge>
                      </div>
                    )}

                    {question.type === 'FILL_IN_THE_BLANK' && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</p>
                        <Badge className="bg-green-100 text-green-800">
                          {question.correct_answer}
                        </Badge>
                      </div>
                    )}

                    {question.type === 'MATCH' && Array.isArray(question.matchPairs) && (
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-700 mb-2">Match Pairs:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {question.matchPairs.map((pair: MatchPair, index: number) => (
                            <div key={index} className="p-2 bg-blue-50 rounded text-sm">
                              <span className="font-medium">{pair.left}</span> → <span className="font-medium">{pair.right}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {question.explanation && (
                      <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                        <p className="text-sm font-medium text-yellow-800 mb-1">Explanation:</p>
                        <p className="text-sm text-yellow-700">{question.explanation}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
            {filteredQuestions.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters or add some questions to get started.</p>
                  <Button onClick={() => setNewQuestion({
                    question_text: '',
                    question_image: '',
                    type: 'MCQ',
                    subject_id: '',
                    topic: '',
                    difficulty: 'MEDIUM',
                    options: ['', '', '', ''],
                    correct_answer: '',
                    explanation: '',
                    marks: 1,
                    optionImages: ['', '', '', ''],
                    numOptions: 4,
                    matchPairs: [
                      { left: '', right: '', order: 1 },
                      { left: '', right: '', order: 2 },
                    ]
                  })} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Question
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>

      {selectedQuestion && (
        <Card className="shadow-lg border-0 bg-gradient-to-r from-emerald-50 to-emerald-100">
          <CardHeader className="bg-emerald-500 text-white rounded-t-lg">
            <CardTitle className="flex items-center">
              <Edit className="w-5 h-5 mr-2" />
              Edit Question
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="edit-subject_id" className="text-emerald-700 font-medium">Subject *</Label>
                <Select value={selectedQuestion.subject_id} onValueChange={(value) => setSelectedQuestion({...selectedQuestion, subject_id: value})}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue placeholder="Select Subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.filter(Boolean).map((subject_id) => (
                      <SelectItem key={subject_id.subject_id} value={subject_id.subject_id}>
                        {subject_id.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-topic" className="text-emerald-700 font-medium">Topic</Label>
                <Input
                  id="edit-topic"
                  value={selectedQuestion.topic}
                  onChange={(e) => setSelectedQuestion({...selectedQuestion, topic: e.target.value})}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>
              <div>
                <Label htmlFor="edit-type" className="text-emerald-700 font-medium">Question Type *</Label>
                <Select value={selectedQuestion.type} onValueChange={(value: any) => setSelectedQuestion({...selectedQuestion, type: value})}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {questionTypes.filter(Boolean).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="edit-difficulty" className="text-emerald-700 font-medium">Difficulty *</Label>
                <Select value={selectedQuestion.difficulty} onValueChange={(value: any) => setSelectedQuestion({...selectedQuestion, difficulty: value})}>
                  <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.filter(Boolean).map((difficulty) => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="edit-question" className="text-emerald-700 font-medium">Question *</Label>
              <Textarea
                id="edit-question"
                value={selectedQuestion.question_text}
                onChange={(e) => setSelectedQuestion({...selectedQuestion, question_text: e.target.value})}
                placeholder="Enter your question..."
                rows={3}
                className="border-emerald-200 focus:border-emerald-500"
              />
              <div className="mt-2 flex items-center space-x-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleQuestionImageUpload}
                  className="text-sm border-emerald-200"
                />
                {selectedQuestion.question_image && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedQuestion({...selectedQuestion, question_image: ''})}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              {selectedQuestion.question_image && (
                <div className="mt-2">
                  <img
                    src={selectedQuestion.question_image}
                    alt="Question preview"
                    className="max-w-[200px] max-h-[200px] object-contain rounded-lg border border-emerald-200"
                  />
                </div>
              )}
            </div>
            {selectedQuestion.type === 'MCQ' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-emerald-700 font-medium">Options * (2-5)</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedQuestion.numOptions < 5) {
                          setSelectedQuestion({
                            ...selectedQuestion,
                            numOptions: selectedQuestion.numOptions + 1,
                            options: [...selectedQuestion.options, ''],
                            optionImages: [...selectedQuestion.optionImages, '']
                          });
                        }
                      }}
                      disabled={selectedQuestion.numOptions >= 5}
                      className="text-emerald-600 border-emerald-300"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (selectedQuestion.numOptions > 2) {
                          setSelectedQuestion({
                            ...selectedQuestion,
                            numOptions: selectedQuestion.numOptions - 1,
                            options: selectedQuestion.options.slice(0, -1),
                            optionImages: selectedQuestion.optionImages.slice(0, -1)
                          });
                        }
                      }}
                      disabled={selectedQuestion.numOptions <= 2}
                      className="text-red-600 border-red-300"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  {selectedQuestion.options.slice(0, selectedQuestion.numOptions).map((option, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="flex-1 flex items-center space-x-2">
                        <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-medium text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <div className="flex-1 space-y-2">
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...selectedQuestion.options];
                              newOptions[index] = e.target.value;
                              setSelectedQuestion({...selectedQuestion, options: newOptions});
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                            className="border-emerald-200 focus:border-emerald-500"
                          />
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(index, e)}
                              className="text-sm border-emerald-200"
                            />
                            {selectedQuestion.optionImages[index] && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newOptionImages = [...selectedQuestion.optionImages];
                                  newOptionImages[index] = '';
                                  setSelectedQuestion({...selectedQuestion, optionImages: newOptionImages});
                                }}
                                className="text-red-600 hover:bg-red-50"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            )}
                          </div>
                          {selectedQuestion.optionImages[index] && (
                            <div className="mt-2">
                              <img
                                src={selectedQuestion.optionImages[index]}
                                alt={`Option ${String.fromCharCode(65 + index)} preview`}
                                className="max-w-[100px] max-h-[100px] object-contain rounded-lg border border-emerald-200"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant={selectedQuestion.correct_answer === option ? "default" : "outline"}
                        onClick={() => setSelectedQuestion({...selectedQuestion, correct_answer: option})}
                        size="sm"
                        className={selectedQuestion.correct_answer === option ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}
                      >
                        Correct
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
              )}
              {selectedQuestion.type === 'TRUE_FALSE' && (
                <div className="space-y-3">
                  <Label className="text-emerald-700 font-medium">Correct Answer *</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={selectedQuestion.correct_answer === 'true' ? "default" : "outline"}
                      onClick={() => setSelectedQuestion({...selectedQuestion, correct_answer: 'true'})}
                      className={selectedQuestion.correct_answer === 'true' ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}
                    >
                      True
                    </Button>
                    <Button
                      variant={selectedQuestion.correct_answer === 'false' ? "default" : "outline"}
                      onClick={() => setSelectedQuestion({...selectedQuestion, correct_answer: 'false'})}
                      className={selectedQuestion.correct_answer === 'false' ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}
                    >
                      False
                    </Button>
                  </div>
                </div>
              )}
              {selectedQuestion.type === 'MATCH' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-emerald-700 font-medium">Matching Pairs * (2-4)</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addMatchPair}
                        disabled={selectedQuestion.matchPairs.length >= 4}
                        className="text-emerald-600 border-emerald-300"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Pair
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeMatchPair(selectedQuestion.matchPairs.length - 1)}
                        disabled={selectedQuestion.matchPairs.length <= 2}
                        className="text-red-600 border-red-300"
                      >
                        <X className="w-4 h-4 mr-1" />
                        Remove Pair
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {selectedQuestion.matchPairs.map((pair, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-emerald-200 rounded-lg">
                        <div>
                          <Label className="text-sm text-emerald-600">Left Item {index + 1}</Label>
                          <Input
                            value={pair.left}
                            onChange={(e) => handleMatchPairChange(index, 'left', e.target.value)}
                            placeholder="Enter left item"
                            className="border-emerald-200 focus:border-emerald-500"
                          />
                        </div>
                        <div className="flex items-end space-x-2">
                          <div className="flex-1">
                            <Label className="text-sm text-emerald-600">Right Item {index + 1}</Label>
                            <Input
                              value={pair.right}
                              onChange={(e) => handleMatchPairChange(index, 'right', e.target.value)}
                              placeholder="Enter right item"
                              className="border-emerald-200 focus:border-emerald-500"
                            />
                          </div>
                          {selectedQuestion.matchPairs.length > 2 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMatchPair(index)}
                              className="text-red-600 hover:bg-red-50"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {selectedQuestion.type === 'FILL_IN_THE_BLANK' && (
                <div className="space-y-4">
                  <Label className="text-emerald-700 font-medium">Correct Answer *</Label>
                  <Input
                    value={selectedQuestion.correct_answer}
                    onChange={(e) => setSelectedQuestion({...selectedQuestion, correct_answer: e.target.value})}
                    placeholder="Enter correct answer for blank"
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-marks" className="text-emerald-700 font-medium">Marks</Label>
                  <Input
                    id="edit-marks"
                    type="number"
                    value={selectedQuestion.marks}
                    onChange={(e) => setSelectedQuestion({...selectedQuestion, marks: parseInt(e.target.value)})}
                    min="1"
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
                <div>
                  <Label htmlFor="edit-explanation" className="text-emerald-700 font-medium">Explanation</Label>
                  <Textarea
                    id="edit-explanation"
                    value={selectedQuestion.explanation}
                    onChange={(e) => setSelectedQuestion({...selectedQuestion, explanation: e.target.value})}
                    placeholder="Explain why this is the correct answer..."
                    rows={3}
                    className="border-emerald-200 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedQuestion(null)}
                  className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleEditQuestion}
                  className="bg-emerald-600 hover:bg-emerald-700"
                  disabled={editQuestionMutation.isPending}
                >
                  {editQuestionMutation.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
};

export default QuestionBank;