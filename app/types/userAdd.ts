// app/types/userAdd.ts (asegurar que esté completo)
export interface UserAddFormData {
  firstName: string;
  lastName: string;
  userId: string;
  password: string;
  userType: 'A' | 'U';
}

export interface UserAddRequest {
  userId: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: string;
}

export interface UserAddResponse {
  success: boolean;
  message: string;
  user?: {
    userId: string;
    firstName: string;
    lastName: string;
    userType: string;
  };
}

export interface UserAddValidationErrors {
  firstName?: string;
  lastName?: string;
  userId?: string;
  password?: string;
  userType?: string;
}