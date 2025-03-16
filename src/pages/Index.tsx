
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import CodeCard from '../components/CodeCard';
import { CodeListing, getCodeListings } from '../utils/storage';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const Index = () => {
  const [featuredListings, setFeaturedListings] = useState<CodeListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      const listings = getCodeListings();
      // Get up to 3 most recent listings
      const recent = [...listings].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3);
      setFeaturedListings(recent);
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        <Hero />
        
        <section className="section-padding bg-background">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row items-center justify-between mb-10">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Listings</h2>
                <p className="text-muted-foreground mt-2">Recently added code assets on our marketplace</p>
              </div>
              
              <Link 
                to="/browse"
                className="mt-4 md:mt-0 inline-flex items-center text-primary hover:text-primary/80 font-medium focus-ring rounded-md px-2 py-1"
              >
                View all
                <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass-card rounded-xl h-64 animate-pulse">
                    <div className="h-full bg-secondary/50"></div>
                  </div>
                ))}
              </div>
            ) : featuredListings.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredListings.map((listing, index) => (
                  <CodeCard 
                    key={listing.id} 
                    listing={listing}
                    onClick={() => window.location.href = `/browse?id=${listing.id}`}
                    delay={index}
                  />
                ))}
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <h3 className="text-xl font-medium mb-4">No listings yet</h3>
                <p className="text-muted-foreground mb-6">Be the first to sell your code on our marketplace!</p>
                <Link to="/create" className="btn-primary inline-flex">
                  Create Listing
                </Link>
              </motion.div>
            )}
          </div>
        </section>
        
        <section className="section-padding bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="p-8 md:p-12 text-center">
                <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">Ready to Share Your Code?</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                  Create your listing today and start earning with your code assets and digital creations.
                </p>
                <Link to="/create" className="btn-primary inline-flex">
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        <footer className="py-12 px-6 bg-background border-t border-border">
          <div className="container mx-auto max-w-6xl">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="flex items-center mb-6 md:mb-0">
                <span className="text-xl font-display font-bold">CodeCraft</span>
                <span className="ml-1 text-primary text-xl font-bold">Market</span>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>© 2023 CodeCraft Market. All rights reserved.</p>
                <p>Running on Sepolia Testnet. Not for production use.</p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Index;
