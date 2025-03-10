import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { changePassword } from '../api/change-password-api';

export const useUpdatePassword = () => {
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => toast.success('Password updated successfully!'),
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 
        (error.response?.data && Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ')) || 
        error.message || 
        'Error updating password';
      toast.error(errorMessage);
      console.error('Mutation error:', error.response?.data || error.message); // Optional logging
    },
  });
};