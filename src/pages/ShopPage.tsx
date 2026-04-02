import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { MegaMenu } from '../components/MegaMenu';
import { ProductFilters } from '../components/ProductFilters';
import { ProductCard } from '../components/ProductCard';
import { ProductDetailDialog } from '../components/ProductDetailDialog';
import { CartDrawer } from '../components/CartDrawer';
import { MobileFilterSheet } from '../components/MobileFilterSheet';
import { Footer } from '../components/Footer';
import { FloatingButtons } from '../components/FloatingButtons';
import { getProducts } from '../lib/api';
import type { Product } from '../lib/api';
import { Button } from '../components/ui/button';
import { SlidersHorizontal, ChevronLeft } from 'lucide-react';
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink,
  PaginationNext, PaginationPrevious, PaginationEllipsis,
} from '../components/ui/pagination';

const ITEMS_PER_PAGE = 12;
const WHATSAPP_NUMBER = '94710773717';

export function ShopPage() {
  const [searchParams] = useSearchParams();

  // Read filters from URL params
  const urlCategory = searchParams.get('category') || '';
  const urlGender = searchParams.get('gender') || 'all';
  const urlTeam = searchParams.get('team') || '';
  const urlSearch = searchParams.get('q') || '';

  const [selectedCategories, setSelectedCategories] = useState<string[]>(urlCategory ? [urlCategory] : []);
  const [selectedGender, setSelectedGender] = useState(urlGender);
  const [selectedTeam, setSelectedTeam] = useState(urlTeam);
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileFilterSheetOpen, setMobileFilterSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync URL params to state when they change
  useEffect(() => {
    if (urlCategory) setSelectedCategories([urlCategory]);
    else setSelectedCategories([]);
    setSelectedGender(urlGender);
    setSelectedTeam(urlTeam);
    setSearchQuery(urlSearch);
  }, [urlCategory, urlGender, urlTeam, urlSearch]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    const fetched = await getProducts();
    setProducts(fetched);
    setLoading(false);
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const categoryMatch = selectedCategories.length === 0 ||
        selectedCategories.some(cat => product.category.toLowerCase().includes(cat.toLowerCase()));

      // Unisex products (gender === 'all') should show under all gender filters
      const genderMatch = selectedGender === 'all' ||
        product.gender === 'all' ||
        product.gender === selectedGender;

      const teamMatch = !selectedTeam ||
        (product.team && product.team.toLowerCase().includes(selectedTeam.toLowerCase()));

      const searchMatch = searchQuery === '' ||
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.team && product.team.toLowerCase().includes(searchQuery.toLowerCase()));

      return categoryMatch && genderMatch && teamMatch && searchMatch;
    });
  }, [products, selectedCategories, selectedGender, selectedTeam, searchQuery]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, selectedGender, selectedTeam, searchQuery]);

  // Build page title
  const pageTitle = (() => {
    const parts: string[] = [];
    if (selectedTeam) parts.push(selectedTeam);
    if (selectedGender !== 'all') parts.push(selectedGender.charAt(0).toUpperCase() + selectedGender.slice(1) + "'s");
    if (selectedCategories.length > 0) parts.push(selectedCategories.join(', '));
    if (searchQuery) return `Search: "${searchQuery}"`;
    return parts.length > 0 ? parts.join(' — ') : 'All Products';
  })();

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <MegaMenu
        onSearch={(q) => setSearchQuery(q)}
        onCartClick={() => setCartDrawerOpen(true)}
        onCategorySelect={(cat) => setSelectedCategories([cat])}
        onGenderSelect={(g) => setSelectedGender(g)}
        onTeamSelect={(t) => setSelectedTeam(t)}
      />

      <div className="container mx-auto px-4 py-6 flex-1">
        {/* Page Header */}
        <div className="mb-6">
          <a href="/" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#FF2800] mb-3 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? 'Loading...' : `${filteredProducts.length} products found`}
          </p>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <div className="hidden lg:block">
            <ProductFilters
              selectedCategories={selectedCategories}
              onCategoryChange={setSelectedCategories}
              selectedGender={selectedGender}
              onGenderChange={setSelectedGender}
            />
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden"
                onClick={() => setMobileFilterSheetOpen(true)}
              >
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Filters
              </Button>
              {(selectedTeam || selectedCategories.length > 0 || selectedGender !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedGender('all');
                    setSelectedTeam('');
                    setSearchQuery('');
                  }}
                  className="text-[#FF2800] hover:text-[#E02400]"
                >
                  Clear all filters
                </Button>
              )}
            </div>

            {loading && (
              <div className="text-center py-16">
                <p className="text-gray-500">Loading products...</p>
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-gray-500 text-lg">No products found matching your filters.</p>
                <p className="text-gray-400 text-sm mt-2">Try adjusting your filter selection or search term.</p>
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(product => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    onClick={() => {
                      setSelectedProduct(product);
                      setDialogOpen(true);
                    }}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-8">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={(e) => { e.preventDefault(); if (currentPage > 1) setCurrentPage(p => p - 1); }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                      .reduce<(number | 'ellipsis')[]>((acc, page, idx, arr) => {
                        if (idx > 0 && page - (arr[idx - 1]) > 1) acc.push('ellipsis');
                        acc.push(page);
                        return acc;
                      }, [])
                      .map((item, idx) =>
                        item === 'ellipsis' ? (
                          <PaginationItem key={`e-${idx}`}><PaginationEllipsis /></PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              onClick={(e) => { e.preventDefault(); setCurrentPage(item); }}
                              isActive={currentPage === item}
                              className="cursor-pointer"
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => { e.preventDefault(); if (currentPage < totalPages) setCurrentPage(p => p + 1); }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

      <ProductDetailDialog product={selectedProduct} open={dialogOpen} onOpenChange={setDialogOpen} />
      <CartDrawer open={cartDrawerOpen} onOpenChange={setCartDrawerOpen} whatsappNumber={WHATSAPP_NUMBER} />
      <MobileFilterSheet
        open={mobileFilterSheetOpen}
        onOpenChange={setMobileFilterSheetOpen}
        selectedCategories={selectedCategories}
        onCategoryChange={setSelectedCategories}
        selectedGender={selectedGender}
        onGenderChange={setSelectedGender}
      />
      <FloatingButtons />
      <Footer />
    </div>
  );
}
