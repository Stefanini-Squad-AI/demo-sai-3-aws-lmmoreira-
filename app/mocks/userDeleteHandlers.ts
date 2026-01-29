// app/mocks/userDeleteHandlers.ts
import { http, HttpResponse } from 'msw';
import type { UserDeleteData } from '~/types/userDelete';

// Datos mock de usuarios para testing (compartidos con otros handlers)
const mockUsers: Record<string, UserDeleteData> = {
  'ADMIN001': {
    userId: 'ADMIN001',
    firstName: 'System',
    lastName: 'Administrator',
    userType: 'A',
  },
  'USER001': {
    userId: 'USER001',
    firstName: 'John',
    lastName: 'Smith',
    userType: 'U',
  },
  'TESTUSER': {
    userId: 'TESTUSER',
    firstName: 'Test',
    lastName: 'User',
    userType: 'U',
  },
};

export const userDeleteHandlers = [
  // Eliminar usuario
  http.delete('/api/users/security/:userId', async ({ params }) => {
    const { userId } = params;

    console.log('🗑️ MSW User Delete - Delete user:', { userId });

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

    // Validación: no permitir eliminar el último admin
    if (existingUser.userType === 'A') {
      const adminCount = Object.values(mockUsers).filter(u => u.userType === 'A').length;
      if (adminCount <= 1) {
        return HttpResponse.json(
          {
            success: false,
            error: 'Cannot delete the last administrator user...',
          },
          { status: 400 }
        );
      }
    }

    // Eliminar usuario de memoria
    delete mockUsers[userId as string];

    console.log('✅ MSW User Delete - User deleted successfully:', userId);

    return HttpResponse.json({
      success: true,
      data: {
        userId: userId as string,
        message: `User ${userId} has been deleted ...`,
        success: true,
      },
    });
  }),
];