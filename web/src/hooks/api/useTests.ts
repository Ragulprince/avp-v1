
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { testService } from '@/services/tests';
import { useToast } from '@/hooks/use-toast';

export const useTests = (params: any = {}) => {
  return useQuery({
    queryKey: ['tests', params],
    queryFn: () => testService.getTests(params),
  });
};

export const useCreateTest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => testService.createTest(data),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Test created successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['tests'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create test',
        variant: 'destructive',
      });
    },
  });
};
