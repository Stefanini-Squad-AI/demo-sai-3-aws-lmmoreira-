// app/types/userUpdate.ts (actualizar)
export interface UserUpdateData {
  userId: string;
  firstName: string;
  lastName: string;
  userType: 'A' | 'U';
  password?: string; // ✅ Hacer opcional para respuestas
  createdDate?: string;
  lastLoginDate?: string;
  isActive?: boolean;
}

export interface UserUpdateRequest {
  userId: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: string;
}

export interface UserUpdateResponse {
  success: boolean;
  message: string;
  user?: UserUpdateData;
}

export interface UserUpdateFormData {
  userId: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: 'A' | 'U' | '';
}

export interface UserUpdateValidationErrors {
  userId?: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  userType?: string;
}

// ✅ NUEVO: Tipo específico para la respuesta del adaptador
export interface UserUpdateApiResponse {
  success: boolean;
  data: UserUpdateData | null;
  error?: string;
  message?: string;
}