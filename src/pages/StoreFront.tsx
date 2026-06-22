import { useState, useEffect } from 'react';
import { MegaMenu } from '../components/MegaMenu';
import { ShopByTeamScroll } from '../components/ShopByTeamScroll';
import { HeroBanner } from '../components/HeroBanner';
import { CartDrawer } from '../components/CartDrawer';
import { Footer } from '../components/Footer';
import { FloatingButtons } from '../components/FloatingButtons';
import { getProducts, initSampleData, testServerConnection } from '../lib/api';
import type { Product } from '../lib/api';
import { ProductCard } from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { AlertCircle, X, Info } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { useNavigate } from 'react-router';
import { NextRaceCountdown } from '../components/NextRaceCountdown';
import { Leaderboard } from '../components/Leaderboard';

const WHATSAPP_NUMBER = '94710773717';

export function StoreFront() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  
  // State to control the visibility of the "For Sale" popup banner
  const [showSaleBanner, setShowSaleBanner] = useState(true);

  useEffect(() => {
    checkServerConnection();
  }, []);

  const checkServerConnection = async () => {
    const result = await testServerConnection();
    if (!result.success) {
      setServerError(result.message);
    } else {
      setServerError(null);
      loadProducts();
    }
  };

  const loadProducts = async () => {
    setLoading(true);
    const fetched = await getProducts();
    setProducts(fetched);
    setLoading(false);
    if (fetched.length === 0 && !initialized) setInitialized(true);
  };

  const handleInitSampleData = async () => {
    const success = await initSampleData();
    if (success) {
      toast.success('Sample data loaded successfully!');
      await loadProducts();
    } else {
      toast.error('Failed to load sample data');
    }
  };

  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-[#0a0a0c] bg-carbon text-white flex flex-col relative">
      <MegaMenu
        onSearch={(q) => { if (q) navigate(`/shop?q=${encodeURIComponent(q)}`); }}
        onCartClick={() => setCartDrawerOpen(true)}
        onCategorySelect={() => {}}
        onGenderSelect={() => {}}
        onTeamSelect={() => {}}
      />

      <HeroBanner onShopNow={() => navigate('/shop')} />
      <ShopByTeamScroll onTeamSelect={() => {}} />

      <div className="container mx-auto px-4 py-8 flex-1 space-y-16">
        {serverError && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Server Connection Error</AlertTitle>
            <AlertDescription className="mt-2">
              <p className="mb-2">{serverError}</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={checkServerConnection}>
                Retry Connection
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Products Section First */}
        {!loading && products.length === 0 && initialized && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Your store is empty!</p>
            <p className="text-gray-400 text-sm mb-6">Get started by adding some sample products.</p>
            <Button onClick={handleInitSampleData} className="bg-[#FF2800] hover:bg-[#E02400]">
              Load Sample Products
            </Button>
          </div>
        )}

        {!loading && featuredProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white uppercase tracking-wide">Featured Products</h2>
              <Button variant="outline" onClick={() => navigate('/shop')} className="text-[#cba153] border-[#cba153] hover:bg-[#cba153] hover:text-black">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onClick={() => navigate(`/product/${product.id}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Race Arena Context Block */}
        <div className="space-y-8 pt-4">
          <NextRaceCountdown 
            raceName="Monaco Grand Prix" 
            targetDate="2026-06-07T13:00:00Z" 
          />
          <Leaderboard />
        </div>
      </div>

      {/* 🏎️ FIXED FOR SALE POPUP ALERT */}
      {showSaleBanner && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-[#121216] border border-[#FF2800]/40 rounded-sm p-4 z-50 flex items-center justify-between gap-4 shadow-[0_0_30px_rgba(255,40,0,0.15)] animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#FF2800]/10 flex items-center justify-center border border-[#FF2800]/20 flex-shrink-0">
              <Info className="w-4 h-4 text-[#FF2800]" />
            </div>
            <div>
              <p className="font-mono text-[10px] text-[#FF2800] uppercase tracking-widest font-bold mb-0.5">Acquisition Opportunity</p>
              <p className="text-sm font-serif text-white tracking-wide">
                This site is for sale. Contact <span className="font-mono text-xs text-[#cba153] font-bold">0758611933 - Sharik</span>
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowSaleBanner(false)}
            className="p-1.5 rounded-sm hover:bg-white/5 border border-transparent hover:border-white/10 text-gray-400 hover:text-white transition-all flex-shrink-0"
            aria-label="Close sale notification"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} whatsappNumber={WHATSAPP_NUMBER} />
      <FloatingButtons />
      <Footer />
    </div>
  );
}