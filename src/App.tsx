import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './lib/CartContext';
import { Toaster } from './components/ui/sonner';
import { SpeedInsights } from '@vercel/speed-insights/react';

function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
      <Toaster />
      <SpeedInsights />
    </CartProvider>
  );
}

export default App;
