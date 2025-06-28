import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Flex,
  Input,
  Card,
  Heading,
  Stack,
} from "@chakra-ui/react";
import { useState } from "react";
import { RiCloseLine, RiFilterLine } from "react-icons/ri";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selectedValues: string[];
  onSelectionChange: (values: string[]) => void;
  multiSelect?: boolean;
}

function FilterSection({ 
  title, 
  options, 
  selectedValues, 
  onSelectionChange, 
  multiSelect = true 
}: FilterSectionProps) {
  const handleToggle = (optionId: string) => {
    if (multiSelect) {
      const newSelection = selectedValues.includes(optionId)
        ? selectedValues.filter(id => id !== optionId)
        : [...selectedValues, optionId];
      onSelectionChange(newSelection);
    } else {
      onSelectionChange(selectedValues.includes(optionId) ? [] : [optionId]);
    }
  };

  return (
    <VStack align="stretch" gap={3}>
      <Text fontWeight="semibold" fontSize="sm" color="gray.700">
        {title}
      </Text>
      <VStack align="stretch" gap={2}>
        {options.map((option) => (
          <HStack key={option.id} justify="space-between">
          <HStack gap={2} flex={1}>
            <input
              type="checkbox"
              checked={selectedValues.includes(option.id)}
              onChange={() => handleToggle(option.id)}
              style={{ marginRight: '8px' }}
            />
            <Text fontSize="sm">{option.label}</Text>
            {option.count !== undefined && (
              <Text fontSize="xs" color="gray.500">
                ({option.count})
              </Text>
            )}
          </HStack>
          </HStack>
        ))}
      </VStack>
    </VStack>
  );
}

interface PriceRangeFilterProps {
  minPrice: number;
  maxPrice: number;
  selectedRange: [number, number];
  onRangeChange: (range: [number, number]) => void;
}

function PriceRangeFilter({ 
  minPrice, 
  maxPrice, 
  selectedRange, 
  onRangeChange 
}: PriceRangeFilterProps) {
  return (
    <VStack align="stretch" gap={3}>
      <Text fontWeight="semibold" fontSize="sm" color="gray.700">
        Rango de Precio
      </Text>
      
      <HStack gap={2}>
        <Input
          type="number"
          placeholder="Min"
          value={selectedRange[0]}
          onChange={(e) => onRangeChange([Number(e.target.value), selectedRange[1]])}
          size="sm"
        />
        <Text color="gray.400">-</Text>
        <Input
          type="number"
          placeholder="Max"
          value={selectedRange[1]}
          onChange={(e) => onRangeChange([selectedRange[0], Number(e.target.value)])}
          size="sm"
        />
      </HStack>
      
      <Text fontSize="xs" color="gray.500">
        ${minPrice} - ${maxPrice}
      </Text>
    </VStack>
  );
}

interface ProductFiltersProps {
  categories: FilterOption[];
  brands: FilterOption[];
  selectedCategories: string[];
  selectedBrands: string[];
  priceRange: [number, number];
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  onCategoryChange: (categories: string[]) => void;
  onBrandChange: (brands: string[]) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onStockChange: (inStock: boolean) => void;
  onClearFilters: () => void;
  totalFiltersApplied: number;
}

