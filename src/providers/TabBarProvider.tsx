import React, { createContext, useContext, useState } from "react";

type TabBarContextType = {
  hasTabBar: boolean;
  setHasTabBar: (hasTabBar: boolean) => void;
};

const TabBarContext = createContext<TabBarContextType | undefined>(undefined);

export const useTabBar = () => {
  const context = useContext(TabBarContext);
  if (!context) {
    throw new Error("useTabBar must be used within an TabBarProvider");
  }
  return context;
};

export const TabBarProvider = ({ children }: { children: React.ReactNode }) => {
  const [hasTabBar, setHasTabBar] = useState(true);

  return (
    <TabBarContext.Provider value={{ hasTabBar, setHasTabBar }}>
      {children}
    </TabBarContext.Provider>
  );
};
