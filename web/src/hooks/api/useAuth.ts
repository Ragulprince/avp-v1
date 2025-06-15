
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

export const useLogin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Login failed',
        variant: 'destructive',
      });
    },
  });
};

export const useRegister = () => {
  const { toast } = useToast();

  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Account created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Registration failed',
        variant: 'destructive',
      });
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
    retry: false,
  });
};
