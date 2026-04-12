import { projectId, publicAnonKey } from '../utils/supabase/info';
import { getAccessToken } from './auth';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-a97df12b`;

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  gender: string;
  isClearance?: boolean;
  team?: string;
  driver?: string;
  description?: string;
  stockQuantity?: number;
  variantStock?: Record<string, number>; // <-- ADD THIS LINE
  // Product variants
  sizes?: string[];
  waistSizes?: string[];
  modelCarScale?: string;
  material?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }[];
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress?: string;
  notes?: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt?: string;
}

// Test server connection
export async function testServerConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${API_URL}/health`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      return {
        success: false,
        message: `Server responded with status ${response.status}: ${response.statusText}`
      };
    }
    
    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Server is running'
    };
  } catch (error) {
    console.error('Server connection test failed:', error);
    return {
      success: false,
      message: `Cannot connect to server: ${error instanceof Error ? error.message : 'Unknown error'}. The Supabase Edge Function may not be deployed yet.`
    };
  }
}

// Fetch all products with optional filters
export async function getProducts(category?: string, gender?: string): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (gender) params.append('gender', gender);
    
    const url = `${API_URL}/products${params.toString() ? `?${params.toString()}` : ''}`;
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Failed to fetch products: ${response.status} ${response.statusText}`, errorText);
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error - The Supabase Edge Function may not be deployed. URL:', `${API_URL}/products`);
    }
    return [];
  }
}

// Fetch single product by ID
export async function getProduct(id: string): Promise<Product | null> {
  try {
    const response = await fetch(`${API_URL}/products/${id}`, {
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      return null;
    }
    
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Create a new product
export async function createProduct(productData: Omit<Product, 'id'>): Promise<Product | null> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Token': accessToken || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to create product:', error);
      throw new Error(error.error || 'Failed to create product');
    }
    
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

// Update a product
export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Token': accessToken || '',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData),
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to update product:', error);
      throw new Error(error.error || 'Failed to update product');
    }
    
    const data = await response.json();
    return data.product;
  } catch (error) {
    console.error('Error updating product:', error);
    return null;
  }
}

// Delete a product
export async function deleteProduct(id: string): Promise<boolean> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Token': accessToken || '',
      },
    });
    
    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to delete product:', error);
      throw new Error(error.error || 'Failed to delete product');
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    return false;
  }
}

// Initialize sample data (call once to populate database)
export async function initSampleData(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/init-sample-data`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Failed to initialize sample data:', errorText);
      throw new Error('Failed to initialize sample data');
    }
    
    const data = await response.json();
    console.log('Sample data initialized:', data);
    return true;
  } catch (error) {
    console.error('Error initializing sample data:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error - The Supabase Edge Function may not be deployed. URL:', `${API_URL}/init-sample-data`);
    }
    return false;
  }
}

// ============================================
// ORDER MANAGEMENT
// ============================================

// Create a new order
export async function createOrder(orderData: Omit<Order, 'id' | 'createdAt'>): Promise<Order | null> {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Order creation failed:', response.status, response.statusText, errorText);
      let errorMessage = 'Failed to create order';
      try {
        const errorJson = JSON.parse(errorText);
        errorMessage = errorJson.error || errorMessage;
      } catch (e) {
        // If response is not JSON, use the text
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data.order;
  } catch (error) {
    console.error('Error creating order:', error);
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      console.error('Network error - The Supabase Edge Function may not be deployed. URL:', `${API_URL}/orders`);
    }
    throw error;
  }
}

// Get all orders (requires auth)
export async function getOrders(accessToken?: string): Promise<Order[]> {
  try {
    const token = accessToken || publicAnonKey;
    const response = await fetch(`${API_URL}/orders`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // If unauthorized, return empty array for now
      if (response.status === 401 || response.status === 403) {
        console.log('Orders require authentication');
        return [];
      }
      throw new Error('Failed to fetch orders');
    }

    const data = await response.json();
    return data.orders || [];
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

// Update order status (requires auth)
export async function updateOrderStatus(orderId: string, status: Order['status'], accessToken: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    return true;
  } catch (error) {
    console.error('Error updating order status:', error);
    return false;
  }
}

// Upload image to Supabase Storage
export async function uploadProductImage(file: File): Promise<string | null> {
  try {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error('No access token available for image upload. Please log in.');
      throw new Error('Not authenticated. Please log in first.');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/upload-image`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${publicAnonKey}`,
        'X-User-Token': accessToken,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Failed to upload image:', error);
      throw new Error(error.error || 'Failed to upload image');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
}