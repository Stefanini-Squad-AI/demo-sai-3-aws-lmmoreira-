// app/mocks/handlers.ts
import { http, HttpResponse } from "msw";
import { accountHandlers } from './accountHandlers';
import { accountUpdateHandlers } from './accountUpdateHandlers';
import { creditCardHandlers } from './creditCardHandlers';
import { creditCardDetailHandlers } from './creditCardDetailHandlers';
import { creditCardUpdateHandlers } from './creditCardUpdateHandlers';
import { transactionAddHandlers } from './transactionAddHandlers';
import { transactionListHandlers } from './transactionListHandlers';
import { transactionViewHandlers } from './transactionViewHandlers';
import { transactionReportsHandlers } from './transactionReportsHandlers';
import { billPaymentHandlers } from './billPaymentHandlers';
import { userListHandlers } from './userListHandlers';
import { userAddHandlers } from './userAddHandlers';
import { userUpdateHandlers } from './userUpdateHandlers';
import { userDeleteHandlers } from './userDeleteHandlers';

// URL base para APIs
const API_BASE = "/api";

// Tipo para usuario
interface User {
  id: number;
  userId: string;
  name: string;
  role: string;
  avatar: string;
  createdAt: string;
}

// Datos mock mejorados
const mockUsers: User[] = [
  { 
    id: 1, 
    userId: "ADMIN001",
    name: "Administrator User", 
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=1",
    createdAt: "2024-01-15T10:30:00Z"
  },
  { 
    id: 2, 
    userId: "USER001",
    name: "Back Office User", 
    role: "back-office",
    avatar: "https://i.pravatar.cc/150?img=2",
    createdAt: "2024-01-10T08:15:00Z"
  },
  { 
    id: 3, 
    userId: "TESTUSER",
    name: "Test User", 
    role: "back-office",
    avatar: "https://i.pravatar.cc/150?img=3",
    createdAt: "2024-01-20T14:45:00Z"
  },
  { 
    id: 4, 
    userId: "USER0002",
    name: "Jane Doe", 
    role: "back-office",
    avatar: "https://i.pravatar.cc/150?img=4",
    createdAt: "2024-02-01T09:00:00Z"
  },
  { 
    id: 5, 
    userId: "MANAGER1",
    name: "Alice Johnson", 
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=5",
    createdAt: "2024-01-10T07:30:00Z"
  },
  { 
    id: 6, 
    userId: "CLERK001",
    name: "Bob Wilson", 
    role: "back-office",
    avatar: "https://i.pravatar.cc/150?img=6",
    createdAt: "2024-02-20T11:15:00Z"
  },
  { 
    id: 7, 
    userId: "CLERK002",
    name: "Carol Brown", 
    role: "back-office",
    avatar: "https://i.pravatar.cc/150?img=7",
    createdAt: "2024-02-25T10:00:00Z"
  },
  { 
    id: 8, 
    userId: "SUPPORT1",
    name: "David Miller", 
    role: "back-office",
    avatar: "https://i.pravatar.cc/150?img=8",
    createdAt: "2024-03-01T08:45:00Z"
  },
  { 
    id: 9, 
    userId: "AUDITOR1",
    name: "Emily Davis", 
    role: "back-office",
    avatar: "https://i.pravatar.cc/150?img=9",
    createdAt: "2024-03-05T13:20:00Z"
  },
  { 
    id: 10, 
    userId: "OPERATOR",
    name: "Frank Martinez", 
    role: "back-office",
    avatar: "https://i.pravatar.cc/150?img=10",
    createdAt: "2024-03-10T12:30:00Z"
  },
];

