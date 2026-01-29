// app/types/index.ts
// Tipos de respuesta de API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T | undefined; // ✅ CORRECCIÓN: Permitir explícitamente undefined
  error?: string;
  message?: string;
}

// Tipos de usuario
export interface User {
  id: number;
  userId: string; // Cambiado de email a userId
  name: string;
  role: 'admin' | 'back-office'; // Roles del mainframe original
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
  isActive?: boolean;
}

// Tipos de autenticación
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  userId: string; // Cambiado de email a userId
  password: string;
  rememberMe?: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// Tipos de estado de la aplicación
export interface AppState {
  initialized: boolean;
  loading: boolean;
  error: string | null;
}

// Tipos de tema
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  mode: ThemeMode;
  primaryColor: string;
  secondaryColor: string;
}

// Tipos comunes de UI
export interface SelectOption<T = string | number> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export interface MenuItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  path?: string;
  children?: MenuItem[];
  disabled?: boolean;
}

// Tipos de error
export interface AppError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

// Tipos de paginación
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  filters?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Tipos de formulario
export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'radio';
  required?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | null;
  };
}

export interface FormState<T = Record<string, any>> {
  values: T;
  errors: Record<keyof T, string>;
  touched: Record<keyof T, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Tipos de notificación
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  duration?: number;
  persistent?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Configuración de API
export interface ApiConfig {
  baseURL: string;
  timeout: number;
  retries: number;
  headers: Record<string, string>;
}

// Tipos de entorno
export interface Environment {
  NODE_ENV: 'development' | 'production' | 'test';
  VITE_API_BASE_URL?: string;
  VITE_APP_NAME?: string;
  VITE_APP_VERSION?: string;
}

// Tipos de utilidad
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export * from './menu';
export * from './account';
export * from './accountUpdate';
export * from './creditCard';
export * from './creditCardDetail';
export * from './creditCardUpdate';
export * from './transactionAdd';
export * from './transactionList';
export * from './transactionView';
export * from './transactionReports';
export * from './billPayment';
export * from './userAdd';
export * from './userUpdate';
export * from './userDelete';