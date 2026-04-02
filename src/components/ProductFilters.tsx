import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

interface ProductFiltersProps {
  selectedCategories: string[];
  onCategoryChange: (categories: string[]) => void;
  selectedGender: string;
  onGenderChange: (gender: string) => void;
}

export function ProductFilters({
  selectedCategories,
  onCategoryChange,
  selectedGender,
  onGenderChange,
}: ProductFiltersProps) {
  const [departmentsOpen, setDepartmentsOpen] = useState(true);
  const [genderOpen, setGenderOpen] = useState(true);

  const categories = [
    'T-Shirts',
    'Hoodies & Sweatshirts',
    'Caps & Hats',
    'Pants',
    'Model Cars',
    'Accessories',
    'Collectibles & Memorabilia',
  ];

  const handleCategoryToggle = (category: string) => {
    if (selectedCategories.includes(category)) {
      onCategoryChange(selectedCategories.filter(c => c !== category));
    } else {
      onCategoryChange([...selectedCategories, category]);
    }
  };

  return (
    <div className="w-64 pr-8">
      {/* All Departments */}
      <div className="mb-6">
        <button
          onClick={() => setDepartmentsOpen(!departmentsOpen)}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-semibold">All Departments</h3>
          {departmentsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {departmentsOpen && (
          <div className="space-y-3">
            {categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={() => handleCategoryToggle(category)}
                />
                <Label
                  htmlFor={category}
                  className="text-sm cursor-pointer"
                >
                  {category}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Gender/Age */}
      <div className="mb-6 border-t pt-4">
        <button
          onClick={() => setGenderOpen(!genderOpen)}
          className="flex items-center justify-between w-full mb-4"
        >
          <h3 className="font-semibold">Gender/Age</h3>
          {genderOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {genderOpen && (
          <RadioGroup value={selectedGender} onValueChange={onGenderChange}>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="all" id="all" />
              <Label htmlFor="all" className="text-sm cursor-pointer">All</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="men" id="men" />
              <Label htmlFor="men" className="text-sm cursor-pointer">Men</Label>
            </div>
            <div className="flex items-center space-x-2 mb-3">
              <RadioGroupItem value="women" id="women" />
              <Label htmlFor="women" className="text-sm cursor-pointer">Women</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="kids" id="kids" />
              <Label htmlFor="kids" className="text-sm cursor-pointer">Kids</Label>
            </div>
          </RadioGroup>
        )}
      </div>
    </div>
  );
}