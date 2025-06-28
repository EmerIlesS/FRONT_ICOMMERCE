import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    // Página de inicio
    index("routes/_index.tsx"),
    
    // Autenticación
    route("auth/login", "routes/auth/login.tsx"),
    route("auth/register", "routes/auth/register.tsx"),
    
    // Productos
    route("products", "routes/products/_index.tsx"),
    route("products/:id", "routes/products/$id.tsx"),
    
    // Carrito de compras
    route("cart", "routes/cart/_index.tsx"),
    
    // Órdenes
    route("orders", "routes/orders/_index.tsx"),
    route("orders/:id", "routes/orders/$id.tsx"),
    
    // Perfil de usuario
    route("profile", "routes/profile/_index.tsx"),
    
    // Búsqueda
    route("search", "routes/search.tsx"),
    
    // Página 404
    route("*", "routes/404.tsx"),
] satisfies RouteConfig;

