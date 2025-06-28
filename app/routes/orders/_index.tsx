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
  Card,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { RiShoppingBagLine, RiEyeLine, RiTruckLine, RiCheckLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

// Tipos simplificados para la demo
interface SimpleOrder {
  id: string;
  status: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  trackingNumber?: string;
}

// Mock data simplificado
const mockOrders: SimpleOrder[] = [
  {
    id: "order-001",
    status: "DELIVERED",
    totalAmount: 999.99,
    itemCount: 1,
    createdAt: "2024-01-15T10:30:00Z",
    trackingNumber: "TRK123456789",
  },
  {
    id: "order-002", 
    status: "PROCESSING",
    totalAmount: 259.98,
    itemCount: 2,
    createdAt: "2024-01-25T16:45:00Z",
  },
];

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
    case "CONFIRMED":
      return "Confirmado";
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PENDING":
      return RiShoppingBagLine;
    case "CONFIRMED":
      return RiShoppingBagLine;
    case "PROCESSING":
      return RiShoppingBagLine;
    case "SHIPPED":
      return RiTruckLine;
    case "DELIVERED":
      return RiCheckLine;
    case "CANCELLED":
      return RiShoppingBagLine;
    default:
      return RiShoppingBagLine;
  }
};

export default function Orders() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string | "all">("all");

  if (!user) {
    return (
      <Container maxW="4xl" py={12}>
        <VStack gap={8}>
          <Icon as={RiShoppingBagLine} boxSize={20} color="gray.400" />
          <Heading size="lg" color="gray.600">
            Inicia sesión para ver tus órdenes
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

  const filteredOrders = selectedFilter === "all" 
    ? mockOrders 
    : mockOrders.filter(order => order.status === selectedFilter);

  const handleViewOrder = (orderId: string) => {
    window.location.href = `/orders/${orderId}`;
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack align="start" gap={6}>
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>
            Mis Órdenes
          </Heading>
          <Text color="gray.600">
            Revisa el estado y detalles de tus compras
          </Text>
        </Box>

        {/* Filtros */}
        <HStack gap={2} flexWrap="wrap">
          <Button
            variant={selectedFilter === "all" ? "solid" : "outline"}
            colorScheme="blue"
            size="sm"
            onClick={() => setSelectedFilter("all")}
          >
            Todas
          </Button>
          <Button
            variant={selectedFilter === "PENDING" ? "solid" : "outline"}
            colorScheme="yellow"
            size="sm"
            onClick={() => setSelectedFilter("PENDING")}
          >
            Pendientes
          </Button>
          <Button
            variant={selectedFilter === "PROCESSING" ? "solid" : "outline"}
            colorScheme="blue"
            size="sm"
            onClick={() => setSelectedFilter("PROCESSING")}
          >
            Procesando
          </Button>
          <Button
            variant={selectedFilter === "SHIPPED" ? "solid" : "outline"}
            colorScheme="purple"
            size="sm"
            onClick={() => setSelectedFilter("SHIPPED")}
          >
            Enviadas
          </Button>
          <Button
            variant={selectedFilter === "DELIVERED" ? "solid" : "outline"}
            colorScheme="green"
            size="sm"
            onClick={() => setSelectedFilter("DELIVERED")}
          >
            Entregadas
          </Button>
        </HStack>

        {/* Lista de órdenes */}
        {filteredOrders.length === 0 ? (
          <VStack gap={6} py={12} w="full">
            <Icon as={RiShoppingBagLine} boxSize={16} color="gray.400" />
            <Text color="gray.600" fontSize="lg">
              No hay órdenes para mostrar
            </Text>
            <Button 
              colorScheme="blue"
              onClick={() => window.location.href = "/products"}
            >
              Explorar productos
            </Button>
          </VStack>
        ) : (
          <VStack gap={4} w="full" align="stretch">
            {filteredOrders.map((order) => (
              <Card.Root key={order.id} variant="elevated">
                <Card.Body p={6}>
                  <Flex direction={{ base: "column", md: "row" }} gap={4}>
                    <VStack align="start" flex={1} gap={2}>
                      <HStack gap={4}>
                        <Heading size="md">Orden #{order.id}</Heading>
                        <Badge 
                          colorScheme={getStatusColor(order.status)}
                          px={2}
                          py={1}
                        >
                          <Icon as={getStatusIcon(order.status)} mr={1} />
                          {getStatusText(order.status)}
                        </Badge>
                      </HStack>
                      
                      <Text color="gray.600" fontSize="sm">
                        Realizada el {new Date(order.createdAt).toLocaleDateString()}
                      </Text>
                      
                      <Text>
                        {order.itemCount} {order.itemCount === 1 ? "producto" : "productos"}
                      </Text>
                      
                      <Text fontWeight="bold" color="blue.600" fontSize="lg">
                        Total: ${order.totalAmount.toFixed(2)}
                      </Text>
                      
                      {order.trackingNumber && (
                        <Text fontSize="sm" color="gray.600">
                          Tracking: {order.trackingNumber}
                        </Text>
                      )}
                    </VStack>
                    
                    <VStack gap={2} align={{ base: "stretch", md: "end" }}>
                      <Button
                        size="sm"
                        variant="outline"
                        colorScheme="blue"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        <Icon as={RiEyeLine} mr={2} />
                        Ver detalles
                      </Button>
                      
                      {order.status === "DELIVERED" && (
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="green"
                        >
                          Calificar productos
                        </Button>
                      )}
                      
                      {order.status === "PENDING" && (
                        <Button
                          size="sm"
                          variant="outline"
                          colorScheme="red"
                        >
                          Cancelar orden
                        </Button>
                      )}
                    </VStack>
                  </Flex>
                </Card.Body>
              </Card.Root>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
}
