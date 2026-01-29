// app/types/userDelete.ts
export interface UserDeleteData {
  userId: string;
  firstName: string;
  lastName: string;
  userType: 'A' | 'U';
}

export interface UserDeleteRequest {
  userId: string;
}

export interface UserDeleteResponse {
  success: boolean;
  message: string;
  userId: string;
}

export interface UserDeleteFormData {
  userId: string;
}

export interface UserDeleteValidationErrors {
  userId?: string;
}