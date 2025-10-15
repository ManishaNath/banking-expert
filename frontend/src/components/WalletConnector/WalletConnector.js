import React, { useEffect, useState } from "react";
import "./WalletConnector.css";

const formatAddress = (address) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export default function WalletConnector() {
  const [account, setAccount] = useState("");
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const { ethereum } = window;

    if (!ethereum) {
      setError(
        "MetaMask not detected. Install the browser extension to connect your wallet."
      );
      return;
    }

    const handleAccountsChanged = (accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount("");
      }
    };

    ethereum
      .request({ method: "eth_accounts" })
      .then(handleAccountsChanged)
      .catch(() => {
        setError("Unable to check wallet status.");
      });

    ethereum.on("accountsChanged", handleAccountsChanged);

    return () => {
      ethereum.removeListener("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      setError(
        "MetaMask not detected. Install the browser extension to connect your wallet."
      );
      return;
    }

    setError("");
    setIsConnecting(true);

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    } catch (requestError) {
      if (requestError?.code === 4001) {
        setError("Connection request was rejected in MetaMask.");
      } else {
        setError("Failed to connect wallet. Try again.");
      }
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="wallet-connector" aria-live="polite">
      {account ? (
        <div className="wallet-connected">
          <span className="wallet-indicator" aria-hidden="true" />
          <span className="wallet-address" title={account}>
            {formatAddress(account)}
          </span>
        </div>
      ) : (
        <button
          type="button"
          className="wallet-button"
          onClick={connectWallet}
          disabled={isConnecting}
        >
          {isConnecting ? "Connecting…" : "Connect Wallet"}
        </button>
      )}
      {error && <p className="wallet-error">{error}</p>}
    </div>
  );
}
