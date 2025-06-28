import { Box, Heading, Text, Button, Container } from "@chakra-ui/react";
import { Link } from "react-router";
import { Navbar } from "../components/layout/navbar";
import { Footer } from "../components/layout/footer";

export default function Home() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Box flex="1">
        <Container maxW="6xl" py={8}>
          <Box textAlign="center">
            <Heading size="2xl" mb={4}>
              Bienvenido a TuMercadoOnline
            </Heading>
            <Text fontSize="lg" mb={6}>
              Tu tienda online de confianza
            </Text>
            <Box>
              <Link to="/products">
                <Button colorScheme="teal" size="lg" mr={4}>
                  Ver Productos
                </Button>
              </Link>
              <Link to="/auth/login">
                <Button variant="outline" size="lg">
                  Iniciar Sesión
                </Button>
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
}
