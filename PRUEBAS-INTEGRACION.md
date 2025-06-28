## 🧪 **PRUEBAS DE INTEGRACIÓN - FRONTEND + BACKEND**

### ✅ **Estado Actual**
- ✅ Frontend corriendo en: `http://localhost:5173`
- ⏳ Backend pendiente de verificación

### 🔧 **Pasos para Probar la Integración Completa**

#### **1. Levantar Servicios Backend**

```bash
# Terminal 1: API Gateway (Puerto 4000)
cd Api-Gateway
npm install
npm start

# Terminal 2: Microservicio Auth (Puerto 4001)
cd ms-auth-java
./mvnw spring-boot:run

# Terminal 3: Microservicio Products (Puerto 4002)
cd ms-products-orders
npm install
npm start

# Terminal 4: Frontend (Puerto 5173) - YA ESTÁ CORRIENDO
cd FRONT_ICOMMERCE
npm run dev
```

#### **2. Verificar Endpoints**

**API Gateway GraphQL:**
- URL: `http://localhost:4000/graphql`
- Test query:
```graphql
query {
  __schema {
    types {
      name
    }
  }
}
```

**Microservicio Auth:**
- URL: `http://localhost:4001/health`
- GraphQL: `http://localhost:4001/graphql`

**Microservicio Products:**
- URL: `http://localhost:4002/health`
- GraphQL: `http://localhost:4002/graphql`

#### **3. Flujo de Pruebas Frontend**

1. **Homepage** (`http://localhost:5173`)
   - ✅ Debe cargar sin errores de hidratación
   - ✅ Mostrar botones "Crear Cuenta" e "Iniciar Sesión"

2. **Registro** (`http://localhost:5173/auth/register`)
   - ✅ Completar formulario
   - ✅ Verificar llamada a API real
   - ✅ Redirección tras registro exitoso

3. **Login** (`http://localhost:5173/auth/login`)
   - ✅ Iniciar sesión con cuenta creada
   - ✅ Verificar persistencia de token
   - ✅ Redirección al homepage autenticado

4. **Productos** (`http://localhost:5173/products`)
   - ✅ Cargar productos desde API real
   - ✅ Probar filtros y búsqueda
   - ✅ Verificar paginación

#### **4. Resolución de Errores de Hidratación**

**Cambios Aplicados:**
- ✅ Hook `useIsHydrated()` para evitar problemas de SSR
- ✅ AuthContext protegido contra hidratación
- ✅ CartContext sin `Date.now()` ni timestamps dinámicos
- ✅ Componentes protegidos con verificación de hidratación

#### **5. URLs de Prueba**

- **Frontend**: http://localhost:5173
- **Login**: http://localhost:5173/auth/login
- **Registro**: http://localhost:5173/auth/register
- **Productos**: http://localhost:5173/products
- **API Gateway**: http://localhost:4000/graphql

### 🐛 **Errores Esperados vs Críticos**

**✅ Errores Normales (ignorar):**
- `No route matches URL "/.well-known/appspecific/com.chrome.devtools.json"` (Chrome DevTools)
- Advertencias de desarrollo de React Router

**❌ Errores Críticos (resolver):**
- Errores de hidratación de React
- Errores de conexión a API (500, Network errors)
- Errores de autenticación

### 🚀 **Próximos Pasos**

1. **Verificar que los 3 servicios backend estén corriendo**
2. **Probar flujo completo de registro → login → productos**
3. **Implementar funcionalidades restantes (perfil, órdenes)**
4. **Optimizar con React Query/SWR**

---

**¿Están todos los servicios backend corriendo? Si no, seguir las instrucciones del paso 1.**
