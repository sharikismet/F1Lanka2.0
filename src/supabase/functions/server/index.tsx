import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const BUCKET_NAME = 'make-a97df12b-product-images';

// Ensure storage bucket exists on startup
(async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some((bucket: any) => bucket.name === BUCKET_NAME);
    if (!bucketExists) {
      await supabase.storage.createBucket(BUCKET_NAME, { public: false });
      console.log('Created storage bucket:', BUCKET_NAME);
    }
  } catch (e) {
    console.log('Error creating bucket:', e);
  }
})();

// Auth middleware - protect admin routes
async function requireAuth(c: any, next: any) {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  // Check for user token in custom header (used to bypass Supabase gateway JWT validation)
  const userToken = c.req.header('X-User-Token');
  const method = c.req.method;

  // For write operations (POST, PUT, DELETE), require a valid user token
  if (['POST', 'PUT', 'DELETE'].includes(method)) {
    if (!userToken) {
      console.log(`Blocked ${method} request - no user token provided`);
      return c.json({ 
        error: 'Authentication required for this action',
        message: 'Admin login is required to modify data'
      }, 403);
    }

    // Verify the user token
    const { data: { user }, error } = await supabase.auth.getUser(userToken);
    
    if (error || !user) {
      console.log('Auth error:', error);
      return c.json({ 
        error: 'Unauthorized - Invalid user token',
        details: error?.message 
      }, 401);
    }

    // Store user in context for later use
    c.set('user', user);
    return next();
  }

  // For GET requests, allow public access
  return next();
}

// Health check
app.get('/make-server-a97df12b/health', (c) => {
  return c.json({ status: 'ok', message: 'F1 Store server is running' });
});

// ============================================
// PRODUCTS ROUTES
// ============================================

// Get all products with optional filters
app.get('/make-server-a97df12b/products', async (c) => {
  try {
    const category = c.req.query('category');
    const gender = c.req.query('gender');
    
    // Get all products from KV store
    const products = await kv.getByPrefix('product:');
    
    // Filter products if needed
    let filteredProducts = products;
    
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category === category);
    }
    
    if (gender && gender !== 'all') {
      filteredProducts = filteredProducts.filter(p => p.gender === gender || p.gender === 'all');
    }
    
    return c.json({ products: filteredProducts });
  } catch (error) {
    console.log('Error fetching products:', error);
    return c.json({ error: 'Failed to fetch products', details: String(error) }, 500);
  }
});

// Get single product by ID
app.get('/make-server-a97df12b/products/:id', async (c) => {
  try {
    const id = c.req.param('id');
    const product = await kv.get(`product:${id}`);
    
    if (!product) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    return c.json({ product });
  } catch (error) {
    console.log('Error fetching product:', error);
    return c.json({ error: 'Failed to fetch product', details: String(error) }, 500);
  }
});

// Create a new product
app.post('/make-server-a97df12b/products', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required to create products' }, 401);
    }

    const body = await c.req.json();
    const { name, price, originalPrice, image, category, gender, isClearance, team, description, stockQuantity } = body;
    
    // Validate required fields
    if (!name || !price || !image || !category || !gender) {
      return c.json({ error: 'Missing required fields: name, price, image, category, gender' }, 400);
    }
    
    // Generate unique ID
    const id = crypto.randomUUID();
    
    const product = {
      id,
      name,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      image,
      category,
      gender,
      isClearance: isClearance || false,
      team: team || undefined,
      driver: body.driver || undefined,
      description: description || undefined,
      stockQuantity: stockQuantity !== undefined ? parseInt(stockQuantity) : 100,
      sizes: body.sizes || undefined,
      waistSizes: body.waistSizes || undefined,
      modelCarScale: body.modelCarScale || undefined,
      material: body.material || undefined,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    };
    
    await kv.set(`product:${id}`, product);
    
    return c.json({ message: 'Product created successfully', product }, 201);
  } catch (error) {
    console.log('Error creating product:', error);
    return c.json({ error: 'Failed to create product', details: String(error) }, 500);
  }
});

// Update a product
app.put('/make-server-a97df12b/products/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required to update products' }, 401);
    }

    const id = c.req.param('id');
    const body = await c.req.json();
    
    // Check if product exists
    const existingProduct = await kv.get(`product:${id}`);
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    // Update product
    const updatedProduct = {
      ...existingProduct,
      ...body,
      id, // Ensure ID doesn't change
      updatedAt: new Date().toISOString(),
      updatedBy: user.id,
    };
    
    await kv.set(`product:${id}`, updatedProduct);
    
    return c.json({ message: 'Product updated successfully', product: updatedProduct });
  } catch (error) {
    console.log('Error updating product:', error);
    return c.json({ error: 'Failed to update product', details: String(error) }, 500);
  }
});

