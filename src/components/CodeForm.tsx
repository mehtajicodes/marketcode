
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { saveCodeListing, generateId } from '../utils/storage';
import { getConnectedAccount } from '../utils/ethereumUtils';
import { PlusCircle, X, Code } from 'lucide-react';

const languageOptions = [
  'JavaScript',
  'TypeScript',
  'Python',
  'Java',
  'C#',
  'Go',
  'Rust',
  'PHP',
  'Ruby',
  'Swift',
  'Kotlin',
  'HTML/CSS',
  'Solidity',
  'Other',
];

const CodeForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    language: 'JavaScript',
    price: '',
    tags: [''],
  });
  const [connectedAccount, setConnectedAccount] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      const account = await getConnectedAccount();
      setConnectedAccount(account);
      
      if (!account) {
        toast.error('Wallet not connected', {
          description: 'Please connect your wallet to create a listing.',
        });
      }
    };
    
    checkWalletConnection();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...formData.tags];
    newTags[index] = value;
    setFormData(prev => ({ ...prev, tags: newTags }));
  };

  const addTag = () => {
    if (formData.tags.length < 5) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, ''] }));
    }
  };

  const removeTag = (index: number) => {
    const newTags = formData.tags.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, tags: newTags.length ? newTags : [''] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!connectedAccount) {
      toast.error('Wallet not connected', {
        description: 'Please connect your wallet to create a listing.',
      });
      return;
    }
    
    // Validate form
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error('Description is required');
      return;
    }
    
    if (!formData.code.trim()) {
      toast.error('Code snippet is required');
      return;
    }
    
    if (!formData.price.trim() || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) <= 0) {
      toast.error('Please enter a valid price');
      return;
    }
    
    // Filter out empty tags
    const filteredTags = formData.tags.filter(tag => tag.trim() !== '');
    
    setIsSubmitting(true);
    
    try {
      // Save the listing
      saveCodeListing({
        id: generateId(),
        ...formData,
        tags: filteredTags,
        seller: connectedAccount,
        createdAt: Date.now(),
      });
      
      toast.success('Listing created successfully!');
      navigate('/browse');
    } catch (error) {
      console.error('Error creating listing:', error);
      toast.error('Failed to create listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-medium">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-input rounded-lg focus-ring"
          placeholder="Enter a descriptive title"
          maxLength={100}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="block text-sm font-medium">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-input rounded-lg focus-ring min-h-[100px]"
          placeholder="Describe your code asset in detail"
          maxLength={500}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="code" className="block text-sm font-medium">
          Code Snippet
        </label>
        <textarea
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-input rounded-lg font-mono text-sm focus-ring min-h-[200px]"
          placeholder="Paste your code here..."
        />
        <p className="text-xs text-muted-foreground">
          This is a preview of your code. The full code will be available after purchase.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="language" className="block text-sm font-medium">
            Programming Language
          </label>
          <select
            id="language"
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-input rounded-lg focus-ring"
          >
            {languageOptions.map((lang) => (
              <option key={lang} value={lang}>
                {lang}
              </option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="price" className="block text-sm font-medium">
            Price (ETH)
          </label>
          <input
            type="text"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-input rounded-lg focus-ring"
            placeholder="0.05"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label className="block text-sm font-medium">
          Tags (up to 5)
        </label>
        <div className="space-y-3">
          {formData.tags.map((tag, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={tag}
                onChange={(e) => handleTagChange(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-input rounded-lg focus-ring"
                placeholder="e.g., React, Animation, UI"
                maxLength={20}
              />
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="p-2 text-muted-foreground hover:text-destructive focus-ring rounded-md"
                aria-label="Remove tag"
              >
                <X size={18} />
              </button>
            </div>
          ))}
          
          {formData.tags.length < 5 && (
            <button
              type="button"
              onClick={addTag}
              className="flex items-center text-sm text-primary hover:text-primary/80 focus-ring py-1 px-2 rounded-md"
            >
              <PlusCircle size={16} className="mr-1" />
              Add Tag
            </button>
          )}
        </div>
      </div>
      
      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !connectedAccount}
          className="w-full btn-primary flex items-center justify-center gap-2"
        >
          <Code size={18} />
          {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
        </button>
        
        {!connectedAccount && (
          <p className="mt-2 text-center text-sm text-destructive">
            Please connect your wallet to create a listing
          </p>
        )}
      </div>
    </form>
  );
};

export default CodeForm;
