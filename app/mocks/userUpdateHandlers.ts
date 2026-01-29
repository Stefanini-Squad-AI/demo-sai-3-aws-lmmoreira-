// app/mocks/userUpdateHandlers.ts (versión corregida)
import { http, HttpResponse } from 'msw';
import type { UserUpdateData, UserUpdateRequest } from '~/types/userUpdate';

// ✅ CORRECCIÓN: Datos mock más completos
const mockUsers: Record<string, UserUpdateData> = {
  'ADMIN001': {
    userId: 'ADMIN001',
    firstName: 'System',
    lastName: 'Administrator',
    userType: 'A',
    password: 'PASSWORD',
    isActive: true,
  },
  'USER001': {
    userId: 'USER001',
    firstName: 'John',
    lastName: 'Smith',
    userType: 'U',
    password: 'PASSWORD',
    isActive: true,
  },
  'TESTUSER': {
    userId: 'TESTUSER',
    firstName: 'Test',
    lastName: 'User',
    userType: 'U',
    password: 'TESTPASS',
    isActive: true,
  },
};

export const userUpdateHandlers = [
  // ✅ CORRECCIÓN: Obtener usuario por ID para actualización
  http.get('/api/users/security/:userId', ({ params }) => {
    const { userId } = params;
    const user = mockUsers[userId as string];

    console.log('🔍 MSW User Update - Get user:', { userId, found: !!user });

    // Simular delay del mainframe
    return new Promise(resolve => {
      setTimeout(() => {
        if (!user) {
          resolve(HttpResponse.json(
            {
              success: false,
              error: 'User ID NOT found...',
            },
            { status: 404 }
          ));
        } else {
          resolve(HttpResponse.json({
            success: true,
            data: user,
          }));
        }
      }, 300);
    });
  }),

  // ✅ CORRECCIÓN: Actualizar usuario
  http.put('/api/users/security/:userId', async ({ params, request }) => {
    const { userId } = params;
    const updateData = await request.json() as UserUpdateRequest;

    console.log('🔄 MSW User Update - Update user:', { userId, updateData });

    // Simular delay del mainframe
    await new Promise(resolve => setTimeout(resolve, 500));

    const existingUser = mockUsers[userId as string];
    if (!existingUser) {
      return HttpResponse.json(
        {
          success: false,
          error: 'User ID NOT found...',
        },
        { status: 404 }
      );
    }

    // ✅ CORRECCIÓN: Validaciones como en el COBOL original
    if (!updateData.firstName?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          error: 'First Name can NOT be empty...',
        },
        { status: 400 }
      );
    }

    if (!updateData.lastName?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Last Name can NOT be empty...',
        },
        { status: 400 }
      );
    }

    if (!updateData.password?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Password can NOT be empty...',
        },
        { status: 400 }
      );
    }

    if (!updateData.userType?.trim()) {
      return HttpResponse.json(
        {
          success: false,
          error: 'User Type can NOT be empty...',
        },
        { status: 400 }
      );
    }

    // Verificar si hay cambios
    const hasChanges = (
      updateData.firstName !== existingUser.firstName ||
      updateData.lastName !== existingUser.lastName ||
      updateData.password !== existingUser.password ||
      updateData.userType !== existingUser.userType
    );

    if (!hasChanges) {
      return HttpResponse.json(
        {
          success: false,
          error: 'Please modify to update ...',
        },
        { status: 400 }
      );
    }

    // ✅ CORRECCIÓN: Actualizar usuario en memoria
    const updatedUser: UserUpdateData = {
      ...existingUser,
      firstName: updateData.firstName,
      lastName: updateData.lastName,
      password: updateData.password,
      userType: updateData.userType as 'A' | 'U',
    };

    mockUsers[userId as string] = updatedUser;

    console.log('✅ MSW User Update - User updated successfully:', updatedUser);

    return HttpResponse.json({
      success: true,
      data: updatedUser,
      message: `User ${userId} has been updated ...`,
    });
  }),
];