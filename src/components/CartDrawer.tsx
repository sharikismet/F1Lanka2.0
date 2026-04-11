import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';
import { Button } from './ui/button';
import { useCart } from '../lib/CartContext';
import { Plus, Minus, Trash2, ShoppingCart, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { DirectCheckoutDialog } from './DirectCheckoutDialog';
import { Badge } from './ui/badge';

interface CartDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  whatsappNumber: string;
}

export function CartDrawer({ open, onOpenChange, whatsappNumber }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  const [showDirectCheckout, setShowDirectCheckout] = useState(false);

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
    
    // Optionally clear cart after checkout
    // clearCart();
  };
  
  const handleDirectCheckout = () => {
    setShowDirectCheckout(true);
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Shopping Cart
              {totalItems > 0 && (
                <Badge className="ml-2">{totalItems} items</Badge>
              )}
            </SheetTitle>
            <SheetDescription>
              Review your items and proceed to checkout
            </SheetDescription>
          </SheetHeader>

          <div className="mt-8">
            {/* Empty Cart */}
            {items.length === 0 && (
              <div className="text-center py-16">
                <ShoppingCart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg mb-2">Your cart is empty</p>
                <p className="text-gray-400 text-sm">Add some awesome F1 merchandise!</p>
              </div>
            )}

            {/* Cart Items */}
            {items.length > 0 && (
              <>
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 mb-1">
                          {item.name}
                        </h3>
                        {/* Variant Info */}
                        {(item.selectedSize || item.selectedWaistSize || item.selectedScale) && (
                          <p className="text-xs text-gray-600 mb-1">
                            {item.selectedSize && <span className="font-medium">Size: {item.selectedSize}</span>}
                            {item.selectedWaistSize && <span className="font-medium">Waist: {item.selectedWaistSize}"</span>}
                            {item.selectedScale && <span className="font-medium">Scale: {item.selectedScale}</span>}
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
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.stockQuantity !== undefined && item.quantity >= item.stockQuantity}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>

                          {/* Remove Button */}
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 ml-auto text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Stock Warning */}
                        {item.stockQuantity !== undefined && item.quantity >= item.stockQuantity && (
                          <p className="text-xs text-orange-600 mt-1">
                            Maximum stock reached
                          </p>
                        )}
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="font-bold text-sm">
                          LKR {(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cart Summary */}
                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal ({totalItems} items)</span>
                    <span className="font-medium">LKR {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2 text-sm text-gray-500">
                    <span>Shipping</span>
                    <span>{totalPrice >= 5000 ? 'FREE' : 'Calculated at checkout'}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-red-600">LKR {totalPrice.toFixed(2)}</span>
                  </div>

                  {totalPrice >= 5000 && (
                    <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                      🎉 You qualify for FREE shipping!
                    </p>
                  )}
                </div>

                {/* Checkout Buttons */}
                <div className="space-y-3">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="lg"
                    onClick={handleWhatsAppCheckout}
                  >
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Checkout via WhatsApp
                  </Button>

                  <Button
                    className="w-full"
                    variant="outline"
                    size="lg"
                    onClick={handleDirectCheckout}
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Direct Checkout (No WhatsApp)
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-gray-600"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>

                {/* Info Messages */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg space-y-2">
                  <p className="text-xs text-gray-600">
                    💬 <strong>WhatsApp Checkout:</strong> Send your order directly to us via WhatsApp
                  </p>
                  <p className="text-xs text-gray-600">
                    🛒 <strong>Direct Checkout:</strong> Fill in your details and we'll contact you to confirm
                  </p>
                  <p className="text-xs text-gray-600">
                    🚚 Free shipping on orders over LKR 5,000
                  </p>
                </div>
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Direct Checkout Dialog */}
      <DirectCheckoutDialog
        open={showDirectCheckout}
        onOpenChange={setShowDirectCheckout}
        cartItems={items}
        totalPrice={totalPrice}
      />
    </>
  );
}