
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService, LoginCredentials, RegisterData } from '@/services/auth';
import { useToast } from '@/hooks/use-toast';

export const useLogin = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authService.login(credentials),
    onSuccess: (data) => {
      // Store token in localStorage
      localStorage.setItem('authToken', data.data.token);
      
      // Invalidate profile query to fetch fresh user data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
      toast({
        title: 'Success',
        description: 'Logged in successfully',
      });
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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userData: RegisterData) => authService.register(userData),
    onSuccess: (data) => {
      // Store token in localStorage  
      localStorage.setItem('authToken', data.data.token);
      
      // Invalidate profile query to fetch fresh user data
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      
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
    enabled: !!localStorage.getItem('authToken'), // Only fetch if token exists
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async () => {
      localStorage.removeItem('authToken');
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.clear();
      window.location.reload();
    },
  });
};
