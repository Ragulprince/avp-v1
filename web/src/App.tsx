import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DashboardOverview from "@/containers/admin/DashboardOverviewNew";
import StudentManagement from "@/containers/admin/StudentManagementNew";
import ContentManagement from "@/containers/admin/ContentManagement";
import TestManagement from "@/containers/admin/TestManagement";
import Analytics from "@/containers/admin/Analytics";
import CourseManagement from "@/containers/admin/CourseManagement";
import QuestionBank from "@/containers/admin/QuestionBank";
import NotificationCenter from "@/containers/admin/NotificationCenter";
import StaffManagement from "@/containers/admin/StaffManagement";
import AdminSettings from "@/containers/admin/AdminSettings";
import TestReports from "@/containers/admin/TestReports";
import ProfileSection from "@/components/common/ProfileSection";
import AdminProfile from "@/components/common/AdminProfile";
import StudentDashboard from "./pages/student/StudentDashboard";
import QuizCenter from "./pages/student/QuizCenter";
import VideoLearning from "./pages/student/VideoLearning";
import Profile from "./pages/student/Profile";
import Settings from "./pages/student/Settings";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/admin" element={<AdminDashboard />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<DashboardOverview />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="courses" element={<CourseManagement />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="tests" element={<TestManagement />} />
            <Route path="questions" element={<QuestionBank />} />
            <Route path="reports" element={<TestReports />} />
            <Route path="notifications" element={<NotificationCenter />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="profile" element={<AdminProfile />} />
            <Route path="analytics" element={<Analytics />} />
          </Route>
          <Route path="/student" element={<Index />} />
          <Route path="/student/home" element={<StudentDashboard activeTab="home" onTabChange={() => {}} />} />
          <Route path="/student/practice" element={<QuizCenter activeTab="practice" onTabChange={() => {}} />} />
          <Route path="/student/hub" element={<VideoLearning activeTab="hub" onTabChange={() => {}} />} />
          <Route path="/student/profile" element={<Profile activeTab="profile" onTabChange={() => {}} />} />
          <Route path="/student/settings" element={<Settings activeTab="settings" onTabChange={() => {}} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
