import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  Input,
  Card,
  SimpleGrid,
  Badge,
  Icon,
  Flex,
} from "@chakra-ui/react";
import { useState } from "react";
import { RiEditLine, RiUserLine, RiLockLine, RiShoppingBagLine, RiHeartLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    country: "",
  });

  if (!user) {
    return (
      <Container maxW="4xl" py={12}>
        <VStack gap={8}>
          <Icon as={RiUserLine} boxSize={20} color="gray.400" />
          <Heading size="lg" color="gray.600">
            Inicia sesión para ver tu perfil
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

  const handleSave = () => {
    // Aquí iría la lógica para guardar los cambios
    alert("Información actualizada correctamente");
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      country: "",
    });
    setIsEditing(false);
  };

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <Container maxW="6xl" py={8}>
      <VStack align="start" gap={6}>
        {/* Header */}
        <Box>
          <Heading size="xl" mb={2}>
            Mi Perfil
          </Heading>
          <Text color="gray.600">
            Gestiona tu información personal y configuración de cuenta
          </Text>
        </Box>

        <SimpleGrid columns={{ base: 1, lg: 3 }} gap={8} w="full">
          {/* Información personal */}
          <Box gridColumn={{ base: "1", lg: "1 / 3" }}>
            <VStack gap={6} align="stretch">
              {/* Datos básicos */}
              <Card.Root>
                <Card.Header>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">Información Personal</Heading>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      <Icon as={RiEditLine} mr={2} />
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                  </Flex>
                </Card.Header>
                <Card.Body>
                  <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
                    <VStack align="start" gap={2}>
                      <Text fontWeight="medium">Nombre</Text>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        disabled={!isEditing}
                        bg={!isEditing ? "gray.50" : "white"}
                      />
                    </VStack>
                    
                    <VStack align="start" gap={2}>
                      <Text fontWeight="medium">Apellido</Text>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        disabled={!isEditing}
                        bg={!isEditing ? "gray.50" : "white"}
                      />
                    </VStack>
                    
                    <VStack align="start" gap={2}>
                      <Text fontWeight="medium">Email</Text>
                      <Input
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        disabled={!isEditing}
                        bg={!isEditing ? "gray.50" : "white"}
                        type="email"
                      />
                    </VStack>
                    
                    <VStack align="start" gap={2}>
                      <Text fontWeight="medium">Teléfono</Text>
                      <Input
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        disabled={!isEditing}
                        bg={!isEditing ? "gray.50" : "white"}
                        placeholder="Agregar número de teléfono"
                      />
                    </VStack>
                    
                    <VStack align="start" gap={2} gridColumn={{ base: "1", md: "1 / 3" }}>
                      <Text fontWeight="medium">Dirección</Text>
                      <Input
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        disabled={!isEditing}
                        bg={!isEditing ? "gray.50" : "white"}
                        placeholder="Agregar dirección"
                      />
                    </VStack>
                    
                    <VStack align="start" gap={2}>
                      <Text fontWeight="medium">Ciudad</Text>
                      <Input
                        value={formData.city}
                        onChange={(e) => setFormData({...formData, city: e.target.value})}
                        disabled={!isEditing}
                        bg={!isEditing ? "gray.50" : "white"}
                        placeholder="Agregar ciudad"
                      />
                    </VStack>
                    
                    <VStack align="start" gap={2}>
                      <Text fontWeight="medium">País</Text>
                      <Input
                        value={formData.country}
                        onChange={(e) => setFormData({...formData, country: e.target.value})}
                        disabled={!isEditing}
                        bg={!isEditing ? "gray.50" : "white"}
                        placeholder="Agregar país"
                      />
                    </VStack>
                  </SimpleGrid>
                  
                  {isEditing && (
                    <HStack gap={4} mt={6}>
                      <Button colorScheme="blue" onClick={handleSave}>
                        Guardar cambios
                      </Button>
                      <Button variant="outline" onClick={handleCancel}>
                        Cancelar
                      </Button>
                    </HStack>
                  )}
                </Card.Body>
              </Card.Root>

              {/* Configuración de seguridad */}
              <Card.Root>
                <Card.Header>
                  <Heading size="md">Seguridad</Heading>
                </Card.Header>
                <Card.Body>
                  <VStack gap={4} align="stretch">
                    <Flex justify="space-between" align="center" p={4} border="1px solid" borderColor="gray.100" borderRadius="md">
                      <VStack align="start" gap={1}>
                        <Text fontWeight="medium">Contraseña</Text>
                        <Text fontSize="sm" color="gray.600">
                          Última actualización: Hace 30 días
                        </Text>
                      </VStack>
                      <Button size="sm" variant="outline">
                        <Icon as={RiLockLine} mr={2} />
                        Cambiar
                      </Button>
                    </Flex>
                    
                    <Flex justify="space-between" align="center" p={4} border="1px solid" borderColor="gray.100" borderRadius="md">
                      <VStack align="start" gap={1}>
                        <Text fontWeight="medium">Autenticación en dos pasos</Text>
                        <Text fontSize="sm" color="gray.600">
                          Aumenta la seguridad de tu cuenta
                        </Text>
                      </VStack>
                      <Button size="sm" variant="outline">
                        Configurar
                      </Button>
                    </Flex>
                  </VStack>
                </Card.Body>
              </Card.Root>
            </VStack>
          </Box>

          {/* Sidebar */}
          <VStack gap={6} align="stretch">
            {/* Avatar y info básica */}
            <Card.Root>
              <Card.Body textAlign="center">
                <VStack gap={4}>
                  <Box
                    w="120px"
                    h="120px"
                    borderRadius="full"
                    bg="blue.500"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    color="white"
                    fontSize="3xl"
                    fontWeight="bold"
                  >
                    {user.firstName.charAt(0).toUpperCase()}{user.lastName.charAt(0).toUpperCase()}
                  </Box>
                  <VStack gap={1}>
                    <Heading size="md">
                      {user.firstName} {user.lastName}
                    </Heading>
                    <Text color="gray.600">{user.email}</Text>
                    <Badge colorScheme={user.role === "ADMIN" ? "purple" : "blue"}>
                      {user.role === "ADMIN" ? "Administrador" : "Cliente"}
                    </Badge>
                  </VStack>
                  
                  <Text fontSize="sm" color="gray.500">
                    Miembro desde {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}
                  </Text>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Estadísticas rápidas */}
            <Card.Root>
              <Card.Header>
                <Heading size="md">Resumen de cuenta</Heading>
              </Card.Header>
              <Card.Body>
                <VStack gap={4} align="stretch">
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <Icon as={RiShoppingBagLine} color="blue.500" />
                      <Text>Órdenes totales</Text>
                    </HStack>
                    <Text fontWeight="bold">12</Text>
                  </Flex>
                  
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <Icon as={RiHeartLine} color="red.500" />
                      <Text>Favoritos</Text>
                    </HStack>
                    <Text fontWeight="bold">5</Text>
                  </Flex>
                  
                  <Box w="full" h="1px" bg="gray.200" />
                  
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="medium">Total gastado</Text>
                    <Text fontWeight="bold" color="green.600">$2,456.78</Text>
                  </Flex>
                </VStack>
              </Card.Body>
            </Card.Root>

            {/* Acciones rápidas */}
            <VStack gap={3} align="stretch">
              <Button 
                variant="outline" 
                w="full"
                onClick={() => window.location.href = "/orders"}
              >
                Ver mis órdenes
              </Button>
              
              <Button 
                variant="outline" 
                w="full"
                onClick={() => window.location.href = "/products"}
              >
                Explorar productos
              </Button>
              
              <Button 
                variant="outline" 
                w="full"
                colorScheme="red"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
            </VStack>
          </VStack>
        </SimpleGrid>
      </VStack>
    </Container>
  );
}
