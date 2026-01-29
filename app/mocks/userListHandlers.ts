// app/mocks/userListHandlers.ts
import { http, HttpResponse } from 'msw';
import type { UserSecurityData, UserListRequest, UserListResponse } from '~/types/user';

// Datos mock que simulan el archivo USRSEC del mainframe
const mockUsers: UserSecurityData[] = [
  {
    userId: 'ADMIN001',
    firstName: 'System',
    lastName: 'Administrator',
    userType: 'A',
    createdDate: '2024-01-15',
    lastLoginDate: '2024-03-15',
    isActive: true,
  },
  {
    userId: 'USER001',
    firstName: 'John',
    lastName: 'Smith',
    userType: 'U',
    createdDate: '2024-01-20',
    lastLoginDate: '2024-03-14',
    isActive: true,
  },
  {
    userId: 'USER0002',
    firstName: 'Jane',
    lastName: 'Doe',
    userType: 'U',
    createdDate: '2024-02-01',
    lastLoginDate: '2024-03-13',
    isActive: true,
  },
  {
    userId: 'TESTUSER',
    firstName: 'Test',
    lastName: 'User',
    userType: 'U',
    createdDate: '2024-02-15',
    lastLoginDate: '2024-03-12',
    isActive: true,
  },
  {
    userId: 'MANAGER1',
    firstName: 'Alice',
    lastName: 'Johnson',
    userType: 'A',
    createdDate: '2024-01-10',
    lastLoginDate: '2024-03-15',
    isActive: true,
  },
  {
    userId: 'CLERK001',
    firstName: 'Bob',
    lastName: 'Wilson',
    userType: 'U',
    createdDate: '2024-02-20',
    lastLoginDate: '2024-03-11',
    isActive: true,
  },
  {
    userId: 'CLERK002',
    firstName: 'Carol',
    lastName: 'Brown',
    userType: 'U',
    createdDate: '2024-02-25',
    lastLoginDate: '2024-03-10',
    isActive: false,
  },
  {
    userId: 'SUPPORT1',
    firstName: 'David',
    lastName: 'Miller',
    userType: 'U',
    createdDate: '2024-03-01',
    lastLoginDate: '2024-03-09',
    isActive: true,
  },
  {
    userId: 'AUDITOR1',
    firstName: 'Emily',
    lastName: 'Davis',
    userType: 'U',
    createdDate: '2024-03-05',
    lastLoginDate: '2024-03-08',
    isActive: true,
  },
  {
    userId: 'OPERATOR',
    firstName: 'Frank',
    lastName: 'Martinez',
    userType: 'U',
    createdDate: '2024-03-10',
    lastLoginDate: '2024-03-07',
    isActive: true,
  },
];

export const userListHandlers = [
  // Obtener lista de usuarios con búsqueda y paginación
  http.get('/api/users/security', async ({ request }) => {
    const url = new URL(request.url);
    const searchUserId = url.searchParams.get('searchUserId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');

    console.log('🔍 MSW User List Request:', { searchUserId, page, limit });

    // Simular delay del mainframe
    await new Promise(resolve => setTimeout(resolve, 300));

    // Filtrar usuarios por criterio de búsqueda (como STARTBR en COBOL)
    let filteredUsers = mockUsers;
    
    if (searchUserId) {
      // Simular búsqueda por prefijo como en el mainframe original
      filteredUsers = mockUsers.filter(user => 
        user.userId.startsWith(searchUserId.toUpperCase())
      );
    }

    // Ordenar por userId (como en el archivo USRSEC)
    filteredUsers.sort((a, b) => a.userId.localeCompare(b.userId));

    // Aplicar paginación
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    const response: UserListResponse = {
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
        hasNext: endIndex < filteredUsers.length,
        hasPrev: page > 1,
      },
      searchCriteria: searchUserId || undefined,
    };

    console.log('✅ MSW User List Response:', response);

    return HttpResponse.json({
      success: true,
      data: response,
    });
  }),

  // Validar acción de usuario (Update/Delete)
  http.post('/api/users/validate-action', async ({ request }) => {
    const action = await request.json() as { action: 'U' | 'D'; userId: string };
    
    console.log('🎯 MSW User Action Validation:', action);

    // Simular validación como en el COBOL original
    const user = mockUsers.find(u => u.userId === action.userId);
    
    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          error: 'User not found. Please verify the User ID.',
        },
        { status: 404 }
      );
    }

    // Simular lógica de validación de permisos
    if (action.action === 'D' && user.userType === 'A') {
      return HttpResponse.json(
        {
          success: false,
          error: 'Cannot delete administrator users.',
        },
        { status: 403 }
      );
    }

    // Determinar URL de redirección basada en la acción
    let redirectUrl: string;
    switch (action.action) {
      case 'U':
        redirectUrl = `/admin/users/update?userId=${action.userId}`;
        break;
      case 'D':
        redirectUrl = `/admin/users/delete?userId=${action.userId}`;
        break;
      default:
        return HttpResponse.json(
          {
            success: false,
            error: 'Invalid action. Valid values are U (Update) and D (Delete).',
          },
          { status: 400 }
        );
    }

    return HttpResponse.json({
      success: true,
      data: {
        valid: true,
        action: action.action,
        userId: action.userId,
        redirectUrl,
        message: `User ${action.userId} ready for ${action.action === 'U' ? 'update' : 'deletion'}.`,
      },
    });
  }),

  // Obtener detalles de un usuario específico
  http.get('/api/users/security/:userId', ({ params }) => {
    const { userId } = params;
    const user = mockUsers.find(u => u.userId === userId);

    if (!user) {
      return HttpResponse.json(
        {
          success: false,
          error: 'User not found',
        },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: user,
    });
  }),
];