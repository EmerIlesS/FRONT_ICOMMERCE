// Exportar todos los tipos para facilitar las importaciones
export type * from './auth';
export type * from './product';
export type * from './order';

// Tipos generales de la API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Tipos para formularios
export interface FormState {
  isLoading: boolean;
  error: string | null;
  success: boolean;
}

// Tipos para paginación
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}
