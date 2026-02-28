
import { useState } from 'react';
import { AgeRange, ResourceType, CostType, ResourceFilters } from '@/types';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { DEFAULT_FORMAT_OPTIONS, RESOURCE_TYPE_OPTIONS, getResourceTypeLabel } from '@/utils/resourceTaxonomy';

interface FilterSidebarProps {
  filters: ResourceFilters;
  onFiltersChange: (filters: ResourceFilters) => void;
}

export const FilterSidebar = ({ filters, onFiltersChange }: FilterSidebarProps) => {
  const [searchValue, setSearchValue] = useState(filters.searchQuery);

  const ageRangeOptions: { value: AgeRange; label: string }[] = [
    { value: '4-7', label: 'Ages 4-7' },
    { value: '8-10', label: 'Ages 8-10' },
    { value: '11-13', label: 'Ages 11-13' },
    { value: '14-17', label: 'Ages 14-17' },
  ];

  const resourceTypeOptions: { value: ResourceType; label: string }[] = RESOURCE_TYPE_OPTIONS.map((option) => ({
    value: option.value,
    label: option.label,
  }));

  const costTypeOptions: { value: CostType; label: string }[] = [
    { value: 'free', label: 'Free' },
    { value: 'paid', label: 'Paid' },
    { value: 'subscription', label: 'Subscription' },
    { value: 'freemium', label: 'Freemium' },
  ];

  const handleAgeRangeChange = (value: AgeRange, checked: boolean) => {
    const newAgeRanges = checked
      ? [...filters.ageRanges, value]
      : filters.ageRanges.filter(range => range !== value);
    
    onFiltersChange({ ...filters, ageRanges: newAgeRanges });
  };

  const handleResourceTypeChange = (value: ResourceType, checked: boolean) => {
    const newResourceTypes = checked
      ? [...filters.resourceTypes, value]
      : filters.resourceTypes.filter(type => type !== value);
    
    onFiltersChange({ ...filters, resourceTypes: newResourceTypes });
  };

  const handleCostTypeChange = (value: CostType, checked: boolean) => {
    const newCostTypes = checked
      ? [...filters.costTypes, value]
      : filters.costTypes.filter(cost => cost !== value);
    
    onFiltersChange({ ...filters, costTypes: newCostTypes });
  };

  const handleFormatChange = (value: string, checked: boolean) => {
    const newFormats = checked
      ? [...filters.formats, value]
      : filters.formats.filter((format) => format !== value);

    onFiltersChange({ ...filters, formats: newFormats });
  };

  const handleRecentlyAddedChange = (checked: boolean) => {
    onFiltersChange({ ...filters, recentlyAdded: checked });
  };

  const handleRatingChange = (value: number[]) => {
    onFiltersChange({ ...filters, minRating: value[0] });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFiltersChange({ ...filters, searchQuery: searchValue });
  };

  const clearSearch = () => {
    setSearchValue('');
    onFiltersChange({ ...filters, searchQuery: '' });
  };

  const clearAllFilters = () => {
    setSearchValue('');
    onFiltersChange({
      ageRanges: [],
      resourceTypes: [],
      formats: [],
      costTypes: [],
      minRating: 0,
      recentlyAdded: false,
      searchQuery: '',
    });
  };

  const hasActiveFilters = 
    filters.ageRanges.length > 0 || 
    filters.resourceTypes.length > 0 || 
    filters.formats.length > 0 ||
    filters.costTypes.length > 0 || 
    filters.minRating > 0 || 
    filters.recentlyAdded || 
    filters.searchQuery !== '';

  return (
    <div className="pb-6">
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <Input
            placeholder="Search resources..."
            value={searchValue}
            onChange={handleSearchChange}
            className="pr-10"
          />
          {searchValue && (
            <button 
              type="button"
              onClick={clearSearch}
              className="absolute right-10 top-1/2 -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <button 
            type="submit"
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Search className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </form>

      {hasActiveFilters && (
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all filters
          </Button>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-3">Age Range</h3>
          <div className="space-y-2">
            {ageRangeOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`age-${option.value}`} 
                  checked={filters.ageRanges.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleAgeRangeChange(option.value, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`age-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {getResourceTypeLabel(option.value)}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Format</h3>
          <div className="space-y-2">
            {DEFAULT_FORMAT_OPTIONS.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`format-${option}`}
                  checked={filters.formats.includes(option)}
                  onCheckedChange={(checked) =>
                    handleFormatChange(option, checked as boolean)
                  }
                />
                <Label
                  htmlFor={`format-${option}`}
                  className="text-sm cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Resource Type</h3>
          <div className="space-y-2">
            {resourceTypeOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`type-${option.value}`} 
                  checked={filters.resourceTypes.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleResourceTypeChange(option.value, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`type-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Cost</h3>
          <div className="space-y-2">
            {costTypeOptions.map(option => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`cost-${option.value}`} 
                  checked={filters.costTypes.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleCostTypeChange(option.value, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`cost-${option.value}`}
                  className="text-sm cursor-pointer"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Minimum Rating</h3>
          <div className="px-2">
            <Slider
              value={[filters.minRating]}
              min={0}
              max={5}
              step={0.5}
              onValueChange={handleRatingChange}
            />
            <div className="flex justify-between mt-1 text-sm text-muted-foreground">
              <span>0</span>
              <span>1</span>
              <span>2</span>
              <span>3</span>
              <span>4</span>
              <span>5</span>
            </div>
            <div className="text-center mt-2 font-medium">
              {filters.minRating} stars or higher
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="recently-added" 
              checked={filters.recentlyAdded}
              onCheckedChange={(checked) => 
                handleRecentlyAddedChange(checked as boolean)
              }
            />
            <Label 
              htmlFor="recently-added"
              className="cursor-pointer"
            >
              Recently Added (Last 30 Days)
            </Label>
          </div>
        </div>
      </div>
    </div>
  );
};
