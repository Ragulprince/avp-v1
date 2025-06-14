
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useStudent } from '@/contexts/StudentContext';
import { User, Mail, Calendar, Award, LogOut, Settings, School, MapPin, Phone, GraduationCap, BookOpen } from 'lucide-react';
import BottomNavigation from '@/components/common/BottomNavigation';

interface ProfileProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ activeTab, onTabChange }) => {
  const { student } = useStudent();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    // Basic Info
    name: student.name,
    email: student.email,
    phone: '+91 9876543210',
    address: 'Mumbai, Maharashtra',
    dateOfBirth: '2005-06-15',
    
    // Academic Info
    batch: student.batch,
    course: 'NEET Preparation',
    subjects: ['Physics', 'Chemistry', 'Biology', 'Mathematics'],
    
    // Educational Background
    school: 'Delhi Public School',
    college: 'Not applicable',
    class10Marks: '92%',
    class10Year: '2021',
    class12Marks: '88%',
    class12Year: '2023',
    
    // Personal Details
    fatherName: 'Rajesh Sharma',
    motherName: 'Priya Sharma',
    emergencyContact: '+91 9876543211',
    bloodGroup: 'O+',
    
    // Goals
    targetExam: 'NEET 2024',
    targetScore: '650+',
    aspirations: 'Want to become a doctor and serve rural areas'
  });

  const handleSave = () => {
    console.log('Saving profile data:', profileData);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-32"></div>
          <CardContent className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between -mt-16 relative">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg">
                  <span className="text-white text-3xl font-bold">
                    {student.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                
                <div className="sm:mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{profileData.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge className="bg-blue-100 text-blue-700">{profileData.batch}</Badge>
                    <Badge className="bg-green-100 text-green-700">{profileData.course}</Badge>
                    <Badge className="bg-purple-100 text-purple-700">{profileData.targetExam}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      {profileData.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      {profileData.phone}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 sm:mt-0">
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button onClick={() => setIsEditing(false)} variant="outline">
                      Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                      Save Changes
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subjects Enrolled */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Subjects Enrolled
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {profileData.subjects.map((subject, index) => (
                <div key={index} className="flex items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-sm">{subject[0]}</span>
                  </div>
                  <span className="font-medium text-gray-900">{subject}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="academic">Academic</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
              </TabsList>
              
              <TabsContent value="personal" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{profileData.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="dob">Date of Birth</Label>
                    {isEditing ? (
                      <Input
                        id="dob"
                        type="date"
                        value={profileData.dateOfBirth}
                        onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(profileData.dateOfBirth).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span>{profileData.phone}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address</Label>
                    {isEditing ? (
                      <Input
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{profileData.address}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="father">Father's Name</Label>
                    {isEditing ? (
                      <Input
                        id="father"
                        value={profileData.fatherName}
                        onChange={(e) => setProfileData({...profileData, fatherName: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{profileData.fatherName}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="mother">Mother's Name</Label>
                    {isEditing ? (
                      <Input
                        id="mother"
                        value={profileData.motherName}
                        onChange={(e) => setProfileData({...profileData, motherName: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <User className="w-4 h-4 text-gray-500" />
                        <span>{profileData.motherName}</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="academic" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Current Course</Label>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <GraduationCap className="w-4 h-4 text-gray-500" />
                      <span>{profileData.course}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label>Batch</Label>
                    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      <BookOpen className="w-4 h-4 text-gray-500" />
                      <span>{profileData.batch}</span>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="target">Target Exam</Label>
                    {isEditing ? (
                      <Input
                        id="target"
                        value={profileData.targetExam}
                        onChange={(e) => setProfileData({...profileData, targetExam: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span>{profileData.targetExam}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="targetScore">Target Score</Label>
                    {isEditing ? (
                      <Input
                        id="targetScore"
                        value={profileData.targetScore}
                        onChange={(e) => setProfileData({...profileData, targetScore: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span>{profileData.targetScore}</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="education" className="space-y-4 mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="school">School</Label>
                    {isEditing ? (
                      <Input
                        id="school"
                        value={profileData.school}
                        onChange={(e) => setProfileData({...profileData, school: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <School className="w-4 h-4 text-gray-500" />
                        <span>{profileData.school}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="college">College (if applicable)</Label>
                    {isEditing ? (
                      <Input
                        id="college"
                        value={profileData.college}
                        onChange={(e) => setProfileData({...profileData, college: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <GraduationCap className="w-4 h-4 text-gray-500" />
                        <span>{profileData.college}</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="class10">Class 10th Marks</Label>
                    {isEditing ? (
                      <Input
                        id="class10"
                        value={profileData.class10Marks}
                        onChange={(e) => setProfileData({...profileData, class10Marks: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span>{profileData.class10Marks} ({profileData.class10Year})</span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="class12">Class 12th Marks</Label>
                    {isEditing ? (
                      <Input
                        id="class12"
                        value={profileData.class12Marks}
                        onChange={(e) => setProfileData({...profileData, class12Marks: e.target.value})}
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <Award className="w-4 h-4 text-gray-500" />
                        <span>{profileData.class12Marks} ({profileData.class12Year})</span>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              Change Password
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Notification Settings
            </Button>
            <Button variant="outline" className="w-full justify-start">
              Privacy Settings
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </CardContent>
        </Card>
      </div>
      <BottomNavigation activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
};

export default Profile;
