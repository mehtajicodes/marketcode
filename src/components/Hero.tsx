
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Code, Package, Shield } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/50 pt-28 pb-16 md:pb-24 lg:pb-32 px-6 md:px-8 lg:px-0">
      <div className="absolute top-0 left-0 right-0 h-[500px] bg-[radial-gradient(50%_50%_at_50%_50%,rgba(56,189,248,0.1)_0%,rgba(56,189,248,0)_100%)]" />
      
      <div className="container mx-auto max-w-6xl">
        {isVisible && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative z-10 flex flex-col items-center text-center"
          >
            <motion.div variants={itemVariants} className="inline-flex items-center rounded-full px-3 py-1 text-sm bg-primary/10 text-primary mb-6">
              <span className="px-2 py-0.5 mr-1 bg-primary text-white text-xs rounded-full">NEW</span>
              Sepolia Testnet Integration
            </motion.div>
            
            <motion.h1 
              variants={itemVariants} 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground max-w-4xl mx-auto"
            >
              The Marketplace for <span className="text-primary">Premium Code</span> and Digital Assets
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Buy and sell high-quality code snippets, components, and digital assets with secure blockchain transactions on the Sepolia testnet.
            </motion.p>
            
            <motion.div variants={itemVariants} className="mt-10 flex flex-col sm:flex-row gap-4 w-full justify-center">
              <Link 
                to="/browse"
                className="btn-primary flex items-center justify-center gap-2 group"
              >
                Browse Marketplace
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              
              <Link 
                to="/create"
                className="btn-secondary flex items-center justify-center gap-2"
              >
                Sell Your Code
              </Link>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full"
            >
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="glass-card rounded-2xl p-6 flex flex-col items-center text-center"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const features = [
  {
    title: "Quality Code Assets",
    description: "Browse through a curated marketplace of premium code snippets and components.",
    icon: <Code size={24} className="text-primary" />,
  },
  {
    title: "Secure Transactions",
    description: "All transactions are secure via the Sepolia test network with MetaMask integration.",
    icon: <Shield size={24} className="text-primary" />,
  },
  {
    title: "Sell Your Work",
    description: "List your code assets for sale and earn cryptocurrency for your expertise.",
    icon: <Package size={24} className="text-primary" />,
  },
];

export default Hero;
