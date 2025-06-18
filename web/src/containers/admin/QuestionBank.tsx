import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Edit, Trash2, HelpCircle, FileText, Upload, Download } from 'lucide-react';
import { useQuestions } from '@/hooks/api/useQuestionBank';
import { useToast } from '@/hooks/use-toast';

const QuestionBank = () => {
  const { toast } = useToast();
  const { data: questionsResponse, isLoading } = useQuestions();
  
  const questions = questionsResponse?.data || [];
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    type: 'MCQ' as const,
    subject: '',
    topic: '',
    difficulty: 'MEDIUM' as const,
    options: ['', '', '', ''],
    correctAnswer: '',
    explanation: '',
    marks: 1
  });

  const filteredQuestions = questions.filter(question => {
    const matchesSearch =
      (question.question && question.question.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (question.topic && question.topic.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSubject = !selectedSubject || question.subject === selectedSubject;
    const matchesDifficulty = !selectedDifficulty || question.difficulty === selectedDifficulty;
    const matchesType = !selectedType || question.type === selectedType;
    return matchesSearch && matchesSubject && matchesDifficulty && matchesType;
  });

  const handleAddQuestion = async () => {
    if (!newQuestion.question || !newQuestion.subject || !newQuestion.correctAnswer) {
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

    try {
      // In real app, this would call questionBankService.createQuestion(newQuestion)
      console.log('Creating question:', newQuestion);
      
      toast({
        title: 'Success',
        description: 'Question added successfully'
      });
      
      setIsAddDialogOpen(false);
      setNewQuestion({
        question: '',
        type: 'MCQ',
        subject: '',
        topic: '',
        difficulty: 'MEDIUM',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
        marks: 1
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add question',
        variant: 'destructive'
      });
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'HARD': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'MCQ': return 'bg-blue-100 text-blue-800';
      case 'FILL_BLANKS': return 'bg-purple-100 text-purple-800';
      case 'TRUE_FALSE': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const subjects = ['Physics', 'Chemistry', 'Biology', 'Mathematics'];
  const difficulties = ['EASY', 'MEDIUM', 'HARD'];
  const questionTypes = ['MCQ', 'FILL_BLANKS', 'TRUE_FALSE', 'MATCH', 'CHOICE_BASED'];

  if (isLoading) {
    return (
      <div className="space-y-6">
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
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600 mt-1">Manage questions for tests and quizzes</p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Add New Question</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select value={newQuestion.subject} onValueChange={(value) => setNewQuestion({...newQuestion, subject: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.filter(Boolean).map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="topic">Topic</Label>
                    <Input
                      id="topic"
                      value={newQuestion.topic}
                      onChange={(e) => setNewQuestion({...newQuestion, topic: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">Question Type *</Label>
                    <Select value={newQuestion.type} onValueChange={(value: any) => setNewQuestion({...newQuestion, type: value})}>
                      <SelectTrigger>
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
                    <Label htmlFor="difficulty">Difficulty *</Label>
                    <Select value={newQuestion.difficulty} onValueChange={(value: any) => setNewQuestion({...newQuestion, difficulty: value})}>
                      <SelectTrigger>
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
                  <Label htmlFor="question">Question *</Label>
                  <Textarea
                    id="question"
                    value={newQuestion.question}
                    onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                    placeholder="Enter your question..."
                    rows={3}
                  />
                </div>
                {newQuestion.type === 'MCQ' && (
                  <div>
                    <Label>Options *</Label>
                    <div className="space-y-2 mt-2">
                      {newQuestion.options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...newQuestion.options];
                              newOptions[index] = e.target.value;
                              setNewQuestion({...newQuestion, options: newOptions});
                            }}
                            placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="correctAnswer">Correct Answer *</Label>
                    {newQuestion.type === 'MCQ' ? (
                      <Select value={newQuestion.correctAnswer} onValueChange={(value) => setNewQuestion({...newQuestion, correctAnswer: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select correct option" />
                        </SelectTrigger>
                        <SelectContent>
                          {newQuestion.options
                            .map((option, index) => ({ option, index }))
                            .filter(({ option }) => option && option.trim() !== '')
                            .map(({ option, index }) => (
                              <SelectItem key={option + '-' + index} value={option}>
                                {String.fromCharCode(65 + index)}: {option}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        id="correctAnswer"
                        value={newQuestion.correctAnswer}
                        onChange={(e) => setNewQuestion({...newQuestion, correctAnswer: e.target.value})}
                        placeholder="Enter correct answer"
                      />
                    )}
                  </div>
                  <div>
                    <Label htmlFor="marks">Marks</Label>
                    <Input
                      id="marks"
                      type="number"
                      value={newQuestion.marks}
                      onChange={(e) => setNewQuestion({...newQuestion, marks: parseInt(e.target.value)})}
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="explanation">Explanation</Label>
                  <Textarea
                    id="explanation"
                    value={newQuestion.explanation}
                    onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                    placeholder="Explain why this is the correct answer..."
                    rows={2}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-6">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddQuestion}>
                  Add Question
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Questions</p>
                <p className="text-2xl font-bold">{questions.length}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">MCQ Questions</p>
                <p className="text-2xl font-bold">{questions.filter(q => q.type === 'MCQ').length}</p>
              </div>
              <FileText className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hard Questions</p>
                <p className="text-2xl font-bold">{questions.filter(q => q.difficulty === 'HARD').length}</p>
              </div>
              <HelpCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Subjects</p>
                <p className="text-2xl font-bold">{new Set(questions.map(q => q.subject)).size}</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
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
              <SelectTrigger>
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
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Questions List */}
      <div className="space-y-4">
        {filteredQuestions.map((question) => (
          <Card key={question.id || question.question} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getTypeColor(question.type)}>
                      {question.type}
                    </Badge>
                    <Badge className={getDifficultyColor(question.difficulty)}>
                      {question.difficulty}
                    </Badge>
                    <Badge variant="outline">
                      {question.subject}
                    </Badge>
                    {question.topic && (
                      <Badge variant="outline">
                        {question.topic}
                      </Badge>
                    )}
                    <span className="text-sm text-gray-500">
                      {question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{question.question}</h3>
                  {question.type === 'MCQ' && Array.isArray(question.options) && question.options.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      {question.options.map((option, index) => (
                        <div key={index} className={`p-2 rounded border ${option === question.correctAnswer ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                          <span className="font-medium">{String.fromCharCode(65 + index)}. </span>
                          {option}
                        </div>
                      ))}
                    </div>
                  )}
                  {question.explanation && (
                    <p className="text-sm text-gray-600 mt-2">
                      <strong>Explanation:</strong> {question.explanation}
                    </p>
                  )}
                </div>
                <div className="flex space-x-1 ml-4">
                  <Button variant="ghost" size="sm">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredQuestions.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No questions found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters or add some questions to get started.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Question
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default QuestionBank;
