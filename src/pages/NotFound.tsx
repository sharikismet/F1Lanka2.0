import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#FF2800] mb-4">404</h1>
        <p className="text-2xl font-semibold text-gray-900 mb-2">Page Not Found</p>
        <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
        <Button 
          onClick={() => navigate('/')}
          className="bg-[#FF2800] hover:bg-[#E02400] text-white"
        >
          Back to Store
        </Button>
      </div>
    </div>
  );
}
