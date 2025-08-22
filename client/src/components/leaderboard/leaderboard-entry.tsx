import { User } from "lucide-react";

interface LeaderboardEntryProps {
  entry: {
    id: string;
    userId: string;
    score: number;
    category: string;
    user?: {
      username: string;
      country: string;
      continent: string;
    };
  };
  rank: number;
  isCurrentUser: boolean;
  rankIcon: string;
  rankColor: string;
}

export default function LeaderboardEntry({
  entry,
  rank,
  isCurrentUser,
  rankIcon,
  rankColor
}: LeaderboardEntryProps) {
  const containerClass = isCurrentUser
    ? "bg-primary/10 border-2 border-primary/20 rounded-xl p-4 flex items-center space-x-4"
    : "bg-white rounded-xl border border-gray-200 p-4 flex items-center space-x-4";

  return (
    <div className={containerClass} data-testid={`leaderboard-entry-${entry.userId}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${rankColor}`}>
        {rankIcon}
      </div>
      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
        <User className="text-gray-600 w-5 h-5" />
      </div>
      <div className="flex-1">
        <p className={`font-medium ${isCurrentUser ? 'text-gray-800' : 'text-gray-800'}`} data-testid="text-username">
          {isCurrentUser ? 'You' : entry.user?.username || 'Unknown User'}
        </p>
        <p className="text-xs text-gray-500 flex items-center">
          <span className="mr-1">🏳️</span>
          <span data-testid="text-country">{entry.user?.country || 'Unknown'}</span>
        </p>
      </div>
      <div className="text-right">
        <p className={`font-bold ${isCurrentUser ? 'text-primary' : 'text-gray-800'}`} data-testid="text-score">
          {entry.score.toLocaleString()}
        </p>
        <p className="text-xs text-gray-500">points</p>
      </div>
    </div>
  );
}
