import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Input,
  Button,
  Badge,
  Icon,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { RiSearchLine, RiFilterLine, RiGridLine, RiListOrdered } from "react-icons/ri";
import { ProductCard } from "../../components/ui/productCard";
import { Breadcrumbs, commonBreadcrumbs } from "../../components/ui/breadcrumbs";
import { Pagination } from "../../components/ui/pagination";
import { LoadingSpinner, EmptyState } from "../../components/ui/Loading";
import { useCart } from "../../context/CartContext";
import { productsApi } from "../../lib/api";
import { useIsHydrated } from "../../hooks/useHydration";
import type { Product, ProductFilters, ProductsResponse } from "../../types/product";

const categories = [
  { id: "all", name: "Todas las categorías" },
  { id: "tech", name: "Tecnología" },
  { id: "sports", name: "Deportes" },
  { id: "electronics", name: "Electrónicos" },
  { id: "audio", name: "Audio" },
  { id: "home", name: "Hogar" },
  { id: "fashion", name: "Moda" },
];

const sortOptions = [
  { value: "newest", label: "Más recientes" },
  { value: "price-low", label: "Precio: menor a mayor" },
  { value: "price-high", label: "Precio: mayor a menor" },
  { value: "rating", label: "Mejor valorados" },
  { value: "name", label: "Nombre A-Z" },
];

export default function Products() {
  const [productsData, setProductsData] = useState<ProductsResponse | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);

  const { addItem } = useCart();
  const isHydrated = useIsHydrated();

  // Función para cargar productos
  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const filters: ProductFilters = {
        page: currentPage,
        limit: pageSize,
      };

      // Agregar filtros si existen
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      if (selectedCategory !== "all") {
        filters.category = selectedCategory;
      }

      // Agregar ordenamiento
      if (sortBy !== "newest") {
        filters.sortBy = sortBy as any;
      }

      const response = await productsApi.getProducts(filters);
      setProductsData(response);
      setProducts(response.products);
    } catch (err: any) {
      console.error('Error al cargar productos:', err);
      setError(err.message || 'Error al cargar los productos');
      // En caso de error, usar productos mock como fallback
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar productos al inicializar y cuando cambien los filtros
  useEffect(() => {
    if (isHydrated) {
      loadProducts();
    }
  }, [isHydrated, currentPage, pageSize, selectedCategory, sortBy]);

  // Manejar búsqueda con debounce
  useEffect(() => {
    if (!isHydrated) return;
    
    const timer = setTimeout(() => {
      if (currentPage !== 1) {
        setCurrentPage(1);
      } else {
        loadProducts();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, isHydrated]);

  // Resetear página cuando cambien los filtros
  useEffect(() => {
    if (isHydrated && currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategory, sortBy, isHydrated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // La búsqueda se maneja en el useEffect
  };

  const handleProductClick = (product: Product) => {
    // TODO: Navegar a la página de detalle del producto
    console.log("Ver producto:", product.id);
  };

  const handleAddToCart = (product: Product) => {
    addItem(product);
  };

  if (error && products.length === 0) {
    return (
      <Container maxW="6xl" py={8}>
        <VStack gap={8} align="stretch">
          <Breadcrumbs items={commonBreadcrumbs.products} />
          <EmptyState
            title="Error al cargar productos"
            description={error}
            action={
              <Button onClick={loadProducts} colorScheme="teal">
                Intentar de nuevo
              </Button>
            }
          />
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="6xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Breadcrumbs */}
        <Breadcrumbs items={commonBreadcrumbs.products} />
        
        {/* Header */}
        <VStack gap={4} align="start">
          <Heading size="xl">Productos</Heading>
          <Text color="gray.600">
            {productsData ? `${productsData.total} productos encontrados` : 'Descubre nuestro catálogo completo'}
          </Text>
        </VStack>

        {/* Filtros y búsqueda */}
        <Flex gap={4} wrap="wrap" align="center">
          {/* Barra de búsqueda */}
          <Box as="form" onSubmit={handleSearch} flex="1" minW="250px">
            <HStack>
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="md"
              />
              <Button type="submit" colorScheme="teal" px={6}>
                <Icon as={RiSearchLine} />
              </Button>
            </HStack>
          </Box>

          {/* Filtros */}
          <HStack gap={4} wrap="wrap">
            {/* Categoría */}
            <Box>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                }}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Box>

            {/* Ordenamiento */}
            <Box>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #e2e8f0",
                  fontSize: "14px",
                }}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </Box>

            {/* Vista */}
            <HStack>
              <Button
                variant={viewMode === "grid" ? "solid" : "outline"}
                size="sm"
                onClick={() => setViewMode("grid")}
              >
                <Icon as={RiGridLine} />
              </Button>
              <Button
                variant={viewMode === "list" ? "solid" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <Icon as={RiListOrdered} />
              </Button>
            </HStack>
          </HStack>
        </Flex>

        {/* Productos */}
        {isLoading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <EmptyState
            title="No se encontraron productos"
            description="Intenta cambiar los filtros o realizar una búsqueda diferente."
          />
        ) : (
          <>
            <SimpleGrid
              columns={
                viewMode === "grid"
                  ? { base: 1, sm: 2, md: 3, lg: 4 }
                  : { base: 1 }
              }
              gap={6}
            >
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  showAddToCart={true}
                />
              ))}
            </SimpleGrid>

            {/* Paginación */}
            {productsData && productsData.totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={productsData.totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        )}

        {/* Mensaje de error si hay productos pero con error */}
        {error && products.length > 0 && (
          <Box p={4} bg="yellow.50" borderRadius="md" borderWidth="1px" borderColor="yellow.200">
            <Text color="yellow.800" fontSize="sm">
              <strong>Advertencia:</strong> {error}
            </Text>
          </Box>
        )}
      </VStack>
    </Container>
  );
}
