import { useState } from 'react';
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Coins, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface BuyCoinsProps {
  userId: string;
}

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number; // in EUR
  bonus?: number;
}

const coinPackages: CoinPackage[] = [
  { id: 'small', name: 'Pack Petit', coins: 10, price: 2 },
  { id: 'medium', name: 'Pack Moyen', coins: 25, price: 5, bonus: 5 },
  { id: 'large', name: 'Pack Grand', coins: 60, price: 10, bonus: 15 },
  { id: 'mega', name: 'Pack Mega', coins: 150, price: 20, bonus: 50 }
];

const CheckoutForm = ({ selectedPackage, userId }: { selectedPackage: CoinPackage; userId: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const addCoinsMutation = useMutation({
    mutationFn: async (coins: number) => {
      const response = await fetch(`/api/users/${userId}/add-coins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins })
      });
      if (!response.ok) throw new Error('Erreur lors de l\'ajout des coins');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: "Coins ajoutés !",
        description: `${selectedPackage.coins} coins ont été ajoutés à votre compte.`
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required"
    });

    if (error) {
      toast({
        title: "Erreur de paiement",
        description: error.message,
        variant: "destructive",
      });
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Payment successful - add coins to user account
      addCoinsMutation.mutate(selectedPackage.coins + (selectedPackage.bonus || 0));
      toast({
        title: "Paiement réussi !",
        description: `${selectedPackage.coins}${selectedPackage.bonus ? ` (+${selectedPackage.bonus} bonus)` : ''} coins ajoutés !`,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="font-medium">{selectedPackage.name}</span>
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="font-bold">
              {selectedPackage.coins}
              {selectedPackage.bonus && (
                <span className="text-green-500"> +{selectedPackage.bonus}</span>
              )}
            </span>
          </div>
        </div>
        <div className="text-right text-lg font-bold">
          {selectedPackage.price} €
        </div>
      </div>
      
      <PaymentElement />
      
      <Button 
        type="submit" 
        disabled={!stripe || addCoinsMutation.isPending}
        className="w-full"
        data-testid="button-confirm-payment"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {addCoinsMutation.isPending ? 'Traitement...' : `Payer ${selectedPackage.price} €`}
      </Button>
    </form>
  );
};

export default function BuyCoins({ userId }: BuyCoinsProps) {
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);
  const [clientSecret, setClientSecret] = useState("");

  const { data: user } = useQuery({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    }
  });

  const createPaymentMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      if (!response.ok) throw new Error('Erreur lors de la création du paiement');
      return response.json();
    },
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    }
  });

  const handlePackageSelect = (pkg: CoinPackage) => {
    setSelectedPackage(pkg);
    createPaymentMutation.mutate(pkg.price);
  };

  if (selectedPackage && clientSecret) {
    return (
      <div className="p-4">
        <div className="mb-4">
          <Button 
            variant="ghost" 
            onClick={() => {
              setSelectedPackage(null);
              setClientSecret("");
            }}
            data-testid="button-back"
          >
            ← Retour
          </Button>
        </div>
        
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm selectedPackage={selectedPackage} userId={userId} />
        </Elements>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Acheter des Coins</h1>
        <p className="text-muted-foreground">
          Utilisez les coins pour débloquer des indices de caractères
        </p>
        {user && (
          <div className="mt-4 p-3 bg-muted rounded-lg inline-block">
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-yellow-500" />
              <span className="font-medium" data-testid="text-current-coins">
                {user.coins || 0} coins
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {coinPackages.map((pkg) => (
          <Card 
            key={pkg.id} 
            className={`cursor-pointer transition-all hover:shadow-lg ${
              pkg.id === 'medium' ? 'border-primary bg-primary/5' : ''
            }`}
            onClick={() => handlePackageSelect(pkg)}
            data-testid={`card-package-${pkg.id}`}
          >
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <Coins className="w-5 h-5 text-yellow-500" />
                {pkg.name}
              </CardTitle>
              {pkg.id === 'medium' && (
                <div className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  POPULAIRE
                </div>
              )}
            </CardHeader>
            
            <CardContent className="text-center">
              <div className="text-3xl font-bold mb-2">
                {pkg.coins}
                {pkg.bonus && (
                  <span className="text-lg text-green-500"> +{pkg.bonus}</span>
                )}
              </div>
              <div className="text-sm text-muted-foreground">coins</div>
            </CardContent>
            
            <CardFooter className="text-center">
              <div className="w-full">
                <div className="text-2xl font-bold text-primary mb-2">
                  {pkg.price} €
                </div>
                {pkg.bonus && (
                  <div className="text-xs text-green-600">
                    +{pkg.bonus} coins bonus !
                  </div>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-muted-foreground">
        <p>• 1 coin = 1 indice de caractère débloqué</p>
        <p>• Paiement sécurisé via Stripe</p>
      </div>
    </div>
  );
}