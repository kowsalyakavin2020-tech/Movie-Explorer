import { createContext, useContext } from 'react';

const AppReadyContext = createContext(true);

export function AppReadyProvider({ ready, children }) {
  return <AppReadyContext.Provider value={ready}>{children}</AppReadyContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAppReady() {
  return useContext(AppReadyContext);
}
