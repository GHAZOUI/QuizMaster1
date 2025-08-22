import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Save } from "lucide-react";

interface LocationSettingsProps {
  currentContinent: string;
  currentCountry: string;
  continents: string[];
  countries: string[];
  onLocationUpdate: (location: { continent: string; country: string }) => void;
  isLoading: boolean;
}

export default function LocationSettings({
  currentContinent,
  currentCountry,
  continents,
  countries,
  onLocationUpdate,
  isLoading
}: LocationSettingsProps) {
  const [selectedContinent, setSelectedContinent] = useState(currentContinent);
  const [selectedCountry, setSelectedCountry] = useState(currentCountry);

  const handleSave = () => {
    onLocationUpdate({
      continent: selectedContinent,
      country: selectedCountry
    });
  };

  const hasChanges = selectedContinent !== currentContinent || selectedCountry !== currentCountry;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
        <MapPin className="w-4 h-4 mr-2 text-primary" />
        Location Settings
      </h3>
      
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Continent
          </label>
          <Select value={selectedContinent} onValueChange={setSelectedContinent}>
            <SelectTrigger data-testid="select-user-continent">
              <SelectValue placeholder="Select Continent" />
            </SelectTrigger>
            <SelectContent>
              {continents.map((continent) => (
                <SelectItem key={continent} value={continent}>
                  {continent}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Country
          </label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger data-testid="select-user-country">
              <SelectValue placeholder="Select Country" />
            </SelectTrigger>
            <SelectContent>
              {countries.map((country) => (
                <SelectItem key={country} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={!hasChanges || isLoading}
          data-testid="button-save-location"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Location'}
        </Button>
      </div>
    </div>
  );
}
