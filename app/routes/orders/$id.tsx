import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Icon,
  Flex,
  Image,
  SimpleGrid,
  Card,
} from "@chakra-ui/react";
import { RiArrowLeftLine, RiTruckLine, RiMapPinLine, RiCalendarLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

// Datos mock para la demo
const mockOrderDetail = {
  id: "order-001",
  status: "DELIVERED",
  totalAmount: 999.99,
  shippingCost: 0,
  tax: 190.00,
  subtotal: 809.99,
  createdAt: "2024-01-15T10:30:00Z",
  estimatedDelivery: "2024-01-18T10:30:00Z",
  trackingNumber: "TRK123456789",
  shippingMethod: "Envío estándar",
  items: [
    {
      id: "item-1",
      name: "iPhone 15 Pro",
      image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=150",
      quantity: 1,
      price: 999.99,
      totalPrice: 999.99,
    }
  ],
  shippingAddress: {
    name: "Usuario de Prueba",
    street: "Calle 123 #45-67",
    city: "Bogotá",
    state: "Cundinamarca",
    zipCode: "110111",
    country: "Colombia",
    phone: "+57 300 123 4567",
  },
  timeline: [
    {
      status: "Pedido realizado",
      date: "2024-01-15T10:30:00Z",
      completed: true,
    },
    {
      status: "Pago confirmado",
      date: "2024-01-15T11:00:00Z", 
      completed: true,
    },
    {
      status: "En preparación",
      date: "2024-01-16T09:00:00Z",
      completed: true,
    },
    {
      status: "Enviado",
      date: "2024-01-17T14:00:00Z",
      completed: true,
    },
    {
      status: "Entregado",
      date: "2024-01-18T10:30:00Z",
      completed: true,
    },
  ]
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "yellow";
    case "PROCESSING":
      return "blue";
    case "SHIPPED":
      return "purple";
    case "DELIVERED":
      return "green";
    case "CANCELLED":
      return "red";
    default:
      return "gray";
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case "PENDING":
      return "Pendiente";
    case "PROCESSING":
      return "Procesando";
    case "SHIPPED":
      return "Enviado";
    case "DELIVERED":
      return "Entregado";
    case "CANCELLED":
      return "Cancelado";
    default:
      return "Desconocido";
  }
};

