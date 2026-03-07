// src/components/providers/DataProvider.tsx
"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PortfolioData } from "@/types";

const DataContext = createContext<PortfolioData | null>(null);

export function DataProvider({
  data,
  children,
}: {
  data: PortfolioData;
  children: ReactNode;
}) {
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function usePortfolioData(): PortfolioData {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error("usePortfolioData must be used within DataProvider");
  }
  return ctx;
}