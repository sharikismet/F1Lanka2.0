import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getProduct, type Product } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { MegaMenu } from '../components/MegaMenu';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { Button } from '../components/ui/button';
import { ChevronLeft, ShoppingBag } from 'lucide-react';

const WHATSAPP_NUMBER = '94710773717';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      getProduct(id).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-[#cba153] font-mono tracking-widest text-xs uppercase">LOADING ARCHIVE...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white font-mono tracking-widest text-xs uppercase">Product not found.</div>;
  }

  // Combine main image and the gallery images your Admin Dashboard uploads
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-[#cba153] selection:text-black flex flex-col">
      <MegaMenu
        onSearch={(q) => { if (q) navigate(`/shop?q=${encodeURIComponent(q)}`); }}
        onCartClick={() => setCartDrawerOpen(true)}
        onCategorySelect={() => {}}
        onGenderSelect={() => {}}
        onTeamSelect={() => {}}
      />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 border-t border-white/5">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-400 hover:text-white text-[10px] md:text-xs font-mono uppercase tracking-widest mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Collection
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          
          {/* LEFT: Scrolling Image Gallery */}
          <div className="w-full lg:w-3/5 space-y-4">
            {allImages.map((img, idx) => (
              <div key={idx} className="w-full bg-[#0f0f13] border border-white/5 overflow-hidden">
                <img 
                  src={img} 
                  alt={`${product.name} - View ${idx + 1}`} 
                  className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-700"
                />
              </div>
            ))}
          </div>

          {/* RIGHT: Sticky Product Details */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-32 flex flex-col">
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-[10px] text-[#cba153] font-mono tracking-widest uppercase border border-[#cba153]/30 px-3 py-1.5 bg-[#cba153]/5">
                {product.category}
              </span>
              {product.team && (
                <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase border border-white/10 px-3 py-1.5 bg-white/5">
                  {product.team}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-serif leading-[1.1] mb-6">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/10">
              <span className="text-2xl font-semibold text-[#cba153]">LKR {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-600 line-through mb-1">
                  LKR {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-400 text-sm leading-relaxed mb-10 border-l border-gray-800 pl-4">
              {product.description || "Official merchandise engineered for peak performance and ultimate comfort. Tailored to standard specifications."}
            </p>

            {product.stockQuantity === 0 ? (
              <Button disabled className="w-full h-14 bg-white/5 text-gray-500 rounded-none font-mono uppercase tracking-widest text-xs">
                Out of Stock
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  addToCart(product);
                  setCartDrawerOpen(true);
                }}
                className="w-full h-14 bg-white hover:bg-[#cba153] text-black rounded-none font-mono uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(203,161,83,0.3)]"
              >
                <ShoppingBag className="w-4 h-4 mr-3" /> Add to Bag
              </Button>
            )}
            
            <div className="mt-12 space-y-4 text-[10px] md:text-xs font-mono text-gray-500 tracking-widest uppercase">
              <p className="flex justify-between border-b border-white/5 pb-3"><span>Gender</span> <span className="text-white">{product.gender}</span></p>
              {product.driver && (
                <p className="flex justify-between border-b border-white/5 pb-3"><span>Driver</span> <span className="text-white">{product.driver}</span></p>
              )}
              <p className="flex justify-between border-b border-white/5 pb-3"><span>Shipping</span> <span className="text-white">Nationwide</span></p>
              <p className="flex justify-between border-b border-white/5 pb-3"><span>Authenticity</span> <span className="text-[#cba153]">Guaranteed</span></p>
            </div>

          </div>
        </div>
      </main>
      
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} whatsappNumber={WHATSAPP_NUMBER} />
      <Footer />
    </div>
  );
}