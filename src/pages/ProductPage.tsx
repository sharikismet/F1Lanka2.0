import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getProduct, type Product } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { MegaMenu } from '../components/MegaMenu';
import { Footer } from '../components/Footer';
import { CartDrawer } from '../components/CartDrawer';
import { Button } from '../components/ui/button';
import { ChevronLeft, ChevronRight, ShoppingBag, MessageCircle, Minus, Plus } from 'lucide-react';
import { toast } from 'sonner';

const WHATSAPP_NUMBER = '94710773717';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  
  // Store quantities for multiple variants simultaneously
  const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({});
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

  const isApparel = product ? ['T-Shirts', 'Hoodies', 'Pants', 'Jackets'].some(cat => product.category.includes(cat)) || product.category.toLowerCase().includes('shirt') : false;
  const isModel = product ? ['Model Cars', 'Collectibles', 'Diecast', 'Helmets'].some(cat => product.category.includes(cat)) || product.name.toLowerCase().includes('scale') : false;
  
  // Dynamically extract variants from the product data or variantStock
  const sizes = product?.sizes?.length 
    ? product.sizes 
    : (isApparel && product?.variantStock ? Object.keys(product.variantStock) : []);
    
  const scales = (product as any)?.scales?.length 
    ? (product as any).scales 
    : (isModel && product?.variantStock ? Object.keys(product.variantStock) : []);

  const hasVariants = sizes.length > 0 || scales.length > 0;

  const totalSelectedQuantity = Object.values(variantQuantities).reduce((a, b) => a + b, 0);

  const handleQuantityChange = (variantKey: string, delta: number) => {
    setVariantQuantities(prev => {
      const current = prev[variantKey] || 0;
      const next = Math.max(0, current + delta);
      
      const stock = product?.variantStock?.[variantKey] ?? product?.stockQuantity ?? 0;
      if (next > stock) return prev; // Cannot exceed available stock
      
      if (next === 0) {
        const updated = { ...prev };
        delete updated[variantKey];
        return updated;
      }
      return { ...prev, [variantKey]: next };
    });
    setShowVariantError(false);
  };

  const handleAddToCart = () => {
    if (hasVariants && totalSelectedQuantity === 0) {
      setShowVariantError(true);
      return;
    }
    
    setShowVariantError(false);
    
    if (hasVariants) {
      // Loop through all selected variants and add them to cart separately
      Object.entries(variantQuantities).forEach(([variant, qty]) => {
        if (qty > 0) {
          addToCart(product!, qty, {
            size: sizes.length > 0 ? variant : undefined,
            scale: scales.length > 0 ? variant : undefined
          });
        }
      });
    } else {
      // For products without variants
      const qty = variantQuantities['default'] || 1;
      addToCart(product!, qty);
    }
    
    setCartDrawerOpen(true);
    setVariantQuantities({}); // Reset selections after adding
  };

  const handleWhatsAppCheckout = () => {
    if (!product) return;
    
    if (hasVariants && totalSelectedQuantity === 0) {
      setShowVariantError(true);
      return;
    }
    
    setShowVariantError(false);
    
    let variantText = '';
    let totalQty = 0;

    if (hasVariants) {
      totalQty = totalSelectedQuantity;
      Object.entries(variantQuantities).forEach(([variant, qty]) => {
        if (qty > 0) {
          variantText += `\n  • ${sizes.length > 0 ? 'Size' : 'Scale'} ${variant}: ${qty} qty`;
        }
      });
    } else {
      totalQty = variantQuantities['default'] || 1;
    }

    const subtotal = (product.price * totalQty).toFixed(2);
    const message = `*New Order Request*\n\n*${product.name}*${variantText}\n  • Total Quantity: ${totalQty}\n  • Price: LKR ${product.price.toFixed(2)} each\n  • Subtotal: LKR ${subtotal}\n\nLink: ${window.location.href}`;
    
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

            {sizes.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-gray-400">
                    Select Sizes & Quantities
                  </span>
                  {showVariantError && totalSelectedQuantity === 0 && (
                    <span className="text-[10px] font-mono uppercase text-[#FF2800] animate-pulse">Select at least one</span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {sizes.map(size => {
                    const sizeStock = product.variantStock !== undefined ? (product.variantStock[size] || 0) : (product.stockQuantity || 0);
                    const isSizeOutOfStock = sizeStock === 0;
                    const qty = variantQuantities[size] || 0;

                    return (
                      <div key={size} className={`flex items-center justify-between p-2 border rounded-sm transition-all ${isSizeOutOfStock ? 'border-white/5 bg-white/5 opacity-50' : qty > 0 ? 'border-[#FF2800] bg-[#FF2800]/5' : 'border-white/10 hover:border-white/30'}`}>
                        <span className={`font-medium ml-2 ${isSizeOutOfStock ? 'text-gray-500 line-through' : 'text-white'}`}>{size}</span>
                        <div className="flex items-center border border-white/10 rounded-sm bg-[#121216]">
                          <button disabled={isSizeOutOfStock || qty === 0} onClick={() => handleQuantityChange(size, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-white">{qty}</span>
                          <button disabled={isSizeOutOfStock || qty >= sizeStock} onClick={() => handleQuantityChange(size, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {scales.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-gray-400">
                    Select Scales & Quantities
                  </span>
                  {showVariantError && totalSelectedQuantity === 0 && (
                    <span className="text-[10px] font-mono uppercase text-[#FF2800] animate-pulse">Select at least one</span>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scales.map(scale => {
                    const scaleStock = product.variantStock !== undefined ? (product.variantStock[scale] || 0) : (product.stockQuantity || 0);
                    const isScaleOutOfStock = scaleStock === 0;
                    const qty = variantQuantities[scale] || 0;

                    return (
                      <div key={scale} className={`flex items-center justify-between p-2 border rounded-sm transition-all ${isScaleOutOfStock ? 'border-white/5 bg-white/5 opacity-50' : qty > 0 ? 'border-[#FF2800] bg-[#FF2800]/5' : 'border-white/10 hover:border-white/30'}`}>
                        <span className={`font-medium ml-2 ${isScaleOutOfStock ? 'text-gray-500 line-through' : 'text-white'}`}>{scale}</span>
                        <div className="flex items-center border border-white/10 rounded-sm bg-[#121216]">
                          <button disabled={isScaleOutOfStock || qty === 0} onClick={() => handleQuantityChange(scale, -1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-white">{qty}</span>
                          <button disabled={isScaleOutOfStock || qty >= scaleStock} onClick={() => handleQuantityChange(scale, 1)} className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!hasVariants && (
              <div className="mb-8">
                <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase text-gray-400 block mb-3">
                  Quantity
                </span>
                <div className="flex items-center border border-white/10 w-fit rounded-sm bg-[#121216]">
                  <button 
                    onClick={() => handleQuantityChange('default', -1)}
                    disabled={(variantQuantities['default'] || 1) <= 1}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-white">{variantQuantities['default'] || 1}</span>
                  <button 
                    onClick={() => handleQuantityChange('default', 1)}
                    disabled={(variantQuantities['default'] || 1) >= (product.stockQuantity || 0)}
                    className="w-12 h-12 flex items-center justify-center text-gray-400 hover:text-white disabled:opacity-30 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <p className="text-gray-400 text-sm leading-relaxed mb-10 border-l-2 border-[#FF2800] pl-4">
              {product.description || "Official merchandise engineered for peak performance and ultimate comfort. Tailored to standard specifications."}
            </p>

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