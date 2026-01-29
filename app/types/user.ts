// app/types/user.ts (actualizar para backend real)
export interface UserSecurityData {
  userId: string;
  firstName: string;
  lastName: string;
  userType: 'A' | 'U' | 'R'; // ✅ Mantener 'R' en el tipo base
  createdDate?: string;
  lastLoginDate?: string;
  isActive?: boolean;
}

export type NormalizedUserType = 'A' | 'U';

export const normalizeUserType = (userType: 'A' | 'U' | 'R'): NormalizedUserType => {
  return userType === 'R' ? 'U' : userType;
};
// ✅ NUEVO: Tipo para el backend real
export interface UserListItemDto {
  userId: string;
  firstName: string;
  lastName: string;
  userType: string;
}

export interface UserListRequest {
  searchUserId?: string | undefined;
  page: number;
  limit: number;
  // ✅ NUEVO: Campos para backend real
  startUserId?: string;
  pageNumber?: number;
  direction?: 'FORWARD' | 'BACKWARD';
}

export interface UserListResponse {
  users: UserSecurityData[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  searchCriteria?: string | undefined;
  // ✅ NUEVO: Campos del backend real
  pageNumber?: number;
  hasNextPage?: boolean;
  firstUserId?: string;
  lastUserId?: string;
  message?: string;
}

export interface UserSelectionAction {
  action: 'U' | 'D';
  userId: string;
  // ✅ NUEVO: Campos para backend real
  selectedUserId?: string;
  selectionFlag?: string;
}