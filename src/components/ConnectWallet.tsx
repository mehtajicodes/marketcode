
import { useState, useEffect } from 'react';
import { Loader2, WalletIcon } from 'lucide-react';
import { 
  connectWallet, 
  formatAddress, 
  isMetaMaskInstalled, 
  getConnectedAccount,
  listenForAccountChanges,
  listenForChainChanges,
  SEPOLIA_CHAIN_ID
} from '../utils/ethereumUtils';

interface ConnectWalletProps {
  isMobile?: boolean;
}

const ConnectWallet = ({ isMobile = false }: ConnectWalletProps) => {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isCorrectNetwork, setIsCorrectNetwork] = useState(true);

  useEffect(() => {
    // Check if already connected
    const checkConnection = async () => {
      const connectedAccount = await getConnectedAccount();
      if (connectedAccount) {
        setAccount(connectedAccount);
      }
    };
    
    checkConnection();

    // Add account change listener
    const removeAccountListener = listenForAccountChanges((newAccount) => {
      setAccount(newAccount);
    });

    // Add chain change listener
    const removeChainListener = listenForChainChanges((chainId) => {
      setIsCorrectNetwork(chainId === SEPOLIA_CHAIN_ID);
    });

    return () => {
      removeAccountListener();
      removeChainListener();
    };
  }, []);

  const handleConnect = async () => {
    if (!isMetaMaskInstalled()) {
      window.open('https://metamask.io/download.html', '_blank');
      return;
    }

    setIsConnecting(true);
    try {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
    } finally {
      setIsConnecting(false);
    }
  };

  const buttonClasses = isMobile
    ? 'w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-primary text-primary-foreground font-medium transition-all hover:bg-primary/90 active:scale-95'
    : 'flex items-center space-x-2 py-2.5 px-5 rounded-full bg-primary text-primary-foreground font-medium text-sm transition-all hover:bg-primary/90 active:scale-95';

  if (account) {
    return (
      <button 
        className={`${buttonClasses} ${!isCorrectNetwork ? 'bg-destructive hover:bg-destructive/90' : ''}`}
        onClick={handleConnect}
      >
        <WalletIcon size={16} />
        <span>{isCorrectNetwork ? formatAddress(account) : 'Wrong Network'}</span>
      </button>
    );
  }

  return (
    <button 
      className={buttonClasses}
      onClick={handleConnect}
      disabled={isConnecting}
    >
      {isConnecting ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          <span>Connecting...</span>
        </>
      ) : (
        <>
          <WalletIcon size={16} />
          <span>Connect Wallet</span>
        </>
      )}
    </button>
  );
};

export default ConnectWallet;
