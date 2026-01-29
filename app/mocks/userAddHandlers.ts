// app/mocks/userAddHandlers.ts (corregir)
import { http, HttpResponse } from 'msw';
import type { UserAddRequest, UserAddResponse } from '~/types/userAdd';

// Base de datos mock de usuarios
const mockUsers: Array<{
  userId: string;
  firstName: string;
  lastName: string;
  password: string;
  userType: string;
  createdAt: string;
}> = [
  {
    userId: 'ADMIN001',
    firstName: 'System',
    lastName: 'Administrator',
    password: 'PASSWORD',
    userType: 'A',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    userId: 'USER001',
    firstName: 'John',
    lastName: 'Smith',
    password: 'PASSWORD',
    userType: 'U',
    createdAt: '2024-01-20T08:15:00Z',
  },
];

export const userAddHandlers = [
  // Crear nuevo usuario (endpoint para mocks)
  http.post('/api/users/add', async ({ request }) => {
    const body = await request.json() as UserAddRequest;
    
    console.log('🔍 MSW User Add Request:', body);

    // Simular delay del mainframe
    await new Promise(resolve => setTimeout(resolve, 500));

    // Validaciones como en el COBOL original
    if (!body.firstName?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'First Name can NOT be empty...',
        } as UserAddResponse,
        { status: 400 }
      );
    }

    if (!body.lastName?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Last Name can NOT be empty...',
        } as UserAddResponse,
        { status: 400 }
      );
    }

    if (!body.userId?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'User ID can NOT be empty...',
        } as UserAddResponse,
        { status: 400 }
      );
    }

    if (!body.password?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Password can NOT be empty...',
        } as UserAddResponse,
        { status: 400 }
      );
    }

    if (!body.userType?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'User Type can NOT be empty...',
        } as UserAddResponse,
        { status: 400 }
      );
    }

    if (!['A', 'U'].includes(body.userType.toUpperCase())) {
      return HttpResponse.json(
        {
          success: false,
          message: 'User Type must be A (Admin) or U (User)',
        } as UserAddResponse,
        { status: 400 }
      );
    }

    // Verificar si el usuario ya existe (como DFHRESP(DUPKEY))
    const existingUser = mockUsers.find(u => u.userId === body.userId.toUpperCase());
    if (existingUser) {
      return HttpResponse.json(
        {
          success: false,
          message: 'User ID already exist...',
        } as UserAddResponse,
        { status: 409 }
      );
    }

    // Crear nuevo usuario
    const newUser = {
      userId: body.userId.toUpperCase(),
      firstName: body.firstName,
      lastName: body.lastName,
      password: body.password,
      userType: body.userType.toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    const response: UserAddResponse = {
      success: true,
      message: `User ${newUser.userId} has been added ...`,
      user: {
        userId: newUser.userId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType: newUser.userType,
      },
    };

    console.log('✅ MSW User Add Success:', response);

    return HttpResponse.json(response, { status: 201 });
  }),

  // ✅ CORRECCIÓN: Endpoint para backend real (compatibilidad)
  http.post('/api/users', async ({ request }) => {
    const body = await request.json() as UserAddRequest;
    
    console.log('🔍 MSW Backend Compatibility - User Add Request:', body);

    // Simular delay del backend real
    await new Promise(resolve => setTimeout(resolve, 300));

    // Reutilizar la misma lógica de validación
    if (!body.firstName?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'First Name can NOT be empty...',
        },
        { status: 400 }
      );
    }

    if (!body.lastName?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Last Name can NOT be empty...',
        },
        { status: 400 }
      );
    }

    if (!body.userId?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'User ID can NOT be empty...',
        },
        { status: 400 }
      );
    }

    if (!body.password?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'Password can NOT be empty...',
        },
        { status: 400 }
      );
    }

    if (!body.userType?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          message: 'User Type can NOT be empty...',
        },
        { status: 400 }
      );
    }

    if (!['A', 'U'].includes(body.userType.toUpperCase())) {
      return HttpResponse.json(
        {
          success: false,
          message: 'User Type must be A (Admin) or U (User)',
        },
        { status: 400 }
      );
    }

    // Verificar usuario duplicado
    const existingUser = mockUsers.find(u => u.userId === body.userId.toUpperCase());
    if (existingUser) {
      return HttpResponse.json(
        {
          success: false,
          message: 'User ID already exist...',
        },
        { status: 409 }
      );
    }

    // Crear usuario
    const newUser = {
      userId: body.userId.toUpperCase(),
      firstName: body.firstName,
      lastName: body.lastName,
      password: body.password,
      userType: body.userType.toUpperCase(),
      createdAt: new Date().toISOString(),
    };

    mockUsers.push(newUser);

    // Respuesta compatible con el backend real
    const response = {
      success: true,
      message: `User ${newUser.userId} has been added ...`,
      user: {
        userId: newUser.userId,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userType: newUser.userType,
      },
    };

    console.log('✅ MSW Backend Compatibility - User Add Success:', response);

    return HttpResponse.json(response, { status: 201 });
  }),
];