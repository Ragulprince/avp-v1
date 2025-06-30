import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subjectService, CreateSubjectData, Subject } from '@/services/subject/subjectService';

export const useSubjects = () => {
  return useQuery({ queryKey: ['subjects'], queryFn: subjectService.getSubjects });
// Debug: Log API call status
console.debug('[useSubjects] Fetching subjects...');
};

export const useCreateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectService.createSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

export const useUpdateSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, values }: { id: number; values: Partial<CreateSubjectData> }) => subjectService.updateSubject(id, values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
};

export const useDeleteSubject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subjectService.deleteSubject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subjects'] });
    },
  });
}; 