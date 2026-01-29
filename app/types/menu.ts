export interface MenuOption {
  id: string;
  label: string;
  description?: string;
  path?: string;
  action?: string;
  disabled?: boolean;
  requiredRole?: 'admin' | 'back-office' | 'both';
  adminOnly?: boolean;
}

export interface MenuData {
  title: string;
  subtitle?: string;
  transactionId: string;
  programName: string;
  userRole: 'admin' | 'back-office';
  options: MenuOption[];
}