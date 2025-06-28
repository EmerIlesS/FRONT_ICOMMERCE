// Utilidades para autenticación
import { authApi } from '../lib/api';
import type { User, LoginCredentials, RegisterData } from '../types/auth';

// Función para hacer login usando la nueva API
export const loginUser = async (loginData: LoginCredentials): Promise<{ user: User; token: string }> => {
  try {
    const result = await authApi.login(loginData);
    
    // Guardar token en localStorage
    if (result.token) {
      tokenUtils.saveToken(result.token);
      userUtils.saveUser(result.user);
    }
    
    return result;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

// Función para registrar usuario
export const registerUser = async (registerData: RegisterData): Promise<{ user: User; token: string }> => {
  try {
    const result = await authApi.register(registerData);
    
    // Guardar token y usuario en localStorage
    if (result.token) {
      tokenUtils.saveToken(result.token);
      userUtils.saveUser(result.user);
    }
    
    return result;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};

// Función para obtener el perfil del usuario
export const getUserProfile = async (): Promise<User | null> => {
  try {
    const token = tokenUtils.getToken();
    if (!token) return null;
    
    const user = await authApi.getProfile(token);
    userUtils.saveUser(user);
    return user;
  } catch (error) {
    console.error('Error al obtener perfil:', error);
    // Si hay error, probablemente el token expiró
    tokenUtils.removeToken();
    userUtils.removeUser();
    return null;
  }
};

// Utilidades para el token
export const tokenUtils = {
  // Guardar token en localStorage
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },

  // Obtener token de localStorage
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },

  // Eliminar token de localStorage
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  },

  // Verificar si hay token válido
  hasValidToken: (): boolean => {
    const token = tokenUtils.getToken();
    if (!token) return false;

    try {
      // Verificar si el token no ha expirado (básico)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  },
};

// Utilidades para el usuario
export const userUtils = {
  // Guardar datos del usuario
  saveUser: (user: User) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user_data', JSON.stringify(user));
    }
  },

  // Obtener datos del usuario
  getUser: (): User | null => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  },

  // Eliminar datos del usuario
  removeUser: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_data');
    }
  },

  // Logout completo
  logout: () => {
    tokenUtils.removeToken();
    userUtils.removeUser();
  },
};

// Headers de autenticación para las peticiones
export const generateAuthHeaders = () => {
  const token = tokenUtils.getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Estado de autenticación actual
export const getAuthState = () => {
  return {
    isAuthenticated: tokenUtils.hasValidToken(),
    user: userUtils.getUser(),
    token: tokenUtils.getToken(),
  };
};
