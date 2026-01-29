// app/services/userApi.ts
import { apiClient } from './api';
import type { 
  UserListRequest, 
  UserListResponse, 
  UserSelectionAction, 
  UserSecurityData 
} from '~/types/user';
import type { UserAddRequest, UserAddResponse } from '~/types/userAdd';
import type { UserUpdateData } from '~/types/userUpdate';
import type { ApiResponse } from '~/types';

// Adaptador para convertir entre formato frontend y backend
export class UserApiAdapter {
  
  /**
   * Convierte request del frontend al formato del backend
   */
  private static adaptRequestToBackend(request: UserListRequest) {
    return {
      startUserId: request.searchUserId || undefined,
      pageNumber: request.page,
      direction: 'FORWARD' as const,
    };
  }

  /**
   * Convierte response del backend al formato del frontend
   */
  private static adaptResponseFromBackend(backendResponse: any): UserListResponse {
    const users: UserSecurityData[] = (backendResponse.users || []).map((user: any) => ({
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType === 'R' ? 'U' : user.userType, // Convertir R a U para compatibilidad
      isActive: true, // Asumir activo si no se especifica
    }));

    return {
      users,
      pagination: {
        page: backendResponse.pageNumber || 1,
        limit: 10,
        total: users.length, // Backend no proporciona total
        totalPages: backendResponse.hasNextPage ? backendResponse.pageNumber + 1 : backendResponse.pageNumber,
        hasNext: backendResponse.hasNextPage || false,
        hasPrev: (backendResponse.pageNumber || 1) > 1,
      },
      searchCriteria: backendResponse.firstUserId ? 'search-applied' : undefined,
    };
  }

