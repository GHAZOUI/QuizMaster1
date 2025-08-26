import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useState } from "react";
import { Brain, User, Coins } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import QuizPage from "@/pages/quiz";
import LeaderboardPage from "@/pages/leaderboard";
import ProfilePage from "@/pages/profile";
import BuyCoinsPage from "@/pages/buy-coins";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import NotFound from "@/pages/not-found";

function AppContent() {
  const { user: currentUser, isLoading, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<'quiz' | 'leaderboard' | 'profile' | 'coins'>('quiz');
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  // Show landing page for non-authenticated users
  if (!isAuthenticated) {
    return <Landing />;
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'quiz':
        return <QuizPage userId={currentUser?.id || ''} />;
      case 'leaderboard':
        return <LeaderboardPage userId={currentUser?.id || ''} />;
      case 'profile':
        return <ProfilePage userId={currentUser?.id || ''} />;
      case 'coins':
        return <BuyCoinsPage userId={currentUser?.id || ''} />;
      default:
        return <QuizPage userId={currentUser?.id || ''} />;
    }
  };

  return (
        <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">
          {/* Header */}
          <header className="bg-primary text-white p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Brain className="text-2xl w-8 h-8" data-testid="icon-brain" />
              <h1 className="text-xl font-bold" data-testid="text-app-title">QuizMaster</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Coins className="w-4 h-4 text-yellow-500" />
                <span className="text-sm font-medium text-yellow-600" data-testid="text-user-coins">
                  {currentUser?.coins || 0}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-sm" data-testid="text-user-score">{(currentUser?.totalScore || 0).toLocaleString()} pts</span>
                <User className="w-5 h-5" data-testid="icon-user" />
              </div>
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
