import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Heading,
  Portal,
  IconButton,
  Card,
  Flex,
} from "@chakra-ui/react";
import { RiAlertLine, RiCheckLine, RiErrorWarningLine, RiInformationLine, RiCloseLine } from "react-icons/ri";
import { useEffect, useState } from "react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = 'danger',
  isLoading = false
}: ConfirmModalProps) {
  const typeConfig = {
    danger: {
      icon: RiErrorWarningLine,
      color: 'red.500',
      confirmColorScheme: 'red'
    },
    warning: {
      icon: RiAlertLine,
      color: 'orange.500',
      confirmColorScheme: 'orange'
    },
    info: {
      icon: RiInformationLine,
      color: 'blue.500',
      confirmColorScheme: 'blue'
    },
    success: {
      icon: RiCheckLine,
      color: 'green.500',
      confirmColorScheme: 'green'
    }
  };

  const config = typeConfig[type];
  const Icon = config.icon;

  // Manejar ESC para cerrar
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      {/* Overlay */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={1000}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <Flex
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        align="center"
        justify="center"
        zIndex={1001}
        p={4}
      >
        <Card.Root 
          maxW="md" 
          w="full"
          variant="elevated"
          onClick={(e) => e.stopPropagation()}
        >
          <Card.Body p={6}>
            <VStack gap={4} align="stretch">
              {/* Header */}
              <HStack justify="space-between" align="start">
                <HStack gap={3}>
                  <Box color={config.color}>
                    <Icon size={24} />
                  </Box>
                  <Heading size="md">{title}</Heading>
                </HStack>
                <IconButton
                  aria-label="Cerrar"
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                >
                  <RiCloseLine />
                </IconButton>
              </HStack>
              
              {/* Message */}
              <Text color="gray.600">
                {message}
              </Text>

              {/* Actions */}
              <HStack gap={3} justify="end">
                <Button 
                  variant="outline" 
                  onClick={onClose}
                  disabled={isLoading}
                >
                  {cancelText}
                </Button>
                <Button
                  colorScheme={config.confirmColorScheme}
                  onClick={onConfirm}
                  loading={isLoading}
                >
                  {confirmText}
                </Button>
              </HStack>
            </VStack>
          </Card.Body>
        </Card.Root>
      </Flex>
    </Portal>
  );
}

// Hook para manejar modales de confirmación

interface UseConfirmModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info' | 'success';
}

export function useConfirmModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<UseConfirmModalOptions>({
    title: '',
    message: ''
  });
  const [onConfirmCallback, setOnConfirmCallback] = useState<(() => void) | null>(null);

  const confirm = (opts: UseConfirmModalOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      setOptions(opts);
      setIsOpen(true);
      setOnConfirmCallback(() => () => {
        resolve(true);
        setIsOpen(false);
      });
    });
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleConfirm = () => {
    if (onConfirmCallback) {
      onConfirmCallback();
    }
  };

  const ConfirmModalComponent = () => (
    <ConfirmModal
      isOpen={isOpen}
      onClose={handleClose}
      onConfirm={handleConfirm}
      {...options}
    />
  );

  return {
    confirm,
    ConfirmModal: ConfirmModalComponent
  };
}

// Modal genérico para otros usos
interface GenericModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  children: React.ReactNode;
  footer?: React.ReactNode;
  closeOnOverlayClick?: boolean;
}

export function GenericModal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  closeOnOverlayClick = true
}: GenericModalProps) {
  const sizeMap = {
    sm: '400px',
    md: '500px', 
    lg: '700px',
    xl: '900px'
  } as const;

  const modalWidth = sizeMap[size as keyof typeof sizeMap] || '500px';

  // Manejar ESC para cerrar
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <Portal>
      {/* Overlay */}
      <Box
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        bg="blackAlpha.600"
        zIndex={1000}
        onClick={closeOnOverlayClick ? onClose : undefined}
      />
      
      {/* Modal Content */}
      <Flex
        position="fixed"
        top={0}
        left={0}
        right={0}
        bottom={0}
        align="center"
        justify="center"
        zIndex={1001}
        p={4}
      >
        <Card.Root 
          maxW={modalWidth} 
          w="full"
          variant="elevated"
          onClick={(e) => e.stopPropagation()}
        >
          {title && (
            <Card.Header>
              <HStack justify="space-between" align="center">
                <Heading size="md">{title}</Heading>
                <IconButton
                  aria-label="Cerrar"
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                >
                  <RiCloseLine />
                </IconButton>
              </HStack>
            </Card.Header>
          )}
          
          <Card.Body>
            {children}
          </Card.Body>

          {footer && (
            <Card.Footer>
              {footer}
            </Card.Footer>
          )}
        </Card.Root>
      </Flex>
    </Portal>
  );
}
