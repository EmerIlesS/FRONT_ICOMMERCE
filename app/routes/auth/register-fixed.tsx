import {
  Box,
  Button,
  VStack,
  Input,
  Heading,
  Text,
  Link,
  Card,
  HStack,
  Field,
  IconButton,
  InputGroup,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { Link as RouterLink } from "react-router";

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Función para mostrar notificaciones
  const showNotification = (title: string, description: string, type: 'success' | 'error') => {
    if (type === 'success') {
      alert(`✅ ${title}: ${description}`);
    } else {
      alert(`❌ ${title}: ${description}`);
    }
  };

  // Validación de email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar errores al escribir
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.values(newErrors).every(error => !error);
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // TODO: Aquí irá la lógica de registro con el backend
      console.log("Datos de registro:", {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });
      
      // Simulación de petición (remover cuando se implemente la lógica real)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showNotification(
        "¡Cuenta creada exitosamente!",
        "Ya puedes iniciar sesión con tu nueva cuenta",
        'success'
      );

      // Limpiar formulario
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

    } catch (error) {
      showNotification(
        "Error al crear la cuenta",
        "Intenta nuevamente o verifica que el email no esté en uso",
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="gray.50"
      p={4}
    >
      <Card.Root maxW="lg" w="full" variant="elevated">
        <Card.Body p={8}>
          <VStack gap={6} align="stretch">
            {/* Header */}
            <VStack gap={2}>
              <Heading size="lg" color="teal.600">
                Crear Cuenta
              </Heading>
              <Text color="gray.600" textAlign="center">
                Únete a nuestra plataforma de e-commerce
              </Text>
            </VStack>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <VStack gap={4}>
                {/* Nombre y Apellido */}
                <SimpleGrid columns={2} gap={4} w="full">
                  <Field.Root invalid={!!errors.firstName}>
                    <Field.Label htmlFor="firstName">Nombre</Field.Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="Tu nombre"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                    {errors.firstName && <Field.ErrorText>{errors.firstName}</Field.ErrorText>}
                  </Field.Root>

                  <Field.Root invalid={!!errors.lastName}>
                    <Field.Label htmlFor="lastName">Apellido</Field.Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Tu apellido"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <Field.ErrorText>{errors.lastName}</Field.ErrorText>}
                  </Field.Root>
                </SimpleGrid>

                {/* Email */}
                <Field.Root invalid={!!errors.email}>
                  <Field.Label htmlFor="email">Email</Field.Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && <Field.ErrorText>{errors.email}</Field.ErrorText>}
                </Field.Root>

                {/* Password */}
                <Field.Root invalid={!!errors.password}>
                  <Field.Label htmlFor="password">Contraseña</Field.Label>
                  <InputGroup
                    endElement={
                      <IconButton
                        aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        onClick={() => setShowPassword(!showPassword)}
                        variant="ghost"
                        size="sm"
                      >
                        {showPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                      </IconButton>
                    }
                  >
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
                </Field.Root>

                {/* Confirm Password */}
                <Field.Root invalid={!!errors.confirmPassword}>
                  <Field.Label htmlFor="confirmPassword">Confirmar Contraseña</Field.Label>
                  <InputGroup
                    endElement={
                      <IconButton
                        aria-label={showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        variant="ghost"
                        size="sm"
                      >
                        {showConfirmPassword ? <RiEyeOffLine /> : <RiEyeLine />}
                      </IconButton>
                    }
                  >
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repite tu contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.confirmPassword && <Field.ErrorText>{errors.confirmPassword}</Field.ErrorText>}
                </Field.Root>

                {/* Botón de submit */}
                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  w="full"
                  loading={isLoading}
                  loadingText="Creando cuenta..."
                >
                  Crear Cuenta
                </Button>
              </VStack>
            </form>

            {/* Link para login */}
            <HStack gap={1} fontSize="sm" justify="center">
              <Text color="gray.600">¿Ya tienes cuenta?</Text>
              <Link asChild color="teal.500" fontWeight="medium">
                <RouterLink to="/auth/login">
                  Inicia sesión aquí
                </RouterLink>
              </Link>
            </HStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}
