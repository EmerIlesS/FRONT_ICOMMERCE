import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Input,
  Button,
  SimpleGrid,
  Icon,
  Badge,
  Flex,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { RiSearchLine, RiFilterLine } from "react-icons/ri";
import { ProductCard } from "../components/ui/productCard";
import { useCart } from "../context/CartContext";
import type { Product } from "../types/product";

// Mock data para resultados de búsqueda
const mockSearchResults: Product[] = [
  {
    id: "search-1",
    name: "iPhone 15 Pro Max",
    description: "El iPhone más avanzado con chip A17 Pro",
    price: 1199.99,
    originalPrice: 1299.99,
    discount: 8,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300",
    category: "Smartphones",
    categoryId: "smartphones",
    stock: 25,
    rating: 4.8,
    reviews: 342,
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "search-2",
    name: "Samsung Galaxy S24 Ultra",
    description: "Smartphone con S Pen y cámara de 200MP",
    price: 1099.99,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300",
    category: "Smartphones",
    categoryId: "smartphones",
    stock: 18,
    rating: 4.7,
    reviews: 287,
    featured: false,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "search-3",
    name: "MacBook Pro 16\"",
    description: "Laptop profesional con chip M3 Pro",
    price: 2499.99,
    image: "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300",
    category: "Laptops",
    categoryId: "laptops",
    stock: 12,
    rating: 4.9,
    reviews: 156,
    featured: true,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export default function Search() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const { addItem } = useCart();

  // Simular búsqueda
  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    setHasSearched(true);
    
    // Simular delay de API
    setTimeout(() => {
      const filtered = mockSearchResults.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
      setIsLoading(false);
    }, 500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  // Búsqueda automática al cambiar el query
  useEffect(() => {
    if (searchQuery.length > 2) {
      const debounceTimer = setTimeout(() => {
        handleSearch(searchQuery);
      }, 300);
      
      return () => clearTimeout(debounceTimer);
    } else if (searchQuery.length === 0) {
      setSearchResults([]);
      setHasSearched(false);
    }
  }, [searchQuery]);

  const handleAddToCart = (product: Product) => {
    addItem(product, 1);
    alert(`${product.name} agregado al carrito`);
  };

  return (
    <Container maxW="7xl" py={8}>
      <VStack gap={8} align="stretch">
        {/* Header de búsqueda */}
        <VStack gap={4} textAlign="center">
          <Heading size="xl">Buscar Productos</Heading>
          <Text color="gray.600" maxW="2xl">
            Encuentra exactamente lo que necesitas entre miles de productos
          </Text>
          
          {/* Barra de búsqueda principal */}
          <Box as="form" onSubmit={handleSubmit} w="full" maxW="2xl">
            <HStack>
              <Input
                placeholder="¿Qué estás buscando?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="lg"
                flex="1"
              />
              <Button
                type="submit"
                colorScheme="blue"
                size="lg"
                px={8}
                loading={isLoading}
              >
                <Icon as={RiSearchLine} />
              </Button>
            </HStack>
          </Box>
        </VStack>

        {/* Sugerencias de búsqueda */}
        {!hasSearched && (
          <Box>
            <Text mb={4} fontWeight="medium">Búsquedas populares:</Text>
            <HStack gap={2} flexWrap="wrap">
              {["iPhone", "Samsung", "MacBook", "Headphones", "Gaming"].map((suggestion) => (
                <Button
                  key={suggestion}
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSearchQuery(suggestion);
                    handleSearch(suggestion);
                  }}
                >
                  {suggestion}
                </Button>
              ))}
            </HStack>
          </Box>
        )}

        {/* Resultados de búsqueda */}
        {hasSearched && (
          <VStack gap={6} align="stretch">
            {/* Header de resultados */}
            <Flex justify="space-between" align="center" flexWrap="wrap" gap={4}>
              <VStack align="start" gap={1}>
                <Heading size="lg">
                  Resultados de búsqueda
                  {searchQuery && ` para "${searchQuery}"`}
                </Heading>
                <Text color="gray.600">
                  {isLoading 
                    ? "Buscando..."
                    : `${searchResults.length} producto${searchResults.length !== 1 ? 's' : ''} encontrado${searchResults.length !== 1 ? 's' : ''}`
                  }
                </Text>
              </VStack>
              
              <Button
                variant="outline"
                size="sm"
              >
                <Icon as={RiFilterLine} mr={2} />
                Filtros
              </Button>
            </Flex>

            {/* Grid de productos */}
            {isLoading ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <Box
                    key={i}
                    h="400px"
                    bg="gray.100"
                    borderRadius="lg"
                  />
                ))}
              </SimpleGrid>
            ) : searchResults.length > 0 ? (
              <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={6}>
                {searchResults.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <VStack gap={6} py={12}>
                <Icon as={RiSearchLine} boxSize={16} color="gray.400" />
                <VStack gap={2} textAlign="center">
                  <Heading size="md" color="gray.600">
                    No se encontraron resultados
                  </Heading>
                  <Text color="gray.500">
                    Intenta con términos de búsqueda diferentes o más generales
                  </Text>
                </VStack>
                
                <VStack gap={2}>
                  <Text fontWeight="medium">Sugerencias:</Text>
                  <Text color="gray.600" fontSize="sm" textAlign="center">
                    • Verifica la ortografía<br/>
                    • Usa términos más generales<br/>
                    • Prueba con sinónimos<br/>
                    • Busca por categoría de producto
                  </Text>
                </VStack>
                
                <Button
                  colorScheme="blue"
                  onClick={() => window.location.href = "/products"}
                >
                  Ver todos los productos
                </Button>
              </VStack>
            )}
          </VStack>
        )}

        {/* Categorías sugeridas */}
        {!hasSearched && (
          <VStack gap={4} align="stretch">
            <Heading size="md">Explorar por categorías</Heading>
            <SimpleGrid columns={{ base: 2, md: 4, lg: 6 }} gap={4}>
              {[
                { name: "Smartphones", emoji: "📱" },
                { name: "Laptops", emoji: "💻" },
                { name: "Auriculares", emoji: "🎧" },
                { name: "Gaming", emoji: "🎮" },
                { name: "Cámaras", emoji: "📷" },
                { name: "Accesorios", emoji: "🔌" },
              ].map((category) => (
                <Button
                  key={category.name}
                  variant="outline"
                  h="auto"
                  p={4}
                  onClick={() => {
                    setSearchQuery(category.name);
                    handleSearch(category.name);
                  }}
                >
                  <VStack gap={2}>
                    <Text fontSize="2xl">{category.emoji}</Text>
                    <Text fontSize="sm">{category.name}</Text>
                  </VStack>
                </Button>
              ))}
            </SimpleGrid>
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