export default function OrderDetail() {
  const { user } = useAuth();
  const order = mockOrderDetail;

  if (!user) {
    return (
      <Container maxW="4xl" py={12}>
        <VStack gap={8}>
          <Heading size="lg" color="gray.600">
            Inicia sesión para ver los detalles de tu orden
          </Heading>
          <Button 
            colorScheme="blue" 
            size="lg"
            onClick={() => window.location.href = "/auth/login"}
          >
            Iniciar sesión
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="7xl" py={8}>
      <VStack align="start" gap={6}>
        {/* Header */}
        <Box>
          <Button
            variant="ghost"
            mb={4}
            onClick={() => window.location.href = "/orders"}
          >
            <Icon as={RiArrowLeftLine} mr={2} />
            Volver a mis órdenes
          </Button>
          
          <Flex direction={{ base: "column", md: "row" }} justify="space-between" align="start" gap={4}>
            <VStack align="start" gap={2}>
              <Heading size="xl">Orden #{order.id}</Heading>
              <Text color="gray.600">
                Realizada el {new Date(order.createdAt).toLocaleDateString()}
              </Text>
            </VStack>
            
            <Badge 
              colorScheme={getStatusColor(order.status)}
              px={4}
              py={2}
              fontSize="md"
            >
              {getStatusText(order.status)}
            </Badge>
          </Flex>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8} w="full">
          {/* Información de productos */}
          <Box gridColumn={{ base: "1", lg: "1 / 3" }}>
            <VStack gap={6} align="stretch">
              {/* Productos */}
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Productos</Heading>
                </Card.Header>
                <Card.Body>
                  <VStack gap={4} align="stretch">
                    {order.items.map((item) => (
                      <Flex key={item.id} gap={4} p={4} border="1px solid" borderColor="gray.100" borderRadius="md">
                        <Image
                          src={item.image}
                          alt={item.name}
                          w="80px"
                          h="80px"
                          objectFit="cover"
                          borderRadius="md"
                        />
                        
                        <Box flex={1}>
                          <VStack align="start" gap={1}>
                            <Heading size="sm">{item.name}</Heading>
                            <Text fontSize="sm" color="gray.600">
                              Cantidad: {item.quantity}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              Precio unitario: ${item.price.toFixed(2)}
                            </Text>
                            <Text fontWeight="bold" color="blue.600">
                              Subtotal: ${item.totalPrice.toFixed(2)}
                            </Text>
                          </VStack>
                        </Box>
                      </Flex>
                    ))}
                  </VStack>
                </Card.Body>
              </Card.Root>

              {/* Seguimiento */}
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Seguimiento del pedido</Heading>
                </Card.Header>
                <Card.Body>
                  <VStack gap={4} align="stretch">
                    {order.trackingNumber && (
                      <Box p={4} bg="blue.50" borderRadius="md">
                        <HStack>
                          <Icon as={RiTruckLine} color="blue.500" />
                          <VStack align="start" gap={1}>
                            <Text fontWeight="medium">Número de seguimiento</Text>
                            <Text fontSize="sm" color="gray.600">{order.trackingNumber}</Text>
                          </VStack>
                        </HStack>
                      </Box>
                    )}
                    
                    <VStack gap={3} align="stretch">
                      {order.timeline.map((step, index) => (
                        <HStack key={index} gap={4}>
                          <Box
                            w="12px"
                            h="12px"
                            borderRadius="full"
                            bg={step.completed ? "green.500" : "gray.300"}
                          />
                          <VStack align="start" gap={1} flex={1}>
                            <Text fontWeight={step.completed ? "bold" : "normal"}>
                              {step.status}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
                              {new Date(step.date).toLocaleString()}
                            </Text>
                          </VStack>
                        </HStack>
                      ))}
                    </VStack>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </VStack>
          </Box>

          {/* Sidebar */}
          <VStack gap={6} align="stretch">
            {/* Resumen de costos */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Resumen de costos</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={3} align="stretch">
                  <Flex justify="space-between">
                    <Text>Subtotal:</Text>
                    <Text>${order.subtotal.toFixed(2)}</Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Envío:</Text>
                    <Text color={order.shippingCost === 0 ? "green.600" : "gray.800"}>
                      {order.shippingCost === 0 ? "Gratis" : `$${order.shippingCost.toFixed(2)}`}
                    </Text>
                  </Flex>
                  <Flex justify="space-between">
                    <Text>Impuestos:</Text>
                    <Text>${order.tax.toFixed(2)}</Text>
                  </Flex>
                  
                  <Box w="full" h="1px" bg="gray.200" />
                  
                  <Flex justify="space-between" align="center">
                    <Text fontSize="lg" fontWeight="bold">Total:</Text>
                    <Text fontSize="xl" fontWeight="bold" color="blue.600">
                      ${order.totalAmount.toFixed(2)}
                    </Text>
                  </Flex>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Dirección de envío */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Dirección de envío</Heading>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={2}>
                  <Text fontWeight="bold">{order.shippingAddress.name}</Text>
                  <Text>{order.shippingAddress.street}</Text>
                  <Text>
                    {order.shippingAddress.city}, {order.shippingAddress.state}
                  </Text>
                  <Text>
                    {order.shippingAddress.zipCode}, {order.shippingAddress.country}
                  </Text>
                  {order.shippingAddress.phone && (
                    <Text color="gray.600">{order.shippingAddress.phone}</Text>
                  )}
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Información de entrega */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Información de entrega</Heading>
              </Card.Header>
              <Card.Body>
                <VStack align="start" gap={3}>
                  <HStack>
                    <Icon as={RiTruckLine} color="blue.500" />
                    <VStack align="start" gap={1}>
                      <Text fontWeight="medium">Método de envío</Text>
                      <Text fontSize="sm" color="gray.600">{order.shippingMethod}</Text>
                    </VStack>
                  </HStack>
                  
                  <HStack>
                    <Icon as={RiCalendarLine} color="green.500" />
                    <VStack align="start" gap={1}>
                      <Text fontWeight="medium">Entrega estimada</Text>
                      <Text fontSize="sm" color="gray.600">
                        {new Date(order.estimatedDelivery).toLocaleDateString()}
                      </Text>
                    </VStack>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Acciones */}
            <VStack gap={3} align="stretch">
              {order.status === "DELIVERED" && (
                <Button colorScheme="green" variant="outline">
                  Calificar productos
                </Button>
              )}
              
              {order.status === "PENDING" && (
                <Button colorScheme="red" variant="outline">
                  Cancelar orden
                </Button>
              )}
              
              <Button variant="outline">
                Descargar factura
              </Button>
              
              <Button variant="outline">
                Contactar soporte
              </Button>
            </VStack>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
