import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from './ui/sheet';
import { ProductFilters } from './ProductFilters';

interface MobileFilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedGender: string;
  onGenderChange: (gender: string) => void;
}

export function MobileFilterSheet({
  open,
  onOpenChange,
  selectedCategories,
  onCategoryChange,
  selectedGender,
  onGenderChange,
}: MobileFilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Filter products by category and gender
          </SheetDescription>
        </SheetHeader>
        <div className="mt-6">
          <ProductFilters
            selectedCategories={selectedCategories}
            onCategoryChange={onCategoryChange}
            selectedGender={selectedGender}
            onGenderChange={onGenderChange}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
