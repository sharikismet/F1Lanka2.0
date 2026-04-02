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
import { ProductDetailDialog } from '../components/ProductDetailDialog';
import { Button } from '../components/ui/button';
import { toast } from 'sonner@2.0.3';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';
import { useNavigate } from 'react-router';

const WHATSAPP_NUMBER = '94710773717';

export function StoreFront() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

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

  useEffect(() => { loadProducts(); }, []);

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

  // Show a few featured products
  const featuredProducts = products.slice(0, 8);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MegaMenu
        onSearch={(q) => { if (q) navigate(`/shop?q=${encodeURIComponent(q)}`); }}
        onCartClick={() => setCartDrawerOpen(true)}
        onCategorySelect={() => {}}
        onGenderSelect={() => {}}
        onTeamSelect={() => {}}
      />

      {/* Hero Banner */}
      <HeroBanner onShopNow={() => navigate('/shop')} />

      {/* Shop By Team Scroll Section */}
      <ShopByTeamScroll onTeamSelect={() => {}} />

      <div className="container mx-auto px-4 py-8 flex-1">
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

        {!loading && products.length === 0 && initialized && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg mb-4">Your store is empty!</p>
            <p className="text-gray-400 text-sm mb-6">Get started by adding some sample products.</p>
            <Button onClick={handleInitSampleData} className="bg-[#FF2800] hover:bg-[#E02400]">
              Load Sample Products
            </Button>
          </div>
        )}

        {/* Featured Products */}
        {!loading && featuredProducts.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Featured Products</h2>
              <Button variant="outline" onClick={() => navigate('/shop')} className="text-[#FF2800] border-[#FF2800] hover:bg-[#FF2800] hover:text-white">
                View All
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {featuredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  onClick={() => {
                    setSelectedProduct(product);
                    setDialogOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <ProductDetailDialog product={selectedProduct} open={dialogOpen} onOpenChange={setDialogOpen} />
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} whatsappNumber={WHATSAPP_NUMBER} />
      <FloatingButtons />
      <Footer />
    </div>
  );
}
