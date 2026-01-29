// app/mocks/menuHandlers.ts
import { http, HttpResponse } from 'msw';

export const menuHandlers = [
  // Obtener datos del menú principal
  http.get('/api/menu/main', () => {
    return HttpResponse.json({
      success: true,
      data: {
        title: 'CardDemo - Menú Principal',
        subtitle: 'Sistema de Gestión de Tarjetas',
        transactionId: 'CC00',
        programName: 'COMEN01',
        options: [
          {
            id: 'list-cards',
            label: 'Listar Tarjetas de Crédito',
            description: 'Ver todas las tarjetas registradas',
            path: '/cards/list',
          },
          {
            id: 'add-card',
            label: 'Agregar Nueva Tarjeta',
            description: 'Registrar una nueva tarjeta de crédito',
            path: '/cards/add',
          },
          {
            id: 'update-card',
            label: 'Actualizar Tarjeta',
            description: 'Modificar información de tarjeta existente',
            path: '/cards/update',
          },
          {
            id: 'delete-card',
            label: 'Eliminar Tarjeta',
            description: 'Remover tarjeta del sistema',
            path: '/cards/delete',
          },
          {
            id: 'view-transactions',
            label: 'Ver Transacciones',
            description: 'Consultar historial de transacciones',
            path: '/transactions',
          },
          {
            id: 'reports',
            label: 'Reportes',
            description: 'Generar reportes del sistema',
            path: '/reports',
          },
          {
            id: 'admin-menu',
            label: 'Menú de Administración',
            description: 'Acceso a funciones administrativas',
            path: '/menu/admin',
            adminOnly: true,
          },
        ],
      },
    });
  }),

  // Obtener datos del menú admin
  http.get('/api/menu/admin', () => {
    return HttpResponse.json({
      success: true,
      data: {
        title: 'CardDemo - Menú de Administración',
        subtitle: 'Funciones Administrativas del Sistema',
        transactionId: 'CADM',
        programName: 'COADM01',
        options: [
          {
            id: 'manage-users',
            label: 'Gestión de Usuarios',
            description: 'Administrar cuentas de usuario',
            path: '/admin/users',
          },
          {
            id: 'system-config',
            label: 'Configuración del Sistema',
            description: 'Ajustes generales del sistema',
            path: '/admin/config',
          },
          {
            id: 'audit-logs',
            label: 'Logs de Auditoría',
            description: 'Revisar registros de actividad',
            path: '/admin/audit',
          },
          {
            id: 'backup-restore',
            label: 'Respaldo y Restauración',
            description: 'Gestionar copias de seguridad',
            path: '/admin/backup',
          },
          {
            id: 'system-monitor',
            label: 'Monitor del Sistema',
            description: 'Supervisar rendimiento del sistema',
            path: '/admin/monitor',
          },
          {
            id: 'database-admin',
            label: 'Administración de Base de Datos',
            description: 'Herramientas de base de datos',
            path: '/admin/database',
          },
          {
            id: 'security-settings',
            label: 'Configuración de Seguridad',
            description: 'Políticas y configuración de seguridad',
            path: '/admin/security',
          },
        ],
      },
    });
  }),

  // Validar selección de opción
  http.post('/api/menu/validate', async ({ request }) => {
    const { optionId } = await request.json() as {
      optionId: string;
      menuType: 'main' | 'admin';
    };

    // Simular validación
    if (optionId === 'invalid-option') {
      return HttpResponse.json(
        {
          success: false,
          error: 'Opción no válida. Por favor seleccione una opción del 1 al 12.',
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