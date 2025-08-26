import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LeaderboardFilters from "@/components/leaderboard/leaderboard-filters";
import LeaderboardEntry from "@/components/leaderboard/leaderboard-entry";
import { Clock } from "lucide-react";
import type { User } from "@shared/schema";

interface LeaderboardPageProps {
  currentUser: User | undefined;
}

export default function LeaderboardPage({ currentUser }: LeaderboardPageProps) {
  const [filters, setFilters] = useState({
    continent: "Europe",
    country: "France",
    category: "Geography"
  });

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['/api/leaderboard', filters.category, filters.country, filters.continent, new Date().toDateString()],
  });

  const { data: continents } = useQuery({
    queryKey: ['/api/continents']
  });

  const { data: countries } = useQuery({
    queryKey: ['/api/countries', filters.continent]
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/questions/categories']
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset country when continent changes
      ...(key === 'continent' ? { country: '' } : {})
    }));
  };

  const getResetTime = () => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    const diff = tomorrow.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "👑";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return rank.toString();
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "bg-accent text-white";
    if (rank === 2) return "bg-gray-400 text-white";
    if (rank === 3) return "bg-orange-400 text-white";
    return "bg-gray-300 text-gray-600";
  };

  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      <LeaderboardFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        continents={Array.isArray(continents) ? continents : []}
        countries={Array.isArray(countries) ? countries : []}
        categories={Array.isArray(categories) ? categories : []}
      />

      {/* Leaderboard Header */}
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-800" data-testid="text-daily-rankings">Daily Rankings</h2>
        <p className="text-sm text-gray-500" data-testid="text-filter-summary">
          {filters.category} • {filters.country} • {filters.continent}
        </p>
        <p className="text-xs text-gray-400 mt-1 flex items-center justify-center">
          <Clock className="w-3 h-3 mr-1" />
          Resets in {getResetTime()}
        </p>
      </div>

      {/* Leaderboard List */}
      <div className="space-y-2">
        {Array.isArray(leaderboard) && leaderboard.length > 0 ? (
          leaderboard.map((entry: any, index: number) => (
            <LeaderboardEntry
              key={entry.id}
              entry={entry}
              rank={entry.rank || index + 1}
              isCurrentUser={entry.userId === currentUser?.id}
              rankIcon={getRankIcon(entry.rank || index + 1)}
              rankColor={getRankColor(entry.rank || index + 1)}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500" data-testid="text-no-entries">No entries found for the selected filters.</p>
            <p className="text-sm text-gray-400 mt-2">Be the first to complete a quiz today!</p>
          </div>
        )}
      </div>
    </div>
  );
}
