import React, { useState, useCallback, useMemo } from "react";
import { useCatalogQuery } from "./hooks/useCatalogQuery";
import type {
  Product,
  CatalogFilters as FiltersType,
} from "./hooks/useCatalogQuery";
import { useDebounce } from "../../shared/hooks/useDebounce";
import { CatalogFilters } from "./components/CatalogFilters";
import { ProductModal } from "./components/ProductModal";
import { Button } from "../../shared/ui/Button";

const ITEMS_PER_PAGE = 12;

export const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FiltersType>({
    search: "",
    category: "",
    sort: "",
  });
  const [page, setPage] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const activeFilters = useMemo(
    () => ({
      ...filters,
      search: debouncedSearch,
    }),
    [filters, debouncedSearch],
  );

  const { data, isLoading, error, total } = useCatalogQuery(
    activeFilters,
    page * ITEMS_PER_PAGE,
  );

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setPage(0);
  }, []);

  const handleFilterChange = useCallback((newFilters: Partial<FiltersType>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(0);
  }, []);

  const handleProductSelect = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Catálogo de Produtos
          </h1>
          <p className="mt-2 text-gray-500">
            Explore nossa seleção de itens com busca em tempo real.
          </p>
        </header>

        <CatalogFilters
          searchTerm={searchTerm}
          filters={filters}
          onSearchChange={handleSearchChange}
          onFilterChange={handleFilterChange}
        />

        <div aria-live="polite" className="sr-only">
          {isLoading
            ? "Carregando produtos"
            : `Mostrando ${data.length} de ${total} produtos`}
        </div>

        {error && (
          <div
            className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-8"
            role="alert"
          >
            <p className="text-red-700 font-medium">
              Ops! Tivemos um problema:
            </p>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
        )}

        {!isLoading && !error && data.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 text-lg">
              Nenhum produto encontrado para sua busca.
            </p>
            <Button
              variant="ghost"
              onClick={() => handleSearchChange("")}
              className="mt-4"
            >
              Limpar busca
            </Button>
          </div>
        )}

        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          role="list"
        >
          {data.map((item) => (
            <article
              key={item.id}
              role="listitem"
              className={`bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
            >
              <div className="h-48 bg-gray-100 p-4 flex items-center justify-center">
                <img
                  src={item.thumbnail}
                  alt=""
                  className="object-contain h-full w-full mix-blend-multiply"
                  loading="lazy"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">
                  {item.category}
                </p>
                <h3 className="font-bold text-gray-900 leading-tight mb-2 line-clamp-2">
                  {item.title}
                </h3>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-extrabold text-lg text-gray-900">
                    ${item.price}
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleProductSelect(item)}
                    aria-label={`Ver detalhes de ${item.title}`}
                  >
                    Detalhes
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {total > 0 && (
          <nav
            className="flex items-center justify-between border-t border-gray-200 mt-10 pt-6"
            aria-label="Paginação"
          >
            <p className="text-sm text-gray-500 hidden sm:block">
              Página{" "}
              <span className="font-medium text-gray-900">{page + 1}</span> de{" "}
              <span className="font-medium text-gray-900">
                {Math.ceil(total / ITEMS_PER_PAGE)}
              </span>
            </p>
            <div className="flex gap-2 w-full sm:w-auto justify-between">
              <Button
                variant="outline"
                disabled={page === 0 || isLoading}
                onClick={() => setPage((p) => p - 1)}
              >
                Anterior
              </Button>
              <Button
                variant="outline"
                disabled={(page + 1) * ITEMS_PER_PAGE >= total || isLoading}
                onClick={() => setPage((p) => p + 1)}
              >
                Próxima
              </Button>
            </div>
          </nav>
        )}

        {selectedProduct && (
          <ProductModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        )}
      </div>
    </main>
  );
};
