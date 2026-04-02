import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { useState } from 'react';
import { createOrder } from '../lib/api';
import type { CartItem } from '../lib/CartContext';
import { toast } from 'sonner@2.0.3';
import { useCart } from '../lib/CartContext';
import { Loader2 } from 'lucide-react';

interface DirectCheckoutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cartItems: CartItem[];
  totalPrice: number;
}

export function DirectCheckoutDialog({
  open,
  onOpenChange,
  cartItems,
  totalPrice,
}: DirectCheckoutDialogProps) {
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Prepare order data
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
          // Include variant information
          selectedSize: item.selectedSize,
          selectedWaistSize: item.selectedWaistSize,
          selectedScale: item.selectedScale,
        })),
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        shippingAddress: formData.shippingAddress,
        notes: formData.notes,
        totalAmount: totalPrice,
        status: 'pending' as const,
      };

      // Create order
      const order = await createOrder(orderData);

      if (order) {
        toast.success('Order placed successfully!', {
          description: 'We will contact you shortly to confirm your order.',
        });

        // Clear form and cart
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          shippingAddress: '',
          notes: '',
        });
        clearCart();
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Error placing order:', error);
      
      let errorMessage = 'Please try again later.';
      
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        errorMessage = 'Cannot connect to server. Please check your internet connection or try again later.';
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast.error('Failed to place order', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Direct Checkout</DialogTitle>
          <DialogDescription>
            Fill in your details and we'll contact you to confirm your order
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Order Summary</h3>
            <div className="space-y-2 mb-3">
              {cartItems.map((item, idx) => (
                <div key={`${item.id}-${idx}`}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="font-medium">
                      LKR {(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                  {/* Show variant info */}
                  {(item.selectedSize || item.selectedWaistSize || item.selectedScale) && (
                    <div className="text-xs text-gray-500 ml-4">
                      {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                      {item.selectedWaistSize && <span>Waist: {item.selectedWaistSize}"</span>}
                      {item.selectedScale && <span>Scale: {item.selectedScale}</span>}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-red-600">LKR {totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Customer Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                type="text"
                required
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="John Doe"
              />
            </div>

            <div>
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                required
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder="+94 77 123 4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="customerEmail">Email Address *</Label>
            <Input
              id="customerEmail"
              type="email"
              required
              value={formData.customerEmail}
              onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
              placeholder="john@example.com"
            />
          </div>

          <div>
            <Label htmlFor="shippingAddress">Shipping Address *</Label>
            <Textarea
              id="shippingAddress"
              required
              value={formData.shippingAddress}
              onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
              placeholder="Enter your full shipping address including street, city, and postal code"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any special instructions or preferences?"
              rows={2}
            />
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>📞 What happens next?</strong>
            </p>
            <p className="text-sm text-blue-700 mt-1">
              1. We'll receive your order immediately<br />
              2. Our team will contact you within 24 hours to confirm<br />
              3. We'll arrange payment and shipping details<br />
              4. Your F1 merchandise will be on its way! 🏎️
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Placing Order...
                </>
              ) : (
                'Place Order'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}