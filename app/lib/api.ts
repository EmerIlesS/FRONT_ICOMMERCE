import type { Product, ProductFilters, ProductsResponse, Category } from '../types';
import type { User, LoginCredentials, RegisterData } from '../types/auth';

// Configuración de la API
const API_BASE_URL = 'http://localhost:4000'; // API Gateway
const GRAPHQL_ENDPOINT = `${API_BASE_URL}/graphql`;

// Utilidad para hacer peticiones GraphQL
async function graphqlRequest<T = any>(
  query: string, 
  variables?: Record<string, any>,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('HTTP Error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`HTTP error! status: ${response.status}. ${errorText}`);
    }

    const result = await response.json();

    if (result.errors) {
      console.error('GraphQL Errors:', result.errors);
      throw new Error(result.errors[0].message || 'GraphQL error');
    }

    return result.data;
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}

// API de autenticación
export const authApi = {
  // Login
  async login(credentials: LoginCredentials): Promise<{ user: User; token: string }> {
    const query = `
      mutation Login($input: LoginInput!) {
        login(input: $input) {
          token
          user {
            id
            email
            firstName
            lastName
            role
          }
        }
      }
    `;

    const data = await graphqlRequest(query, { input: credentials });

    return data.login;
  },

  // Registro
  async register(userData: RegisterData): Promise<{ user: User; token: string }> {
    const query = `
      mutation Register($input: RegisterInput!) {
        register(input: $input) {
          token
          user {
            id
            email
            firstName
            lastName
            role
          }
        }
      }
    `;

    const data = await graphqlRequest(query, { input: userData });
    return data.register;
  },

  // Obtener perfil del usuario
  async getProfile(token: string): Promise<User> {
    const query = `
      query GetProfile {
        profile {
          id
          email
          firstName
          lastName
          role
          isActive
          createdAt
          updatedAt
        }
      }
    `;

    const data = await graphqlRequest(query, {}, token);
    return data.profile;
  },

  // Actualizar perfil
  async updateProfile(userData: Partial<User>, token: string): Promise<User> {
    const query = `
      mutation UpdateProfile($input: UpdateProfileInput!) {
        updateProfile(input: $input) {
          id
          email
          firstName
          lastName
          role
          isActive
          createdAt
          updatedAt
        }
      }
    `;

    const data = await graphqlRequest(query, { input: userData }, token);
    return data.updateProfile;
  },

  // Logout (opcional - mainly client-side)
  async logout(): Promise<boolean> {
    // En este caso, el logout es principalmente del lado del cliente
    // Pero podrías agregar lógica para invalidar el token en el servidor
    return true;
  },
};

// API de productos
export const productsApi = {
  // Obtener todos los productos con filtros
  async getProducts(filters: ProductFilters = {}): Promise<ProductsResponse> {
    const query = `
      query GetProducts($filters: ProductFiltersInput) {
        products(filters: $filters) {
          products {
            id
            name
            description
            price
            originalPrice
            discount
            image
            images
            category
            categoryId
            stock
            rating
            reviews
            featured
            active
            createdAt
            updatedAt
          }
          total
          page
          totalPages
          hasMore
        }
      }
    `;

    const data = await graphqlRequest(query, { filters });
    return data.products;
  },

  // Obtener producto por ID
  async getProduct(id: string): Promise<Product> {
    const query = `
      query GetProduct($id: ID!) {
        product(id: $id) {
          id
          name
          description
          price
          originalPrice
          discount
          image
          images
          category
          categoryId
          stock
          rating
          reviews
          featured
          active
          createdAt
          updatedAt
        }
      }
    `;

    const data = await graphqlRequest(query, { id });
    return data.product;
  },

  // Buscar productos
  async searchProducts(searchTerm: string, filters: ProductFilters = {}): Promise<ProductsResponse> {
    const searchFilters = { ...filters, search: searchTerm };
    return this.getProducts(searchFilters);
  },

  // Obtener productos destacados
  async getFeaturedProducts(limit: number = 8): Promise<Product[]> {
    const query = `
      query GetFeaturedProducts($limit: Int) {
        featuredProducts(limit: $limit) {
          id
          name
          description
          price
          originalPrice
          discount
          image
          category
          rating
          reviews
          featured
        }
      }
    `;

    const data = await graphqlRequest(query, { limit });
    return data.featuredProducts;
  },
};

// API de categorías
export const categoriesApi = {
  // Obtener todas las categorías
  async getCategories(): Promise<Category[]> {
    const query = `
      query GetCategories {
        categories {
          id
          name
          description
          icon
          image
          productsCount
          active
        }
      }
    `;

    const data = await graphqlRequest(query);
    return data.categories;
  },

  // Obtener categoría por ID
  async getCategory(id: string): Promise<Category> {
    const query = `
      query GetCategory($id: ID!) {
        category(id: $id) {
          id
          name
          description
          icon
          image
          productsCount
          active
        }
      }
    `;

    const data = await graphqlRequest(query, { id });
    return data.category;
  },
};

// Utilitades generales
export const apiUtils = {
  // Construir URL de imagen
  getImageUrl: (imagePath: string): string => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${API_BASE_URL}/uploads/${imagePath}`;
  },

  // Formatear precio
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(price);
  },

  // Calcular descuento
  calculateDiscount: (originalPrice: number, currentPrice: number): number => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  },
};

// Configuración para peticiones que requieren autenticación
export function createAuthenticatedApi(token: string) {
  return {
    // Agregar producto a favoritos
    async addToFavorites(productId: string): Promise<boolean> {
      const query = `
        mutation AddToFavorites($productId: ID!) {
          addToFavorites(productId: $productId)
        }
      `;

      const data = await graphqlRequest(query, { productId }, token);
      return data.addToFavorites;
    },

    // Remover producto de favoritos
    async removeFromFavorites(productId: string): Promise<boolean> {
      const query = `
        mutation RemoveFromFavorites($productId: ID!) {
          removeFromFavorites(productId: $productId)
        }
      `;

      const data = await graphqlRequest(query, { productId }, token);
      return data.removeFromFavorites;
    },

    // Obtener favoritos del usuario
    async getFavorites(): Promise<Product[]> {
      const query = `
        query GetFavorites {
          favorites {
            id
            name
            description
            price
            originalPrice
            discount
            image
            category
            rating
            reviews
          }
        }
      `;

      const data = await graphqlRequest(query, {}, token);
      return data.favorites;
    },
  };
}
