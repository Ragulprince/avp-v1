
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { questionBankService } from '@/services/questionBank';
import { useToast } from '@/hooks/use-toast';

export const useQuestions = (params: any = {}) => {
  return useQuery({
    queryKey: ['questions', params],
    queryFn: () => questionBankService.getQuestions(params),
  });
};

export const useCreateQuestion = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => questionBankService.createQuestion(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Question created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['questions'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create question',
        variant: 'destructive',
      });
    },
  });
};
