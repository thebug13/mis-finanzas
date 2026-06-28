import { useState } from 'react';

const defaultFilters = {
  mes: '',
  anio: new Date().getFullYear().toString(),
  tipo: '',
  categoria: '',
  medio: '',
};

export function useFilters() {
  const [filters, setFilters] = useState(defaultFilters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => setFilters(defaultFilters);

  return { filters, updateFilter, resetFilters };
}