// Delete a product
app.delete('/make-server-a97df12b/products/:id', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required to delete products' }, 401);
    }

    const id = c.req.param('id');
    
    // Check if product exists
    const existingProduct = await kv.get(`product:${id}`);
    if (!existingProduct) {
      return c.json({ error: 'Product not found' }, 404);
    }
    
    await kv.del(`product:${id}`);
    
    return c.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.log('Error deleting product:', error);
    return c.json({ error: 'Failed to delete product', details: String(error) }, 500);
  }
});

// Get all categories
app.get('/make-server-a97df12b/categories', async (c) => {
  try {
    const products = await kv.getByPrefix('product:');
    const categories = [...new Set(products.map(p => p.category))];
    
    return c.json({ categories });
  } catch (error) {
    console.log('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories', details: String(error) }, 500);
  }
});

// Initialize sample data (run once to populate database)
app.post('/make-server-a97df12b/init-sample-data', async (c) => {
  try {
    const sampleProducts = [
      {
        id: '1',
        name: 'Scuderia Ferrari 2025 Drivers Oversized T-Shirt - Red',
        price: 40.00,
        originalPrice: 81.00,
        image: 'https://images.unsplash.com/photo-1763558134668-e185bbab7aca?w=1080',
        category: 'T-Shirts',
        gender: 'men',
        isClearance: true,
        team: 'Ferrari',
        description: 'Official Ferrari racing team t-shirt',
        stockQuantity: 25,
      },
      {
        id: '2',
        name: 'Scuderia Ferrari 2025 Team Charles Leclerc Cap - White',
        price: 24.00,
        originalPrice: 41.00,
        image: 'https://images.unsplash.com/photo-1752348512163-68e894f22046?w=1080',
        category: 'Caps & Hats',
        gender: 'all',
        isClearance: true,
        team: 'Ferrari',
        description: 'Charles Leclerc signature cap',
        stockQuantity: 50,
      },
      {
        id: '3',
        name: 'Mercedes AMG Petronas Team Hoodie - Black',
        price: 75.00,
        image: 'https://images.unsplash.com/photo-1614214191247-5b2d3a734f1b?w=1080',
        category: 'Hoodies & Sweatshirts',
        gender: 'men',
        team: 'Mercedes',
        description: 'Official Mercedes F1 team hoodie',
        stockQuantity: 15,
      },
      {
        id: '4',
        name: 'Ferrari SF-23 1:18 Scale Model Car',
        price: 89.00,
        image: 'https://images.unsplash.com/photo-1752896596098-4f679e66ba15?w=1080',
        category: 'Model Cars',
        gender: 'all',
        team: 'Ferrari',
        description: 'Detailed 1:18 scale Ferrari model',
        stockQuantity: 10,
      },
      {
        id: '5',
        name: 'Mercedes AMG Track Pants - Black',
        price: 55.00,
        image: 'https://images.unsplash.com/photo-1765568562615-4bf854edcf1a?w=1080',
        category: 'Pants',
        gender: 'men',
        team: 'Mercedes',
        description: 'Mercedes racing track pants',
        stockQuantity: 30,
      },
      {
        id: '6',
        name: 'F1 Racing Sunglasses - Black',
        price: 35.00,
        image: 'https://images.unsplash.com/photo-1765146488719-c33cdd056b53?w=1080',
        category: 'Accessories',
        gender: 'all',
        description: 'Official F1 racing sunglasses',
        stockQuantity: 0, // Out of stock example
      },
    ];
    
    for (const product of sampleProducts) {
      await kv.set(`product:${product.id}`, {
        ...product,
        createdAt: new Date().toISOString(),
      });
    }
    
    return c.json({ 
      message: 'Sample data initialized successfully',
      productsCount: sampleProducts.length 
    });
  } catch (error) {
    console.log('Error initializing sample data:', error);
    return c.json({ error: 'Failed to initialize sample data', details: String(error) }, 500);
  }
});

// ============================================
// IMAGE UPLOAD ROUTE
// ============================================

