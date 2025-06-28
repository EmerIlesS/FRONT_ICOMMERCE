import { Box, Spinner, Text, VStack, Flex } from "@chakra-ui/react";

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  fullScreen?: boolean;
  color?: string;
}

export function LoadingSpinner({ 
  size = 'md', 
  label, 
  fullScreen = false,
  color = 'teal.500'
}: LoadingSpinnerProps) {
  const content = (
    <VStack gap={3}>
      <Spinner 
        size={size} 
        color={color}
      />
      {label && (
        <Text fontSize="sm" color="gray.600">
          {label}
        </Text>
      )}
    </VStack>
  );

  if (fullScreen) {
    return (
      <Flex
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="rgba(255, 255, 255, 0.8)"
        zIndex={9999}
        align="center"
        justify="center"
      >
        {content}
      </Flex>
    );
  }

  return (
    <Flex align="center" justify="center" p={8}>
      {content}
    </Flex>
  );
}

// Componente de skeleton para loading de contenido
interface SkeletonCardProps {
  lines?: number;
  hasImage?: boolean;
}

export function SkeletonCard({ lines = 3, hasImage = true }: SkeletonCardProps) {
  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" bg="white">
      {hasImage && (
        <Box 
          h="200px" 
          bg="gray.200" 
          borderRadius="md" 
          mb={4}
        />
      )}
      <VStack gap={2} align="stretch">
        {Array.from({ length: lines }).map((_, index) => (
          <Box
            key={index}
            h="20px"
            bg="gray.200"
            borderRadius="md"
            w={index === lines - 1 ? "60%" : "100%"}
          />
        ))}
      </VStack>
    </Box>
  );
}

// Componente para mostrar estado vacío
interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, icon, action }: EmptyStateProps) {
  return (
    <VStack gap={4} py={12} textAlign="center">
      {icon && (
        <Box fontSize="4xl" color="gray.400">
          {icon}
        </Box>
      )}
      <VStack gap={2}>
        <Text fontSize="lg" fontWeight="semibold" color="gray.700">
          {title}
        </Text>
        {description && (
          <Text color="gray.500" maxW="md">
            {description}
          </Text>
        )}
      </VStack>
      {action && action}
    </VStack>
  );
}
