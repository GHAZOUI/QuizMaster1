import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter } from "lucide-react";

interface LeaderboardFiltersProps {
  filters: {
    continent: string;
    country: string;
    category: string;
  };
  onFilterChange: (key: string, value: string) => void;
  continents: string[];
  countries: string[];
  categories: string[];
}

export default function LeaderboardFilters({
  filters,
  onFilterChange,
  continents,
  countries,
  categories
}: LeaderboardFiltersProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
        <Filter className="w-4 h-4 mr-2 text-primary" />
        Filters
      </h3>
      
      <div className="grid grid-cols-1 gap-3">
        <Select value={filters.continent} onValueChange={(value) => onFilterChange('continent', value)}>
          <SelectTrigger data-testid="select-continent">
            <SelectValue placeholder="Select Continent" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Continents</SelectItem>
            {continents.map((continent) => (
              <SelectItem key={continent} value={continent}>
                {continent}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filters.country} onValueChange={(value) => onFilterChange('country', value)}>
          <SelectTrigger data-testid="select-country">
            <SelectValue placeholder="Select Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
          <SelectTrigger data-testid="select-category-filter">
            <SelectValue placeholder="Select Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
