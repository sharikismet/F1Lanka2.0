import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { BarChart3, Package, ShoppingCart, TrendingUp, DollarSign, Plus, Search, Edit, Trash2, Download, Store, LogOut, ImagePlus, Loader2, Upload } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { getProducts, getOrders, createProduct, updateProduct, deleteProduct, uploadProductImage, type Product, type Order } from '../lib/api';
import { signIn, signOut, getSession } from '../lib/auth';

const F1_TEAMS = ['Red Bull', 'Ferrari', 'Mercedes', 'McLaren', 'Aston Martin', 'Alpine', 'Williams', 'AlphaTauri', 'Alfa Romeo', 'Haas'];
const F1_DRIVERS = ['Max Verstappen', 'Sergio Perez', 'Charles Leclerc', 'Carlos Sainz', 'Lewis Hamilton', 'George Russell', 'Lando Norris', 'Oscar Piastri'];
const CATEGORIES = ['T-Shirts', 'Hoodies', 'Pants', 'Caps', 'Accessories', 'Model Cars', 'Posters', 'Photo Cards', 'Keychains', 'Phone Cases'];
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const WAIST_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42'];
const MODEL_CAR_SCALES = ['1:18', '1:24', '1:43', '1:64'];
const MATERIALS = ['Die-cast', 'Resin', 'Plastic', 'Mixed'];

type AdminView = 'overview' | 'products' | 'orders';

const defaultProduct = {
  name: '', price: '', originalPrice: '', image: '', category: '', gender: 'all',
  team: '', driver: '', description: '', stockQuantity: '', isClearance: false,
  sizes: [] as string[], waistSizes: [] as string[], modelCarScale: '', material: '',
  variantStock: {} as Record<string, number>, // Added variant tracking
};

