"use client";
import { NftContext } from "@/components/NftContext/NftContext";
import { useContext, useEffect, useState } from "react";
import Web3 from "web3";
import contractDetails from "@/constants/NftContract.json";
import Button from "@/components/Button/Button";
import toast, { Toaster } from "react-hot-toast";
import BigNumber from "bignumber.js";
import Input from "@/components/Input/Input";

export default function Home() {
  const {
    maxSupply,
    setMaxSupply,
    totalSupply,
    setTotalSupply,
    isMintEnabled,
    setIsMintEnabled,
  } = useContext(NftContext);
  const [connectedAccount, setConnectedAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);

  async function connectWallet() {
    const provider = window.ethereum;
    if (provider) {
      console.log("Metamask available");
      try {
        // Connect to MetaMask or another Ethereum provider

        await provider.enable();
        const web3Instance = new Web3(provider);

        // Create a contract instance
        const contractInstance = new web3Instance.eth.Contract(
          contractDetails.abi,
          contractDetails.address
        );

        setWeb3(web3Instance);
        setContract(contractInstance);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setConnectedAccount(accounts[0]);
        toast.success("Wallet connected!");

        // Use the local Ganache URL (adjust port if necessary)
        // const ganacheUrl = "http://127.0.0.1:7545";
        // const ganacheProvider = new Web3.providers.HttpProvider(ganacheUrl);

        // // Create a contract instance using the local Ganache provider
        // const ganacheWeb3Instance = new Web3(ganacheProvider);
        // const contractInstance = new ganacheWeb3Instance.eth.Contract(
        //   contractDetails.abi,
        //   contractDetails.address
        // );

        // // Set the state variables
        // setWeb3(ganacheWeb3Instance);
        // setContract(contractInstance);

        // // Get the connected account
        // const accounts = await ganacheWeb3Instance.eth.getAccounts();
        // setConnectedAccount(accounts[0]);

        // toast.success("Wallet connected to local Ganache!");
      } catch (error) {
        console.error("Error initializing Web3:", error);
      }
    } else {
      console.log("Matamask not detected!");
    }
  }

  async function getMaxSupply() {
    try {
      const result = await contract.methods.maxSupply().call();
      setMaxSupply(new BigNumber(result).toString());
      console.log("Value of maxSupply:", result);
    } catch (error) {
      console.error("Error retrieving public variable maxSupply:", error);
    }
  }

  async function getTotalSupply() {
    try {
      const result = await contract.methods.totalSupply().call();
      setTotalSupply(new BigNumber(result).toString());
      console.log("Value of maxSupply:", result);
    } catch (error) {
      console.error("Error retrieving public variable maxSupply:", error);
    }
  }

  async function getIsMintEnabled() {
    try {
      const result = await contract.methods.isMintEnabled().call();
      setIsMintEnabled(result);
      console.log("Value of isMintEnabled:", result);
    } catch (error) {
      console.error("Error retrieving public variable isMintEnabled:", error);
    }
  }

  async function toggleIsMintEnabled() {
    try {
      // Call the setMaxSupply function
      const transaction = await contract.methods.toggleIsMintEnabled().send({
        from: connectedAccount,
      });

      console.log("Toggled");
      getIsMintEnabled();
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error calling function toggleIsMintEnabled:", error);
    }
  }

  const handleFetchDetails = () => {
    getMaxSupply();
    getTotalSupply();
    getIsMintEnabled();
  };

  // const updateMaxSupply = async () => {
  //   try {
  //     // Call the setMaxSupply function
  //     const transaction = await contract.methods.setMaxSupply(2).send({
  //       from: connectedAccount,
  //     });

  //     console.log("Transaction details:", transaction);
  //   } catch (error) {
  //     console.error("Error setting max supply:", error);
  //   }
  // };

  const mintNFT = async () => {
    try {
      // Call the mint function
      const transaction = await contract.methods.mint().send({
        from: connectedAccount,
        value: web3.utils.toWei("0.01", "ether"),
        gasPrice: web3.utils.toWei("1", "gwei"),
        gas: 500000,
      });

      toast.success("Mint successfull");

      handleFetchDetails();
      console.log("Transaction details:", transaction);
    } catch (error) {
      toast.error("An error occurred");
      console.error("Error minting NFT:", error);
    }
  };

  useEffect(() => {
    connectWallet();
  }, []);

  useEffect(() => {
    if (contract) {
      getIsMintEnabled();
    }
  }, [contract]);

  return (
    <main className="flex min-h-screen flex-col">
      <Toaster />
      <div className="flex justify-between w-full bg-slate-200 p-8">
        <span className="text-4xl font-bold">Basic NFT</span>
        <Button onclick={connectWallet}>
          {contract
            ? `Wallet Connected : ${connectedAccount?.slice(0, 15)}...`
            : "Connect Wallet"}
        </Button>
      </div>
      <div
        className={`p-12 text-xl font-medium flex gap-4 ${
          contract && "flex-col"
        }`}
      >
        <div className="w-fit">
          <Button
            className={"font-medium text-lg"}
            onclick={handleFetchDetails}
          >
            Get Details
          </Button>
        </div>
        <span>NFT Smart Contract Details :</span>
        {contract ? (
          <div className="flex flex-col gap-6 border-2 w-96 p-4 rounded-sm">
            {!isMintEnabled && (
              <span className="text-lg text-red-500">Minting is disabled!</span>
            )}
            <div className="">Total Supply : {totalSupply}</div>
            <div className="">Max Supply: {maxSupply}</div>
            {/* <Input
              onChange={handleSupplyChange}
              placeholder={"Enter new supply value"}
            /> */}
            <Button
              className={"text-xl font-normal border-gray-400"}
              onclick={mintNFT}
              disabled={!isMintEnabled}
            >
              Mint
            </Button>
            <Button
              className={"text-xl font-normal border-gray-400"}
              onclick={toggleIsMintEnabled}
            >
              Toggle isMintEnabled
            </Button>
            <span className="text-sm text-red-500">
              Note: Only the owner is allowed to toggle the value
            </span>
          </div>
        ) : (
          <div className="text-red-600">Connect your wallet to continue!</div>
        )}
      </div>
    </main>
  );
}
