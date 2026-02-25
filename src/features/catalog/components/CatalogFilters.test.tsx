import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { CatalogFilters } from "./CatalogFilters";

describe("Componente: CatalogFilters", () => {
  const mockOnSearchChange = vi.fn();
  const mockOnFilterChange = vi.fn();

  const defaultProps = {
    searchTerm: "",
    filters: { search: "", category: "", sort: "" },
    onSearchChange: mockOnSearchChange,
    onFilterChange: mockOnFilterChange,
  };

  it("deve renderizar os inputs de busca e selects", () => {
    render(<CatalogFilters {...defaultProps} />);

    expect(screen.getByLabelText(/buscar produtos/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/categoria/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/ordenar por/i)).toBeInTheDocument();
  });

  it("deve chamar onSearchChange ao digitar no campo de busca", async () => {
    const user = userEvent.setup();

    const TestWrapper = () => {
      const [term, setTerm] = React.useState("");
      return (
        <CatalogFilters
          {...defaultProps}
          searchTerm={term}
          onSearchChange={(value) => {
            setTerm(value);
            mockOnSearchChange(value);
          }}
        />
      );
    };

    render(<TestWrapper />);

    const inputBusca = screen.getByLabelText(/buscar produtos/i);
    await user.type(inputBusca, "laptop");

    expect(mockOnSearchChange).toHaveBeenCalled();
    expect(mockOnSearchChange).toHaveBeenLastCalledWith("laptop");
  });

  it("deve chamar onFilterChange ao selecionar uma categoria", async () => {
    const user = userEvent.setup();
    render(<CatalogFilters {...defaultProps} />);

    const selectCategoria = screen.getByLabelText(/categoria/i);
    await user.selectOptions(selectCategoria, "smartphones");

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      category: "smartphones",
    });
  });
});
