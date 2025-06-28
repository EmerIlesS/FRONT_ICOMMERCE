import { Box, VStack, Card, Text, HStack } from "@chakra-ui/react";
import { RiCheckLine, RiErrorWarningLine, RiInformationLine, RiAlertLine } from "react-icons/ri";

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
}

const iconMap = {
  success: RiCheckLine,
  error: RiErrorWarningLine,
  warning: RiAlertLine,
  info: RiInformationLine,
};

const colorMap = {
  success: { bg: 'green.50', border: 'green.500', text: 'green.700' },
  error: { bg: 'red.50', border: 'red.500', text: 'red.700' },
  warning: { bg: 'orange.50', border: 'orange.500', text: 'orange.700' },
  info: { bg: 'blue.50', border: 'blue.500', text: 'blue.700' },
};

export function Notification({ 
  type, 
  title, 
  message
}: NotificationProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <Card.Root
      bg={colors.bg}
      borderLeft="4px solid"
      borderColor={colors.border}
      variant="elevated"
    >
      <Card.Body p={4}>
        <HStack gap={3} align="start">
          <Icon color={colors.border} size={20} />
          <Box flex={1}>
            {title && (
              <Text fontWeight="semibold" color={colors.text} mb={1}>
                {title}
              </Text>
            )}
            <Text color={colors.text} fontSize="sm">
              {message}
            </Text>
          </Box>
        </HStack>
      </Card.Body>
    </Card.Root>
  );
}

// Hook para manejar notificaciones
import { useState, useCallback } from 'react';

interface NotificationItem extends NotificationProps {
  id: string;
  duration?: number;
}

export function useNotification() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);

    // Auto remove después de la duración especificada (por defecto 5 segundos)
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, notification.duration || 5000);

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
  };
}

// Componente contenedor de notificaciones
interface NotificationContainerProps {
  notifications: NotificationItem[];
  onRemove: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export function NotificationContainer({ 
  notifications, 
  onRemove, 
  position = 'top-right' 
}: NotificationContainerProps) {
  const positionStyles = {
    'top-right': { top: 4, right: 4 },
    'top-left': { top: 4, left: 4 },
    'bottom-right': { bottom: 4, right: 4 },
    'bottom-left': { bottom: 4, left: 4 },
  };

  return (
    <Box
      position="fixed"
      zIndex={9999}
      {...positionStyles[position]}
      maxW="400px"
      w="full"
    >
      <VStack gap={2} align="stretch">
        {notifications.map((notification) => (
          <Box
            key={notification.id}
            onClick={() => onRemove(notification.id)}
            cursor="pointer"
            transition="all 0.2s"
            _hover={{ transform: 'translateX(-4px)' }}
          >
            <Notification {...notification} />
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
