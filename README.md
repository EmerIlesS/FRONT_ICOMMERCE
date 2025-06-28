# E-commerce Frontend

Un frontend moderno para aplicación de e-commerce construido con React Router 7, TypeScript y Chakra UI.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/remix-run/react-router-templates/tree/main/default)

## 🚀 Características

### 🛠 Tecnologías Principales
- **React Router 7** - Framework full-stack para React con SSR
- **TypeScript** - Tipado estático para mayor robustez
- **Chakra UI** - Biblioteca de componentes UI moderna y accesible
- **Tailwind CSS** - Framework CSS utilitario
- **Vite** - Herramienta de build ultrarrápida
- **React Hook Form** - Manejo eficiente de formularios

### ✨ Funcionalidades Implementadas

#### 🔐 Sistema de Autenticación
- **Login de usuarios** (`/auth/login`)
- **Registro de usuarios** (`/auth/register`)
- Integración con el backend Apollo Gateway
- Validación de formularios con React Hook Form
- Manejo de estados de autenticación

#### 🎨 Interfaz de Usuario
- **Diseño responsive** con Chakra UI
- **Sistema de temas** (claro/oscuro) con next-themes
- **Componentes UI reutilizables**:
  - `ColorMode` - Selector de tema
  - `Provider` - Proveedor de contexto de Chakra UI
  - `Toaster` - Sistema de notificaciones
  - `Tooltip` - Tooltips informativos
- **Iconografía** con React Icons

#### � Páginas y Rutas
- **Página de inicio** (`/`) - Landing page del e-commerce
- **Páginas de autenticación** (`/auth/*`) - Login y registro
- **Enrutamiento** configurado con React Router 7

#### 🔧 Características Técnicas
- **Server-Side Rendering (SSR)**
- **Hot Module Replacement (HMR)**
- **Optimización de assets**
- **Carga de datos asíncrona**
- **TypeScript estricto**
- **Linting y formateo**

## 📦 Instalación

### Prerrequisitos
- Node.js 18+ 
- npm o yarn

### Configuración del Proyecto

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
```bash
# Crear archivo .env basado en .env.example
cp .env.example .env
```

3. **Iniciar servidor de desarrollo:**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 🛠 Scripts Disponibles

```bash
# Desarrollo con HMR
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start

# Verificación de tipos TypeScript
npm run typecheck
```

## 📁 Estructura del Proyecto

```
app/
├── components/
│   └── ui/                 # Componentes UI reutilizables
│       ├── color-mode.tsx  # Selector de tema
│       ├── provider.tsx    # Proveedor de Chakra UI
│       ├── toaster.tsx     # Sistema de notificaciones
│       └── tooltip.tsx     # Componente de tooltip
├── routes/
│   ├── auth/              # Rutas de autenticación
│   │   ├── login.tsx      # Página de login
│   │   └── register.tsx   # Página de registro
│   └── home.tsx           # Página de inicio
├── app.css               # Estilos globales
├── root.tsx              # Componente raíz de la aplicación
└── routes.ts             # Configuración de rutas
```

## 🔌 Integración con Backend

El frontend se conecta con el sistema de microservicios a través del Apollo Gateway:

- **Gateway URL:** `http://localhost:4000/graphql`
- **Autenticación:** JWT tokens
- **Servicios integrados:**
  - Microservicio de autenticación (Java/Spring)
  - Microservicio de productos y órdenes (Node.js/Express)

### GraphQL Queries y Mutations

#### Autenticación
```graphql
# Login
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

# Registro
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
```

## 🚀 Deployment

### Desarrollo Local
```bash
npm run dev
```

### Build de Producción
```bash
npm run build
npm start
```

### Docker Deployment
```bash
# Construir imagen
docker build -t ecommerce-frontend .

# Ejecutar contenedor
docker run -p 3000:3000 ecommerce-frontend
```

### Plataformas Soportadas
- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway
- Vercel
- Netlify

## 🎨 Personalización

### Temas
El proyecto incluye soporte para temas claro/oscuro usando Chakra UI y next-themes. Los temas se pueden personalizar en:

- `app/components/ui/provider.tsx` - Configuración del proveedor de temas
- `app/components/ui/color-mode.tsx` - Componente selector de tema

### Estilos
- **Chakra UI** para componentes principales
- **Tailwind CSS** para utilidades de estilo
- **CSS personalizado** en `app/app.css`

## 🧪 Testing

```bash
# Ejecutar tests (cuando estén configurados)
npm test

# Verificación de tipos
npm run typecheck
```

## 📝 Próximas Funcionalidades

- [ ] Catálogo de productos
- [ ] Carrito de compras
- [ ] Proceso de checkout
- [ ] Gestión de perfil de usuario
- [ ] Historial de órdenes
- [ ] Sistema de favoritos
- [ ] Búsqueda y filtros
- [ ] Panel de administración
- [ ] Tests unitarios y de integración

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es parte de un sistema de e-commerce desarrollado para fines educativos.

---

**Tecnologías:** React Router 7 • TypeScript • Chakra UI • Tailwind CSS • Vite  
**Backend:** Apollo Gateway • GraphQL • Java/Spring • Node.js/Express  
**Base de datos:** MongoDB • PostgreSQL
