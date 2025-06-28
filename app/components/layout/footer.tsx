import { Box, Container, Text } from "@chakra-ui/react";

export function Footer() {
  return (
    <Box bg="gray.50" borderTop="1px" borderColor="gray.200" py={8}>
      <Container maxW="6xl">
        <Text textAlign="center" color="gray.600">
          © 2025 TuMercadoOnline. Todos los derechos reservados.
        </Text>
      </Container>
    </Box>
  );
}
