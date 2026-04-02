import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ShoppingCart, Package, DollarSign, Calendar } from 'lucide-react';
import type { Product } from '../lib/api';
import { useCart } from '../lib/CartContext';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

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
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedWaistSize, setSelectedWaistSize] = useState<string>('');
  const [selectedScale, setSelectedScale] = useState<string>('');

  if (!product) return null;

  const isOutOfStock = product.stockQuantity === 0;
  const isLowStock = product.stockQuantity !== undefined && product.stockQuantity > 0 && product.stockQuantity < 10;

  // Check if product requires variant selection
  const hasClothingSizes = product.sizes && product.sizes.length > 0;
  const hasWaistSizes = product.waistSizes && product.waistSizes.length > 0;
  const hasModelCarScale = product.modelCarScale;

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    
    // Validate variant selection
    if (hasClothingSizes && !selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (hasWaistSizes && !selectedWaistSize) {
      toast.error('Please select a waist size');
      return;
    }
    
    addToCart(product, 1, {
      size: selectedSize,
      waistSize: selectedWaistSize,
      scale: hasModelCarScale ? product.modelCarScale : undefined,
    });
    toast.success('Added to cart!', {
      description: `${product.name}${selectedSize ? ` (Size: ${selectedSize})` : ''}${selectedWaistSize ? ` (Waist: ${selectedWaistSize}")` : ''} has been added to your cart.`,
    });
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
          {/* Product Image */}
          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            
            {/* Stock Status Badge */}
            {isOutOfStock && (
              <Badge className="absolute top-4 right-4 bg-gray-800 text-white text-sm">
                Out of Stock
              </Badge>
            )}
            {isLowStock && (
              <Badge className="absolute top-4 right-4 bg-orange-600 text-white text-sm">
                Only {product.stockQuantity} left!
              </Badge>
            )}
            
            {product.isClearance && !isOutOfStock && (
              <Badge className="absolute top-4 right-4 bg-red-600 text-white">
                Clearance
              </Badge>
            )}
            {product.team && (
              <Badge className="absolute top-4 left-4 bg-black text-white">
                {product.team}
              </Badge>
            )}
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl font-bold text-red-600">
                  LKR {product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-gray-500 line-through">
                    LKR {product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              {product.originalPrice && (
                <p className="text-sm text-green-600 font-medium">
                  Save LKR {(product.originalPrice - product.price).toFixed(2)} (
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF)
                </p>
              )}
            </div>

            {/* Variant Selection - Clothing Sizes */}
            {hasClothingSizes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes!.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedSize === size
                          ? 'border-[#FF2800] bg-[#FF2800] text-white'
                          : 'border-gray-300 hover:border-[#FF2800] text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selection - Waist Sizes */}
            {hasWaistSizes && (
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Select Waist Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.waistSizes!.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedWaistSize(size)}
                      className={`px-4 py-2 rounded-lg border-2 font-medium transition-all ${
                        selectedWaistSize === size
                          ? 'border-[#FF2800] bg-[#FF2800] text-white'
                          : 'border-gray-300 hover:border-[#FF2800] text-gray-700'
                      }`}
                    >
                      {size}"
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Variant Selection - Model Car Scale */}
            {hasModelCarScale && (
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

            {/* Stock Availability */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg flex items-center gap-3">
              <Package className={`w-5 h-5 ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`} />
              <div>
                <p className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                  {isOutOfStock ? 'Out of Stock' : 'In Stock'}
                </p>
                {!isOutOfStock && product.stockQuantity !== undefined && (
                  <p className="text-sm text-gray-600">
                    {isLowStock ? `Hurry! Only ${product.stockQuantity} items remaining` : `${product.stockQuantity} available`}
                  </p>
                )}
                {isOutOfStock && (
                  <p className="text-sm text-gray-600">
                    This item is currently unavailable. Contact us for restock information.
                  </p>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-600">
                {product.description || 'Official F1 merchandise. High-quality product for true Formula 1 fans.'}
              </p>
            </div>

            {/* Product Info */}
            <div className="mb-6 space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Category:</span>
                <span className="font-medium">{product.category}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-gray-600">Gender:</span>
                <span className="font-medium capitalize">{product.gender}</span>
              </div>
              {product.team && (
                <div className="flex justify-between py-2 border-b">
                  <span className="text-gray-600">Team:</span>
                  <span className="font-medium">{product.team}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-auto space-y-3">
              <Button
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                size="lg"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
              </Button>
            </div>

            {/* Additional Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-xs text-gray-600">
                🛒 Add items to your cart and checkout when ready
              </p>
              <p className="text-xs text-gray-600 mt-1">
                🚚 Free shipping on orders over LKR 5,000
              </p>
              {isOutOfStock && (
                <p className="text-xs text-gray-600 mt-1">
                  📧 Want to be notified when back in stock? Message us!
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}