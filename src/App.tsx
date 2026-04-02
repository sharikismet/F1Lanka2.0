import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CartProvider } from './lib/CartContext';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <CartProvider>
      <RouterProvider router={router} />
      <Toaster />
    </CartProvider>
  );
}

export default App;
