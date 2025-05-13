import React, { createContext, useState, useContext } from 'react';

// Create the context
const LoadingContext = createContext(null);

// Custom hook to use the context
export const useLoading = () => useContext(LoadingContext);

// Context provider component
export const LoadingProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Chargement...');

  const startLoading = (message = 'Chargement...') => {
    setLoadingMessage(message);
    setIsLoading(true);
  };

  const stopLoading = () => {
    setIsLoading(false);
  };

  return (
    <LoadingContext.Provider value={{ isLoading, loadingMessage, startLoading, stopLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};

export default LoadingContext; 