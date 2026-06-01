import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getProduct, type Product } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { MegaMenu } from '../components/MegaMenu';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingBag, MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '94710773717';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  
  // State to capture customer variant selections
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedScale, setSelectedScale] = useState<string>('');
  const [showVariantError, setShowVariantError] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (id) {
      getProduct(id).then((data) => {
        setProduct(data);
        setLoading(false);
      });
    }
  }, [id]);

  // 🚨 FIX: Determine product types to show the correct selectors
  const isApparel = product ? ['T-Shirts', 'Hoodies', 'Pants', 'Jackets'].some(cat => product.category.includes(cat)) || product.category.toLowerCase().includes('shirt') : false;
  const isModel = product ? ['Model Cars', 'Collectibles', 'Diecast', 'Helmets'].some(cat => product.category.includes(cat)) || product.name.toLowerCase().includes('scale') : false;
  
  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
  const scales = ['1:18', '1:43', '1:64', '1:2']; // Common F1 model and helmet scales

  // Validation function before adding to cart
  const handleAddToCart = () => {
    if (isApparel && !selectedSize) {
      setShowVariantError(true);
      return;
    }
    if (isModel && !selectedScale) {
      setShowVariantError(true);
      return;
    }
    
    setShowVariantError(false);
    addToCart({ ...product, selectedSize, selectedScale } as Product);
    setCartDrawerOpen(true);
  };

  // Direct checkout bypass with variant injection
  const handleWhatsAppCheckout = () => {
    if (!product) return;
    
    // Validate selections
    if (isApparel && !selectedSize) {
      setShowVariantError(true);
      return;
    }
    if (isModel && !selectedScale) {
      setShowVariantError(true);
      return;
    }
    
    setShowVariantError(false);
    
    let variantText = '';
    if (isApparel) variantText = `\n  • Size: ${selectedSize}`;
    if (isModel) variantText = `\n  • Scale: ${selectedScale}`;

    const message = `*New Order Request*\n\n*${product.name}*${variantText}\n  • Quantity: 1\n  • Price: LKR ${product.price.toFixed(2)}\n\nLink: ${window.location.href}`;
    
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-[#FF2800] font-mono tracking-widest text-xs uppercase">LOADING ARCHIVE...</div>;
  }

  if (!product) {
    return <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center text-white font-mono tracking-widest text-xs uppercase">Product not found.</div>;
  }

  const allImages = [product.image, ...(product.images || [])].filter(Boolean);
  const nextImage = () => setCurrentImageIdx((prev) => (prev + 1) % allImages.length);
  const prevImage = () => setCurrentImageIdx((prev) => (prev - 1 + allImages.length) % allImages.length);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-[#FF2800] selection:text-white flex flex-col">
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
          
          {/* LEFT: Image Carousel & Thumbnails */}
          <div className="w-full lg:w-3/5 space-y-4">
            <div className="relative w-full aspect-square bg-[#0f0f13] border border-white/5 overflow-hidden rounded-sm group">
              <img 
                src={allImages[currentImageIdx]} 
                alt={`${product.name} - View ${currentImageIdx + 1}`} 
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
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

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                {allImages.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIdx(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-sm overflow-hidden border-2 transition-all ${
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
                <span className="text-[10px] text-gray-300 font-mono tracking-widest uppercase border border-white/10 px-3 py-1.5 bg-white/5 rounded-sm">
                  {product.team}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-serif leading-[1.1] mb-6 text-white">
              {product.name}
            </h1>

            <div className="flex items-end gap-4 mb-8 pb-8 border-b border-white/10">
              <span className="text-2xl font-semibold text-white">LKR {product.price.toFixed(2)}</span>
              {product.originalPrice && (
                <span className="text-lg text-gray-500 line-through mb-1">
                  LKR {product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>

            {/* 🚨 APPAREL SIZE SELECTOR */}
            {isApparel && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-gray-400">
                    Select Size
                  </span>
                  {showVariantError && !selectedSize && (
                    <span className="text-[10px] font-mono uppercase text-[#FF2800] animate-pulse">Required</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {sizes.map(size => {
                    const isSizeOutOfStock = product.variantStock && product.variantStock[size] === 0;

                    return (
                      <button
                        key={size}
                        disabled={isSizeOutOfStock}
                        onClick={() => {
                          setSelectedSize(size);
                          setShowVariantError(false);
                        }}
                        className={`w-12 h-12 flex items-center justify-center border text-sm font-medium transition-all ${
                          isSizeOutOfStock
                            ? 'border-white/5 bg-white/5 text-gray-700 cursor-not-allowed line-through'
                            : selectedSize === size
                              ? 'border-[#FF2800] bg-[#FF2800]/10 text-[#FF2800]'
                              : showVariantError 
                                ? 'border-[#FF2800]/50 text-[#FF2800] hover:border-[#FF2800]' 
                                : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 🚨 MODEL SCALE SELECTOR */}
            {isModel && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-gray-400">
                    Select Scale
                  </span>
                  {showVariantError && !selectedScale && (
                    <span className="text-[10px] font-mono uppercase text-[#FF2800] animate-pulse">Required</span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {scales.map(scale => {
                    const isScaleOutOfStock = product.variantStock && product.variantStock[scale] === 0;

                    return (
                      <button
                        key={scale}
                        disabled={isScaleOutOfStock}
                        onClick={() => {
                          setSelectedScale(scale);
                          setShowVariantError(false);
                        }}
                        className={`px-4 h-12 flex items-center justify-center border text-sm font-medium transition-all ${
                          isScaleOutOfStock
                            ? 'border-white/5 bg-white/5 text-gray-700 cursor-not-allowed line-through'
                            : selectedScale === scale
                              ? 'border-[#FF2800] bg-[#FF2800]/10 text-[#FF2800]'
                              : showVariantError 
                                ? 'border-[#FF2800]/50 text-[#FF2800] hover:border-[#FF2800]' 
                                : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {scale}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-10 border-l-2 border-[#FF2800] pl-4">
              {product.description || "Official merchandise engineered for peak performance and ultimate comfort. Tailored to standard specifications."}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3">
              {product.stockQuantity === 0 ? (
                <Button disabled className="w-full h-14 bg-white/5 text-gray-500 rounded-sm font-mono uppercase tracking-widest text-xs">
                  Out of Stock
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleAddToCart}
                    className="w-full h-14 bg-white hover:bg-gray-200 text-black rounded-sm font-mono uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                  >
                    <ShoppingBag className="w-4 h-4 mr-3" /> Add to Bag
                  </Button>
                  
                  <Button 
                    onClick={handleWhatsAppCheckout}
                    className="w-full h-14 bg-[#25D366] hover:bg-[#1DA851] text-white rounded-sm font-mono uppercase tracking-widest text-xs transition-colors shadow-[0_0_20px_rgba(37,211,102,0.15)] hover:shadow-[0_0_30px_rgba(37,211,102,0.3)]"
                  >
                    <MessageCircle className="w-5 h-5 mr-3" /> Checkout via WhatsApp
                  </Button>
                </>
              )}
            </div>
            
            <div className="mt-12 space-y-4 text-[10px] md:text-xs font-mono text-gray-500 tracking-widest uppercase">
              <p className="flex justify-between border-b border-white/5 pb-3"><span>Gender</span> <span className="text-white">{product.gender}</span></p>
              {product.driver && (
                <p className="flex justify-between border-b border-white/5 pb-3"><span>Driver</span> <span className="text-white">{product.driver}</span></p>
              )}
              <p className="flex justify-between border-b border-white/5 pb-3"><span>Shipping</span> <span className="text-white">Nationwide</span></p>
              <p className="flex justify-between border-b border-white/5 pb-3"><span>Authenticity</span> <span className="text-[#FF2800]">Guaranteed</span></p>
            </div>

          </div>
        </div>
      </main>
      
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} whatsappNumber={WHATSAPP_NUMBER} />
      <Footer />
    </div>
  );
}