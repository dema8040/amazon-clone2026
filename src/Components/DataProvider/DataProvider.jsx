import React, { createContext, useReducer } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children, reducer, initialState }) => {
  const value = useReducer(reducer, initialState);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};