app.post('/make-server-a97df12b/upload-image', requireAuth, async (c) => {
  try {
    const user = c.get('user');
    if (!user) {
      return c.json({ error: 'Authentication required to upload images' }, 401);
    }

    const formData = await c.req.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const ext = file.name.split('.').pop() || 'png';
    const fileName = `${crypto.randomUUID()}.${ext}`;
    const filePath = `products/${fileName}`;

    const arrayBuffer = await file.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, uint8Array, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.log('Upload error:', error);
      return c.json({ error: 'Failed to upload image', details: error.message }, 500);
    }

    // Create a signed URL (valid for 1 year)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, 60 * 60 * 24 * 365);

    if (signedUrlError) {
      console.log('Signed URL error:', signedUrlError);
      return c.json({ error: 'Failed to create signed URL', details: signedUrlError.message }, 500);
    }

    return c.json({ 
      message: 'Image uploaded successfully',
      url: signedUrlData.signedUrl,
      path: filePath,
    });
  } catch (error) {
    console.log('Error uploading image:', error);
    return c.json({ error: 'Failed to upload image', details: String(error) }, 500);
  }
});

// ============================================
// AUTH ROUTES
// ============================================

// Sign up admin user
app.post('/make-server-a97df12b/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();
    
    if (!email || !password) {
      return c.json({ error: 'Email and password required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || 'Admin' },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ 
      message: 'User created successfully',
      user: data.user 
    }, 201);
  } catch (error) {
    console.log('Error in signup:', error);
    return c.json({ error: 'Failed to create user', details: String(error) }, 500);
  }
});

// ============================================
// ORDER MANAGEMENT ROUTES
// ============================================

// Create a new order
app.post('/make-server-a97df12b/orders', async (c) => {
  try {
    const body = await c.req.json();
    const { items, customerName, customerPhone, customerEmail, shippingAddress, notes, totalAmount, status } = body;
    
    console.log('Creating order with data:', { customerName, customerPhone, itemCount: items?.length, totalAmount });
    
    if (!items || !customerName || !customerPhone || !totalAmount) {
      console.log('Missing required fields:', { 
        hasItems: !!items, 
        hasCustomerName: !!customerName, 
        hasCustomerPhone: !!customerPhone, 
        hasTotalAmount: !!totalAmount 
      });
      return c.json({ error: 'Missing required fields: items, customerName, customerPhone, totalAmount' }, 400);
    }

    if (!Array.isArray(items) || items.length === 0) {
      console.log('Invalid items array:', items);
      return c.json({ error: 'Items must be a non-empty array' }, 400);
    }

    const id = crypto.randomUUID();
    
    const order = {
      id,
      items, // Array of { productId, productName, quantity, price }
      customerName,
      customerPhone,
      customerEmail: customerEmail || '',
      shippingAddress: shippingAddress || '',
      notes: notes || '',
      totalAmount: parseFloat(totalAmount),
      status: status || 'pending', // pending, confirmed, shipped, delivered, cancelled
      createdAt: new Date().toISOString(),
    };

    console.log('Saving order to KV store:', order.id);
    await kv.set(`order:${id}`, order);
    console.log('Order saved successfully:', order.id);

    return c.json({ message: 'Order created successfully', order }, 201);
  } catch (error) {
    console.log('Error creating order:', error);
    console.log('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return c.json({ error: 'Failed to create order', details: String(error) }, 500);
  }
});

// Get all orders
app.get('/make-server-a97df12b/orders', requireAuth, async (c) => {
  try {
    const orders = await kv.getByPrefix('order:');
    // Sort by creation date, newest first
    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return c.json({ orders });
  } catch (error) {
    console.log('Error fetching orders:', error);
    return c.json({ error: 'Failed to fetch orders', details: String(error) }, 500);
  }
});

// Update order status
app.put('/make-server-a97df12b/orders/:id/status', requireAuth, async (c) => {
  try {
    const id = c.req.param('id');
    const { status } = await c.req.json();
    
    const existingOrder = await kv.get(`order:${id}`);
    if (!existingOrder) {
      return c.json({ error: 'Order not found' }, 404);
    }

    const updatedOrder = {
      ...existingOrder,
      status,
      updatedAt: new Date().toISOString(),
    };

    await kv.set(`order:${id}`, updatedOrder);

    return c.json({ message: 'Order status updated', order: updatedOrder });
  } catch (error) {
    console.log('Error updating order:', error);
    return c.json({ error: 'Failed to update order', details: String(error) }, 500);
  }
});

Deno.serve(app.fetch);