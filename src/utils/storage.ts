
export interface CodeListing {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  price: string;
  seller: string;
  createdAt: number;
  tags: string[];
  purchasers?: string[]; // Array of addresses that have purchased this listing
}

const LISTINGS_STORAGE_KEY = 'code_marketplace_listings';

export const saveCodeListing = (listing: CodeListing): void => {
  const listings = getCodeListings();
  listings.push(listing);
  localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
};

export const getCodeListings = (): CodeListing[] => {
  const listingsJson = localStorage.getItem(LISTINGS_STORAGE_KEY);
  return listingsJson ? JSON.parse(listingsJson) : [];
};

export const getCodeListingById = (id: string): CodeListing | undefined => {
  const listings = getCodeListings();
  return listings.find(listing => listing.id === id);
};

export const updateCodeListing = (updatedListing: CodeListing): void => {
  const listings = getCodeListings();
  const index = listings.findIndex(listing => listing.id === updatedListing.id);
  
  if (index !== -1) {
    listings[index] = updatedListing;
    localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(listings));
  }
};

export const deleteCodeListing = (id: string): void => {
  const listings = getCodeListings();
  const filteredListings = listings.filter(listing => listing.id !== id);
  localStorage.setItem(LISTINGS_STORAGE_KEY, JSON.stringify(filteredListings));
};

export const getListingsByUser = (address: string): CodeListing[] => {
  const listings = getCodeListings();
  return listings.filter(listing => 
    listing.seller.toLowerCase() === address.toLowerCase()
  );
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};
