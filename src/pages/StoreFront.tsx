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
import { AlertCircle, X, Trophy } from 'lucide-react';
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
            raceName="British Grand Prix" 
            targetDate="2026-07-05T19:30:00+05:30"
          />
          <Leaderboard />
        </div>
      </div>

      {/* 🏎️ PREMIUM ACQUISITION / INVESTMENT BANNER */}
      {showSaleBanner && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-2xl bg-[#0f0f13] border border-[#FF2800]/50 rounded-sm p-5 z-50 shadow-[0_0_40px_rgba(255,40,0,0.2)] animate-in fade-in slide-in-from-bottom-6 duration-300 backdrop-blur-md">
          {/* Close Button Anchor */}
          <button 
            onClick={() => setShowSaleBanner(false)}
            className="absolute top-4 right-4 p-1 rounded-sm border border-transparent hover:border-white/10 hover:bg-white/5 text-gray-500 hover:text-white transition-all z-10"
            aria-label="Dismiss offering prospectus"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex flex-col md:flex-row gap-5 items-start">
            {/* Icon Profile Badge */}
            <div className="w-12 h-12 rounded-sm bg-[#FF2800]/10 flex items-center justify-center border border-[#FF2800]/30 flex-shrink-0 mx-auto md:mx-0">
              <Trophy className="w-5 h-5 text-[#FF2800]" />
            </div>

            {/* Sales Pitch and Investment Prospectus Copy */}
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-center md:justify-start gap-2">
                <span className="font-mono text-[10px] text-[#FF2800] uppercase tracking-widest font-black bg-[#FF2800]/10 border border-[#FF2800]/20 px-2 py-0.5 rounded-sm w-fit mx-auto md:mx-0">
                  Premium Turnkey Venture
                </span>
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest font-bold w-fit mx-auto md:mx-0">
                  • Live 2026 Teleboard Core Enabled
                </span>
              </div>

              <h3 className="text-xl font-serif text-white tracking-wide leading-tight">
                If you are planning on investing in a business, <span className="text-[#FF2800]">this is your chance.</span>
              </h3>
              
              <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xl">
                Acquire a highly specialized, fully integrated E-commerce architecture engineered directly for the global motorsport niche. This online store captures premium, high-intent traffic by attracting dedicated <strong className="text-white font-medium">F1 enthusiasts</strong> with real time race data analytics, offering a flawless transition from live fan engagement directly into targeted merchandising streams.
              </p>

              {/* Call To Action Row */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 text-xs font-mono tracking-wider">
                <p className="text-gray-400 uppercase text-[11px]">
                  Direct Principal Contact: 
                  <span className="text-[#cba153] font-bold ml-1.5 selection:bg-white select-all">
                    0758611933 – SHARIK
                  </span>
                </p>
                <a 
                  href="https://wa.me/94758611933?text=I%20am%20interested%20in%20discussing%20the%20acquisition%20of%20your%20F1%20platform." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] uppercase font-bold text-black bg-white hover:bg-gray-200 px-3 py-1.5 rounded-sm transition-colors tracking-widest shadow-sm"
                >
                  Inquire via WA
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} whatsappNumber={WHATSAPP_NUMBER} />
      <FloatingButtons />
      <Footer />
    </div>
  );
}