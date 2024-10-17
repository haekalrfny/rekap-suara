import React, { createContext, useContext, useEffect, useState } from "react";

const Context = createContext();

export const StateContext = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [loadingButton, setLoadingButton] = useState(false);

  return (
    <Context.Provider
      value={{
        loading,
        setLoading,
        loadingButton,
        setLoadingButton,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export const useStateContext = () => useContext(Context);
