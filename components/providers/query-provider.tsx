"use client";

import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

import React, { useState } from "react";  

export const QueryProvider = ({ children }: {
  children: React.ReactNode;
}) => {
  // This hook initializes a new instance of QueryClient
  // on every render, preventing sharing across components.
  const [queryClient] = useState(() => new QueryClient());

  return (
    // Wrap the children with QueryClientProvider to provide
    // the instance of QueryClient to the React Query ecosystem.
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};
 
