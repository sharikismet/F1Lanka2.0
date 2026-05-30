import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { useCart } from '../lib/CartContext';
import { Plus, Minus, Trash2, ShoppingCart, MessageCircle } from 'lucide-react';
import { Badge } from './ui/badge';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  whatsappNumber: string;
}

export function CartDrawer({ open, onOpenChange, whatsappNumber }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();

  const handleWhatsAppCheckout = () => {
    if (items.length === 0) return;

    // Use single \n for line breaks and * for WhatsApp bold formatting
    let message = `*New Order Request*\n\n`;
    
    items.forEach((item, index) => {
      message += `*${index + 1}. ${item.name}*\n`;
      
      // Add variant info if present
      if (item.selectedSize) message += `  • Size: ${item.selectedSize}\n`;
      if (item.selectedWaistSize) message += `  • Waist Size: ${item.selectedWaistSize}"\n`;
      if (item.selectedScale) message += `  • Scale: ${item.selectedScale}\n`;
      
      message += `  • Quantity: ${item.quantity}\n`;
      message += `  • Price: LKR ${item.price.toFixed(2)} each\n`;
      message += `  • Subtotal: LKR ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `*Total Items:* ${totalItems}\n`;
    message += `*Total Amount:* LKR ${totalPrice.toFixed(2)}\n\n`;
    message += `Please confirm availability and provide payment details. Thank you!`;

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* 🚨 FIX: Applied dark theme styling to the SheetContent */}
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto bg-[#0a0a0c] border-l border-white/10 text-white">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2 text-white">
            <ShoppingCart className="w-5 h-5 text-[#FF2800]" />
            Shopping Cart
            {totalItems > 0 && (
              <Badge className="ml-2 bg-[#FF2800] text-white border-none">{totalItems} items</Badge>
            )}
          </SheetTitle>
          <SheetDescription className="text-gray-400">
            Review your items and proceed to checkout
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8">
          {/* Empty Cart */}
          {items.length === 0 && (
            <div className="text-center py-16">
              <ShoppingCart className="w-16 h-16 mx-auto text-gray-700 mb-4" />
              <p className="text-gray-400 text-lg mb-2">Your cart is empty</p>
              <p className="text-gray-500 text-sm font-mono tracking-widest uppercase">Add some F1 merchandise</p>
            </div>
          )}

          {/* Cart Items */}
          {items.length > 0 && (
            <>
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 bg-[#121216] border border-white/5 rounded-lg">
                    {/* Product Image */}
                    <div className="w-20 h-20 bg-[#0a0a0c] rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm text-white line-clamp-2 mb-1">
                        {item.name}
                      </h3>
                      {/* Variant Info */}
                      {(item.selectedSize || item.selectedWaistSize || item.selectedScale) && (
                        <p className="text-xs text-gray-400 mb-1">
                          {item.selectedSize && <span className="font-medium text-gray-300 mr-2">Size: {item.selectedSize}</span>}
                          {item.selectedWaistSize && <span className="font-medium text-gray-300 mr-2">Waist: {item.selectedWaistSize}"</span>}
                          {item.selectedScale && <span className="font-medium text-gray-300">Scale: {item.selectedScale}</span>}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mb-2">
                        LKR {item.price.toFixed(2)} each
                      </p>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-white/10 bg-transparent hover:bg-white/10 text-white"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center font-medium text-white">
                          {item.quantity}
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 w-8 p-0 border-white/10 bg-transparent hover:bg-white/10 text-white"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={(() => {
                            const variantKey = item.selectedSize || item.selectedWaistSize || item.selectedScale;
                            const maxStock = (item.variantStock && variantKey) 
                              ? item.variantStock[variantKey] 
                              : item.stockQuantity;
                            return maxStock !== undefined && item.quantity >= maxStock;
                          })()}
                        >
                          <Plus className="w-3 h-3" />
                        </Button>

                        {/* Remove Button */}
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 ml-auto text-red-500 hover:text-red-400 hover:bg-red-500/10"
                          onClick={() => removeFromCart(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Stock Warning */}
                      {item.stockQuantity !== undefined && item.quantity >= item.stockQuantity && (
                        <p className="text-xs text-[#cba153] mt-2 font-mono uppercase tracking-widest">
                          Maximum stock reached
                        </p>
                      )}
                    </div>

                    {/* Subtotal */}
                    <div className="text-right">
                      <p className="font-bold text-sm text-white">
                        LKR {(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t border-white/10 pt-4 mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-400">Subtotal ({totalItems} items)</span>
                  <span className="font-medium text-white">LKR {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2 text-sm text-gray-500">
                  <span>Shipping</span>
                  <span>{totalPrice >= 5000 ? 'FREE' : 'Calculated at checkout'}</span>
                </div>
                <div className="flex justify-between text-lg font-bold border-t border-white/10 pt-2 mt-2">
                  <span className="text-white">Total</span>
                  <span className="text-[#FF2800]">LKR {totalPrice.toFixed(2)}</span>
                </div>

                {totalPrice >= 5000 && (
                  <p className="text-sm text-[#25D366] mt-2 flex items-center gap-1">
                    🎉 You qualify for FREE shipping!
                  </p>
                )}
              </div>

              {/* Checkout Buttons */}
              <div className="space-y-3">
                {/* 🚨 FIX: WhatsApp is now the sole checkout button */}
                <Button
                  className="w-full h-14 bg-[#25D366] hover:bg-[#1DA851] text-white shadow-[0_0_20px_rgba(37,211,102,0.15)] rounded-sm font-mono uppercase tracking-widest text-xs transition-colors"
                  size="lg"
                  onClick={handleWhatsAppCheckout}
                >
                  <MessageCircle className="w-5 h-5 mr-3" />
                  Checkout via WhatsApp
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-gray-500 hover:text-white hover:bg-white/5 uppercase font-mono tracking-widest text-xs"
                  onClick={clearCart}
                >
                  Clear Cart
                </Button>
              </div>

              {/* Info Messages */}
              <div className="mt-6 p-4 bg-white/5 border border-white/5 rounded-lg space-y-2">
                <p className="text-xs text-gray-400">
                  💬 <strong className="text-gray-200">WhatsApp Checkout:</strong> Send your order directly to us via WhatsApp for quick processing.
                </p>
                <p className="text-xs text-gray-400">
                  🚚 <strong className="text-gray-200">Free shipping</strong> on orders over LKR 5,000.
                </p>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}