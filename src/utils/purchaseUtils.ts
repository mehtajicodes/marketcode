
import { supabase } from '@/integrations/supabase/client';
import { sendTransaction } from './ethereumUtils';
import { CodeListing, updateCodeListing } from './storage';
import { toast } from 'sonner';

export const purchaseCode = async (
  listing: CodeListing,
  buyerAddress: string
): Promise<boolean> => {
  // Send the transaction via MetaMask
  const txHash = await sendTransaction(
    buyerAddress,
    listing.seller,
    listing.price
  );
  
  if (!txHash) return false;
  
  try {
    // Log the purchase in the database
    const { error } = await supabase
      .from('code_purchases')
      .insert({
        listing_id: listing.id,
        buyer_address: buyerAddress,
        seller_address: listing.seller,
        price: listing.price,
        transaction_hash: txHash
      });
    
    if (error) {
      console.error('Error logging purchase:', error);
      toast.error('Error recording your purchase', {
        description: 'Your transaction was sent, but there was an error recording it in our system.',
      });
      return false;
    }
    
    // Update local storage to mark this listing as purchased by the user
    const updatedListing = {
      ...listing,
      purchasers: [...(listing.purchasers || []), buyerAddress]
    };
    
    updateCodeListing(updatedListing);
    
    return true;
  } catch (error) {
    console.error('Purchase error:', error);
    return false;
  }
};

export const hasPurchased = (listing: CodeListing, address: string): boolean => {
  if (!address || !listing.purchasers) return false;
  return listing.purchasers.some(
    purchaser => purchaser.toLowerCase() === address.toLowerCase()
  );
};
