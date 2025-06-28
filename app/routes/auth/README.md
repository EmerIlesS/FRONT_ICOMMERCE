# 🚀 Interfaces de Autenticación - Frontend

## 📁 Archivos Creados

### **Componentes de UI:**
- `app/routes/auth/login.tsx` - Interfaz de inicio de sesión
- `app/routes/auth/register.tsx` - Interfaz de registro de usuario

### **Utilidades:**
- `app/utils/auth.ts` - Funciones para conectar con el backend

## 🎨 **Características de la UI**

### ✨ **Login (`/auth/login`)**
- ✅ Formulario responsivo y moderno
- ✅ Validación en tiempo real
- ✅ Mostrar/ocultar contraseña
- ✅ Manejo de errores
- ✅ Estados de carga
- ✅ Toast notifications
- ✅ Link a registro

### ✨ **Registro (`/auth/register`)**
- ✅ Campos: nombre, apellido, email, contraseña
- ✅ Confirmación de contraseña
- ✅ Validación completa
- ✅ UI consistente con login
- ✅ Manejo de errores
- ✅ Link a login

## 🔧 **Próximos Pasos - Conectar con Backend**

### **1. Actualizar las funciones en `auth.ts`**

Actualmente las funciones tienen simulaciones. Para conectar con tu backend:

```typescript
// En app/utils/auth.ts
const API_URL = 'http://localhost:4000/graphql'; // ✅ Ya configurado

// Las funciones loginUser() y registerUser() están listas
// Solo necesitas descomentar el código real y comentar las simulaciones
```

### **2. Integrar en los componentes**

En `login.tsx`, reemplaza la simulación:

```typescript
// Cambiar esto:
await new Promise(resolve => setTimeout(resolve, 2000));

// Por esto:
const authResponse = await loginUser(formData);
tokenUtils.saveToken(authResponse.token);
userUtils.saveUser(authResponse.user);
```

En `register.tsx`, igual cambio:

```typescript
// Cambiar simulación por:
const authResponse = await registerUser({
  firstName: formData.firstName,
  lastName: formData.lastName, 
  email: formData.email,
  password: formData.password,
});
```

### **3. Manejo de rutas protegidas (futuro)**

```typescript
// Crear un hook de autenticación
const useAuth = () => {
  const [authState, setAuthState] = useState(getAuthState());
  
  useEffect(() => {
    // Verificar estado al cargar
    setAuthState(getAuthState());
  }, []);
  
  return authState;
};
```

## 🎯 **Como probar actualmente**

### **1. Navegar a las rutas:**
- `/auth/login` - Página de inicio de sesión
- `/auth/register` - Página de registro

### **2. Probar la UI:**
- ✅ Validación de campos vacíos
- ✅ Validación de email
- ✅ Validación de contraseña (mínimo 6 caracteres)
- ✅ Confirmación de contraseña
- ✅ Mostrar/ocultar contraseñas
- ✅ Estados de carga
- ✅ Navegación entre login y registro

### **3. Verificar en consola:**
Los datos del formulario se imprimen en console.log, verifica que:
- Los campos se capturen correctamente
- Las validaciones funcionen
- Los estados de carga se activen

## 🔗 **Conexión con Backend**

### **URLs configuradas:**
- **API Gateway**: `http://localhost:4000/graphql`
- **Auth Service**: `http://localhost:4001/graphql` (directo)
- **Products Service**: `http://localhost:4002/graphql` (directo)

### **Mutations disponibles:**

#### **Login:**
```graphql
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
```

#### **Registro:**
```graphql
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

## 🛠️ **Para implementar la lógica completa:**

### **1. En `login.tsx`:**
```typescript
import { loginUser, tokenUtils, userUtils } from '~/utils/auth';

// En handleSubmit, reemplazar la simulación:
try {
  const authResponse = await loginUser(formData);
  
  // Guardar token y usuario
  tokenUtils.saveToken(authResponse.token);
  userUtils.saveUser(authResponse.user);
  
  // Redirigir al dashboard o home
  navigate('/dashboard');
  
} catch (error) {
  toast({
    title: "Error al iniciar sesión",
    description: error.message,
    status: "error",
  });
}
```

### **2. En `register.tsx`:**
```typescript
import { registerUser } from '~/utils/auth';

// En handleSubmit, reemplazar la simulación:
try {
  await registerUser({
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    password: formData.password,
  });
  
  // Redirigir al login
  navigate('/auth/login');
  
} catch (error) {
  toast({
    title: "Error al crear la cuenta",
    description: error.message,
    status: "error",
  });
}
```

## 🎨 **Personalización**

### **Colores:**
- Primary: `teal` (puedes cambiar a `blue`, `purple`, etc.)
- Error: `red`
- Success: `green`

### **Responsive:**
- Mobile-first design
- Cards adaptativos
- Formularios optimizados

### **Accesibilidad:**
- Labels apropiados
- ARIA attributes
- Navegación por teclado
- Contraste adecuado

## 🚀 **¡Listo para usar!**

Las interfaces están completamente funcionales y listas para conectar con tu backend. Solo necesitas:

1. ✅ **UI completa** - Ya terminado
2. 🔄 **Conectar API** - Cambiar simulaciones por llamadas reales
3. 🛡️ **Proteger rutas** - Implementar guards de autenticación
4. 📱 **Estado global** - Opcional: usar Context API o Zustand

¿Quieres que te ayude a implementar alguno de estos siguientes pasos?
