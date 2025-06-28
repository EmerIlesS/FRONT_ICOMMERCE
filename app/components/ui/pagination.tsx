import { HStack, Button, Text, IconButton, Select } from "@chakra-ui/react";
import { RiArrowLeftLine, RiArrowRightLine } from "react-icons/ri";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  showPageSize?: boolean;
  pageSize?: number;
  onPageSizeChange?: (size: number) => void;
  totalItems?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showPageSize = false,
  pageSize = 10,
  onPageSizeChange,
  totalItems
}: PaginationProps) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Si hay pocas páginas, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para mostrar páginas con ellipsis
      const halfVisible = Math.floor(maxVisiblePages / 2);
      let startPage = Math.max(1, currentPage - halfVisible);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
      
      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }
      
      // Agregar primera página
      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push('...');
        }
      }
      
      // Agregar páginas del rango
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Agregar última página
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const pageNumbers = generatePageNumbers();

  return (
    <HStack justify="space-between" align="center" wrap="wrap" gap={4}>
      {/* Información de resultados */}
      {totalItems && (
        <Text fontSize="sm" color="gray.600">
          Mostrando {((currentPage - 1) * pageSize) + 1} - {Math.min(currentPage * pageSize, totalItems)} de {totalItems} resultados
        </Text>
      )}

      <HStack gap={2}>
        {/* Botón anterior */}
        <IconButton
          aria-label="Página anterior"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
        >
          <RiArrowLeftLine />
        </IconButton>

        {/* Números de página */}
        {pageNumbers.map((page, index) => (
          page === '...' ? (
            <Text key={index} px={2} color="gray.500">
              ...
            </Text>
          ) : (
            <Button
              key={page}
              onClick={() => onPageChange(page as number)}
              variant={currentPage === page ? "solid" : "outline"}
              colorScheme={currentPage === page ? "teal" : "gray"}
              size="sm"
              minW="10"
            >
              {page}
            </Button>
          )
        ))}

        {/* Botón siguiente */}
        <IconButton
          aria-label="Página siguiente"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
        >
          <RiArrowRightLine />
        </IconButton>
      </HStack>

      {/* Selector de tamaño de página */}
      {showPageSize && onPageSizeChange && (
        <HStack gap={2}>
          <Text fontSize="sm" color="gray.600">
            Por página:
          </Text>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(parseInt(e.target.value))}
            style={{
              padding: '4px 8px',
              borderRadius: '6px',
              border: '1px solid #e2e8f0',
              fontSize: '14px',
              width: '70px'
            }}
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </HStack>
      )}
    </HStack>
  );
}
