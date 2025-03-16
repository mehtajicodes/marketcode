import { toast } from 'sonner';

export interface EthereumWindow extends Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    selectedAddress: string | null;
    chainId: string;
  };
}

declare const window: EthereumWindow;

// Sepolia testnet configuration
export const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in decimal
export const SEPOLIA_NETWORK = {
  chainId: SEPOLIA_CHAIN_ID,
  chainName: 'Sepolia Test Network',
  nativeCurrency: {
    name: 'Sepolia Ether',
    symbol: 'SEP',
    decimals: 18,
  },
  rpcUrls: ['https://sepolia.infura.io/v3/'],
  blockExplorerUrls: ['https://sepolia.etherscan.io'],
};

export const isMetaMaskInstalled = (): boolean => {
  return window.ethereum?.isMetaMask ?? false;
};

export const connectWallet = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    toast.error('MetaMask is not installed!', {
      description: 'Please install MetaMask extension to continue.',
      action: {
        label: 'Install',
        onClick: () => window.open('https://metamask.io/download.html', '_blank'),
      },
    });
    return null;
  }

  try {
    // Request account access
    const accounts = await window.ethereum!.request({
      method: 'eth_requestAccounts',
    });

    // Check if connected to Sepolia
    const chainId = await window.ethereum!.request({
      method: 'eth_chainId',
    });

    if (chainId !== SEPOLIA_CHAIN_ID) {
      try {
        // Try to switch to Sepolia
        await window.ethereum!.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: SEPOLIA_CHAIN_ID }],
        });
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          try {
            await window.ethereum!.request({
              method: 'wallet_addEthereumChain',
              params: [SEPOLIA_NETWORK],
            });
          } catch (addError) {
            toast.error('Failed to add Sepolia network to MetaMask', {
              description: 'Please add the Sepolia network manually.',
            });
            return null;
          }
        } else {
          toast.error('Failed to switch to Sepolia network', {
            description: 'Please switch to the Sepolia network manually.',
          });
          return null;
        }
      }
    }

    if (accounts && accounts.length > 0) {
      toast.success('Wallet connected!', {
        description: `Connected to ${formatAddress(accounts[0])}`,
      });
      return accounts[0];
    }

    return null;
  } catch (error) {
    console.error('Error connecting to wallet:', error);
    toast.error('Failed to connect wallet', {
      description: 'There was an error connecting to your wallet.',
    });
    return null;
  }
};

export const getConnectedAccount = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    return null;
  }

  try {
    const accounts = await window.ethereum!.request({
      method: 'eth_accounts',
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Error getting wallet accounts:', error);
    return null;
  }
};

export const formatAddress = (address: string): string => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export const listenForAccountChanges = (callback: (account: string | null) => void): () => void => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      // User disconnected their wallet
      callback(null);
      toast.info('Wallet disconnected');
    } else {
      // Account changed
      callback(accounts[0]);
      toast.info('Account changed', {
        description: `Now connected to ${formatAddress(accounts[0])}`,
      });
    }
  };

  window.ethereum!.on('accountsChanged', handleAccountsChanged);

  // Return cleanup function
  return () => {
    window.ethereum!.removeListener('accountsChanged', handleAccountsChanged);
  };
};

export const listenForChainChanges = (callback: (chainId: string) => void): () => void => {
  if (!isMetaMaskInstalled()) {
    return () => {};
  }

  const handleChainChanged = (chainId: string) => {
    callback(chainId);
    
    if (chainId !== SEPOLIA_CHAIN_ID) {
      toast.warning('Network changed', {
        description: 'Please switch to Sepolia test network for this application.',
      });
    } else {
      toast.success('Connected to Sepolia test network');
    }
  };

  window.ethereum!.on('chainChanged', handleChainChanged);

  // Return cleanup function
  return () => {
    window.ethereum!.removeListener('chainChanged', handleChainChanged);
  };
};

export const sendTransaction = async (
  fromAddress: string,
  toAddress: string,
  amountInEth: string
): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    toast.error('MetaMask is not installed!');
    return null;
  }

  try {
    // Convert ETH to wei (1 ETH = 10^18 wei)
    const amountInWei = BigInt(parseFloat(amountInEth) * 10**18);
    
    // Request transaction
    const transactionParameters = {
      from: fromAddress,
      to: toAddress,
      value: '0x' + amountInWei.toString(16),
      gas: '0x5208', // 21000 gas
    };

    // Send transaction
    const txHash = await window.ethereum!.request({
      method: 'eth_sendTransaction',
      params: [transactionParameters],
    });

    return txHash as string;
  } catch (error: any) {
    console.error('Transaction error:', error);
    
    if (error.code === 4001) {
      // User rejected the transaction
      toast.error('Transaction rejected', {
        description: 'You rejected the transaction in MetaMask.',
      });
    } else {
      toast.error('Transaction failed', {
        description: error.message || 'There was an error processing your transaction.',
      });
    }
    
    return null;
  }
};
