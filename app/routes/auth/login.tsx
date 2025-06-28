import {
  Box,
  Button,
  VStack,
  Input,
  Heading,
  Text,
  Card,
  HStack,
  Field,
  IconButton,
  InputGroup,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";
import { useAuth } from "../../context/AuthContext";
import { useIsHydrated } from "../../hooks/useHydration";

export default function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAuth();
  const isHydrated = useIsHydrated();
  
  // Redirigir si ya está autenticado (solo después de hidratación)
  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isHydrated, isAuthenticated, navigate]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Función para mostrar notificaciones
  const showNotification = (title: string, description: string, type: 'success' | 'error') => {
    // Aquí puedes implementar tu sistema de notificaciones preferido
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
      email: "",
      password: "",
    };

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

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('🔵 Iniciando login desde página...');
      
      // Usar la función login del contexto
      await login(formData);
      
      console.log('🟢 Login completado en página, contexto debería estar actualizado');
      
      showNotification(
        "¡Bienvenido!",
        "Has iniciado sesión correctamente",
        'success'
      );

      // Redirigir al home o a la página anterior
      console.log('🔵 Redirigiendo a home...');
      navigate("/", { replace: true });

    } catch (error) {
      console.error("🔴 Error en login desde página:", error);
      showNotification(
        "Error al iniciar sesión",
        "Verifica tus credenciales e intenta nuevamente",
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
      <Card.Root maxW="md" w="full" variant="elevated">
        <Card.Body p={8}>
          <VStack gap={6} align="stretch">
            {/* Header */}
            <VStack gap={2}>
              <Heading size="lg" color="teal.600">
                Iniciar Sesión
              </Heading>
              <Text color="gray.600" textAlign="center">
                Ingresa a tu cuenta para continuar
              </Text>
            </VStack>

            {/* Formulario */}
            <form onSubmit={handleSubmit}>
              <VStack gap={4}>
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
                      placeholder="Tu contraseña"
                      value={formData.password}
                      onChange={handleChange}
                    />
                  </InputGroup>
                  {errors.password && <Field.ErrorText>{errors.password}</Field.ErrorText>}
                </Field.Root>

                {/* Botón de submit */}
                <Button
                  type="submit"
                  colorScheme="teal"
                  size="lg"
                  w="full"
                  loading={isLoading}
                  loadingText="Iniciando sesión..."
                >
                  Ingresar
                </Button>
              </VStack>
            </form>

            {/* Links adicionales */}
            <VStack gap={3}>
              <Text color="teal.500" fontSize="sm" cursor="pointer">
                ¿Olvidaste tu contraseña?
              </Text>
              
              <HStack gap={1} fontSize="sm">
                <Text color="gray.600">¿No tienes cuenta?</Text>
                <Link 
                  to="/auth/register"
                  style={{ color: 'var(--chakra-colors-teal-500)', fontWeight: '500' }}
                >
                  Regístrate aquí
                </Link>
              </HStack>
            </VStack>
          </VStack>
        </Card.Body>
      </Card.Root>
    </Box>
  );
}   
