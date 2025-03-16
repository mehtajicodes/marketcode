
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Navbar from '../components/Navbar';
import CodeCard from '../components/CodeCard';
import { CodeListing, getCodeListings, getCodeListingById } from '../utils/storage';
import { connectWallet, getConnectedAccount, formatAddress } from '../utils/ethereumUtils';
import { purchaseCode, hasPurchased } from '../utils/purchaseUtils';
import { ArrowLeft, Search, Filter, Code, Copy, X, CheckCircle2, ExternalLink } from 'lucide-react';

const Browse = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('id');
  
  const [listings, setListings] = useState<CodeListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<CodeListing[]>([]);
  const [selectedListing, setSelectedListing] = useState<CodeListing | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [account, setAccount] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [hasBought, setHasBought] = useState(false);

  // Get all available languages from the listings
  const availableLanguages = [...new Set(listings.map(listing => listing.language))].sort();

  useEffect(() => {
    const checkWalletConnection = async () => {
      const connectedAccount = await getConnectedAccount();
      setAccount(connectedAccount);
    };
    
    checkWalletConnection();
    
    // Simulate loading of listings
    const timer = setTimeout(() => {
      const allListings = getCodeListings();
      setListings(allListings);
      setFilteredListings(allListings);
      setIsLoading(false);
      
      // Check if a specific listing is requested
      if (selectedId) {
        const listing = getCodeListingById(selectedId);
        if (listing) {
          setSelectedListing(listing);
          if (account) {
            setHasBought(hasPurchased(listing, account));
          }
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [selectedId, account]);

  // Handle filtering when search or language filter changes
  useEffect(() => {
    let results = listings;
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(
        listing => 
          listing.title.toLowerCase().includes(term) || 
          listing.description.toLowerCase().includes(term) ||
          listing.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    // Apply language filter
    if (selectedLanguage) {
      results = results.filter(listing => listing.language === selectedLanguage);
    }
    
    setFilteredListings(results);
  }, [searchTerm, selectedLanguage, listings]);

  // Check if user has purchased when account or selected listing changes
  useEffect(() => {
    if (selectedListing && account) {
      setHasBought(hasPurchased(selectedListing, account));
    }
  }, [selectedListing, account]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value);
  };

  const handleSelectListing = (listing: CodeListing) => {
    setSelectedListing(listing);
    setSearchParams({ id: listing.id });
    if (account) {
      setHasBought(hasPurchased(listing, account));
    }
  };

  const handleBack = () => {
    setSelectedListing(null);
    setSearchParams({});
  };

  const handlePurchase = async () => {
    if (!account) {
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      if (!connectedAccount) return;
    }
    
    if (!selectedListing) return;
    
    setIsPurchasing(true);
    
    try {
      const success = await purchaseCode(selectedListing, account);
      
      if (success) {
        toast.success('Code purchased successfully!', {
          description: `You now have access to the complete code.`,
        });
        setHasBought(true);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed', {
        description: 'There was an error processing your purchase.',
      });
    } finally {
      setIsPurchasing(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const viewTransaction = (txHash: string) => {
    window.open(`https://sepolia.etherscan.io/tx/${txHash}`, '_blank');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedLanguage('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16 px-6">
        <div className="container mx-auto max-w-6xl">
          {selectedListing ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <button 
                onClick={handleBack}
                className="inline-flex items-center text-muted-foreground hover:text-foreground focus-ring rounded-md px-2 py-1"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to listings
              </button>
              
              <div className="glass-card rounded-xl overflow-hidden">
                <div className="p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-display font-bold">{selectedListing.title}</h1>
                      <p className="text-muted-foreground mt-2">{selectedListing.description}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold">{selectedListing.price} ETH</span>
                      {hasBought ? (
                        <div className="inline-flex items-center px-3 py-2 rounded-md bg-green-100 text-green-800 font-medium text-sm">
                          <CheckCircle2 size={16} className="mr-1" />
                          Purchased
                        </div>
                      ) : (
                        <button
                          onClick={handlePurchase}
                          disabled={isPurchasing || !account}
                          className="btn-primary whitespace-nowrap"
                        >
                          {!account 
                            ? 'Connect Wallet to Buy' 
                            : isPurchasing 
                              ? 'Processing...' 
                              : 'Purchase Code'}
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium flex items-center">
                            <Code size={16} className="mr-1" />
                            {hasBought ? 'Full Code' : 'Code Preview'}
                          </h3>
                          <button
                            onClick={() => copyToClipboard(selectedListing.code)}
                            className="text-muted-foreground hover:text-foreground focus-ring rounded-md p-1"
                            aria-label="Copy code"
                          >
                            {copied ? (
                              <CheckCircle2 size={16} className="text-green-500" />
                            ) : (
                              <Copy size={16} />
                            )}
                          </button>
                        </div>
                        <div className="bg-secondary/50 p-4 rounded-lg font-mono text-sm overflow-auto max-h-80">
                          <pre>{selectedListing.code}</pre>
                        </div>
                        {!hasBought && (
                          <p className="text-xs text-muted-foreground">
                            This is a preview. Purchase to get the full code.
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Language</span>
                            <span>{selectedListing.language}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Seller</span>
                            <span>{formatAddress(selectedListing.seller)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Listed On</span>
                            <span>{new Date(selectedListing.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-medium mb-2">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedListing.tags.map((tag, index) => (
                            <span 
                              key={index} 
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-display font-bold">Browse Code Marketplace</h1>
                <p className="text-muted-foreground mt-2">
                  Discover high-quality code snippets and digital assets
                </p>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    placeholder="Search listings..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 w-full px-4 py-2 border border-input rounded-lg focus-ring"
                  />
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Filter size={18} className="text-muted-foreground mr-2" />
                    <select
                      value={selectedLanguage}
                      onChange={handleLanguageChange}
                      className="px-4 py-2 border border-input rounded-lg focus-ring"
                    >
                      <option value="">All Languages</option>
                      {availableLanguages.map((lang) => (
                        <option key={lang} value={lang}>
                          {lang}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {(searchTerm || selectedLanguage) && (
                    <button
                      onClick={clearFilters}
                      className="p-2 text-muted-foreground hover:text-foreground focus-ring rounded-md"
                      aria-label="Clear filters"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
              
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="glass-card rounded-xl h-64 animate-pulse">
                      <div className="h-full bg-secondary/50"></div>
                    </div>
                  ))}
                </div>
              ) : filteredListings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                  {filteredListings.map((listing, index) => (
                    <CodeCard 
                      key={listing.id} 
                      listing={listing}
                      onClick={() => handleSelectListing(listing)}
                      delay={index}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl font-medium mb-4">No listings found</h3>
                  {listings.length > 0 ? (
                    <p className="text-muted-foreground">Try adjusting your search filters</p>
                  ) : (
                    <p className="text-muted-foreground">Be the first to sell your code on our marketplace!</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Browse;
