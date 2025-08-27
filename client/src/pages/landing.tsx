import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain, Trophy, Gamepad2 } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="bg-blue-600 p-4 rounded-full">
              <Brain className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
            QuizMaster
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Testez vos connaissances avec des quiz passionnants dans 5 catégories différentes. 
            Débloquez des indices avec des coins et grimpez dans le classement quotidien !
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <Gamepad2 className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Quiz Interactif</CardTitle>
              <CardDescription>
                Répondez à des questions avec des indices de caractères. 1 coin = 1 caractère révélé.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <Trophy className="h-8 w-8 text-yellow-600 mb-2" />
              <CardTitle>Classements</CardTitle>
              <CardDescription>
                Comparez vos scores avec d'autres joueurs par continent, pays et catégorie.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
            <CardHeader>
              <Brain className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>5 Catégories</CardTitle>
              <CardDescription>
                Géographie, Histoire, Sciences, Arts, Sports - des milliers de questions !
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="px-8 py-4 text-lg"
            onClick={() => window.location.href = '/api/login'}
            data-testid="login-button"
          >
            Se Connecter pour Jouer
          </Button>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4">
            Utilisez votre compte Replit pour vous connecter
          </p>
        </div>
      </div>
    </div>
  );
}