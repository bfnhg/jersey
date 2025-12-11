// src/hooks/useSearch.ts
import { useState, useMemo } from "react";
import { products } from "../data/products";
import { Product } from "../data/products";

export function useSearch() {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    
    const lowerQuery = query.toLowerCase();
    return products.filter((product: Product) =>
      product.name.toLowerCase().includes(lowerQuery) ||
      product.category.toLowerCase().includes(lowerQuery) ||
      (product.category && product.category.toLowerCase().includes(lowerQuery)) ||
      (product.description && product.description.toLowerCase().includes(lowerQuery))  ||
        product.price.toString().includes(lowerQuery)
    
    );
  }, [query]);

  return { query, setQuery, filteredProducts };
}