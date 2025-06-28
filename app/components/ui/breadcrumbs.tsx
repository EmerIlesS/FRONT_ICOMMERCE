import { HStack, Text, Box } from "@chakra-ui/react";
import { RiArrowRightSLine, RiHomeLine } from "react-icons/ri";
import { Link } from "react-router";

interface BreadcrumbItem {
  label: string;
  href?: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  separator?: React.ReactNode;
  homeLink?: string;
}

export function Breadcrumbs({ 
  items, 
  separator = <RiArrowRightSLine />,
  homeLink = "/"
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <HStack gap={2} align="center" wrap="wrap">
        {/* Home link */}
        {homeLink && (
          <>
            <Link 
              to={homeLink}
              style={{
                color: 'var(--chakra-colors-teal-500)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <RiHomeLine size={16} />
              <Text fontSize="sm">Inicio</Text>
            </Link>
            {items.length > 0 && (
              <Box color="gray.400" fontSize="sm">
                {separator}
              </Box>
            )}
          </>
        )}

        {/* Breadcrumb items */}
        {items.map((item, index) => (
          <HStack key={index} gap={2} align="center">
            {item.href && !item.isCurrentPage ? (
              <Link
                to={item.href}
                style={{
                  color: 'var(--chakra-colors-teal-500)',
                  textDecoration: 'none',
                  fontSize: '14px'
                }}
              >
                {item.label}
              </Link>
            ) : (
              <Text 
                fontSize="sm" 
                color={item.isCurrentPage ? "gray.600" : "gray.400"}
                fontWeight={item.isCurrentPage ? "medium" : "normal"}
              >
                {item.label}
              </Text>
            )}
            
            {/* Separator */}
            {index < items.length - 1 && (
              <Box color="gray.400" fontSize="sm">
                {separator}
              </Box>
            )}
          </HStack>
        ))}
      </HStack>
    </nav>
  );
}

// Hook para generar breadcrumbs automáticamente desde la URL
import { useLocation } from "react-router";

interface UseBreadcrumbsOptions {
  homeLabel?: string;
  pathLabels?: Record<string, string>;
  excludePaths?: string[];
}

export function useBreadcrumbs({
  homeLabel = "Inicio",
  pathLabels = {},
  excludePaths = []
}: UseBreadcrumbsOptions = {}) {
  const location = useLocation();
  
  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const pathnames = location.pathname.split('/').filter(x => x);
    
    if (pathnames.length === 0) {
      return [];
    }

    const breadcrumbs: BreadcrumbItem[] = [];
    let href = '';

    pathnames.forEach((pathname, index) => {
      href += `/${pathname}`;
      
      // Skip excluded paths
      if (excludePaths.includes(pathname)) {
        return;
      }

      const isLast = index === pathnames.length - 1;
      const label = pathLabels[pathname] || pathname.charAt(0).toUpperCase() + pathname.slice(1);

      breadcrumbs.push({
        label,
        href: isLast ? undefined : href,
        isCurrentPage: isLast
      });
    });

    return breadcrumbs;
  };

  return generateBreadcrumbs();
}

// Breadcrumbs predefinidos para rutas comunes
export const commonBreadcrumbs = {
  products: [
    { label: "Productos", href: "/products" }
  ],
  productDetail: (productName: string) => [
    { label: "Productos", href: "/products" },
    { label: productName, isCurrentPage: true }
  ],
  cart: [
    { label: "Carrito de Compras", isCurrentPage: true }
  ],
  orders: [
    { label: "Mis Órdenes", href: "/orders" }
  ],
  orderDetail: (orderId: string) => [
    { label: "Mis Órdenes", href: "/orders" },
    { label: `Orden #${orderId}`, isCurrentPage: true }
  ],
  profile: [
    { label: "Mi Perfil", isCurrentPage: true }
  ],
  search: (query?: string) => [
    { label: query ? `Búsqueda: "${query}"` : "Búsqueda", isCurrentPage: true }
  ]
};
