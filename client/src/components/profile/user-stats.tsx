import { User } from "lucide-react";
import type { User as UserType } from "@shared/schema";

interface UserStatsProps {
  user: UserType;
  rank: number;
}

export default function UserStats({ user, rank }: UserStatsProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <User className="text-primary text-2xl w-10 h-10" />
      </div>
      <h2 className="text-xl font-bold text-gray-800" data-testid="text-username">
        {user.username}
      </h2>
      <p className="text-gray-500" data-testid="text-email">
        {user.email}
      </p>
      
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
        <div className="text-center">
          <p className="text-2xl font-bold text-primary" data-testid="text-total-score">
            {(user.totalScore || 0).toLocaleString()}
          </p>
          <p className="text-xs text-gray-500">Total Points</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-secondary" data-testid="text-quizzes-completed">
            {user.quizzesCompleted || 0}
          </p>
          <p className="text-xs text-gray-500">Quizzes</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-accent" data-testid="text-rank">
            {rank ? `${rank}${getOrdinalSuffix(rank)}` : 'Unranked'}
          </p>
          <p className="text-xs text-gray-500">Rank</p>
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(num: number): string {
  const j = num % 10;
  const k = num % 100;
  if (j === 1 && k !== 11) return 'st';
  if (j === 2 && k !== 12) return 'nd';
  if (j === 3 && k !== 13) return 'rd';
  return 'th';
}
