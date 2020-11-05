import React, { createContext, useState } from "react";

export const SearchContext = createContext();

// This context provider is passed to any component requiring the context
export const SearchProvider = ({ children }) => {
  const [location, setLocation] = useState("San Jose");
  const [map, updateMap] = useState(false);

  return (
    <SearchContext.Provider
      value={{
        location,
        map,
        setLocation,
        updateMap
      }}
    >
      {children}
    </SearchContext.Provider>
  );
};
