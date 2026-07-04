import { createContext, useContext, useState } from "react";

const SearchContext = createContext();

export function SearchProvider({ children }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        filter,
        setFilter,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  return useContext(SearchContext);
}