import { createContext, useState, useEffect } from "react";

export const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const saved = localStorage.getItem("currency") || "₴";
  const [currency, setCurrency] = useState(saved);

  useEffect(() => {
    localStorage.setItem("currency", currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}
