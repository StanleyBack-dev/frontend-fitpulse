"use client";

import { createContext, useContext, ReactNode, useState, useCallback } from "react";
import LoadingScreen from "./loading.screen";

interface LoadingContextProps {
  showLoading: (msg?: string) => void;
  hideLoading: () => void;
}

const LoadingContext = createContext<LoadingContextProps | undefined>(undefined);

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("Carregando...");

  const showLoading = useCallback((msg?: string) => {
    setMessage(msg || "Carregando...");
    setVisible(true);
  }, []);

  const hideLoading = useCallback(() => setVisible(false), []);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading }}>
      {children}
      <LoadingScreen visible={visible} message={message} />
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) throw new Error("useLoading must be used within LoadingProvider");
  return context;
}