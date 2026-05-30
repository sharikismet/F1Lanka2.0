import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';
import { MegaMenu } from '../components/MegaMenu';
import { ProductFilters } from '../components/ProductFilters';
import { ProductCard } from '../components/ProductCard';
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
  const navigate = useNavigate(); // 🚨 Added useNavigate to route to the actual product page

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
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const [mobileFilterSheetOpen, setMobileFilterSheetOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 🚨 FIX: Force scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
    loadProducts();
  }, []);

  // Sync URL params to state when they change
  useEffect(() => {
    if (urlCategory) setSelectedCategories([urlCategory]);
    else setSelectedCategories([]);
    setSelectedGender(urlGender);
    setSelectedTeam(urlTeam);
    setSearchQuery(urlSearch);
    window.scrollTo(0, 0); // 🚨 FIX: Scroll to top when filters change via URL
  }, [urlCategory, urlGender, urlTeam, urlSearch]);

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
    window.scrollTo(0, 0); // 🚨 FIX: Scroll to top when manual filter states change
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
    <div className="min-h-screen bg-background text-foreground flex flex-col">
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
          <a href="/" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-[#FF2800] mb-3 transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Back to Home
          </a>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{pageTitle}</h1>
          <p className="text-sm text-muted-foreground mt-1">
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
                className="lg:hidden border-border text-foreground hover:bg-accent"
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
                  className="text-[#FF2800] hover:text-[#E02400] hover:bg-accent"
                >
                  Clear all filters
                </Button>
              )}
            </div>

            {loading && (
              <div className="text-center py-16">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            )}

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No products found matching your filters.</p>
                <p className="text-muted-foreground/60 text-sm mt-2">Try adjusting your filter selection or search term.</p>
              </div>
            )}

            {!loading && filteredProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                {filteredProducts.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE).map(product => (
                  <ProductCard
                    key={product.id}
                    {...product}
                    // 🚨 FIX: Navigate to the beautiful Product Page instead of the old Quick View Modal
                    onClick={() => {
                      navigate(`/product/${product.id}`);
                      window.scrollTo(0, 0);
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
                        onClick={(e) => { 
                          e.preventDefault(); 
                          if (currentPage > 1) {
                            setCurrentPage(p => p - 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' }); // 🚨 FIX: Scroll to top on page change
                          }
                        }}
                        className={currentPage === 1 ? 'pointer-events-none opacity-50 text-foreground hover:bg-accent' : 'cursor-pointer text-foreground hover:bg-accent'}
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
                          <PaginationItem key={`e-${idx}`}><PaginationEllipsis className="text-muted-foreground" /></PaginationItem>
                        ) : (
                          <PaginationItem key={item}>
                            <PaginationLink
                              onClick={(e) => { 
                                e.preventDefault(); 
                                setCurrentPage(item);
                                window.scrollTo({ top: 0, behavior: 'smooth' }); // 🚨 FIX: Scroll to top on page change
                              }}
                              isActive={currentPage === item}
                              className={`cursor-pointer ${currentPage === item ? 'bg-[#FF2800] text-white border-[#FF2800] hover:bg-[#E02400]' : 'text-foreground hover:bg-accent border-border'}`}
                            >
                              {item}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                    <PaginationItem>
                      <PaginationNext
                        onClick={(e) => { 
                          e.preventDefault(); 
                          if (currentPage < totalPages) {
                            setCurrentPage(p => p + 1);
                            window.scrollTo({ top: 0, behavior: 'smooth' }); // 🚨 FIX: Scroll to top on page change
                          }
                        }}
                        className={currentPage === totalPages ? 'pointer-events-none opacity-50 text-foreground hover:bg-accent' : 'cursor-pointer text-foreground hover:bg-accent'}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </div>
        </div>
      </div>

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