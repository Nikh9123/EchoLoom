"use client";

import {
  QueryClient,
<<<<<<< HEAD
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
 
=======
  QueryClientProvider
} from "@tanstack/react-query";
import { useState } from "react";

export const QueryProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
>>>>>>> 1d64d64694c8bd6660e6308a89a3dc5249e59389
