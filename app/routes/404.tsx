import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Button,
  Icon,
  HStack,
} from "@chakra-ui/react";
import { RiHome2Line, RiSearchLine, RiArrowLeftLine, RiErrorWarningLine } from "react-icons/ri";

export default function NotFound() {
  const handleGoHome = () => {
    window.location.href = "/";
  };

  const handleGoBack = () => {
    window.history.back();
  };

  const handleSearch = () => {
    window.location.href = "/search";
  };

  const handleExploreProducts = () => {
    window.location.href = "/products";
  };

  return (
    <Container maxW="4xl" py={16}>
      <VStack gap={8} textAlign="center">
        {/* Icono de error */}
        <Box>
          <Icon 
            as={RiErrorWarningLine} 
            boxSize={24} 
            color="gray.400"
          />
        </Box>

        {/* Mensaje principal */}
        <VStack gap={4}>
          <Heading size="3xl" color="gray.700">
            404
          </Heading>
          <Heading size="xl" color="gray.600">
            Página no encontrada
          </Heading>
          <Text color="gray.500" fontSize="lg" maxW="2xl">
            Lo sentimos, la página que estás buscando no existe o ha sido movida. 
            Puede que hayas escrito mal la dirección o la página ya no esté disponible.
          </Text>
        </VStack>

        {/* Acciones sugeridas */}
        <VStack gap={6} w="full" maxW="md">
          <Text fontWeight="medium" color="gray.700">
            ¿Qué te gustaría hacer?
          </Text>
          
          <VStack gap={3} w="full">
            <Button
              colorScheme="blue"
              size="lg"
              w="full"
              onClick={handleGoHome}
            >
              <Icon as={RiHome2Line} mr={2} />
              Ir a inicio
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              w="full"
              onClick={handleGoBack}
            >
              <Icon as={RiArrowLeftLine} mr={2} />
              Volver atrás
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              w="full"
              onClick={handleSearch}
            >
              <Icon as={RiSearchLine} mr={2} />
              Buscar productos
            </Button>
          </VStack>
        </VStack>

        {/* Enlaces útiles */}
        <Box w="full">
          <Text mb={4} fontWeight="medium" color="gray.700">
            O explora estas secciones:
          </Text>
          
          <HStack gap={4} justify="center" flexWrap="wrap">
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={handleExploreProducts}
            >
              Productos
            </Button>
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => window.location.href = "/orders"}
            >
              Mis órdenes
            </Button>
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => window.location.href = "/profile"}
            >
              Mi perfil
            </Button>
            <Button
              variant="ghost"
              colorScheme="blue"
              onClick={() => window.location.href = "/cart"}
            >
              Carrito
            </Button>
          </HStack>
        </Box>

        {/* Información adicional */}
        <Box
          p={6}
          bg="gray.50"
          borderRadius="lg"
          w="full"
          maxW="2xl"
        >
          <VStack gap={3}>
            <Text fontSize="sm" color="gray.600" textAlign="center">
              <strong>¿Necesitas ayuda?</strong>
            </Text>
            <Text fontSize="sm" color="gray.500" textAlign="center">
              Si crees que esto es un error, puedes contactar a nuestro 
              equipo de soporte técnico o intentar recargar la página.
            </Text>
            <HStack gap={4} mt={2}>
              <Button size="sm" variant="outline">
                Contactar soporte
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Recargar página
              </Button>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
