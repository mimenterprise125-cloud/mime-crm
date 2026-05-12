import React, { createContext, useContext, useEffect, useCallback } from "react";

interface RefreshContextType {
  triggerRefresh: () => void;
  onRefresh: (callback: () => void) => void;
}

const RefreshContext = createContext<RefreshContextType | undefined>(undefined);

export function RefreshProvider({ children }: { children: React.ReactNode }) {
  const [refreshListeners, setRefreshListeners] = React.useState<Set<() => void>>(new Set());

  const triggerRefresh = useCallback(() => {
    refreshListeners.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.error("Refresh callback error:", error);
      }
    });
  }, [refreshListeners]);

  const onRefresh = useCallback((callback: () => void) => {
    setRefreshListeners(prev => new Set(prev).add(callback));
    return () => {
      setRefreshListeners(prev => {
        const next = new Set(prev);
        next.delete(callback);
        return next;
      });
    };
  }, []);

  // Listen for tab visibility changes with debounce
  useEffect(() => {
    let debounceTimer: NodeJS.Timeout;

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // Tab became active - debounce to avoid rapid multiple refreshes
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          triggerRefresh();
        }, 500);
      }
    };

    // Also listen for focus event as backup
    const handleFocus = () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        triggerRefresh();
      }, 300);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearTimeout(debounceTimer);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, [triggerRefresh]);

  return (
    <RefreshContext.Provider value={{ triggerRefresh, onRefresh }}>
      {children}
    </RefreshContext.Provider>
  );
}

export function useRefresh() {
  const context = useContext(RefreshContext);
  if (!context) {
    throw new Error("useRefresh must be used within RefreshProvider");
  }
  return context;
}
