import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getProduct, type Product } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { MegaMenu } from '../components/MegaMenu';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';

const WHATSAPP_NUMBER = '94710773717';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);

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
    return <div className="min-h-screen bg-background flex items-center justify-center text-[#FF2800] font-mono tracking-widest text-xs uppercase">LOADING ARCHIVE...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-background flex items-center justify-center text-foreground font-mono tracking-widest text-xs uppercase">Product not found.</div>;
  }

  // Combine main image and the gallery images
  const allImages = [product.image, ...(product.images || [])].filter(Boolean);

  const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-[#FF2800] selection:text-white flex flex-col">
      <MegaMenu
        onSearch={(q) => { if (q) navigate(`/shop?q=${encodeURIComponent(q)}`); }}
        onCartClick={() => setCartDrawerOpen(true)}
        onCategorySelect={() => {}}
        onGenderSelect={() => {}}
        onTeamSelect={() => {}}
      />

      <main className="flex-1 container mx-auto px-4 py-8 md:py-12 border-t border-border">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-[10px] md:text-xs font-mono uppercase tracking-widest mb-8 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Collection
        </button>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
          
          {/* LEFT: Image Carousel & Thumbnails */}
          <div className="w-full lg:w-3/5 space-y-4">
            {/* Main Carousel Image */}
            <div className="relative w-full aspect-square bg-card border border-border overflow-hidden rounded-md group">
              <img 
                src={allImages[currentImageIdx]} 
                alt={`${product.name} - View ${currentImageIdx + 1}`} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              {/* Arrow Buttons (Only show if multiple images exist) */}
              {allImages.length > 1 && (
                <>
                  <button 
                    onClick={prevImage} 
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button 
                    onClick={nextImage} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Selection Row */}
            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${
                      currentImageIdx === idx ? 'border-[#FF2800]' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Sticky Product Details */}
          <div className="w-full lg:w-2/5 lg:sticky lg:top-32 flex flex-col">
            
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className="text-[10px] text-[#FF2800] font-mono tracking-widest uppercase border border-[#FF2800]/30 px-3 py-1.5 bg-[#FF2800]/5 rounded-sm">
                {product.category}
              </span>
              {product.team && (
                <span className="text-[10px] text-foreground font-mono tracking-widest uppercase border border-border px-3 py-1.5 bg-accent rounded-sm">
                  {product.team}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-serif leading-[1.1] mb-6 text-foreground">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-border">
              <span className="text-2xl font-semibold text-foreground">LKR {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through mb-1">
                  LKR {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-muted-foreground text-sm leading-relaxed mb-10 border-l-2 border-[#FF2800] pl-4">
              {product.description || "Official merchandise engineered for peak performance and ultimate comfort. Tailored to standard specifications."}
            </p>

            {product.stockQuantity === 0 ? (
              <Button disabled className="w-full h-14 bg-accent text-muted-foreground rounded-sm font-mono uppercase tracking-widest text-xs">
                Out of Stock
              </Button>
            ) : (
              <Button 
                onClick={() => {
                  addToCart(product);
                  setCartDrawerOpen(true);
                }}
                className="w-full h-14 bg-[#FF2800] hover:bg-[#E02400] text-white rounded-sm font-mono uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(255,40,0,0.1)] hover:shadow-[0_0_30px_rgba(255,40,0,0.3)]"
              >
                <ShoppingBag className="w-4 h-4 mr-3" /> Add to Bag
              </Button>
            )}
            
            <div className="mt-12 space-y-4 text-[10px] md:text-xs font-mono text-muted-foreground tracking-widest uppercase">
              <p className="flex justify-between border-b border-border pb-3"><span>Gender</span> <span className="text-foreground">{product.gender}</span></p>
              {product.driver && (
                <p className="flex justify-between border-b border-border pb-3"><span>Driver</span> <span className="text-foreground">{product.driver}</span></p>
              )}
              <p className="flex justify-between border-b border-border pb-3"><span>Shipping</span> <span className="text-foreground">Nationwide</span></p>
              <p className="flex justify-between border-b border-border pb-3"><span>Authenticity</span> <span className="text-[#FF2800]">Guaranteed</span></p>
            </div>

          </div>
        </div>
      </main>
      
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} whatsappNumber={WHATSAPP_NUMBER} />
      <Footer />
    </div>
  );
}