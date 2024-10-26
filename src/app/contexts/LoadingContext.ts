import { Provider } from "react";
import { createContext, useState, ReactNode, useContext } from "react";

// Define the context type
interface LoadingContextType {
  loading: boolean;
  showLoading: () => void;
  hideLoading: () => void;
}

// Create the context with a type that could be undefined initially
const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

// Define the provider component
export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = () => setLoading(true);
  const hideLoading = () => setLoading(false);

  return (
    <LoadingContext.Provider value={{ loading, showLoading, hideLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook to use LoadingContext in components
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};
import loading from "../[locale]/(admin)/home/loading";
