import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import UserStats from "@/components/profile/user-stats";
import LocationSettings from "@/components/profile/location-settings";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

interface ProfilePageProps {
  user: User & { totalScore: number; quizzesCompleted: number };
}

export default function ProfilePage({ user }: ProfilePageProps) {
  const [selectedCategories, setSelectedCategories] = useState([
    "Geography",
    "History"
  ]);
  const { toast } = useToast();

  const { data: continents } = useQuery({
    queryKey: ['/api/continents']
  });

  const { data: countries } = useQuery({
    queryKey: ['/api/countries', user.continent]
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/questions/categories']
  });

  const { data: userRank } = useQuery({
    queryKey: ['/api/users', user.id, 'rank', 'Geography', new Date().toDateString()],
    enabled: !!user.id
  });

  const updateLocationMutation = useMutation({
    mutationFn: async (locationData: { continent: string; country: string }) => {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(locationData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] });
      toast({
        title: "Location Updated",
        description: "Your location settings have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update location settings.",
        variant: "destructive",
      });
    }
  });

  const handleLocationUpdate = (locationData: { continent: string; country: string }) => {
    updateLocationMutation.mutate(locationData);
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const getCategoryStats = (category: string) => {
    // This would ideally come from the API
    const stats: Record<string, number> = {
      "Geography": 23,
      "History": 18,
      "Science": 12,
      "Sports": 8,
      "Arts": 5
    };
    return stats[category] || 0;
  };

  return (
    <div className="p-4 space-y-4">
      <UserStats
        user={user}
        rank={userRank?.rank || 7}
      />

      <LocationSettings
        currentContinent={user.continent || ""}
        currentCountry={user.country || ""}
        continents={continents || []}
        countries={countries || []}
        onLocationUpdate={handleLocationUpdate}
        isLoading={updateLocationMutation.isPending}
      />

      {/* Quiz Categories */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
          <span className="mr-2">📋</span>
          Favorite Categories
        </h3>
        
        <div className="space-y-2">
          {categories?.map((category: string) => (
            <label key={category} className="flex items-center space-x-3" data-testid={`checkbox-category-${category.toLowerCase()}`}>
              <input
                type="checkbox"
                checked={selectedCategories.includes(category)}
                onChange={() => handleCategoryToggle(category)}
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
              />
              <span className="text-gray-700">{category}</span>
              <span className="text-xs text-gray-500 ml-auto">
                {getCategoryStats(category)} completed
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Additional Profile Actions */}
      <div className="space-y-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            toast({
              title: "Feature Coming Soon",
              description: "Export functionality will be available in a future update.",
            });
          }}
          data-testid="button-export-stats"
        >
          📊 Export Quiz Statistics
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            toast({
              title: "Feature Coming Soon", 
              description: "Achievement system will be available in a future update.",
            });
          }}
          data-testid="button-view-achievements"
        >
          🏆 View Achievements
        </Button>
      </div>
    </div>
  );
}
