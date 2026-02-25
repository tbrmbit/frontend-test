import React, { memo } from "react";
import type { CatalogFilters as FiltersType } from "../hooks/useCatalogQuery";
import { TextField } from "../../../shared/ui/TextField";

interface Props {
  searchTerm: string;
  filters: FiltersType;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: Partial<FiltersType>) => void;
}

export const CatalogFilters = memo(
  ({ searchTerm, filters, onSearchChange, onFilterChange }: Props) => {
    return (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1 w-full">
          <TextField
            label="Buscar produtos"
            placeholder="Ex: Smartphone..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5 w-full md:w-48">
          <label
            htmlFor="category"
            className="text-sm font-semibold text-gray-700"
          >
            Categoria
          </label>
          <select
            id="category"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            value={filters.category}
            onChange={(e) => onFilterChange({ category: e.target.value })}
          >
            <option value="">Todas as categorias</option>
            <option value="laptops">Laptops</option>
            <option value="smartphones">Smartphones</option>
            <option value="fragrances">Perfumes</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5 w-full md:w-48">
          <label htmlFor="sort" className="text-sm font-semibold text-gray-700">
            Ordenar por
          </label>
          <select
            id="sort"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
            value={filters.sort}
            onChange={(e) => onFilterChange({ sort: e.target.value })}
          >
            <option value="">Relevância</option>
            <option value="name">Nome (A-Z)</option>
            <option value="date">Mais Recentes</option>
          </select>
        </div>
      </div>
    );
  },
);
CatalogFilters.displayName = "CatalogFilters";
