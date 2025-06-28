import {
  Box,
  Container,
  HStack,
  Heading,
  Button,
  Text,
  Badge,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { Link, useLocation, useNavigate } from "react-router";
import { RiShoppingCartLine, RiUserLine, RiLogoutBoxLine, RiUserSettingsLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { useCart } from "../../context/CartContext";
import { useIsHydrated } from "../../hooks/useHydration";

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { totalItems } = useCart();
  const isHydrated = useIsHydrated();

  // Debug logs
  console.log('🔵 Navbar render:', { 
    isHydrated, 
    isAuthenticated, 
    user: user ? { id: user.id, firstName: user.firstName } : null 
  });

  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <Box 
      bg="white" 
      borderBottom="1px" 
      borderColor="gray.200" 
      position="sticky" 
      top={0} 
      zIndex={1000}
      shadow="sm"
    >
      <Container maxW="6xl">
        <Flex align="center" py={4}>
          {/* Logo */}
          <Link to="/">
            <Heading 
              size="lg" 
              color="teal.500"
              _hover={{ color: "teal.600" }}
              cursor="pointer"
            >
              TuMercado
            </Heading>
          </Link>

          <Spacer />

          {/* Navigation Links */}
          <HStack gap={6} display={{ base: "none", md: "flex" }}>
            <Link to="/products">
              <Text
                fontWeight={isActiveRoute("/products") ? "bold" : "medium"}
                color={isActiveRoute("/products") ? "teal.500" : "gray.600"}
                _hover={{ color: "teal.500" }}
                cursor="pointer"
              >
                Productos
              </Text>
            </Link>
          </HStack>

          <Spacer />

          {/* Action Buttons */}
          <HStack gap={4}>
            {/* Cart */}
            <Link to="/cart">
              <Button
                variant="ghost"
                size="sm"
                position="relative"
              >
                <RiShoppingCartLine size={20} />
                {isHydrated && totalItems > 0 && (
                  <Badge
                    position="absolute"
                    top="-1"
                    right="-1"
                    colorScheme="red"
                    borderRadius="full"
                    fontSize="xs"
                    minW="18px"
                    h="18px"
                  >
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Auth Section */}
            {!isHydrated ? (
              // Placeholder mientras se hidrata
              <Button size="sm" variant="outline" disabled>
                <RiUserLine size={16} />
                <Text ml={2}>...</Text>
              </Button>
            ) : !isAuthenticated ? (
              // Usuario no autenticado
              <HStack gap={2}>
                <Link to="/auth/login">
                  <Button size="sm" variant="outline">
                    <RiUserLine size={16} />
                    <Text ml={2}>Acceder</Text>
                  </Button>
                </Link>
                <Link to="/auth/register">
                  <Button size="sm" colorScheme="teal">
                    Registrarse
                  </Button>
                </Link>
              </HStack>
            ) : (
              // Usuario autenticado - Menú simple con botones
              <HStack gap={2}>
                <Text fontSize="sm" color="gray.600">
                  Hola, {user?.firstName}
                </Text>
                <Link to="/profile">
                  <Button
                    size="sm"
                    variant="ghost"
                  >
                    <RiUserSettingsLine size={16} />
                  </Button>
                </Link>
                <Button
                  onClick={handleLogout}
                  size="sm"
                  variant="ghost"
                  color="red.500"
                >
                  <RiLogoutBoxLine size={16} />
                </Button>
              </HStack>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
}
