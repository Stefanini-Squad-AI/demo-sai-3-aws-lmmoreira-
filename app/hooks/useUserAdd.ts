// app/hooks/useUserAdd.ts
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from './useApi';
import { apiClient } from '~/services/api';
import { UserApiAdapter } from '~/services/userApi';
import type { UserAddFormData, UserAddRequest, UserAddResponse, UserAddValidationErrors } from '~/types/userAdd';

interface UseUserAddOptions {
  onSuccess?: (response: UserAddResponse) => void;
  onError?: (error: string) => void;
}

export function useUserAdd(options: UseUserAddOptions = {}) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<UserAddFormData>({
    firstName: '',
    lastName: '',
    userId: '',
    password: '',
    userType: 'U',
  });
  const [validationErrors, setValidationErrors] = useState<UserAddValidationErrors>({});
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Detectar si usar mocks o backend real
  const useMocks = import.meta.env.VITE_USE_MOCKS === 'true';

  // Mutation para crear usuario
  const { mutate: createUser, loading, error } = useMutation(
    async (request: UserAddRequest) => {
      console.log('🔍 Creating user with:', { useMocks, request });
      
      if (useMocks) {
        // Usar endpoint de mocks
        return apiClient.post<UserAddResponse>('/users/add', request);
      } else {
        // Usar adaptador para backend real
        return UserApiAdapter.createUser(request);
      }
    },
    {
      onSuccess: (response) => {
        console.log('✅ User created successfully:', response);
        setSuccessMessage(response.message);
        clearForm();
        options.onSuccess?.(response);
      },
      onError: (error) => {
        console.error('❌ Error creating user:', error);
        setSuccessMessage('');
        options.onError?.(error);
      },
    }
  );

  // Validar formulario (como en PROCESS-ENTER-KEY)
  const validateForm = useCallback((): boolean => {
    const errors: UserAddValidationErrors = {};
    let isValid = true;

    // Validaciones como en el COBOL original
    if (!formData.firstName.trim()) {
      errors.firstName = 'First Name can NOT be empty...';
      isValid = false;
    }

    if (!formData.lastName.trim()) {
      errors.lastName = 'Last Name can NOT be empty...';
      isValid = false;
    }

    if (!formData.userId.trim()) {
      errors.userId = 'User ID can NOT be empty...';
      isValid = false;
    } else if (formData.userId.length > 8) {
      errors.userId = 'User ID must be 8 characters or less';
      isValid = false;
    }

    if (!formData.password.trim()) {
      errors.password = 'Password can NOT be empty...';
      isValid = false;
    } else if (formData.password.length > 8) {
      errors.password = 'Password must be 8 characters or less';
      isValid = false;
    }

    if (!formData.userType) {
      errors.userType = 'User Type can NOT be empty...';
      isValid = false;
    } else if (!['A', 'U'].includes(formData.userType)) {
      errors.userType = 'User Type must be A (Admin) or U (User)';
      isValid = false;
    }

    setValidationErrors(errors);
    return isValid;
  }, [formData]);

  // Manejar cambios en campos
  const handleFieldChange = useCallback((field: keyof UserAddFormData, value: string) => {
    // Aplicar transformaciones según el campo
    let processedValue = value;
    
    if (field === 'userId' || field === 'userType') {
      processedValue = value.toUpperCase();
    }
    
    // Limitar longitud según el campo
    const maxLengths = {
      firstName: 20,
      lastName: 20,
      userId: 8,
      password: 8,
      userType: 1,
    };
    
    if (processedValue.length <= maxLengths[field]) {
      setFormData(prev => ({ ...prev, [field]: processedValue }));
      
      // Limpiar error del campo si existe
      if (validationErrors[field]) {
        setValidationErrors(prev => ({ ...prev, [field]: undefined }));
      }
      
      // Limpiar mensaje de éxito si hay cambios
      if (successMessage) {
        setSuccessMessage('');
      }
    }
  }, [validationErrors, successMessage]);

  // Enviar formulario (como PROCESS-ENTER-KEY)
  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    const request: UserAddRequest = {
      userId: formData.userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      password: formData.password,
      userType: formData.userType,
    };

    await createUser(request);
  }, [formData, validateForm, createUser]);

  // Limpiar formulario (como F4=Clear)
  const clearForm = useCallback(() => {
    setFormData({
      firstName: '',
      lastName: '',
      userId: '',
      password: '',
      userType: 'U',
    });
    setValidationErrors({});
    setSuccessMessage('');
  }, []);

  // Volver al menú admin (como F3=Back)
  const handleBack = useCallback(() => {
    navigate('/menu/admin');
  }, [navigate]);

  // Salir del sistema (como F12=Exit)
  const handleExit = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    // Estado
    formData,
    validationErrors,
    successMessage,
    loading,
    error,
    
    // Acciones
    handleFieldChange,
    handleSubmit,
    clearForm,
    handleBack,
    handleExit,
    
    // Utilidades
    validateForm,
  };
}