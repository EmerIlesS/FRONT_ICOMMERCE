import {
  Box,
  Container,
  Heading,
  Text,
  SimpleGrid,
  HStack,
  VStack,
  Button,
  Badge,
  Icon,
  Flex,
  Image,
  Stack,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { RiShoppingCartLine, RiHeartLine, RiStarFill, RiArrowLeftLine } from "react-icons/ri";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import type { Product } from "../../types/product";

// Mock data - en producción vendría del backend
const mockProduct: Product = {
  id: "1",
  name: "Smartphone Galaxy Pro",
  description: "Un smartphone de última generación con cámara de 108MP, pantalla AMOLED de 6.7 pulgadas, procesador octa-core y batería de 5000mAh. Incluye carga rápida de 65W y almacenamiento de 256GB.",
  price: 899.99,
  image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
  images: [
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  ],
  category: "Electrónicos",
  categoryId: "electronics",
  stock: 15,
  rating: 4.5,
  reviews: 234,
  featured: true,
  active: true,
  brand: "Samsung",
  specifications: {
    "Pantalla": "6.7\" AMOLED",
    "Procesador": "Snapdragon 8 Gen 2",
    "RAM": "12GB",
    "Almacenamiento": "256GB",
    "Cámara": "108MP + 12MP + 12MP",
    "Batería": "5000mAh",
    "Sistema Operativo": "Android 14"
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export default function ProductDetail() {
  const { addItem } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // En producción, aquí haríamos una llamada al backend con el id
  const product = mockProduct;

  if (!product) {
    return (
      <Container maxW="7xl" py={8}>
        <Text>Producto no encontrado</Text>
      </Container>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      alert("Debes iniciar sesión para agregar productos al carrito");
      return;
    }

    addItem(product, quantity);
    alert(`${product.name} se agregó al carrito`);
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 1;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Container maxW="7xl" py={8}>
      {/* Botón volver */}
      <Button 
        variant="ghost" 
        mb={6}
        onClick={() => window.location.href = "/products"}
      >
        <Icon as={RiArrowLeftLine} mr={2} />
        Volver a productos
      </Button>

      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={12}>
        {/* Imágenes del producto */}
        <VStack gap={4}>
          <Image
            src={product.images ? product.images[selectedImage] : product.image}
            alt={product.name}
            w="full"
            h="400px"
            objectFit="cover"
            borderRadius="lg"
            border="1px solid"
            borderColor="gray.200"
          />
          
          {product.images && (
            <HStack gap={2} w="full" justifyContent="center">
              {product.images.map((image, index) => (
                <Image
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  w="80px"
                  h="80px"
                  objectFit="cover"
                  borderRadius="md"
                  border="2px solid"
                  borderColor={selectedImage === index ? "blue.500" : "gray.200"}
                  cursor="pointer"
                  onClick={() => setSelectedImage(index)}
                  _hover={{ borderColor: "blue.300" }}
                />
              ))}
            </HStack>
          )}
        </VStack>

        {/* Información del producto */}
        <VStack align="start" gap={6}>
          <VStack align="start" gap={2}>
            <Badge colorScheme="blue" size="lg">
              {product.category}
            </Badge>
            <Heading size="xl">{product.name}</Heading>
            {product.brand && (
              <Text color="gray.600" fontSize="lg">
                {product.brand}
              </Text>
            )}
          </VStack>

          {/* Rating y reseñas */}
          <HStack>
            <HStack gap={1}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Icon
                  key={i}
                  as={RiStarFill}
                  color={i < Math.floor(product.rating) ? "yellow.400" : "gray.300"}
                />
              ))}
            </HStack>
            <Text color="gray.600">
              {product.rating} ({product.reviews} reseñas)
            </Text>
          </HStack>

          {/* Precio */}
          <Heading size="lg" color="blue.600">
            ${product.price.toFixed(2)}
          </Heading>

          {/* Stock */}
          <Text color={product.stock > 0 ? "green.600" : "red.600"} fontWeight="medium">
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
          </Text>

          {/* Descripción */}
          <Box>
            <Heading size="md" mb={2}>Descripción</Heading>
            <Text color="gray.700" lineHeight="tall">
              {product.description}
            </Text>
          </Box>

          <Box w="full" h="1px" bg="gray.200" />

          {/* Especificaciones */}
          {product.specifications && (
            <Box w="full">
              <Heading size="md" mb={4}>Especificaciones</Heading>
              <VStack align="start" gap={2}>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <Flex key={key} w="full" justify="space-between">
                    <Text fontWeight="medium" color="gray.600">
                      {key}:
                    </Text>
                    <Text>{value}</Text>
                  </Flex>
                ))}
              </VStack>
            </Box>
          )}

          <Box w="full" h="1px" bg="gray.200" />

          {/* Controles de compra */}
          {product.stock > 0 && (
            <VStack align="start" gap={4} w="full">
              <Box>
                <Text mb={2} fontWeight="medium">Cantidad:</Text>
                <Input
                  type="number"
                  value={quantity}
                  onChange={handleQuantityChange}
                  min={1}
                  max={product.stock}
                  maxW="120px"
                />
              </Box>

              <Stack direction={{ base: "column", sm: "row" }} gap={4} w="full">
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleAddToCart}
                  flex={1}
                >
                  <Icon as={RiShoppingCartLine} mr={2} />
                  Agregar al carrito
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    alert("El producto se agregó a tu lista de deseos");
                  }}
                >
                  <Icon as={RiHeartLine} mr={2} />
                  Favoritos
                </Button>
              </Stack>
            </VStack>
          )}
        </VStack>
      </SimpleGrid>
    </Container>
  );
}