// Handlers de autenticación
export const authHandlers = [
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = (await request.json()) as { userId: string; password: string };

    console.log('🔐 MSW Login attempt:', body);

    // Simular la validación del archivo USRSEC del mainframe
    const validUsers = [
      { 
        userId: "ADMIN001", 
        password: "PASSWORD", 
        role: "admin", 
        name: "Administrator User",
        userType: "A" // Como en el COBOL: SEC-USR-TYPE
      },
      { 
        userId: "USER001", 
        password: "PASSWORD", 
        role: "back-office", 
        name: "Back Office User",
        userType: "U"
      },
      { 
        userId: "TESTUSER", 
        password: "TESTPASS", 
        role: "back-office", 
        name: "Test User",
        userType: "U"
      },
    ];

    const user = validUsers.find(u => 
      u.userId === body.userId && u.password === body.password
    );

    if (user) {
      // ✅ CORRECCIÓN CRÍTICA: Devolver la estructura que espera authSlice
      const mockResponse = {
        success: true,
        data: {
          accessToken: `mock-jwt-token-${user.userId}-${Date.now()}`,
          refreshToken: `mock-refresh-token-${user.userId}-${Date.now()}`,
          tokenType: "Bearer",
          userId: user.userId,
          fullName: user.name,
          userType: user.userType, // 'A' para admin, 'U' para back-office
          expiresIn: 86400000, // 24 horas
          message: "Authentication successful"
        }
      };

      console.log('✅ MSW Login successful:', mockResponse);
      return HttpResponse.json(mockResponse);
    }

    // Validaciones como en el COBOL original
    if (!body.userId || body.userId.trim() === '') {
      return HttpResponse.json(
        {
          success: false,
          error: "Please enter User ID ...",
        },
        { status: 400 }
      );
    }

    if (!body.password || body.password.trim() === '') {
      return HttpResponse.json(
        {
          success: false,
          error: "Please enter Password ...",
        },
        { status: 400 }
      );
    }

    // Usuario no encontrado (RESP-CD = 13 en COBOL)
    const userExists = validUsers.some(u => u.userId === body.userId);
    if (!userExists) {
      return HttpResponse.json(
        {
          success: false,
          error: "User not found. Try again ...",
        },
        { status: 401 }
      );
    }

    // Contraseña incorrecta
    return HttpResponse.json(
      {
        success: false,
        error: "Wrong Password. Try again ...",
      },
      { status: 401 }
    );
  }),

  http.post(`${API_BASE}/auth/logout`, () => {
    return HttpResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  }),

  http.get(`${API_BASE}/auth/me`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        id: 1,
        userId: "ADMIN001",
        name: "Administrator User",
        role: "admin",
        avatar: "https://i.pravatar.cc/150?img=1",
      },
    });
  }),

  http.post(`${API_BASE}/auth/refresh`, ({ request }) => {
    const authHeader = request.headers.get("Authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return HttpResponse.json(
        { success: false, error: "Invalid refresh token" },
        { status: 401 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        accessToken: "mock-jwt-token-refreshed-" + Date.now(),
        tokenType: "Bearer",
        message: "Token refreshed successfully"
      },
    });
  }),

  // ✅ CORRECCIÓN: Agregar endpoint de validación de token
  http.post(`${API_BASE}/auth/validate`, async ({ request }) => {
    const body = (await request.json()) as { token: string };

    if (!body.token) {
      return HttpResponse.json({
        success: true,
        data: {
          valid: false,
          message: "Token is required"
        }
      });
    }

    // Simular validación del token
    const isValid = body.token.startsWith('mock-jwt-token-');
    
    if (isValid) {
      // Extraer userId del token mock
      const tokenParts = body.token.split('-');
      const userId = tokenParts.length > 3 ? tokenParts[3] : "ADMIN001";
      
      return HttpResponse.json({
        success: true,
        data: {
          valid: true,
          userId: userId,
          message: "Token is valid"
        }
      });
    }
    
    return HttpResponse.json({
      success: true,
      data: {
        valid: false,
        message: "Token is invalid"
      }
    });
  }),
];

// Handlers de usuarios
export const userHandlers = [
  http.get(`${API_BASE}/users`, ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '10');
    const search = url.searchParams.get('search') || '';

    let filteredUsers = mockUsers;
    
    if (search) {
      filteredUsers = mockUsers.filter(user => 
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.userId.toLowerCase().includes(search.toLowerCase())
      );
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = filteredUsers.slice(startIndex, endIndex);

    return HttpResponse.json({
      success: true,
      data: paginatedUsers,
      pagination: {
        page,
        limit,
        total: filteredUsers.length,
        totalPages: Math.ceil(filteredUsers.length / limit),
        hasNext: endIndex < filteredUsers.length,
        hasPrev: page > 1,
      },
    });
  }),

  http.get(`${API_BASE}/users/:id`, ({ params }) => {
    const { id } = params;
    const user = mockUsers.find(u => u.id === Number(id));

    if (!user) {
      return HttpResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: user,
    });
  }),

  http.post(`${API_BASE}/users`, async ({ request }) => {
    const body = (await request.json()) as { name: string; userId: string; role: string };
    
    const newUser: User = {
      id: mockUsers.length + 1,
      userId: body.userId,
      name: body.name,
      role: body.role,
      avatar: `https://i.pravatar.cc/150?img=${mockUsers.length + 1}`,
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    return HttpResponse.json({
      success: true,
      data: newUser,
    }, { status: 201 });
  }),

  http.put(`${API_BASE}/users/:id`, async ({ params, request }) => {
    const { id } = params;
    const body = (await request.json()) as {
      id?: number;
      userId?: string;
      name?: string;
      role?: string;
      avatar?: string;
      createdAt?: string;
    };
    const userIndex = mockUsers.findIndex(u => u.id === Number(id));

    if (userIndex === -1) {
      return HttpResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const existingUser = mockUsers[userIndex];
    if (!existingUser) {
      return HttpResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const updatedUser: User = {
      id: existingUser.id,
      userId: body.userId ?? existingUser.userId,
      name: body.name ?? existingUser.name,
      role: body.role ?? existingUser.role,
      avatar: body.avatar ?? existingUser.avatar,
      createdAt: body.createdAt ?? existingUser.createdAt,
    };

    mockUsers[userIndex] = updatedUser;

    return HttpResponse.json({
      success: true,
      data: updatedUser,
    });
  }),

  http.delete(`${API_BASE}/users/:id`, ({ params }) => {
    const { id } = params;
    const userIndex = mockUsers.findIndex(u => u.id === Number(id));

    if (userIndex === -1) {
      return HttpResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    mockUsers.splice(userIndex, 1);

    return HttpResponse.json({
      success: true,
      message: "User deleted successfully",
    });
  }),
];

// Handlers de configuración/sistema
export const systemHandlers = [
  http.get(`${API_BASE}/health`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
      },
    });
  }),

  http.get(`${API_BASE}/config`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        appName: "CardDemo React SPA",
        version: "1.0.0",
        features: {
          darkMode: true,
          notifications: true,
          analytics: false,
        },
      },
    });
  }),
];

