// app/hooks/useUserUpdate.ts (versión corregida)
import { useState, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import { UserApiAdapter } from '~/services/userApi';
import type { 
  UserUpdateFormData, 
  UserUpdateValidationErrors,
  UserUpdateData,
  UserUpdateRequest 
} from '~/types/userUpdate';
import type { ApiResponse } from '~/types';

interface UseUserUpdateOptions {
  onError?: (error: string) => void;
  onSuccess?: (message: string) => void;
}

export function useUserUpdate(options: UseUserUpdateOptions = {}) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialUserId = searchParams.get('userId') || '';

  // Estados del formulario
  const [formData, setFormData] = useState<UserUpdateFormData>({
    userId: initialUserId,
    firstName: '',
    lastName: '',
    password: '',
    userType: '',
  });

  const [errors, setErrors] = useState<UserUpdateValidationErrors>({});
  const [message, setMessage] = useState<string | null>(null);
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info' | null>(null);
  const [userData, setUserData] = useState<UserUpdateData | null>(null);

  // Detectar si usar mocks o backend real
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

  // ✅ CORRECCIÓN: Mutation para buscar usuario con tipos correctos
  const { mutate: fetchUser, loading: fetchLoading } = useMutation<
    UserUpdateData,
    string
  >(
    async (userId: string): Promise<ApiResponse<UserUpdateData>> => {
      console.log('🔍 Fetching user:', { userId, useMocks });
      
      if (useMocks) {
        // ✅ Para mocks, usar endpoint directo
        return apiClient.get<UserUpdateData>(`/users/security/${userId}`);
      } else {
        // ✅ Para backend real, usar adaptador
        return UserApiAdapter.getUserById(userId);
      }
    },
    {
      onSuccess: (result) => {
        console.log('✅ User fetched successfully:', result);
        setUserData(result);
        setFormData(prev => ({
          ...prev,
          firstName: result.firstName,
          lastName: result.lastName,
          password: result.password || '',
          userType: result.userType,
        }));
        setMessage('Press F5 key to save your updates ...');
        setMessageType('info');
        setErrors({});
      },
      onError: (error) => {
        console.error('❌ Error fetching user:', error);
        setUserData(null);
        setFormData(prev => ({
          ...prev,
          firstName: '',
          lastName: '',
          password: '',
          userType: '',
        }));
        setMessage(error);
        setMessageType('error');
        options.onError?.(error);
      },
    }
  );

  // ✅ CORRECCIÓN: Mutation para actualizar usuario con tipos correctos
  const { mutate: updateUser, loading: updateLoading } = useMutation<
    UserUpdateData,
    UserUpdateRequest
  >(
    async (data: UserUpdateRequest): Promise<ApiResponse<UserUpdateData>> => {
      console.log('🔄 Updating user:', { data, useMocks });
      
      if (useMocks) {
        // ✅ Para mocks, usar endpoint directo
        return apiClient.put<UserUpdateData>(`/users/security/${data.userId}`, data);
      } else {
        // ✅ Para backend real, usar adaptador
        return UserApiAdapter.updateUser(data.userId, {
          firstName: data.firstName,
          lastName: data.lastName,
          password: data.password,
          userType: data.userType,
        });
      }
    },
    {
      onSuccess: (result) => {
        console.log('✅ User updated successfully:', result);
        setMessage(`User ${formData.userId} has been updated ...`);
        setMessageType('success');
        options.onSuccess?.(`User ${formData.userId} has been updated ...`);
      },
      onError: (error) => {
        console.error('❌ Error updating user:', error);
        setMessage(error);
        setMessageType('error');
        options.onError?.(error);
      },
    }
  );

  // Validaciones
  const validateForm = useCallback((): boolean => {
    const newErrors: UserUpdateValidationErrors = {};

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID can NOT be empty...';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First Name can NOT be empty...';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last Name can NOT be empty...';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password can NOT be empty...';
    } else if (formData.password.length !== 8) {
      newErrors.password = 'Password must be exactly 8 characters...';
    }

    if (!formData.userType) {
      newErrors.userType = 'User Type can NOT be empty...';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Verificar si hay cambios
  const hasChanges = useCallback((): boolean => {
    if (!userData) return false;
    
    return (
      formData.firstName !== userData.firstName ||
      formData.lastName !== userData.lastName ||
      formData.password !== (userData.password || '') ||
      formData.userType !== userData.userType
    );
  }, [formData, userData]);

  // Handlers
  const handleFormChange = useCallback((field: keyof UserUpdateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleFetchUser = useCallback(() => {
    if (!formData.userId.trim()) {
      setErrors({ userId: 'User ID can NOT be empty...' });
      setMessage('User ID can NOT be empty...');
      setMessageType('error');
      return;
    }

    fetchUser(formData.userId.trim());
  }, [formData.userId, fetchUser]);

  const handleSave = useCallback(() => {
    if (!validateForm()) {
      setMessage('Please correct the errors and try again...');
      setMessageType('error');
      return;
    }

    if (!hasChanges()) {
      setMessage('Please modify to update ...');
      setMessageType('error');
      return;
    }

    const updateRequest: UserUpdateRequest = {
      userId: formData.userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      userType: formData.userType,
    };

    updateUser(updateRequest);
  }, [validateForm, hasChanges, formData, updateUser]);

  const handleSaveAndExit = useCallback(() => {
    if (!validateForm()) {
      setMessage('Please correct the errors and try again...');
      setMessageType('error');
      return;
    }

    if (!hasChanges()) {
      // Si no hay cambios, simplemente salir
      navigate('/admin/users/list');
      return;
    }

    const updateRequest: UserUpdateRequest = {
      userId: formData.userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      userType: formData.userType,
    };

    // ✅ CORRECCIÓN: Manejar la navegación después de la actualización
    updateUser(updateRequest);
    
    // Usar un timeout para permitir que se muestre el mensaje antes de navegar
    setTimeout(() => {
      navigate('/admin/users/list');
    }, 1500);
  }, [validateForm, hasChanges, formData, updateUser, navigate]);

  const handleClear = useCallback(() => {
    setFormData({
      userId: '',
      firstName: '',
      lastName: '',
      password: '',
      userType: '',
    });
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
      console.log('🚀 Auto-fetching user from URL params:', initialUserId);
      fetchUser(initialUserId);
    }
  }, [initialUserId, userData, fetchLoading, fetchUser]);

  return {
    // Estados
    formData,
    errors,
    loading: fetchLoading || updateLoading,
    message,
    messageType,
    userData,
    
    // Acciones
    handleFormChange,
    handleFetchUser,
    handleSave,
    handleSaveAndExit,
    handleClear,
    handleExit,
    
    // Utilidades
    hasChanges: hasChanges(),
    isValid: Object.keys(errors).length === 0,
  };
}