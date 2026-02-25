import { useState, useEffect, useRef } from "react";

export interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  description: string;
  thumbnail: string;
  meta: { createdAt: string };
}

export interface CatalogFilters {
  search: string;
  category: string;
  sort: string;
}

interface QueryState {
  data: Product[];
  isLoading: boolean;
  error: string | null;
  total: number;
}

export function useCatalogQuery(filters: CatalogFilters, skip: number) {
  const [state, setState] = useState<QueryState>({
    data: [],
    isLoading: true,
    error: null,
    total: 0,
  });
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort(); // Cancela requisição anterior
    }
    abortControllerRef.current = new AbortController();

    const fetchProducts = async () => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        let url = "https://dummyjson.com/products";

        if (filters.search)
          url += `/search?q=${encodeURIComponent(filters.search)}&`;
        else if (filters.category)
          url += `/category/${encodeURIComponent(filters.category)}?`;
        else url += "?";

        url += `limit=12&skip=${skip}`;
        if (filters.sort === "name") url += "&sortBy=title&order=asc";

        const response = await fetch(url, {
          signal: abortControllerRef.current?.signal,
        });
        if (!response.ok) throw new Error("Falha ao carregar os produtos.");

        const result = await response.json();
        let finalData = result.products;

        // Dummyjson não ordena por data nativamente em todas as rotas, fazemos localmente
        if (filters.sort === "date") {
          finalData = finalData.sort(
            (a: Product, b: Product) =>
              new Date(b.meta.createdAt).getTime() -
              new Date(a.meta.createdAt).getTime(),
          );
        }

        setState({
          data: finalData,
          total: result.total,
          isLoading: false,
          error: null,
        });
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setState({
          data: [],
          total: 0,
          isLoading: false,
          error: err.message || "Erro desconhecido",
        });
      }
    };

    fetchProducts();

    return () => abortControllerRef.current?.abort();
  }, [filters, skip]);

  return state;
}
