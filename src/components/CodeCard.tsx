
import { CodeListing } from '../utils/storage';
import { formatAddress } from '../utils/ethereumUtils';
import { motion } from 'framer-motion';
import { Code, Tag, User } from 'lucide-react';

interface CodeCardProps {
  listing: CodeListing;
  onClick?: () => void;
  delay?: number;
}

const CodeCard = ({ listing, onClick, delay = 0 }: CodeCardProps) => {
  const formattedDate = new Date(listing.createdAt).toLocaleDateString();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay * 0.1 }}
      className="glass-card rounded-xl overflow-hidden card-hover cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-lg font-semibold line-clamp-1">{listing.title}</h3>
          <span className="px-3 py-1 bg-primary text-primary-foreground text-sm rounded-full">
            {listing.price} ETH
          </span>
        </div>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {listing.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {listing.tags.map((tag, index) => (
            <span 
              key={index} 
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs bg-secondary text-secondary-foreground"
            >
              <Tag size={12} className="mr-1" />
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center text-xs text-muted-foreground gap-4">
          <div className="flex items-center">
            <User size={14} className="mr-1" />
            {formatAddress(listing.seller)}
          </div>
          <div className="flex items-center">
            <Code size={14} className="mr-1" />
            {listing.language}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground">
          Listed on {formattedDate}
        </div>
      </div>
    </motion.div>
  );
};

export default CodeCard;
