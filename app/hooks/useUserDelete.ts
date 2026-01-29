// app/hooks/useUserDelete.ts (versión alternativa sin ApiResult)
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import { UserApiAdapter } from '~/services/userApi';
import type { 
  UserDeleteFormData, 
  UserDeleteValidationErrors,
  UserDeleteData
} from '~/types/userDelete';
import type { ApiResponse } from '~/types';

interface UseUserDeleteOptions {
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export function useUserDelete(options: UseUserDeleteOptions = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId') || '';

  // Estados del formulario
  const [formData, setFormData] = useState<UserDeleteFormData>({
    userId: initialUserId,
  });

  const [errors, setErrors] = useState<UserDeleteValidationErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | null>(null);
  const [userData, setUserData] = useState<UserDeleteData | null>(null);

  // Detectar si usar mocks o backend real
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

  // ✅ CORRECCIÓN: Mutation para buscar usuario con ApiResponse
  const { mutate: fetchUser, loading: fetchLoading } = useMutation<
    UserDeleteData,
    string
  >(
    async (userId: string): Promise<ApiResponse<UserDeleteData>> => {
      console.log('🔍 Fetching user for deletion:', { userId, useMocks });
      
      if (useMocks) {
        // ✅ Para mocks, usar endpoint directo
        return apiClient.get<UserDeleteData>(`/users/security/${userId}`);
      } else {
        // ✅ Para backend real, usar adaptador y convertir el resultado
        const result = await UserApiAdapter.getUserById(userId);
        if (result.success && result.data) {
          return {
            success: true,
            data: result.data,
          };
        } else {
          return {
            success: false,
            error: result.error || 'User not found',
          };
        }
      }
    },
    {
      onSuccess: (result) => {
        console.log('✅ User fetched for deletion:', result);
        setUserData(result);
        setMessage('Press F5 key to delete this user ...');
        setMessageType('info');
        setErrors({});
      },
      onError: (error) => {
        console.error('❌ Error fetching user for deletion:', error);
        setUserData(null);
        setMessage(error);
        setMessageType('error');
        options.onError?.(error);
      },
    }
  );

  // ✅ CORRECCIÓN: Mutation para eliminar usuario con ApiResponse
  const { mutate: deleteUser, loading: deleteLoading } = useMutation<
    { userId: string; message: string; success: boolean },
    string
  >(
    async (userId: string): Promise<ApiResponse<{ userId: string; message: string; success: boolean }>> => {
      console.log('🗑️ Deleting user:', { userId, useMocks });
      
      if (useMocks) {
        // ✅ Para mocks, usar endpoint directo
        return apiClient.delete<{ userId: string; message: string; success: boolean }>(`/users/security/${userId}`);
      } else {
        // ✅ Para backend real, usar adaptador y convertir el resultado
        const result = await UserApiAdapter.deleteUser(userId);
        if (result.success && result.data) {
          return {
            success: true,
            data: result.data,
          };
        } else {
          return {
            success: false,
            error: result.data?.message || 'Delete failed',
          };
        }
      }
    },
    {
      onSuccess: (result) => {
        console.log('✅ User deleted successfully:', result);
        setMessage(result.message || `User ${formData.userId} has been deleted ...`);
        setMessageType('success');
        setUserData(null);
        setFormData({ userId: '' });
        options.onSuccess?.(result.message || `User ${formData.userId} has been deleted ...`);
      },
      onError: (error) => {
        console.error('❌ Error deleting user:', error);
        setMessage(error);
        setMessageType('error');
        options.onError?.(error);
      },
    }
  );

  // Validaciones
  const validateForm = useCallback((): boolean => {
    const newErrors: UserDeleteValidationErrors = {};

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID can NOT be empty...';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Handlers
  const handleFormChange = useCallback((field: keyof UserDeleteFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo correctamente
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  const handleFetchUser = useCallback(() => {
    if (!validateForm()) {
      setMessage('User ID can NOT be empty...');
      setMessageType('error');
      return;
    }

    fetchUser(formData.userId.trim());
  }, [formData.userId, fetchUser, validateForm]);

  const handleDelete = useCallback(() => {
    if (!userData) {
      setMessage('No user selected for deletion...');
      setMessageType('error');
      return;
    }

    deleteUser(userData.userId);
  }, [userData, deleteUser]);

  const handleClear = useCallback(() => {
    setFormData({ userId: '' });
    setUserData(null);
    setErrors({});
    setMessage(null);
    setMessageType(null);
  }, []);

  const handleExit = useCallback(() => {
    navigate('/admin/users/list');
  }, [navigate]);

  // Cargar usuario automáticamente si viene de la lista
  useEffect(() => {
    if (initialUserId && !userData && !fetchLoading) {
      console.log('🚀 Auto-fetching user for deletion from URL params:', initialUserId);
      fetchUser(initialUserId);
    }
  }, [initialUserId, userData, fetchLoading, fetchUser]);

  return {
    // Estados
    formData,
    errors,
    loading: fetchLoading || deleteLoading,
    message,
    messageType,
    userData,
    
    // Acciones
    handleFormChange,
    handleFetchUser,
    handleDelete,
    handleClear,
    handleExit,
    
    // Utilidades
    canDelete: userData !== null,
    isValid: Object.keys(errors).length === 0,
  };
}