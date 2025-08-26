import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Brain, User, Coins } from "lucide-react";
import QuizPage from "@/pages/quiz";
import LeaderboardPage from "@/pages/leaderboard";
import ProfilePage from "@/pages/profile";
import BuyCoinsPage from "@/pages/buy-coins";
import NotFound from "@/pages/not-found";

function App() {
  const [activeTab, setActiveTab] = useState<'quiz' | 'leaderboard' | 'profile' | 'coins'>('quiz');
  const [currentUser] = useState({
    id: "user-1",
    username: "Alex Dupont",
    email: "alex.dupont@email.com",
    totalScore: 5420,
    quizzesCompleted: 23,
    country: "France",
    continent: "Europe"
  });

  const renderScreen = () => {
    switch (activeTab) {
      case 'quiz':
        return <QuizPage userId={currentUser.id} />;
      case 'leaderboard':
        return <LeaderboardPage currentUser={currentUser} />;
      case 'profile':
        return <ProfilePage user={currentUser} />;
      case 'coins':
        return <BuyCoinsPage userId={currentUser.id} />;
      default:
        return <QuizPage userId={currentUser.id} />;
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          {/* Header */}
          <header className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="text-2xl w-8 h-8" data-testid="icon-brain" />
              <h1 className="text-xl font-bold" data-testid="text-app-title">QuizMaster</h1>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm" data-testid="text-user-score">{currentUser.totalScore.toLocaleString()} pts</span>
              <User className="text-xl w-6 h-6" data-testid="icon-user" />
            </div>
          </header>

          {/* Tab Navigation */}
          <nav className="bg-white border-b border-gray-200">
            <div className="flex">
              <button 
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'quiz' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('quiz')}
                data-testid="button-tab-quiz"
              >
                <div className="fas fa-question-circle mb-1 block text-sm">❓</div>
                Quiz
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'leaderboard' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('leaderboard')}
                data-testid="button-tab-leaderboard"
              >
                <div className="fas fa-trophy mb-1 block text-sm">🏆</div>
                Leaderboard
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'profile' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('profile')}
                data-testid="button-tab-profile"
              >
                <div className="fas fa-user mb-1 block text-sm">👤</div>
                Profile
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center font-medium ${
                  activeTab === 'coins' 
                    ? 'text-primary border-b-2 border-primary' 
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('coins')}
                data-testid="button-tab-coins"
              >
                <Coins className="w-4 h-4 mx-auto mb-1 text-yellow-500" />
                Coins
              </button>
            </div>
          </nav>

          {/* Screen Content */}
          {renderScreen()}
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
