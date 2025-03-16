
import Navbar from '../components/Navbar';
import CodeForm from '../components/CodeForm';

const Create = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-28 pb-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold">Create a New Listing</h1>
            <p className="text-muted-foreground mt-2">
              Share your code snippets and digital assets with the community
            </p>
          </div>
          
          <div className="glass-card rounded-xl p-6 md:p-8">
            <CodeForm />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Create;
