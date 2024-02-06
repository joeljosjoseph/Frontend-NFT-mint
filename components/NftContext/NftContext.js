"use client";
const { createContext, useState } = require("react");

const NftContext = createContext();

const NftProvider = ({ children }) => {
  const [maxSupply, setMaxSupply] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [isMintEnabled, setIsMintEnabled] = useState("");
  return (
    <NftContext.Provider
      value={{
        maxSupply,
        setMaxSupply,
        totalSupply,
        setTotalSupply,
        isMintEnabled,
        setIsMintEnabled,
      }}
    >
      {children}
    </NftContext.Provider>
  );
};

export { NftContext, NftProvider };
