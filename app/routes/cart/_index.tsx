import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Icon,
  Image,
  Flex,
  Spacer,
  Badge,
  Input,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { RiDeleteBinLine, RiShoppingCartLine, RiArrowRightLine, RiSubtractLine, RiAddLine } from "react-icons/ri";
import { useNavigate } from "react-router";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useIsHydrated } from "../../hooks/useHydration";
import type { CartItem } from "../../types";

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const isHydrated = useIsHydrated();

  // Mostrar loading mientras se hidrata
  if (!isHydrated) {
    return (
      <Container maxW="4xl" py={12}>
        <VStack gap={8}>
          <Icon as={RiShoppingCartLine} boxSize={20} color="gray.400" />
          <Heading size="lg" color="gray.600">
            Cargando carrito...
          </Heading>
        </VStack>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return (
      <Container maxW="4xl" py={12}>
        <VStack gap={8}>
          <Icon as={RiShoppingCartLine} boxSize={20} color="gray.400" />
          <Heading size="lg" color="gray.600">
            Inicia sesión para ver tu carrito
          </Heading>
          <Button 
            colorScheme="blue" 
            size="lg"
            onClick={() => navigate("/auth/login")}
          >
            Iniciar sesión
          </Button>
        </VStack>
      </Container>
    );
  }

  if (items.length === 0) {
    return (
      <Container maxW="4xl" py={12}>
        <VStack gap={8}>
          <Icon as={RiShoppingCartLine} boxSize={20} color="gray.400" />
          <Heading size="lg" color="gray.600">
            Tu carrito está vacío
          </Heading>
          <Text color="gray.500" textAlign="center">
            Explora nuestros productos y encuentra algo increíble para agregar a tu carrito
          </Text>
          <Button 
            colorScheme="blue" 
            size="lg"
            onClick={() => navigate("/products")}
          >
            Ver productos
          </Button>
        </VStack>
      </Container>
    );
  }

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    alert("Funcionalidad de checkout próximamente. Total: $" + totalPrice.toFixed(2));
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack align="start" gap={8}>
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>
            Carrito de compras
          </Heading>
          <Text color="gray.600">
            {totalItems} {totalItems === 1 ? "producto" : "productos"} en tu carrito
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8} w="full">
          {/* Lista de productos */}
          <Box gridColumn={{ base: "1", lg: "1 / 3" }}>
            <VStack gap={4} align="stretch">
              {items.map((item) => (
                <Box
                  key={item.productId}
                  p={4}
                  border="1px solid"
                  borderColor="gray.200"
                  borderRadius="lg"
                  bg="white"
                >
                  <Flex gap={4}>
                    <Image
                      src={item.product.image}
                      alt={item.product.name}
                      w="100px"
                      h="100px"
                      objectFit="cover"
                      borderRadius="md"
                    />
                    
                    <Box flex={1}>
                      <VStack align="start" gap={2}>
                        <Heading size="md">{item.product.name}</Heading>
                        <Text color="blue.600" fontSize="lg" fontWeight="bold">
                          ${item.price.toFixed(2)}
                        </Text>
                        
                        {/* Controles de cantidad */}
                        <HStack>
                          <Text fontSize="sm" color="gray.600">Cantidad:</Text>
                          <HStack>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.productId, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                            >
                              <Icon as={RiSubtractLine} />
                            </Button>
                            <Text minW="40px" textAlign="center" fontWeight="medium">
                              {item.quantity}
                            </Text>
                            <Button
                              size="xs"
                              variant="outline"
                              onClick={() => handleQuantityChange(item.productId, item.quantity + 1)}
                            >
                              <Icon as={RiAddLine} />
                            </Button>
                          </HStack>
                        </HStack>
                        
                        <Text fontSize="sm" color="gray.600">
                          Subtotal: ${item.totalPrice.toFixed(2)}
                        </Text>
                      </VStack>
                    </Box>
                    
                    <VStack gap={2}>
                      <Button
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Icon as={RiDeleteBinLine} />
                      </Button>
                    </VStack>
                  </Flex>
                </Box>
              ))}
              
              {/* Botón limpiar carrito */}
              <Button
                variant="outline"
                colorScheme="red"
                onClick={clearCart}
                alignSelf="start"
              >
                Vaciar carrito
              </Button>
            </VStack>
          </Box>

          {/* Resumen de compra */}
          <Box>
            <Box
              p={6}
              border="1px solid"
              borderColor="gray.200"
              borderRadius="lg"
              bg="gray.50"
              position="sticky"
              top="20px"
            >
              <VStack gap={4} align="stretch">
                <Heading size="md">Resumen de compra</Heading>
                
                <Box w="full" h="1px" bg="gray.200" />
                
                <VStack gap={2} align="stretch">
                  <Flex justify="space-between">
                    <Text>Subtotal ({totalItems} productos):</Text>
                    <Text fontWeight="medium">${totalPrice.toFixed(2)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Envío:</Text>
                    <Text fontWeight="medium" color="green.600">Gratis</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Impuestos:</Text>
                    <Text fontWeight="medium">${(totalPrice * 0.19).toFixed(2)}</Text>
                  </Flex>
                </VStack>
                
                <Box w="full" h="1px" bg="gray.200" />
                
                <Flex justify="space-between" align="center">
                  <Text fontSize="lg" fontWeight="bold">Total:</Text>
                  <Text fontSize="xl" fontWeight="bold" color="blue.600">
                    ${(totalPrice * 1.19).toFixed(2)}
                  </Text>
                </Flex>
                
                <Button
                  colorScheme="blue"
                  size="lg"
                  onClick={handleCheckout}
                  w="full"
                >
                  Proceder al pago
                  <Icon as={RiArrowRightLine} ml={2} />
                </Button>
                
                <Button
                  variant="outline"
                  w="full"
                  onClick={() => navigate("/products")}
                >
                  Continuar comprando
                </Button>
              </VStack>
            </Box>
          </Box>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
