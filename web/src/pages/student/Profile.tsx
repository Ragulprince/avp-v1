import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { 
  User, 
  Mail, 
  Calendar, 
  Award, 
  BookOpen, 
  Clock, 
  Target, 
  ChevronDown,
  ChevronUp,
  MapPin,
  School,
  GraduationCap,
  Phone
} from 'lucide-react';
import BottomNavigation from '@/components/common/BottomNavigation';
import { useStudentProfile, useStudentVideos } from '@/hooks/api/useStudent';
import { useProfile } from '@/hooks/api/useAuth';
import StudentHeader from '@/containers/student/StudentHeader';

// Define TypeScript interfaces for type safety
interface User {
  avatar?: string;
  name?: string;
  email?: string;
  phone?: string;
  createdAt?: string;
}

interface StudentProfile {
  student_profile?: {
    batch?: {
      batch_name: string;
    };
    course?: {
      name: string;
    };
    address?: string;
  };
}

interface Video {
  id: string; // Adjust based on actual video data structure
}

interface ProfileProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ activeTab, onTabChange }) => {
  const [isSubjectsOpen, setIsSubjectsOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isPersonalDetailsOpen, setIsPersonalDetailsOpen] = useState(false);
  const [isEducationOpen, setIsEducationOpen] = useState(false);

  // API calls
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const { data: studentProfileData, isLoading: studentProfileLoading } = useStudentProfile();
  const { data: videosData } = useStudentVideos();

  const user: User | undefined = profileData?.data;
  const studentProfile: StudentProfile | undefined = studentProfileData?.data;
  const videos: Video[] = videosData?.data || [];

  const enrolledSubjects = [
    { name: 'Physics', progress: 75, totalChapters: 20, completedChapters: 15 },
    { name: 'Chemistry', progress: 60, totalChapters: 18, completedChapters: 11 },
    { name: 'Mathematics', progress: 85, totalChapters: 25, completedChapters: 21 },
    { name: 'Biology', progress: 45, totalChapters: 22, completedChapters: 10 },
  ];

  const achievements = [
    { title: 'First Quiz Completed', date: '2024-06-01', icon: '🎯' },
    { title: '10 Videos Watched', date: '2024-06-05', icon: '📺' },
    { title: 'Score Above 80%', date: '2024-06-10', icon: '🏆' },
    { title: 'Daily Streak - 7 Days', date: '2024-06-14', icon: '🔥' },
  ];

  const stats = [
    { label: 'Videos Watched', value: videos.length, total: 50, color: 'bg-blue-500' },
    { label: 'Quizzes Taken', value: 18, total: 30, color: 'bg-green-500' },
    { label: 'Study Hours', value: 45, total: 100, color: 'bg-purple-500' },
    { label: 'Notes Downloaded', value: 12, total: 20, color: 'bg-orange-500' },
  ];

  const educationDetails = {
    class10: {
      school: 'DAV Public School',
      board: 'CBSE',
      percentage: '95.2%',
      year: '2022',
    },
    class12: {
      school: 'St. Xavier Higher Secondary School',
      board: 'CBSE',
      percentage: '92.8%',
      year: '2024',
      stream: 'PCM+B',
    },
    college: {
      name: 'Not Yet Enrolled',
      course: 'Preparing for NEET',
      year: 'Target: 2025',
    },
  };