// Handlers de menú
export const menuHandlers = [
  http.get(`${API_BASE}/menu/main`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        title: 'CardDemo - Menú Principal',
        subtitle: 'Funciones Back-Office del Sistema',
        transactionId: 'CC00',
        programName: 'COMEN01',
        options: [
          {
            id: 'account-view',
            label: 'Account View',
            description: 'Consultar información de cuentas',
            path: '/accounts/view',
          },
          {
            id: 'account-update',
            label: 'Account Update',
            description: 'Actualizar información de cuentas',
            path: '/accounts/update',
          },
          {
            id: 'credit-card-list',
            label: 'Credit Card List',
            description: 'Listar todas las tarjetas de crédito',
            path: '/cards/list',
          },
          {
            id: 'credit-card-view',
            label: 'Credit Card View',
            description: 'Ver detalles de tarjeta de crédito',
            path: '/cards/view',
          },
          {
            id: 'credit-card-update',
            label: 'Credit Card Update',
            description: 'Actualizar tarjeta de crédito',
            path: '/cards/update',
          },
          {
            id: 'credit-card-delete',
            label: 'Credit Card Delete',
            description: 'Eliminar tarjeta de crédito',
            path: '/cards/delete',
          },
          {
            id: 'transaction-add',
            label: 'Transaction Add',
            description: 'Agregar nueva transacción',
            path: '/transactions/add',
          },
          {
            id: 'transaction-update',
            label: 'Transaction Update',
            description: 'Actualizar transacción existente',
            path: '/transactions/update',
          },
          {
            id: 'transaction-reports',
            label: 'Transaction Reports',
            description: 'Generar reportes de transacciones',
            path: '/reports/transactions',
          },
          {
            id: 'bill-payment',
            label: 'Bill Payment',
            description: 'Procesar pagos de facturas',
            path: '/payments/bills',
          },
        ],
      },
    });
  }),

  http.get(`${API_BASE}/menu/admin`, () => {
    return HttpResponse.json({
      success: true,
      data: {
        title: 'CardDemo - Menú de Administración',
        subtitle: 'Funciones de Seguridad y Administración',
        transactionId: 'CADM',
        programName: 'COADM01',
        options: [
          {
            id: 'user-list',
            label: 'User List (Security)',
            description: 'Listar todos los usuarios del sistema',
            path: '/admin/users/list',
          },
          {
            id: 'user-add',
            label: 'User Add (Security)',
            description: 'Agregar nuevo usuario al sistema',
            path: '/admin/users/add',
          },
          {
            id: 'user-update',
            label: 'User Update (Security)',
            description: 'Actualizar información de usuario',
            path: '/admin/users/update',
          },
          {
            id: 'user-delete',
            label: 'User Delete (Security)',
            description: 'Eliminar usuario del sistema',
            path: '/admin/users/delete',
          },
        ],
      },
    });
  }),

  http.post(`${API_BASE}/menu/validate`, async ({ request }) => {
    const { optionId } = await request.json() as {
      optionId: string;
      menuType: 'main' | 'admin';
    };

    if (optionId === 'invalid-option') {
      return HttpResponse.json(
        {
          success: false,
          error: 'Opción no válida. Por favor seleccione una opción válida.',
        },
        { status: 400 }
      );
    }

    return HttpResponse.json({
      success: true,
      data: {
        optionId,
        validated: true,
        redirectUrl: `/redirect/${optionId}`,
      },
    });
  }),
];

// Combinar todos los handlers
export const handlers = [
  ...userListHandlers,
  ...authHandlers, 
  ...userHandlers, 
  ...systemHandlers,
  ...menuHandlers,
  ...accountHandlers,
  ...accountUpdateHandlers,
  ...creditCardHandlers,
  ...creditCardDetailHandlers,
  ...creditCardUpdateHandlers,
  ...transactionAddHandlers,
  ...transactionListHandlers,
  ...transactionViewHandlers,
  ...transactionReportsHandlers,
  ...billPaymentHandlers,
  ...userAddHandlers,
  ...userUpdateHandlers,
  ...userDeleteHandlers,
];