interface ProductFormContentProps {
  isEdit: boolean;
  newProduct: typeof defaultProduct;
  setNewProduct: React.Dispatch<React.SetStateAction<typeof defaultProduct>>;
  uploading: boolean;
  imagePreview: string;
  setImagePreview: React.Dispatch<React.SetStateAction<string>>;
  handleImageUpload: (file: File) => void;
  toggleSize: (size: string) => void;
  toggleWaistSize: (size: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ProductFormContent: React.FC<ProductFormContentProps> = ({
  isEdit,
  newProduct,
  setNewProduct,
  uploading,
  imagePreview,
  setImagePreview,
  handleImageUpload,
  toggleSize,
  toggleWaistSize,
  fileInputRef,
}) => {
  const shouldShowSizes = ['T-Shirts', 'Hoodies'].includes(newProduct.category);
  const shouldShowWaistSizes = newProduct.category === 'Pants';
  const shouldShowModelCarOptions = newProduct.category === 'Model Cars';

  // Helper to update individual variant stock
  const updateVariantStock = (variant: string, qty: number) => {
    setNewProduct(prev => ({
      ...prev,
      variantStock: {
        ...(prev.variantStock || {}),
        [variant]: qty
      }
    }));
  };

  return (
    <div className="grid gap-5 py-4">
      {/* Image Upload */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">Product Image</Label>
        <div className="flex gap-4 items-start">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-28 h-28 rounded-xl border-2 border-dashed border-gray-300 hover:border-[#FF2800] flex items-center justify-center cursor-pointer bg-gray-50 hover:bg-red-50 transition-all overflow-hidden flex-shrink-0"
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            ) : imagePreview || newProduct.image ? (
              <img src={imagePreview || newProduct.image} alt="Preview" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="text-center">
                <ImagePlus className="w-6 h-6 text-gray-400 mx-auto" />
                <span className="text-xs text-gray-400 mt-1 block">Upload</span>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
          <div className="flex-1 space-y-2">
            <Input
              placeholder="Or paste image URL"
              value={newProduct.image}
              onChange={(e) => {
                setNewProduct(prev => ({ ...prev, image: e.target.value }));
                setImagePreview(e.target.value);
              }}
              className="text-sm"
            />
            <p className="text-xs text-gray-400">Click the box to upload or paste a URL above</p>
          </div>
        </div>
      </div>

      <Separator />

      {/* Product Name */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Product Name *</Label>
        <Input
          placeholder="e.g. Ferrari 2025 Team T-Shirt"
          value={newProduct.name}
          onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
        />
      </div>

      {/* Category + Gender */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Category *</Label>
          <Select value={newProduct.category} onValueChange={(v) => setNewProduct(prev => ({ ...prev, category: v, sizes: [], waistSizes: [], modelCarScale: '', material: '' }))}>
            <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
              {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Gender</Label>
          <Select value={newProduct.gender} onValueChange={(v) => setNewProduct(prev => ({ ...prev, gender: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Unisex (All)</SelectItem>
              <SelectItem value="men">Men</SelectItem>
              <SelectItem value="women">Women</SelectItem>
              <SelectItem value="kids">Kids</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Sizes for T-Shirts / Hoodies */}
      {shouldShowSizes && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Available Sizes</Label>
          <div className="flex flex-col gap-2">
            {SIZES.map(size => {
              const isSelected = newProduct.sizes.includes(size);
              return (
                <div key={size} className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border w-16 text-center transition-all ${
                      isSelected
                        ? 'bg-[#FF2800] text-white border-[#FF2800]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#FF2800]'
                    }`}
                  >
                    {size}
                  </button>
                  
                  {/* Dynamic Stock Input for this specific size */}
                  {isSelected && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                      <Label className="text-xs text-gray-500 whitespace-nowrap">Stock:</Label>
                      <Input
                        type="number"
                        min="0"
                        className="w-24 h-8 text-sm"
                        value={newProduct.variantStock?.[size] ?? ''}
                        onChange={(e) => updateVariantStock(size, parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Waist Sizes for Pants */}
      {shouldShowWaistSizes && (
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Waist Sizes</Label>
          <div className="flex flex-col gap-2">
            {WAIST_SIZES.map(size => {
              const isSelected = newProduct.waistSizes.includes(size);
              return (
                <div key={size} className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => toggleWaistSize(size)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium border w-16 text-center transition-all ${
                      isSelected
                        ? 'bg-[#FF2800] text-white border-[#FF2800]'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-[#FF2800]'
                    }`}
                  >
                    {size}"
                  </button>

                  {/* Dynamic Stock Input for this specific waist size */}
                  {isSelected && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                      <Label className="text-xs text-gray-500 whitespace-nowrap">Stock:</Label>
                      <Input
                        type="number"
                        min="0"
                        className="w-24 h-8 text-sm"
                        value={newProduct.variantStock?.[size] ?? ''}
                        onChange={(e) => updateVariantStock(size, parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Model Car Options */}
      {shouldShowModelCarOptions && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <Label className="text-sm font-semibold">Scale</Label>
            <div className="flex flex-col gap-3">
              <Select value={newProduct.modelCarScale} onValueChange={(v) => setNewProduct(prev => ({ ...prev, modelCarScale: v }))}>
                <SelectTrigger><SelectValue placeholder="Select scale" /></SelectTrigger>
                <SelectContent>
                  {MODEL_CAR_SCALES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Dynamic Stock Input for the selected scale */}
              {newProduct.modelCarScale && (
                <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
                  <Label className="text-xs text-gray-500 whitespace-nowrap">Stock for {newProduct.modelCarScale}:</Label>
                  <Input
                    type="number"
                    min="0"
                    className="w-24 h-9 text-sm"
                    value={newProduct.variantStock?.[newProduct.modelCarScale] ?? ''}
                    onChange={(e) => updateVariantStock(newProduct.modelCarScale!, parseInt(e.target.value) || 0)}
                    placeholder="0"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Material</Label>
            <Select value={newProduct.material} onValueChange={(v) => setNewProduct(prev => ({ ...prev, material: v }))}>
              <SelectTrigger><SelectValue placeholder="Select material" /></SelectTrigger>
              <SelectContent>
                {MATERIALS.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <Separator />

      {/* Price + Stock */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Price (LKR) *</Label>
          <Input type="number" placeholder="e.g. 9000" value={newProduct.price} onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))} />
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">General Stock (Fallback) *</Label>
          <Input type="number" placeholder="e.g. 50" value={newProduct.stockQuantity} onChange={(e) => setNewProduct(prev => ({ ...prev, stockQuantity: e.target.value }))} />
        </div>
      </div>

      {/* Original Price + Clearance */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Original Price (for sale items)</Label>
          <Input type="number" placeholder="e.g. 12000" value={newProduct.originalPrice} onChange={(e) => setNewProduct(prev => ({ ...prev, originalPrice: e.target.value }))} />
        </div>
        <div className="space-y-2 flex items-end">
          <label className="flex items-center gap-2 cursor-pointer pb-2">
            <input
              type="checkbox"
              checked={newProduct.isClearance}
              onChange={(e) => setNewProduct(prev => ({ ...prev, isClearance: e.target.checked }))}
              className="w-4 h-4 rounded border-gray-300 text-[#FF2800] focus:ring-[#FF2800]"
            />
            <span className="text-sm font-medium">Mark as Sale</span>
          </label>
        </div>
      </div>

      {/* Team + Driver */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Team / Brand</Label>
          <Select value={newProduct.team} onValueChange={(v) => setNewProduct(prev => ({ ...prev, team: v }))}>
            <SelectTrigger><SelectValue placeholder="Select team" /></SelectTrigger>
            <SelectContent>
              {F1_TEAMS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label className="text-sm font-semibold">Driver (Optional)</Label>
          <Select value={newProduct.driver} onValueChange={(v) => setNewProduct(prev => ({ ...prev, driver: v }))}>
            <SelectTrigger><SelectValue placeholder="Select driver" /></SelectTrigger>
            <SelectContent>
              {F1_DRIVERS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Description</Label>
        <Textarea
          placeholder="Product description..."
          value={newProduct.description}
          onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
        />
      </div>
    </div>
  );
};

export function AdminDashboard() {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<AdminView>('overview');
  const [addProductDialogOpen, setAddProductDialogOpen] = useState(false);
  const [editProductDialogOpen, setEditProductDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({ ...defaultProduct });
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);

  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [checkingSession, setCheckingSession] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { session } = await getSession();
        if (session?.access_token) {
          localStorage.setItem('session', JSON.stringify(session));
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.log('No existing session');
      }
      setCheckingSession(false);
    };
    checkSession();
  }, []);

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const { session, error } = await signIn(loginEmail, loginPassword);
      if (error) {
        setLoginError(error);
      } else if (session) {
        localStorage.setItem('session', JSON.stringify(session));
        setIsAuthenticated(true);
        toast.success('Logged in successfully!');
      }
    } catch (err) {
      setLoginError('Login failed. Please try again.');
    }
    setLoginLoading(false);
  };

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('session');
    setIsAuthenticated(false);
    toast.success('Logged out');
  };

  const loadData = async () => {
    setLoading(true);
    const [fetchedProducts, fetchedOrders] = await Promise.all([getProducts(), getOrders()]);
    setProducts(fetchedProducts);
    setOrders(fetchedOrders);
    setLoading(false);
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (p.team && p.team.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalStock = products.reduce((sum, p) => sum + (p.stockQuantity || 0), 0);
  const salesData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === date.toDateString());
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      revenue: dayOrders.reduce((sum, o) => sum + o.totalAmount, 0),
      orders: dayOrders.length,
    };
  });

  const handleImageUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadProductImage(file);
      if (url) {
        setNewProduct(prev => ({ ...prev, image: url }));
        setImagePreview(URL.createObjectURL(file));
        toast.success('Image uploaded successfully!');
      } else {
        toast.error('Failed to upload image. Make sure you are logged in.');
      }
    } catch {
      toast.error('Image upload failed');
    }
    setUploading(false);
  };

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error('Please fill in all required fields');
      return;
    }
    const productData: any = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      image: newProduct.image || 'https://via.placeholder.com/400',
      category: newProduct.category,
      gender: newProduct.gender,
      team: newProduct.team || undefined,
      driver: newProduct.driver || undefined,
      description: newProduct.description || undefined,
      stockQuantity: newProduct.stockQuantity ? parseInt(newProduct.stockQuantity) : 100,
      isClearance: newProduct.isClearance,
      sizes: newProduct.sizes.length > 0 ? newProduct.sizes : undefined,
      waistSizes: newProduct.waistSizes.length > 0 ? newProduct.waistSizes : undefined,
      modelCarScale: newProduct.modelCarScale || undefined,
      material: newProduct.material || undefined,
      variantStock: Object.keys(newProduct.variantStock).length > 0 ? newProduct.variantStock : undefined,
    };
    const result = await createProduct(productData);
    if (result) {
      toast.success('Product added successfully!');
      setAddProductDialogOpen(false);
      resetForm();
      loadData();
    } else {
      toast.error('Failed to add product. Make sure you are logged in as admin.');
    }
  };

  const handleEditProduct = async () => {
    if (!selectedProduct) return;
    const productData: any = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      originalPrice: newProduct.originalPrice ? parseFloat(newProduct.originalPrice) : undefined,
      image: newProduct.image,
      category: newProduct.category,
      gender: newProduct.gender,
      team: newProduct.team || undefined,
      driver: newProduct.driver || undefined,
      description: newProduct.description || undefined,
      stockQuantity: newProduct.stockQuantity ? parseInt(newProduct.stockQuantity) : 100,
      isClearance: newProduct.isClearance,
      sizes: newProduct.sizes.length > 0 ? newProduct.sizes : undefined,
      waistSizes: newProduct.waistSizes.length > 0 ? newProduct.waistSizes : undefined,
      modelCarScale: newProduct.modelCarScale || undefined,
      material: newProduct.material || undefined,
      variantStock: Object.keys(newProduct.variantStock).length > 0 ? newProduct.variantStock : undefined,
    };
    const result = await updateProduct(selectedProduct.id, productData);
    if (result) {
      toast.success('Product updated successfully!');
      setEditProductDialogOpen(false);
      setSelectedProduct(null);
      resetForm();
      loadData();
    } else {
      toast.error('Failed to update product.');
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(productId);
      if (success) {
        toast.success('Product deleted successfully!');
        loadData();
      } else {
        toast.error('Failed to delete product.');
      }
    }
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setNewProduct({
      name: product.name,
      price: String(product.price),
      originalPrice: product.originalPrice ? String(product.originalPrice) : '',
      image: product.image,
      category: product.category,
      gender: product.gender,
      team: product.team || '',
      driver: product.driver || '',
      description: product.description || '',
      stockQuantity: product.stockQuantity !== undefined ? String(product.stockQuantity) : '',
      isClearance: product.isClearance || false,
      sizes: product.sizes || [],
      waistSizes: product.waistSizes || [],
      modelCarScale: product.modelCarScale || '',
      material: product.material || '',
      variantStock: product.variantStock || {},
    });
    setImagePreview(product.image);
    setEditProductDialogOpen(true);
  };

  const resetForm = () => {
    setNewProduct({ ...defaultProduct });
    setImagePreview('');
  };

  const handleExportProducts = () => {
    const csv = [
      ['Name', 'Price', 'Category', 'Gender', 'Team', 'Stock', 'Image URL'].join(','),
      ...products.map(p => [`"${p.name}"`, p.price, p.category, p.gender, p.team || '', p.stockQuantity || 0, p.image].join(','))
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `products-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Products exported!');
  };

  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvText = event.target?.result as string;
      const lines = csvText.split('\n');
      
      let successCount = 0;
      let errorCount = 0;
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',');
        const productData: any = {
          name: values[0]?.replace(/"/g, ''),
          price: parseFloat(values[1]),
          category: values[2],
          gender: values[3] || 'all',
          team: values[4] || undefined,
          stockQuantity: parseInt(values[5]) || 100,
          image: values[6] || 'https://via.placeholder.com/400',
        };

        const result = await createProduct(productData);
        if (result) {
          successCount++;
        } else {
          errorCount++;
        }
      }

      if (successCount > 0) {
        toast.success(`Imported ${successCount} products successfully!`);
        loadData();
      }
      if (errorCount > 0) {
        toast.error(`Failed to import ${errorCount} products`);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const toggleSize = (size: string) => {
    setNewProduct(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size) ? prev.sizes.filter(s => s !== size) : [...prev.sizes, size]
    }));
  };

  const toggleWaistSize = (size: string) => {
    setNewProduct(prev => ({
      ...prev,
      waistSizes: prev.waistSizes.includes(size) ? prev.waistSizes.filter(s => s !== size) : [...prev.waistSizes, size]
    }));
  };

  const navItems: { key: AdminView; label: string; icon: React.ReactNode }[] = [
    { key: 'overview', label: 'Overview', icon: <BarChart3 className="w-4 h-4" /> },
    { key: 'products', label: 'Products', icon: <Package className="w-4 h-4" /> },
    { key: 'orders', label: 'Orders', icon: <ShoppingCart className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show login screen if not authenticated */}
      {checkingSession ? (
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF2800]" />
        </div>
      ) : !isAuthenticated ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="text-center space-y-1">
              <div className="flex justify-center mb-4">
                <div className="bg-[#FF2800] p-3 rounded-xl">
                  <Package className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold">F1 LANKA Admin</CardTitle>
              <CardDescription>Sign in to access the admin dashboard</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@f1lanka.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                {loginError && (
                  <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                    {loginError}
                  </div>
                )}
                <Button
                  type="submit"
                  className="w-full bg-[#FF2800] hover:bg-[#E02400] text-white"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>
              <div className="mt-4 text-center text-sm text-gray-500">
                <p>Designed by::</p>
                <p className="font-mono text-xs mt-1">Tuan Sharik Ismet AKA Mubtakar</p>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <>
      {/* Header */}
      <header className="bg-[#1a1a1a] text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-0">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-[#FF2800]" />
                <span className="font-bold text-lg">F1 LANKA</span>
                <Badge variant="outline" className="ml-1 border-[#FF2800] text-[#FF2800] text-[10px] px-1.5 py-0">
                  Admin
                </Badge>
              </div>
              <nav className="flex items-center">
                {navItems.map(item => (
                  <button
                    key={item.key}
                    onClick={() => setActiveView(item.key)}
                    className={`flex items-center gap-2 px-4 py-4 text-sm font-medium border-b-2 transition-colors ${
                      activeView === item.key
                        ? 'text-white border-[#FF2800]'
                        : 'text-gray-400 border-transparent hover:text-white hover:border-gray-600'
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/')}
              className="text-gray-300 hover:text-white hover:bg-[#2a2a2a]"
            >
              <Store className="w-4 h-4 mr-2" />
              View Storefront
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-gray-300 hover:text-white hover:bg-[#2a2a2a]"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Overview */}
        {activeView === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, sub: 'Total earnings', icon: <DollarSign className="w-5 h-5" />, color: 'text-green-600 bg-green-50' },
                { label: 'Products', value: products.length, sub: 'Total products', icon: <Package className="w-5 h-5" />, color: 'text-blue-600 bg-blue-50' },
                { label: 'Orders', value: orders.length, sub: 'Total orders', icon: <ShoppingCart className="w-5 h-5" />, color: 'text-[#FF2800] bg-red-50' },
                { label: 'Total Stock', value: totalStock, sub: 'Items in stock', icon: <TrendingUp className="w-5 h-5" />, color: 'text-orange-600 bg-orange-50' },
              ].map(stat => (
                <Card key={stat.label} className="border-0 shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-gray-500 font-medium">{stat.label}</span>
                      <div className={`p-2 rounded-lg ${stat.color}`}>{stat.icon}</div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Sales Analytics</CardTitle>
                <CardDescription>Revenue and orders over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const maxRevenue = Math.max(...salesData.map(d => d.revenue), 1);
                  return (
                    <div className="h-[300px] flex items-end gap-3 pt-6 pb-8 relative">
                      {/* Y-axis labels */}
                      <div className="absolute left-0 top-6 bottom-8 flex flex-col justify-between text-xs text-gray-400 w-16">
                        <span>Rs. {maxRevenue.toLocaleString()}</span>
                        <span>Rs. {Math.round(maxRevenue / 2).toLocaleString()}</span>
                        <span>Rs. 0</span>
                      </div>
                      {/* Bars */}
                      <div className="flex items-end gap-3 flex-1 ml-18 h-full">
                        {salesData.map((d, i) => (
                          <div key={`bar-${i}`} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                            {/* Tooltip on hover */}
                            <div className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                              Rs. {d.revenue.toLocaleString()} | {d.orders} orders
                            </div>
                            <div
                              className="w-full bg-[#FF2800] rounded-t-md transition-all hover:bg-[#E02400] min-h-[4px]"
                              style={{ height: `${Math.max((d.revenue / maxRevenue) * 100, 2)}%` }}
                            />
                            <span className="text-xs text-gray-500 mt-1">{d.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Products */}
        {activeView === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Product Inventory</h2>
                <p className="text-sm text-gray-500">{products.length} products total</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportProducts}>
                  <Download className="w-4 h-4 mr-2" />Export
                </Button>
                <Button size="sm" onClick={() => { resetForm(); setAddProductDialogOpen(true); }} className="bg-[#FF2800] hover:bg-[#E02400] text-white">
                  <Plus className="w-4 h-4 mr-2" />Add Product
                </Button>
                <input
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleImportCSV}
                  ref={csvInputRef}
                />
                <Button size="sm" className="bg-[#FF2800] hover:bg-[#E02400] text-white" onClick={() => csvInputRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-2" />Import CSV
                </Button>
              </div>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Team</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Variants</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loading ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">Loading...</TableCell></TableRow>
                      ) : filteredProducts.length === 0 ? (
                        <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-400">No products found</TableCell></TableRow>
                      ) : filteredProducts.map(product => (
                        <TableRow key={product.id} className="hover:bg-gray-50">
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <img src={product.image} alt={product.name} className="w-10 h-10 rounded-lg object-cover border" />
                              <div>
                                <div className="font-medium text-sm">{product.name}</div>
                                <div className="text-xs text-gray-400 capitalize">{product.gender === 'all' ? 'Unisex' : product.gender}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{product.category}</TableCell>
                          <TableCell className="text-sm">{product.team || '—'}</TableCell>
                          <TableCell>
                            <span className={`text-sm font-medium ${product.stockQuantity === 0 ? 'text-red-600' : product.stockQuantity && product.stockQuantity < 10 ? 'text-orange-600' : 'text-green-600'}`}>
                              {product.stockQuantity === 0 ? 'Out' : product.stockQuantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-sm font-medium">Rs. {product.price.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {product.sizes && product.sizes.length > 0 && (
                                <Badge variant="outline" className="text-[10px] px-1.5">{product.sizes.join(', ')}</Badge>
                              )}
                              {product.isClearance && (
                                <Badge className="bg-red-100 text-red-700 text-[10px] px-1.5">Sale</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-1 justify-end">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(product)}>
                                <Edit className="w-3.5 h-3.5 text-gray-500" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="w-3.5 h-3.5 text-red-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Orders */}
        {activeView === 'orders' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Order Management</h2>
              <p className="text-sm text-gray-500">{orders.length} orders total</p>
            </div>

            <Card className="border-0 shadow-sm">
              <CardContent className="p-4">
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-400">No orders yet</TableCell></TableRow>
                      ) : orders.map(order => (
                        <TableRow key={order.id} className="hover:bg-gray-50">
                          <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}</TableCell>
                          
                          {/* Expanded Customer Info with Address */}
                          <TableCell>
                            <div className="font-medium text-sm">{order.customerName}</div>
                            <div className="text-xs text-gray-400">{order.customerPhone}</div>
                            <div className="text-xs text-gray-500 mt-1 max-w-[200px] whitespace-normal">
                              {order.shippingAddress}
                            </div>
                          </TableCell>

                          <TableCell className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          
                          {/* Detailed Items List with Sizes/Variants */}
                          <TableCell>
                            <div className="flex flex-col gap-1 max-w-[300px]">
                              {order.items?.map((item: any, idx: number) => (
                                <div key={idx} className="text-xs leading-relaxed">
                                  <span className="font-medium">{item.quantity}x</span> {item.productName}
                                  {(item.selectedSize || item.selectedWaistSize || item.selectedScale) && (
                                    <span className="text-gray-500 ml-1">
                                      ({item.selectedSize || item.selectedWaistSize || item.selectedScale})
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </TableCell>

                          <TableCell className="text-sm font-medium">Rs. {order.totalAmount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={
                              order.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                              order.status === 'confirmed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                              order.status === 'shipped' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                              order.status === 'delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                              'bg-red-50 text-red-700 border-red-200'
                            }>
                              {order.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Add Product Dialog */}
      <Dialog open={addProductDialogOpen} onOpenChange={setAddProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Add New Product</DialogTitle>
            <DialogDescription>Fill in the product details below. Fields marked with * are required.</DialogDescription>
          </DialogHeader>
          <ProductFormContent
            isEdit={false}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            uploading={uploading}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            handleImageUpload={handleImageUpload}
            toggleSize={toggleSize}
            toggleWaistSize={toggleWaistSize}
            fileInputRef={fileInputRef}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddProductDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleAddProduct} className="bg-[#FF2800] hover:bg-[#E02400] text-white">Add Product</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={editProductDialogOpen} onOpenChange={setEditProductDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Product</DialogTitle>
            <DialogDescription>Update the product details below.</DialogDescription>
          </DialogHeader>
          <ProductFormContent
            isEdit={true}
            newProduct={newProduct}
            setNewProduct={setNewProduct}
            uploading={uploading}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            handleImageUpload={handleImageUpload}
            toggleSize={toggleSize}
            toggleWaistSize={toggleWaistSize}
            fileInputRef={fileInputRef}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditProductDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleEditProduct} className="bg-[#FF2800] hover:bg-[#E02400] text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </>
      )}
    </div>
  );
}