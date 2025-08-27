import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User, Coins as CoinsIcon } from "lucide-react";

export default function Home() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
      </div>
    );
  }

  const handleLogout = () => {
    window.location.href = '/api/logout';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header with user info and logout */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            {user?.profileImageUrl && (
              <img 
                src={user.profileImageUrl} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Bonjour {user?.firstName || 'Joueur'} !
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Prêt pour un nouveau défi ?
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="flex items-center space-x-1">
              <CoinsIcon className="h-4 w-4" />
              <span>{user?.coins || 0} coins</span>
            </Badge>
            <Button variant="outline" onClick={handleLogout} data-testid="logout-button">
              <LogOut className="h-4 w-4 mr-2" />
              Se Déconnecter
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Score Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">
                {user?.totalScore || 0}
              </div>
              <p className="text-sm text-muted-foreground">points accumulés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Quiz Complétés</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {user?.quizzesCompleted || 0}
              </div>
              <p className="text-sm text-muted-foreground">défis relevés</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Localisation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-lg font-semibold">
                {user?.country || 'Non défini'}
              </div>
              <p className="text-sm text-muted-foreground">{user?.continent}</p>
            </CardContent>
          </Card>
        </div>

        {/* Welcome message and CTA */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardHeader>
            <CardTitle className="text-2xl">Continuez votre aventure !</CardTitle>
            <CardDescription className="text-blue-100">
              Choisissez une catégorie et testez vos connaissances. Utilisez vos coins pour débloquer des indices !
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="secondary" 
              size="lg"
              onClick={() => window.location.reload()} // Will redirect to quiz through app routing
              data-testid="start-quiz-button"
            >
              Commencer un Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}