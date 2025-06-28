import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from 'react';
import type { User, AuthState, LoginCredentials, RegisterData } from '../types/auth';
import { loginUser, registerUser, getUserProfile, tokenUtils, userUtils } from '../utils/auth';

// Acciones del reducer
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_ERROR'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

// Estado inicial
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

// Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'AUTH_ERROR':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

// Contexto
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [isHydrated, setIsHydrated] = useState(false);

  // Evitar problemas de hidratación con SSR
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    if (!isHydrated) return; // Solo ejecutar después de hidratación
    
    const initializeAuth = async () => {
      const token = tokenUtils.getToken();
      const user = userUtils.getUser();
      
      if (token && user) {
        // Verificar si el token aún es válido
        if (tokenUtils.hasValidToken()) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: { user, token }
          });
        } else {
          // Token expirado, intentar obtener el perfil para verificar
          try {
            const updatedUser = await getUserProfile();
            if (updatedUser) {
              dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user: updatedUser, token }
              });
            } else {
              // Token inválido, limpiar datos
              userUtils.logout();
            }
          } catch (error) {
            // Error al verificar token, limpiar datos
            userUtils.logout();
          }
        }
      }
    };

    initializeAuth();
  }, [isHydrated]);

  const login = async (credentials: LoginCredentials) => {
    try {
      console.log('🔵 Iniciando login en contexto...');
      dispatch({ type: 'AUTH_START' });
      const response = await loginUser(credentials);
      
      console.log('🟢 Login exitoso, actualizando contexto:', { 
        user: response.user, 
        hasToken: !!response.token 
      });
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
      
      console.log('🟢 Contexto actualizado - isAuthenticated debería ser true');
    } catch (error) {
      console.error('🔴 Error en login del contexto:', error);
      const message = error instanceof Error ? error.message : 'Error en el login';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' });
      const response = await registerUser(data);
      
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.user,
          token: response.token,
        },
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en el registro';
      dispatch({ type: 'AUTH_ERROR', payload: message });
      throw error;
    }
  };

  const logout = () => {
    userUtils.logout();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}