  /**
   * Obtiene lista de usuarios del backend real
   */
  static async getUserList(request: UserListRequest) {
    const backendRequest = this.adaptRequestToBackend(request);
    
    const params = new URLSearchParams();
    if (backendRequest.startUserId) {
      params.append('startUserId', backendRequest.startUserId);
    }
    params.append('pageNumber', backendRequest.pageNumber.toString());
    params.append('direction', backendRequest.direction);

    const response = await apiClient.get(`/users/list?${params.toString()}`);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: this.adaptResponseFromBackend(response.data),
      };
    }
    
    return response;
  }

  /**
   * Procesa selección de usuario
   */
  static async processUserSelection(action: UserSelectionAction) {
    const backendRequest = {
      selectedUserId: action.userId,
      selectionFlag: action.action,
    };

    const response = await apiClient.post('/users/process-selection', backendRequest);
    
    if (response.success) {
      // Adaptar respuesta para compatibilidad
      let redirectUrl = '';
      if (action.action === 'U') {
        redirectUrl = `/admin/users/update?userId=${action.userId}`;
      } else if (action.action === 'D') {
        redirectUrl = `/admin/users/delete?userId=${action.userId}`;
      }

      return {
        success: true,
        data: {
          valid: true,
          action: action.action,
          userId: action.userId,
          redirectUrl,
          message: response.data || `User ${action.userId} ready for ${action.action === 'U' ? 'update' : 'deletion'}.`,
        },
      };
    }
    
    return response;
  }

  /**
   * Navega a página anterior
   */
  static async getPreviousPage(firstUserId: string, currentPage: number) {
    const params = new URLSearchParams();
    params.append('firstUserId', firstUserId);
    params.append('currentPage', currentPage.toString());

    const response = await apiClient.get(`/users/previous-page?${params.toString()}`);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: this.adaptResponseFromBackend(response.data),
      };
    }
    
    return response;
  }

  /**
   * Navega a página siguiente
   */
  static async getNextPage(lastUserId: string, currentPage: number, hasNextPage: boolean) {
    const params = new URLSearchParams();
    params.append('lastUserId', lastUserId);
    params.append('currentPage', currentPage.toString());
    params.append('hasNextPage', hasNextPage.toString());

    const response = await apiClient.get(`/users/next-page?${params.toString()}`);
    
    if (response.success && response.data) {
      return {
        success: true,
        data: this.adaptResponseFromBackend(response.data),
      };
    }
    
    return response;
  }

  /**
   * Crea un nuevo usuario
   * Compatible con el endpoint POST /api/users del backend Spring Boot
   * Migrado desde WRITE-USER-SEC-FILE del programa COBOL COUSR01C
   */
  static async createUser(request: UserAddRequest): Promise<{ success: boolean; data: UserAddResponse }> {
    // ✅ BACKEND REAL: Formato que espera el Spring Boot Controller
    const backendRequest = {
      userId: request.userId,
      firstName: request.firstName,
      lastName: request.lastName,
      password: request.password,
      userType: request.userType,
    };

    try {
      // ✅ BACKEND REAL: Usar el endpoint correcto del UserController
      const response = await apiClient.post<{
        success: boolean;
        message: string;
        user?: {
          userId: string;
          firstName: string;
          lastName: string;
          userType: string;
        };
      }>('/users', backendRequest);
      
      if (response.success && response.data) {
        // ✅ BACKEND REAL: El Spring Boot devuelve CreateUserResponseDto
        const userAddResponse: UserAddResponse = {
          success: response.data.success,
          message: response.data.message,
          // Solo incluir user si existe en la respuesta del backend
          ...(response.data.user && { user: response.data.user }),
        };

        return {
          success: true,
          data: userAddResponse,
        };
      }
      
      // ✅ BACKEND REAL: Manejar errores del Spring Boot
      const errorResponse: UserAddResponse = {
        success: false,
        message: response.error || 'Unable to Add User...',
      };

      return {
        success: false,
        data: errorResponse,
      };
    } catch (error) {
      // ✅ BACKEND REAL: Manejar excepciones de red o del servidor
      let errorMessage = 'Unable to Add User...';
      
      // Manejar errores específicos del backend Spring Boot
      if (error instanceof Error) {
        if (error.message.includes('409')) {
          errorMessage = 'User ID already exist...';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid user data provided...';
        } else if (error.message.includes('500')) {
          errorMessage = 'Unable to Add User...';
        } else {
          errorMessage = error.message;
        }
      }

      const errorResponse: UserAddResponse = {
        success: false,
        message: errorMessage,
      };

      return {
        success: false,
        data: errorResponse,
      };
    }
  }

  /**
   * Obtiene información de un usuario por ID
   * Compatible con GET /api/users/{userId} del backend Spring Boot
   * Migrado desde READ-USER-SEC-FILE del programa COBOL
   */
  static async getUserById(userId: string): Promise<ApiResponse<UserUpdateData>> {
    try {
      // ✅ BACKEND REAL: Endpoint del UserController
      const response = await apiClient.get<UserUpdateData>(`/users/${userId}`);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
        };
      }
      
      return {
        success: false,
        data: undefined, // ✅ Usar undefined en lugar de null
        error: response.error || 'User not found',
      };
    } catch (error) {
      let errorMessage = 'User ID NOT found...';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'User ID NOT found...';
        } else {
          errorMessage = 'Unable to lookup User...';
        }
      }

      return {
        success: false,
        data: undefined, // ✅ Usar undefined en lugar de null
        error: errorMessage,
      };
    }
  }

  /**
   * Actualiza información de un usuario
   * Compatible con PUT /api/users/{userId} del backend Spring Boot
   * Migrado desde UPDATE-USER-SEC-FILE del programa COBOL
   */
  static async updateUser(userId: string, updateData: {
    firstName: string;
    lastName: string;
    password: string;
    userType: string;
  }): Promise<ApiResponse<UserUpdateData>> {
    try {
      // ✅ BACKEND REAL: Formato que espera UserUpdateDto
      const backendRequest = {
        userId, // Requerido por el DTO
        firstName: updateData.firstName,
        lastName: updateData.lastName,
        password: updateData.password,
        userType: updateData.userType,
      };

      // ✅ BACKEND REAL: Endpoint del UserController
      const response = await apiClient.put<UserUpdateData>(`/users/${userId}`, backendRequest);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data,
          message: `User ${userId} has been updated ...`,
        };
      }
      
      return {
        success: false,
        data: undefined, // ✅ Usar undefined en lugar de null
        error: response.error || 'Unable to Update User...',
      };
    } catch (error) {
      let errorMessage = 'Unable to Update User...';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'User ID NOT found...';
        } else if (error.message.includes('400')) {
          errorMessage = 'Please modify to update ...';
        } else {
          errorMessage = 'Unable to Update User...';
        }
      }

      return {
        success: false,
        data: undefined, // ✅ Usar undefined en lugar de null
        error: errorMessage,
      };
    }
  }

  /**
   * Elimina un usuario del sistema
   * Compatible con DELETE /api/users/{userId} del backend Spring Boot
   * Migrado desde DELETE-USER-SEC-FILE del programa COBOL
   */
  static async deleteUser(userId: string) {
    try {
      // ✅ BACKEND REAL: Endpoint del UserController
      const response = await apiClient.delete<{
        userId: string;
        message: string;
        success: boolean;
      }>(`/users/${userId}`);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: {
            userId: response.data.userId,
            message: response.data.message,
            success: response.data.success,
          },
        };
      }
      
      return {
        success: false,
        data: {
          userId,
          message: response.error || 'Unable to Update User...',
          success: false,
        },
      };
    } catch (error) {
      let errorMessage = 'Unable to Update User...';
      
      if (error instanceof Error) {
        if (error.message.includes('404')) {
          errorMessage = 'User ID NOT found...';
        } else if (error.message.includes('400')) {
          errorMessage = 'User ID can NOT be empty...';
        } else {
          errorMessage = 'Unable to Update User...';
        }
      }

      return {
        success: false,
        data: {
          userId,
          message: errorMessage,
          success: false,
        },
      };
    }
  }
}