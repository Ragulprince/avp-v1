
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Edit, Trash2, Search, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuestionBank = () => {
  const { toast } = useToast();
  
  const courses = [
    { id: 1, name: 'NEET 2024' },
    { id: 2, name: 'JEE Main 2024' },
    { id: 3, name: 'NEET 2025' }
  ];

  const subjects = [
    { id: 1, name: 'Physics', courseId: 1 },
    { id: 2, name: 'Chemistry', courseId: 1 },
    { id: 3, name: 'Biology', courseId: 1 },
    { id: 4, name: 'Mathematics', courseId: 2 }
  ];

  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: 'What is Newton\'s First Law of Motion?',
      type: 'mcq',
      courseId: 1,
      course: 'NEET 2024',
      subjectId: 1,
      subject: 'Physics',
      difficulty: 'medium',
      options: ['An object at rest stays at rest unless acted upon by a force', 'Force equals mass times acceleration', 'For every action there is an equal and opposite reaction', 'Energy cannot be created or destroyed'],
      correctAnswer: 0,
      explanation: 'Newton\'s First Law states that an object at rest will remain at rest, and an object in motion will remain in motion at constant velocity, unless acted upon by an external force.'
    },
    {
      id: 2,
      text: 'The Earth revolves around the Sun.',
      type: 'true-false',
      courseId: 1,
      course: 'NEET 2024',
      subjectId: 1,
      subject: 'Physics',
      difficulty: 'easy',
      options: ['True', 'False'],
      correctAnswer: 0,
      explanation: 'The Earth orbits around the Sun, which takes approximately 365.25 days to complete one revolution.'
    }
  ]);

  const [newQuestion, setNewQuestion] = useState({
    text: '',
    type: 'mcq',
    courseId: '',
    subjectId: '',
    difficulty: 'medium',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    matchPairs: [{ left: '', right: '' }, { left: '', right: '' }],
    fillBlanks: ['']
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterType, setFilterType] = useState('all');

  const handleCreateQuestion = () => {
    if (!newQuestion.text || !newQuestion.courseId || !newQuestion.subjectId) {
      toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
      return;
    }

    const selectedCourse = courses.find(c => c.id === parseInt(newQuestion.courseId));
    const selectedSubject = subjects.find(s => s.id === parseInt(newQuestion.subjectId));

    let questionData = {
      id: questions.length + 1,
      text: newQuestion.text,
      type: newQuestion.type,
      courseId: parseInt(newQuestion.courseId),
      course: selectedCourse?.name || '',
      subjectId: parseInt(newQuestion.subjectId),
      subject: selectedSubject?.name || '',
      difficulty: newQuestion.difficulty,
      explanation: newQuestion.explanation
    };

    // Handle different question types
    switch (newQuestion.type) {
      case 'mcq':
        if (newQuestion.options.some(opt => !opt.trim())) {
          toast({ title: "Error", description: "Please fill all options.", variant: "destructive" });
          return;
        }
        questionData = {
          ...questionData,
          options: newQuestion.options,
          correctAnswer: newQuestion.correctAnswer
        };
        break;
      
      case 'true-false':
        questionData = {
          ...questionData,
          options: ['True', 'False'],
          correctAnswer: newQuestion.correctAnswer
        };
        break;
      
      case 'fill-blank':
        if (newQuestion.fillBlanks.some(blank => !blank.trim())) {
          toast({ title: "Error", description: "Please fill all correct answers for blanks.", variant: "destructive" });
          return;
        }
        questionData = {
          ...questionData,
          correctAnswer: newQuestion.fillBlanks,
          blanksCount: newQuestion.fillBlanks.length
        };
        break;
      
      case 'match':
        if (newQuestion.matchPairs.some(pair => !pair.left.trim() || !pair.right.trim())) {
          toast({ title: "Error", description: "Please fill all match pairs.", variant: "destructive" });
          return;
        }
        questionData = {
          ...questionData,
          matchPairs: newQuestion.matchPairs,
          correctAnswer: newQuestion.matchPairs.map(pair => `${pair.left}-${pair.right}`)
        };
        break;
      
      default:
        break;
    }

    setQuestions([...questions, questionData]);
    setNewQuestion({
      text: '',
      type: 'mcq',
      courseId: '',
      subjectId: '',
      difficulty: 'medium',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      matchPairs: [{ left: '', right: '' }, { left: '', right: '' }],
      fillBlanks: ['']
    });
    toast({ title: "Success", description: "Question created successfully!" });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...newQuestion.options];
    newOptions[index] = value;
    setNewQuestion({ ...newQuestion, options: newOptions });
  };

  const handleMatchPairChange = (index, field, value) => {
    const newPairs = [...newQuestion.matchPairs];
    newPairs[index][field] = value;
    setNewQuestion({ ...newQuestion, matchPairs: newPairs });
  };

  const handleFillBlankChange = (index, value) => {
    const newBlanks = [...newQuestion.fillBlanks];
    newBlanks[index] = value;
    setNewQuestion({ ...newQuestion, fillBlanks: newBlanks });
  };

  const addMatchPair = () => {
    setNewQuestion({
      ...newQuestion,
      matchPairs: [...newQuestion.matchPairs, { left: '', right: '' }]
    });
  };

  const removeMatchPair = (index) => {
    if (newQuestion.matchPairs.length > 2) {
      const newPairs = newQuestion.matchPairs.filter((_, i) => i !== index);
      setNewQuestion({ ...newQuestion, matchPairs: newPairs });
    }
  };

  const addFillBlank = () => {
    setNewQuestion({
      ...newQuestion,
      fillBlanks: [...newQuestion.fillBlanks, '']
    });
  };

  const removeFillBlank = (index) => {
    if (newQuestion.fillBlanks.length > 1) {
      const newBlanks = newQuestion.fillBlanks.filter((_, i) => i !== index);
      setNewQuestion({ ...newQuestion, fillBlanks: newBlanks });
    }
  };

  const getFilteredSubjects = () => {
    if (!newQuestion.courseId) return [];
    return subjects.filter(s => s.courseId === parseInt(newQuestion.courseId));
  };

  const filteredQuestions = questions.filter(q => {
    const matchesSearch = q.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || q.courseId === parseInt(filterCourse);
    const matchesSubject = filterSubject === 'all' || q.subjectId === parseInt(filterSubject);
    const matchesType = filterType === 'all' || q.type === filterType;
    return matchesSearch && matchesCourse && matchesSubject && matchesType;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'mcq': return 'bg-blue-100 text-blue-800';
      case 'true-false': return 'bg-green-100 text-green-800';
      case 'fill-blank': return 'bg-purple-100 text-purple-800';
      case 'match': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8 bg-gradient-to-br from-emerald-50 to-teal-50 min-h-screen p-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Question Bank
            </h1>
            <p className="text-gray-600 mt-2">Create and manage your question repository</p>
          </div>
          <div className="flex gap-3">
            <div className="bg-blue-100 p-4 rounded-lg text-center">
              <BookOpen className="w-6 h-6 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-blue-800">{questions.length} Questions</p>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="create" className="w-full">
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
                  <Label htmlFor="questionType" className="text-emerald-700 font-medium">Question Type *</Label>
                  <Select value={newQuestion.type} onValueChange={(value) => setNewQuestion({...newQuestion, type: value})}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mcq">Multiple Choice</SelectItem>
                      <SelectItem value="true-false">True/False</SelectItem>
                      <SelectItem value="fill-blank">Fill in the Blanks</SelectItem>
                      <SelectItem value="match">Match the Following</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="questionCourse" className="text-emerald-700 font-medium">Course *</Label>
                  <Select 
                    value={newQuestion.courseId} 
                    onValueChange={(value) => setNewQuestion({...newQuestion, courseId: value, subjectId: ''})}
                  >
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="Select course" />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="questionSubject" className="text-emerald-700 font-medium">Subject *</Label>
                  <Select 
                    value={newQuestion.subjectId} 
                    onValueChange={(value) => setNewQuestion({...newQuestion, subjectId: value})}
                    disabled={!newQuestion.courseId}
                  >
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredSubjects().map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="questionDifficulty" className="text-emerald-700 font-medium">Difficulty *</Label>
                  <Select value={newQuestion.difficulty} onValueChange={(value) => setNewQuestion({...newQuestion, difficulty: value})}>
                    <SelectTrigger className="border-emerald-200 focus:border-emerald-500">
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
                <Label htmlFor="questionText" className="text-emerald-700 font-medium">Question Text *</Label>
                <Textarea
                  id="questionText"
                  value={newQuestion.text}
                  onChange={(e) => setNewQuestion({...newQuestion, text: e.target.value})}
                  placeholder="Enter your question here..."
                  rows={3}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              {/* MCQ Options */}
              {newQuestion.type === 'mcq' && (
                <div className="space-y-4">
                  <Label className="text-emerald-700 font-medium">Options *</Label>
                  {newQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="flex-1 flex items-center space-x-2">
                        <span className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-medium text-sm">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <Input
                          value={option}
                          onChange={(e) => handleOptionChange(index, e.target.value)}
                          placeholder={`Option ${String.fromCharCode(65 + index)}`}
                          className="border-emerald-200 focus:border-emerald-500"
                        />
                      </div>
                      <Button
                        variant={newQuestion.correctAnswer === index ? "default" : "outline"}
                        onClick={() => setNewQuestion({...newQuestion, correctAnswer: index})}
                        size="sm"
                        className={newQuestion.correctAnswer === index ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}
                      >
                        Correct
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* True/False */}
              {newQuestion.type === 'true-false' && (
                <div className="space-y-3">
                  <Label className="text-emerald-700 font-medium">Correct Answer *</Label>
                  <div className="flex space-x-4">
                    <Button
                      variant={newQuestion.correctAnswer === 0 ? "default" : "outline"}
                      onClick={() => setNewQuestion({...newQuestion, correctAnswer: 0})}
                      className={newQuestion.correctAnswer === 0 ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}
                    >
                      True
                    </Button>
                    <Button
                      variant={newQuestion.correctAnswer === 1 ? "default" : "outline"}
                      onClick={() => setNewQuestion({...newQuestion, correctAnswer: 1})}
                      className={newQuestion.correctAnswer === 1 ? "bg-green-600 hover:bg-green-700" : "border-green-300 text-green-600 hover:bg-green-50"}
                    >
                      False
                    </Button>
                  </div>
                </div>
              )}

              {/* Fill in the Blanks */}
              {newQuestion.type === 'fill-blank' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-emerald-700 font-medium">Correct Answers for Blanks *</Label>
                    <Button onClick={addFillBlank} variant="outline" size="sm" className="text-emerald-600 border-emerald-300">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Blank
                    </Button>
                  </div>
                  {newQuestion.fillBlanks.map((blank, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-emerald-700 w-16">Blank {index + 1}:</span>
                      <Input
                        value={blank}
                        onChange={(e) => handleFillBlankChange(index, e.target.value)}
                        placeholder={`Correct answer for blank ${index + 1}`}
                        className="flex-1 border-emerald-200 focus:border-emerald-500"
                      />
                      {newQuestion.fillBlanks.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFillBlank(index)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Match the Following */}
              {newQuestion.type === 'match' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-emerald-700 font-medium">Match Pairs *</Label>
                    <Button onClick={addMatchPair} variant="outline" size="sm" className="text-emerald-600 border-emerald-300">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Pair
                    </Button>
                  </div>
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
              )}

              {/* Explanation */}
              <div>
                <Label htmlFor="explanation" className="text-emerald-700 font-medium">Explanation (Optional)</Label>
                <Textarea
                  id="explanation"
                  value={newQuestion.explanation}
                  onChange={(e) => setNewQuestion({...newQuestion, explanation: e.target.value})}
                  placeholder="Provide explanation for the correct answer..."
                  rows={3}
                  className="border-emerald-200 focus:border-emerald-500"
                />
              </div>

              <Button onClick={handleCreateQuestion} className="w-full bg-emerald-600 hover:bg-emerald-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Question
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manage" className="space-y-6">
          {/* Search and Filters */}
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
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={filterCourse} onValueChange={setFilterCourse}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Course" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courses</SelectItem>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id.toString()}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterSubject} onValueChange={setFilterSubject}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Subjects</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {subject.name}
                        </SelectItem>
                      ))}
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
                      <SelectItem value="fill-blank">Fill Blanks</SelectItem>
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
              <Card key={question.id} className="shadow-lg border-0 hover:shadow-xl transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 mb-3 text-lg">{question.text}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge className={getTypeColor(question.type)}>
                          {question.type.replace('-', ' ').toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{question.course}</Badge>
                        <Badge variant="outline">{question.subject}</Badge>
                        <Badge className={getDifficultyColor(question.difficulty)}>
                          {question.difficulty.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Question Details */}
                  {question.options && question.type === 'mcq' && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.options.map((option, index) => (
                          <div key={index} className={`p-2 rounded text-sm ${index === question.correctAnswer ? 'bg-green-100 text-green-800 font-medium' : 'bg-gray-50'}`}>
                            <span className="font-medium mr-2">{String.fromCharCode(65 + index)}.</span>
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === 'true-false' && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</p>
                      <Badge className="bg-green-100 text-green-800">
                        {question.options[question.correctAnswer]}
                      </Badge>
                    </div>
                  )}

                  {question.type === 'fill-blank' && question.correctAnswer && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Correct Answers:</p>
                      <div className="flex flex-wrap gap-2">
                        {question.correctAnswer.map((answer, index) => (
                          <Badge key={index} className="bg-green-100 text-green-800">
                            Blank {index + 1}: {answer}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {question.type === 'match' && question.matchPairs && (
                    <div className="mb-3">
                      <p className="text-sm font-medium text-gray-700 mb-2">Match Pairs:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {question.matchPairs.map((pair, index) => (
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
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default QuestionBank;