  if (profileLoading || studentProfileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pb-24 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <StudentHeader />
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-blue-100">Track your learning progress and achievements</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Profile Header */}
        <Card className="shadow-sm">
          <CardContent className="p-4 md:p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              <Avatar className="w-20 h-20 md:w-24 md:h-24">
                <AvatarImage src={user?.avatar ?? ''} alt={user?.name ?? 'User'} />
                <AvatarFallback className="text-xl">
                  {user?.name?.split(' ').map(n => n[0]).join('') ?? 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{user?.name ?? 'User'}</h2>
                <div className="space-y-2">
                  <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user?.email ?? 'email@example.com'}</span>
                  </div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <GraduationCap className="w-3 h-3" />
                      {studentProfile?.student_profile?.batch?.batch_name ?? 'NEET 2024'}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <School className="w-3 h-3" />
                      Class XII
                    </Badge>
                  </div>
                  <div className="flex items-center justify-center sm:text-left text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-1" />
                    Member since {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'June 2024'}
                  </div>
                </div>
              </div>
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="shadow-sm">
              <CardContent className="p-3 md:p-4">
                <div className="text-center">
                  <div className="text-lg md:text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}/{stat.total}
                  </div>
                  <p className="text-xs md:text-sm text-gray-600 mb-2">{stat.label}</p>
                  <Progress value={(stat.value / stat.total) * 100} className="w-full h-1 md:h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Overview */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <Target className="w-5 h-5 mr-2" />
              Performance Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-blue-600">85%</div>
                <p className="text-xs md:text-sm text-gray-600">Average Score</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-green-600">#42</div>
                <p className="text-xs md:text-sm text-gray-600">Class Rank</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-purple-600">28</div>
                <p className="text-xs md:text-sm text-gray-600">Tests Taken</p>
              </div>
              <div className="text-center">
                <div className="text-xl md:text-2xl font-bold text-orange-600">7</div>
                <p className="text-xs md:text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Collapsible Personal Details */}
        <Card className="shadow-sm">
          <Collapsible open={isPersonalDetailsOpen} onOpenChange={setIsPersonalDetailsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base md:text-lg">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Personal Details
                  </div>
                  {isPersonalDetailsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <User className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Full Name</p>
                      <p className="text-sm text-gray-600">{user?.name ?? 'User'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email</p>
                      <p className="text-sm text-gray-600">{user?.email ?? 'email@example.com'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Phone</p>
                      <p className="text-sm text-gray-600">{user?.phone ?? '+91 9876543210'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Address</p>
                      <p className="text-sm text-gray-600">{studentProfile?.student_profile?.address ?? '123 Main Street, City'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Batch</p>
                      <p className="text-sm text-gray-600">{studentProfile?.student_profile?.batch?.batch_name ?? 'NEET 2024'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Join Date</p>
                      <p className="text-sm text-gray-600">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'June 2024'}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Collapsible Education Details */}
        <Card className="shadow-sm">
          <Collapsible open={isEducationOpen} onOpenChange={setIsEducationOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base md:text-lg">
                  <div className="flex items-center">
                    <School className="w-5 h-5 mr-2" />
                    Educational Background
                  </div>
                  {isEducationOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 space-y-4">
                {/* Class 10th */}
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Class 10th
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">School</p>
                      <p className="text-sm text-gray-900">{educationDetails.class10.school}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Board</p>
                      <p className="text-sm text-gray-900">{educationDetails.class10.board}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Percentage</p>
                      <p className="text-sm text-gray-900 font-semibold text-blue-600">{educationDetails.class10.percentage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Year</p>
                      <p className="text-sm text-gray-900">{educationDetails.class10.year}</p>
                    </div>
                  </div>
                </div>

                {/* Class 12th */}
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Class 12th
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">School</p>
                      <p className="text-sm text-gray-900">{educationDetails.class12.school}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Board</p>
                      <p className="text-sm text-gray-900">{educationDetails.class12.board}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Stream</p>
                      <p className="text-sm text-gray-900">{educationDetails.class12.stream}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Percentage</p>
                      <p className="text-sm text-gray-900 font-semibold text-green-600">{educationDetails.class12.percentage}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Year</p>
                      <p className="text-sm text-gray-900">{educationDetails.class12.year}</p>
                    </div>
                  </div>
                </div>

                {/* College */}
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <School className="w-4 h-4 mr-2" />
                    Higher Education
                  </h4>
                  <div className="grid gap-3 md:grid-cols-2">
                    <div>
                      <p className="text-sm font-medium text-gray-700">College/University</p>
                      <p className="text-sm text-gray-900">{educationDetails.college.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Course</p>
                      <p className="text-sm text-gray-900">{educationDetails.college.course}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Target Year</p>
                      <p className="text-sm text-gray-900 font-semibold text-purple-600">{educationDetails.college.year}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Collapsible Subjects Enrolled */}
        <Card className="shadow-sm">
          <Collapsible open={isSubjectsOpen} onOpenChange={setIsSubjectsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base md:text-lg">
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Subjects Enrolled ({enrolledSubjects.length})
                  </div>
                  {isSubjectsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="grid gap-4">
                  {enrolledSubjects.map((subject, index) => (
                    <div key={index} className="p-3 md:p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">{subject.name}</h4>
                        <div className="text-sm text-gray-600 mt-1 sm:mt-0">
                          {subject.completedChapters}/{subject.totalChapters} chapters
                        </div>
                      </div>
                      <Progress value={subject.progress} className="w-full h-2" />
                      <p className="text-sm text-gray-600 mt-1">{subject.progress}% Complete</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Collapsible Recent Achievements */}
        <Card className="shadow-sm">
          <Collapsible open={isAchievementsOpen} onOpenChange={setIsAchievementsOpen}>
            <CollapsibleTrigger asChild>
              <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
                <CardTitle className="flex items-center justify-between text-base md:text-lg">
                  <div className="flex items-center">
                    <Award className="w-5 h-5 mr-2" />
                    Recent Achievements ({achievements.length})
                  </div>
                  {isAchievementsOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
              </CardHeader>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl mr-3">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                        <p className="text-sm text-gray-600">
                          Earned on {new Date(achievement.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Study Activity */}
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center text-base md:text-lg">
              <Clock className="w-5 h-5 mr-2" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm md:text-base">Physics - Newton's Laws</h4>
                  <p className="text-sm text-gray-600">Video completed</p>
                </div>
                <span className="text-xs md:text-sm text-gray-500">2h ago</span>
              </div>
              <div className="flex justify-between items-center p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium text-sm md:text-base">Chemistry Mock Test</h4>
                  <p className="text-sm text-gray-600">Score: 78%</p>
                </div>
                <span className="text-xs md:text-sm text-gray-500">1d ago</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default Profile;