import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

export function Footer() {
  const [activeDialog, setActiveDialog] = useState<string | null>(null);

  const openDialog = (type: string) => {
    setActiveDialog(type);
  };

  const closeDialog = () => {
    setActiveDialog(null);
  };

  return (
    <>
      <footer className="border-t mt-16 bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          {/* Footer Links */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="font-bold text-gray-900 mb-3">F1 Lanka</h3>
              <p className="text-sm text-gray-600">
                Your premier destination for authentic Formula 1 merchandise in Sri Lanka.
              </p>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Customer Service</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <button onClick={() => openDialog('shipping')} className="hover:text-gray-900">
                    Shipping & Delivery
                  </button>
                </li>
                <li>
                  <button onClick={() => openDialog('returns')} className="hover:text-gray-900">
                    Returns & Refunds
                  </button>
                </li>
                <li>
                  <a href={`https://wa.me/94710773717`} className="hover:text-gray-900">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <button onClick={() => openDialog('privacy')} className="hover:text-gray-900">
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button onClick={() => openDialog('terms')} className="hover:text-gray-900">
                    Terms & Conditions
                  </button>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>Sri Lanka</li>
                <li>WhatsApp: +94 71 077 3717</li>
                <li>Email: f1lankabusiness@gmail.com</li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t pt-6 text-center text-sm text-gray-600">
            <p>© 2026 F1 Lanka. All rights reserved.</p>
            <p className="mt-1 text-xs">Bringing the Formula 1 Experience to Sri Lanka</p>
          </div>
        </div>
      </footer>

      {/* Privacy Policy Dialog */}
      <Dialog open={activeDialog === 'privacy'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Privacy Policy</DialogTitle>
            <DialogDescription>Last Updated: February 28, 2026</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="font-semibold text-base mb-2">1. Introduction</h3>
                <p className="text-gray-600">
                  F1 Lanka ("we," "our," or "us") respects your privacy and is committed to protecting your personal data. 
                  This privacy policy complies with the Personal Data Protection Act No. 9 of 2022 of Sri Lanka and will inform 
                  you about how we collect, use, and safeguard your personal information.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">2. Information We Collect</h3>
                <p className="text-gray-600 mb-2">We collect the following information:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Name and contact details (phone number, email address)</li>
                  <li>Shipping address for delivery purposes</li>
                  <li>Order history and purchase information</li>
                  <li>Payment information (processed securely, not stored by us)</li>
                  <li>Communication preferences</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">3. How We Use Your Information</h3>
                <p className="text-gray-600 mb-2">Your information is used to:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Process and fulfill your orders</li>
                  <li>Communicate order status and delivery updates</li>
                  <li>Provide customer support via WhatsApp or email</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional offers (with your consent)</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">4. Data Protection</h3>
                <p className="text-gray-600">
                  We implement appropriate security measures to protect your personal data from unauthorized access, 
                  alteration, disclosure, or destruction. Your data is stored securely and accessed only by authorized personnel.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">5. Third-Party Sharing</h3>
                <p className="text-gray-600">
                  We do not sell or rent your personal information to third parties. We may share your data with:
                </p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Delivery partners for order fulfillment</li>
                  <li>Payment processors for transaction processing</li>
                  <li>Legal authorities when required by law</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">6. Your Rights</h3>
                <p className="text-gray-600 mb-2">Under Sri Lankan law, you have the right to:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Access your personal data</li>
                  <li>Request correction of inaccurate data</li>
                  <li>Request deletion of your data</li>
                  <li>Withdraw consent for marketing communications</li>
                  <li>Lodge a complaint with the Data Protection Authority of Sri Lanka</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">7. Contact Us</h3>
                <p className="text-gray-600">
                  For privacy-related inquiries, contact us at: f1lankabusiness@gmail.com or WhatsApp: +94 71 077 3717
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Terms & Conditions Dialog */}
      <Dialog open={activeDialog === 'terms'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Terms & Conditions</DialogTitle>
            <DialogDescription>Last Updated: February 28, 2026</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="font-semibold text-base mb-2">1. Acceptance of Terms</h3>
                <p className="text-gray-600">
                  By accessing and using F1 Lanka's website and services, you agree to be bound by these Terms and Conditions. 
                  These terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">2. Products and Pricing</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>All prices are displayed in Sri Lankan Rupees (LKR)</li>
                  <li>Product images are for illustration purposes and may vary slightly from actual products</li>
                  <li>We reserve the right to modify prices without prior notice</li>
                  <li>All products are subject to availability</li>
                  <li>We reserve the right to limit order quantities</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">3. Orders and Payment</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Orders can be placed via WhatsApp or our online checkout system</li>
                  <li>Payment must be completed before order dispatch</li>
                  <li>Accepted payment methods include bank transfer, cash on delivery, and online payment gateways</li>
                  <li>Order confirmation will be sent via WhatsApp or email</li>
                  <li>We reserve the right to cancel orders for any reason</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">4. Intellectual Property</h3>
                <p className="text-gray-600">
                  All content, trademarks, and logos are property of F1 Lanka or licensed partners. Unauthorized use, 
                  reproduction, or distribution is strictly prohibited under Sri Lankan copyright law.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">5. Limitation of Liability</h3>
                <p className="text-gray-600">
                  F1 Lanka is not liable for indirect, incidental, or consequential damages arising from product use. 
                  Our liability is limited to the purchase price of the product in accordance with Sri Lankan consumer protection laws.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">6. Dispute Resolution</h3>
                <p className="text-gray-600">
                  Any disputes will be resolved through good-faith negotiation. If unresolved, disputes shall be subject to 
                  the exclusive jurisdiction of the courts of Sri Lanka.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">7. Contact Information</h3>
                <p className="text-gray-600">
                  For questions about these terms, contact us at: f1lankabusiness@gmail.com or WhatsApp: +94 71 077 3717
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Shipping & Delivery Dialog */}
      <Dialog open={activeDialog === 'shipping'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Shipping & Delivery Policy</DialogTitle>
            <DialogDescription>Delivering across Sri Lanka</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="font-semibold text-base mb-2">1. Delivery Coverage</h3>
                <p className="text-gray-600">
                  We deliver to all areas within Sri Lanka, including Colombo, Gampaha, Kandy, Galle, Jaffna, and remote areas.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">2. Delivery Timeframes</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li><strong>Colombo & Suburbs:</strong> 1-2 business days</li>
                  <li><strong>Major Cities:</strong> 2-4 business days</li>
                  <li><strong>Remote Areas:</strong> 4-7 business days</li>
                  <li>Express delivery options available upon request</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">3. Shipping Charges</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Shipping costs calculated based on location and order weight</li>
                  <li>Free shipping on orders above LKR 10,000 (within Colombo)</li>
                  <li>Shipping charges displayed at checkout before payment</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">4. Order Tracking</h3>
                <p className="text-gray-600">
                  Once your order is dispatched, you'll receive tracking information via WhatsApp or email. 
                  You can track your order status in real-time.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">5. Delivery Partners</h3>
                <p className="text-gray-600">
                  We work with trusted courier services including Pronto, DHL, and local delivery partners to ensure 
                  safe and timely delivery of your merchandise.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">6. Failed Delivery</h3>
                <p className="text-gray-600">
                  If delivery fails due to incorrect address or unavailability, we'll contact you to arrange redelivery. 
                  Additional charges may apply for redelivery attempts.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">7. Contact for Shipping Inquiries</h3>
                <p className="text-gray-600">
                  WhatsApp: +94 71 077 3717 | Email: f1lankabusiness@gmail.com
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Returns & Refunds Dialog */}
      <Dialog open={activeDialog === 'returns'} onOpenChange={closeDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Returns & Refunds Policy</DialogTitle>
            <DialogDescription>Your satisfaction is our priority</DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="space-y-4 text-sm">
              <section>
                <h3 className="font-semibold text-base mb-2">1. Return Eligibility</h3>
                <p className="text-gray-600 mb-2">Products can be returned within 7 days of delivery if:</p>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Product is defective or damaged upon arrival</li>
                  <li>Wrong item was delivered</li>
                  <li>Product is unused, unworn, and in original packaging with all tags attached</li>
                  <li>You have proof of purchase (receipt or order confirmation)</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">2. Non-Returnable Items</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Custom or personalized items</li>
                  <li>Items marked as "Clearance" or "Final Sale"</li>
                  <li>Underwear and intimate apparel (for hygiene reasons)</li>
                  <li>Items without original packaging or tags</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">3. Return Process</h3>
                <ol className="list-decimal pl-5 text-gray-600 space-y-1">
                  <li>Contact us via WhatsApp (+94 71 077 3717) or email within 7 days</li>
                  <li>Provide order number, photos of the item, and reason for return</li>
                  <li>We'll review and approve your return request within 24-48 hours</li>
                  <li>Ship the item back to our address (we'll provide pickup for defective items)</li>
                  <li>Refund will be processed within 7-10 business days after receiving the item</li>
                </ol>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">4. Refund Methods</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li>Original payment method (bank transfer, online payment)</li>
                  <li>Store credit for future purchases</li>
                  <li>Exchange for a different size or product</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">5. Return Shipping Costs</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  <li><strong>Defective/Wrong Item:</strong> We cover return shipping</li>
                  <li><strong>Change of Mind:</strong> Customer covers return shipping</li>
                  <li>We'll arrange pickup for defective items at no cost to you</li>
                </ul>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">6. Exchanges</h3>
                <p className="text-gray-600">
                  We gladly exchange items for different sizes or colors (subject to availability). 
                  Contact us to arrange an exchange. Exchanges are processed faster than refunds.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">7. Damaged or Defective Items</h3>
                <p className="text-gray-600">
                  If you receive a damaged or defective item, contact us immediately with photos. 
                  We'll arrange immediate replacement or full refund, including shipping costs.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">8. Consumer Rights</h3>
                <p className="text-gray-600">
                  This policy complies with the Consumer Affairs Authority Act of Sri Lanka. 
                  Your statutory rights are not affected by this policy.
                </p>
              </section>

              <section>
                <h3 className="font-semibold text-base mb-2">9. Contact for Returns</h3>
                <p className="text-gray-600">
                  WhatsApp: +94 71 077 3717 | Email: f1lankabusiness@gmail.com
                </p>
              </section>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}
