
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuestionBank = () => {
  const { toast } = useToast();
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: 'What is Newton\'s First Law of Motion?',
      type: 'mcq',
      subject: 'Physics',
      difficulty: 'medium',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0
    },
    {
      id: 2,
      text: 'The Earth revolves around the Sun.',
      type: 'true-false',
      subject: 'Physics',
      difficulty: 'easy',
      options: ['True', 'False'],
      correctAnswer: 0
    }
  ]);

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'mcq',
    subject: '',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const handleCreateQuestion = () => {
    const question = {
      id: questions.length + 1,
      ...newQuestion,
      options: newQuestion.type === 'true-false' ? ['True', 'False'] : newQuestion.options
    };
    setQuestions([...questions, question]);
    setNewQuestion({
      text: '',
      type: 'mcq',
      subject: '',
      difficulty: 'medium',
      options: ['', '', '', ''],
      correctAnswer: 0
    });
    toast({ title: "Question Created", description: "New question has been added to the question bank." });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = filterSubject === 'all' || q.subject === filterSubject;
    const matchesType = filterType === 'all' || q.type === filterType;
    return matchesSearch && matchesSubject && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Question Bank</h1>
          <p className="text-gray-600">Manage your question repository</p>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="create">Create Question</TabsTrigger>
          <TabsTrigger value="manage">Manage Questions</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="w-5 h-5 mr-2" />
                Create New Question
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="questionType">Question Type</Label>
                  <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({...newQuestion, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="drag-drop">Drag & Drop</SelectItem>
                      <SelectItem value="match">Match the Following</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="questionSubject">Subject</Label>
                  <Select value={newQuestion.subject} onValueChange={(value) => setNewQuestion({...newQuestion, subject: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="questionDifficulty">Difficulty</Label>
                  <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="questionText">Question Text</Label>
                <Textarea
                  id="questionText"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  placeholder="Enter your question here..."
                  rows={3}
                />
              </div>

              {newQuestion.type === 'mcq' && (
                <div className="space-y-3">
                  <Label>Options</Label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${String.fromCharCode(65 + index)}`}
                      />
                      <Button
                        variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                        onClick={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                        size="sm"
                      >
                        Correct
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {newQuestion.type === 'true-false' && (
                <div className="space-y-3">
                  <Label>Correct Answer</Label>
                  <div className="flex space-x-2">
                    <Button
                      variant={newQuestion.correctAnswer === 0 ? "default" : "outline"}
                      onClick={() => setNewQuestion({...newQuestion, correctAnswer: 0})}
                    >
                      True
                    </Button>
                    <Button
                      variant={newQuestion.correctAnswer === 1 ? "default" : "outline"}
                      onClick={() => setNewQuestion({...newQuestion, correctAnswer: 1})}
                    >
                      False
                    </Button>
                  </div>
                </div>
              )}

              <Button onClick={handleCreateQuestion} className="w-full">
                Create Question
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-4">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search questions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                      <SelectItem value="Mathematics">Mathematics</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="drag-drop">Drag & Drop</SelectItem>
                      <SelectItem value="match">Match</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <div className="space-y-4">
            {filteredQuestions.map((question) => (
              <Card key={question.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-2">{question.text}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{question.subject}</Badge>
                        <Badge variant="outline">{question.type}</Badge>
                        <Badge 
                          variant={
                            question.difficulty === 'easy' ? 'default' : 
                            question.difficulty === 'medium' ? 'secondary' : 
                            'destructive'
                          }
                        >
                          {question.difficulty}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {question.options && (
                    <div className="text-sm text-gray-600">
                      <strong>Options:</strong> {question.options.join(', ')}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionBank;
