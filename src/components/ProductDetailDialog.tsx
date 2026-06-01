import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Package, Minus, Plus } from 'lucide-react';
import type { Product } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { toast } from 'sonner';
import { useState, useEffect } from 'react';

interface ProductDetailDialogProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductDetailDialog({
  product,
  open,
  onOpenChange,
}: ProductDetailDialogProps) {
  const { addToCart } = useCart();
  
  // Store multiple quantities for different variants
  const [variantQuantities, setVariantQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (open) {
      setVariantQuantities({});
    }
  }, [open, product]);

  if (!product) return null;

  const currentStock = product.stockQuantity;
  const isOutOfStock = currentStock === 0;
  const isLowStock = currentStock !== undefined && currentStock > 0 && currentStock < 10;

  const hasClothingSizes = product.sizes && product.sizes.length > 0;
  const hasWaistSizes = product.waistSizes && product.waistSizes.length > 0;
  
  // Dynamically extract scale variants from variantStock
  const isModel = ['Model Cars', 'Collectibles', 'Diecast', 'Helmets'].some(cat => product.category.includes(cat)) || product.name.toLowerCase().includes('scale');
  const extractedScales = isModel && product.variantStock ? Object.keys(product.variantStock) : [];
  const scales = (product as any).scales?.length > 0 ? (product as any).scales : extractedScales;
  const hasScales = scales.length > 0;

  const hasVariants = hasClothingSizes || hasWaistSizes || hasScales;

  const totalSelectedQuantity = Object.values(variantQuantities).reduce((a, b) => a + b, 0);

  const handleQuantityChange = (variantKey: string, delta: number) => {
    setVariantQuantities(prev => {
      const current = prev[variantKey] || 0;
      const next = Math.max(0, current + delta);
      
      const stock = product.variantStock?.[variantKey] ?? product.stockQuantity ?? 0;
      if (next > stock) return prev;
      
      if (next === 0) {
        const updated = { ...prev };
        delete updated[variantKey];
        return updated;
      }
      return { ...prev, [variantKey]: next };
    });
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    if (hasVariants && totalSelectedQuantity === 0) {
      toast.error('Please select at least one variant and quantity.');
      return;
    }
    
    if (hasVariants) {
      Object.entries(variantQuantities).forEach(([variantKey, qty]) => {
        if (qty > 0) {
          addToCart(product, qty, {
            size: hasClothingSizes ? variantKey : undefined,
            waistSize: hasWaistSizes ? variantKey : undefined,
            scale: hasScales ? variantKey : undefined,
          });
        }
      });
      toast.success('Items added to cart!', {
        description: `${totalSelectedQuantity} items have been added to your cart.`
      });
    } else {
      const qty = variantQuantities['default'] || 1;
      addToCart(product, qty, {
        scale: product.modelCarScale
      });
      toast.success('Added to cart!', {
        description: `${qty} ${product.name} added to your cart.`
      });
    }
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{product.name}</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {product.category}
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            
            {isOutOfStock && (
              <Badge className="absolute top-4 right-4 bg-gray-800 text-white text-sm">Out of Stock</Badge>
            )}
            {isLowStock && !isOutOfStock && (
              <Badge className="absolute top-4 right-4 bg-orange-600 text-white text-sm">Only {currentStock} left!</Badge>
            )}
            {product.isClearance && !isOutOfStock && (
              <Badge className="absolute top-4 right-4 bg-red-600 text-white">Clearance</Badge>
            )}
            {product.team && (
              <Badge className="absolute top-4 left-4 bg-black text-white">{product.team}</Badge>
            )}
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-red-600">LKR {product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">LKR {product.originalPrice.toFixed(2)}</span>
                )}
              </div>
            </div>

            {hasClothingSizes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Sizes & Quantities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.sizes!.map((size) => {
                    const sizeStock = product.variantStock ? (product.variantStock[size] || 0) : (product.stockQuantity || 0);
                    const isSizeOut = sizeStock === 0;
                    const qty = variantQuantities[size] || 0;

                    return (
                      <div key={size} className={`flex items-center justify-between p-2 border rounded-lg transition-all ${isSizeOut ? 'bg-gray-50 opacity-60' : qty > 0 ? 'border-[#FF2800] bg-red-50' : 'border-gray-200'}`}>
                        <span className={`font-medium ml-1 ${isSizeOut ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{size}</span>
                        <div className="flex items-center bg-white border border-gray-200 rounded-md">
                          <button disabled={isSizeOut || qty === 0} onClick={() => handleQuantityChange(size, -1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{qty}</span>
                          <button disabled={isSizeOut || qty >= sizeStock} onClick={() => handleQuantityChange(size, 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hasWaistSizes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Waist Sizes & Quantities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.waistSizes!.map((size) => {
                    const sizeStock = product.variantStock ? (product.variantStock[size] || 0) : (product.stockQuantity || 0);
                    const isSizeOut = sizeStock === 0;
                    const qty = variantQuantities[size] || 0;

                    return (
                      <div key={size} className={`flex items-center justify-between p-2 border rounded-lg transition-all ${isSizeOut ? 'bg-gray-50 opacity-60' : qty > 0 ? 'border-[#FF2800] bg-red-50' : 'border-gray-200'}`}>
                        <span className={`font-medium ml-1 ${isSizeOut ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{size}"</span>
                        <div className="flex items-center bg-white border border-gray-200 rounded-md">
                          <button disabled={isSizeOut || qty === 0} onClick={() => handleQuantityChange(size, -1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{qty}</span>
                          <button disabled={isSizeOut || qty >= sizeStock} onClick={() => handleQuantityChange(size, 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30">
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {hasScales && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Scales & Quantities</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {scales.map((scale: string) => {
                    const scaleStock = product.variantStock ? (product.variantStock[scale] || 0) : (product.stockQuantity || 0);
                    const isScaleOut = scaleStock === 0;
                    const qty = variantQuantities[scale] || 0;

                    return (
                      <div key={scale} className={`flex items-center justify-between p-2 border rounded-lg transition-all ${isScaleOut ? 'bg-gray-50 opacity-60' : qty > 0 ? 'border-[#FF2800] bg-red-50' : 'border-gray-200'}`}>
                        <span className={`font-medium ml-1 ${isScaleOut ? 'text-gray-400 line-through' : 'text-gray-800'}`}>{scale}</span>
                        <div className="flex items-center bg-white border border-gray-200 rounded-md">
                          <button disabled={isScaleOut || qty === 0} onClick={() => handleQuantityChange(scale, -1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30">
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-sm font-medium">{qty}</span>
                          <button disabled={isScaleOut || qty >= scaleStock} onClick={() => handleQuantityChange(scale, 1)} className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30">
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
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Quantity</h3>
                <div className="flex items-center bg-white border border-gray-200 rounded-md w-fit">
                  <button onClick={() => handleQuantityChange('default', -1)} disabled={(variantQuantities['default'] || 1) <= 1} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30">
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-10 text-center font-medium">{variantQuantities['default'] || 1}</span>
                  <button onClick={() => handleQuantityChange('default', 1)} disabled={(variantQuantities['default'] || 1) >= (product.stockQuantity || 0)} className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {product.modelCarScale && !hasScales && (
              <div className="mb-6">
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Scale:</span>
                  <span className="font-medium">{product.modelCarScale}</span>
                </div>
                {product.material && (
                  <div className="flex justify-between py-2 border-b">
                    <span className="text-gray-600">Material:</span>
                    <span className="font-medium">{product.material}</span>
                  </div>
                )}
              </div>
            )}

            <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
              <Package className={`w-5 h-5 ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`} />
              <div>
                <p className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                </p>
                {!isOutOfStock && currentStock !== undefined && (
                  <p className="text-sm text-gray-600">
                    {isLowStock ? `Hurry! Only ${currentStock} items remaining` : `${currentStock} available`}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">{product.description || 'Official F1 merchandise. High-quality product for true Formula 1 fans.'}</p>
            </div>

            <div className="mt-auto space-y-3">
              <Button className="w-full bg-[#FF2800] hover:bg-[#CC2000] text-white" size="lg" onClick={handleAddToCart} disabled={isOutOfStock}>
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}