export function ProductFilters({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  priceRange,
  minPrice,
  maxPrice,
  inStock,
  onCategoryChange,
  onBrandChange,
  onPriceRangeChange,
  onStockChange,
  onClearFilters,
  totalFiltersApplied
}: ProductFiltersProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Card.Root variant="outline">
      <Card.Header>
        <HStack justify="space-between" align="center">
          <HStack gap={2}>
            <RiFilterLine />
            <Heading size="sm">Filtros</Heading>
            {totalFiltersApplied > 0 && (
              <Badge colorScheme="teal" variant="solid" borderRadius="full">
                {totalFiltersApplied}
              </Badge>
            )}
          </HStack>
          
          <HStack gap={2}>
            {totalFiltersApplied > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={onClearFilters}
              >
                <RiCloseLine />
                <Text ml={1}>Limpiar</Text>
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              {isCollapsed ? 'Expandir' : 'Contraer'}
            </Button>
          </HStack>
        </HStack>
      </Card.Header>

      {!isCollapsed && (
        <Card.Body>
          <VStack align="stretch" gap={6}>
            {/* Categorías */}
            <FilterSection
              title="Categorías"
              options={categories}
              selectedValues={selectedCategories}
              onSelectionChange={onCategoryChange}
            />

            {/* Marcas */}
            {brands.length > 0 && (
              <FilterSection
                title="Marcas"
                options={brands}
                selectedValues={selectedBrands}
                onSelectionChange={onBrandChange}
              />
            )}

            {/* Precio */}
            <PriceRangeFilter
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedRange={priceRange}
              onRangeChange={onPriceRangeChange}
            />

            {/* Disponibilidad */}
            <VStack align="stretch" gap={3}>
              <Text fontWeight="semibold" fontSize="sm" color="gray.700">
                Disponibilidad
              </Text>
              <HStack gap={2} align="center">
                <input
                  type="checkbox"
                  checked={inStock}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => onStockChange(e.target.checked)}
                />
                <Text fontSize="sm">Solo productos en stock</Text>
              </HStack>
            </VStack>
          </VStack>
        </Card.Body>
      )}
    </Card.Root>
  );
}

// Componente para mostrar filtros activos
interface ActiveFiltersProps {
  categories: string[];
  brands: string[];
  priceRange: [number, number];
  inStock: boolean;
  onRemoveCategory: (category: string) => void;
  onRemoveBrand: (brand: string) => void;
  onClearPriceRange: () => void;
  onToggleStock: () => void;
  onClearAll: () => void;
  categoryLabels: Record<string, string>;
  brandLabels: Record<string, string>;
}

export function ActiveFilters({
  categories,
  brands,
  priceRange,
  inStock,
  onRemoveCategory,
  onRemoveBrand,
  onClearPriceRange,
  onToggleStock,
  onClearAll,
  categoryLabels,
  brandLabels
}: ActiveFiltersProps) {
  const hasFilters = categories.length > 0 || brands.length > 0 || 
                    (priceRange[0] > 0 || priceRange[1] < 10000) || inStock;

  if (!hasFilters) return null;

  return (
    <Card.Root variant="subtle">
      <Card.Body>
        <VStack align="stretch" gap={3}>
          <HStack justify="space-between" align="center">
            <Text fontWeight="semibold" fontSize="sm">
              Filtros Activos
            </Text>
            <Button size="sm" variant="ghost" onClick={onClearAll}>
              Limpiar todo
            </Button>
          </HStack>
          
          <Flex wrap="wrap" gap={2}>
            {categories.map((category) => (
              <Badge
                key={category}
                colorScheme="blue"
                variant="solid"
                cursor="pointer"
                onClick={() => onRemoveCategory(category)}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {categoryLabels[category] || category}
                <RiCloseLine size={12} />
              </Badge>
            ))}
            
            {brands.map((brand) => (
              <Badge
                key={brand}
                colorScheme="green"
                variant="solid"
                cursor="pointer"
                onClick={() => onRemoveBrand(brand)}
                display="flex"
                alignItems="center"
                gap={1}
              >
                {brandLabels[brand] || brand}
                <RiCloseLine size={12} />
              </Badge>
            ))}
            
            {(priceRange[0] > 0 || priceRange[1] < 10000) && (
              <Badge
                colorScheme="purple"
                variant="solid"
                cursor="pointer"
                onClick={onClearPriceRange}
                display="flex"
                alignItems="center"
                gap={1}
              >
                ${priceRange[0]} - ${priceRange[1]}
                <RiCloseLine size={12} />
              </Badge>
            )}
            
            {inStock && (
              <Badge
                colorScheme="orange"
                variant="solid"
                cursor="pointer"
                onClick={onToggleStock}
                display="flex"
                alignItems="center"
                gap={1}
              >
                En stock
                <RiCloseLine size={12} />
              </Badge>
            )}
          </Flex>
        </VStack>
      </Card.Body>
    </Card.Root>
  );
}
