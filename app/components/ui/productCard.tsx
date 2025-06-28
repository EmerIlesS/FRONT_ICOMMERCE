import {
  Card,
  Box,
  Image,
  Badge,
  VStack,
  HStack,
  Heading,
  Text,
  Button,
  Icon,
} from "@chakra-ui/react";
import { RiShoppingCartLine, RiStarFill, RiHeartLine, RiHeartFill } from "react-icons/ri";
import { useCart } from "../../context/CartContext";
import { useState } from "react";
import type { Product } from "../../types";

interface ProductCardProps {
  product: Product;
  onProductClick?: (product: Product) => void;
  showAddToCart?: boolean;
  showFavorite?: boolean;
}

export function ProductCard({ 
  product, 
  onProductClick, 
  showAddToCart = true,
  showFavorite = true 
}: ProductCardProps) {
  const { addItem } = useCart();
  const [isFavorite, setIsFavorite] = useState(false); // TODO: obtener desde contexto/API
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Evitar que se active el click del producto
    setIsLoading(true);
    
    try {
      addItem(product, 1);
      // TODO: Mostrar notificación de éxito
    } catch (error) {
      console.error('Error adding to cart:', error);
      // TODO: Mostrar notificación de error
    } finally {
      setIsLoading(false);
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setIsFavorite(!isFavorite);
      // TODO: Conectar con API de favoritos
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setIsFavorite(isFavorite); // Revertir en caso de error
    }
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product);
    }
  };

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Card.Root
      variant="elevated"
      cursor="pointer"
      _hover={{ transform: "translateY(-4px)", shadow: "lg" }}
      transition="all 0.3s"
      onClick={handleProductClick}
      overflow="hidden"
    >
      <Card.Body p={0}>
        <Box position="relative">
          <Image
            src={product.image}
            alt={product.name}
            h="200px"
            w="full"
            objectFit="cover"
            loading="lazy"
          />
          
          {/* Badges y botones sobre la imagen */}
          <Box position="absolute" top={2} left={2} right={2}>
            <HStack justify="space-between" align="start">
              {/* Badge de descuento */}
              {discountPercentage > 0 && (
                <Badge colorScheme="red" fontSize="xs">
                  -{discountPercentage}%
                </Badge>
              )}
              
              {/* Botón de favorito */}
              {showFavorite && (
                <Button
                  size="sm"
                  variant="ghost"
                  colorScheme="red"
                  onClick={handleFavoriteToggle}
                  p={1}
                  minW="auto"
                  h="auto"
                  bg="whiteAlpha.800"
                  _hover={{ bg: "whiteAlpha.900" }}
                >
                  <Icon 
                    as={isFavorite ? RiHeartFill : RiHeartLine} 
                    color={isFavorite ? "red.500" : "gray.600"}
                    boxSize={4}
                  />
                </Button>
              )}
            </HStack>
          </Box>

          {/* Badge de stock bajo */}
          {product.stock <= 5 && product.stock > 0 && (
            <Badge
              position="absolute"
              bottom={2}
              left={2}
              colorScheme="orange"
              fontSize="xs"
            >
              ¡Últimas {product.stock} unidades!
            </Badge>
          )}
          
          {/* Badge de sin stock */}
          {product.stock === 0 && (
            <Badge
              position="absolute"
              bottom={2}
              left={2}
              colorScheme="red"
              fontSize="xs"
            >
              Sin stock
            </Badge>
          )}
        </Box>

        <VStack gap={3} p={4} align="start">
          {/* Categoría */}
          <Badge colorScheme="blue" size="sm">
            {product.category}
          </Badge>
          
          {/* Nombre del producto */}
          <Heading 
            size="sm" 
            lineHeight="1.3"
            css={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
            }}
          >
            {product.name}
          </Heading>

          {/* Rating y reseñas */}
          <HStack gap={2}>
            <HStack gap={1}>
              <Icon as={RiStarFill} color="yellow.400" boxSize={4} />
              <Text fontSize="sm" fontWeight="medium">
                {product.rating.toFixed(1)}
              </Text>
            </HStack>
            <Text fontSize="sm" color="gray.500">
              ({product.reviews} reseñas)
            </Text>
          </HStack>

          {/* Precios */}
          <VStack gap={1} align="start" w="full">
            <HStack gap={2} align="baseline">
              <Text fontSize="lg" fontWeight="bold" color="teal.500">
                ${product.price.toLocaleString()}
              </Text>
              {product.originalPrice && product.originalPrice > product.price && (
                <Text
                  fontSize="sm"
                  color="gray.400"
                  textDecoration="line-through"
                >
                  ${product.originalPrice.toLocaleString()}
                </Text>
              )}
            </HStack>

            {/* Botón de agregar al carrito */}
            {showAddToCart && (
              <Button
                size="sm"
                colorScheme="teal"
                w="full"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                loading={isLoading}
              >
                <Icon as={RiShoppingCartLine} mr={2} />
                {product.stock === 0 ? 'Sin stock' : 'Agregar al Carrito'}
              </Button>
            )}
          </VStack>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
