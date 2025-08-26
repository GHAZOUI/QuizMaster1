import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Coins, Lock, Unlock } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface CharacterUnlockButtonProps {
  userId: string;
  characterIndex: number;
  answer: string;
  onCharacterUnlocked: (index: number, character: string) => void;
}

export default function CharacterUnlockButton({ 
  userId, 
  characterIndex, 
  answer, 
  onCharacterUnlocked 
}: CharacterUnlockButtonProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['/api/users', userId],
    queryFn: async () => {
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    }
  });

  const unlockCharacterMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${userId}/unlock-character`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }
      return response.json();
    },
    onSuccess: (data) => {
      const character = answer[characterIndex];
      onCharacterUnlocked(characterIndex, character);
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: "Caractère débloqué !",
        description: `Lettre "${character}" révélée. Coins restants : ${data.remainingCoins}`
      });
    },
    onError: (error: any) => {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de débloquer le caractère",
        variant: "destructive"
      });
    }
  });

  const handleUnlock = () => {
    if (!user || (user.coins || 0) < 1) {
      toast({
        title: "Pas assez de coins",
        description: "Vous avez besoin d'au moins 1 coin pour débloquer un caractère",
        variant: "destructive"
      });
      return;
    }
    unlockCharacterMutation.mutate();
  };

  const userCoins = user?.coins || 0;
  const canUnlock = userCoins >= 1;

  return (
    <Button
      size="sm"
      variant={canUnlock ? "default" : "secondary"}
      onClick={handleUnlock}
      disabled={!canUnlock || unlockCharacterMutation.isPending}
      className="h-8 px-2"
      data-testid={`button-unlock-character-${characterIndex}`}
    >
      {unlockCharacterMutation.isPending ? (
        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : canUnlock ? (
        <>
          <Unlock className="w-3 h-3 mr-1" />
          <Coins className="w-3 h-3 mr-1 text-yellow-500" />
          1
        </>
      ) : (
        <>
          <Lock className="w-3 h-3 mr-1" />
          <span className="text-xs">Pas de coins</span>
        </>
      )}
    </Button>
  );
}