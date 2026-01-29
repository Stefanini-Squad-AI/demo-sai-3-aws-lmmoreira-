// ===== app/data/menuData.ts =====
import type { MenuData } from '~/types/menu';

export const getMainMenuData = (): MenuData => ({
  title: 'CardDemo - Main Menu',
  subtitle: 'System Back-Office Functions',
  transactionId: 'CC00',
  programName: 'COMEN01',
  userRole: 'back-office',
  options: [
    {
      id: 'account-view',
      label: 'Account View',
      description: 'View account information',
      path: '/accounts/view',
    },
    {
      id: 'account-update',
      label: 'Account Update',
      description: 'Update account information',
      path: '/accounts/update',
    },
    {
      id: 'credit-card-list',
      label: 'Credit Card List',
      description: 'List all credit cards',
      path: '/cards/list',
    },
    {
      id: 'credit-card-view',
      label: 'Credit Card View',
      description: 'View credit card details',
      path: '/cards/view',
    },
    {
      id: 'credit-card-update',
      label: 'Credit Card Update',
      description: 'Update credit card',
      path: '/cards/update',
    },
    {
      id: 'transaction-list',
      label: 'Transaction List',
      description: 'List all transactions',
      path: '/transactions/list',
    },
    {
      id: 'transaction-view',
      label: 'Transaction View',
      description: 'View transaction details',
      path: '/transactions/view',
    },
    {
      id: 'transaction-add',
      label: 'Transaction Add',
      description: 'Add new transaction',
      path: '/transactions/add',
    },
    {
      id: 'transaction-reports',
      label: 'Transaction Reports',
      description: 'Generate transaction reports',
      path: '/reports/transactions',
    },
    {
      id: 'bill-payment',
      label: 'Bill Payment',
      description: 'Process bill payments',
      path: '/payments/bills',
    },
  ],
});

export const getAdminMenuData = (): MenuData => ({
  title: 'CardDemo - Administration Menu',
  subtitle: 'Security and Administration Functions',
  transactionId: 'CADM',
  programName: 'COADM01',
  userRole: 'admin',
  options: [
    {
      id: 'user-list',
      label: 'User List (Security)',
      description: 'List all system users',
      path: '/admin/users/list',
      adminOnly: true,
    },
    {
      id: 'user-add',
      label: 'User Add (Security)',
      description: 'Add new user to system',
      path: '/admin/users/add',
      adminOnly: true,
    },
    {
      id: 'user-update',
      label: 'User Update (Security)',
      description: 'Update user information',
      path: '/admin/users/update',
      adminOnly: true,
    },
    {
      id: 'user-delete',
      label: 'User Delete (Security)',
      description: 'Delete user from system',
      path: '/admin/users/delete',
      adminOnly: true,
    },
  ],
});