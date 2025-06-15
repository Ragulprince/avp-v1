
import { useQuery } from '@tanstack/react-query';
import { studentService } from '@/services/student';

export const useStudentDashboard = () => {
  return useQuery({
    queryKey: ['student-dashboard'],
    queryFn: studentService.getDashboard,
  });
};

export const useStudentVideos = () => {
  return useQuery({
    queryKey: ['student-videos'],
    queryFn: () => studentService.getVideos(),
  });
};

export const useStudentQuizzes = () => {
  return useQuery({
    queryKey: ['student-quizzes'],
    queryFn: studentService.getQuizzes,
  });
};

export const useStudentNotifications = () => {
  return useQuery({
    queryKey: ['student-notifications'],
    queryFn: studentService.getNotifications,
  });
};
