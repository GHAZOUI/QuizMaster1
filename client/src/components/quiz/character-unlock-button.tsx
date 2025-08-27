import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Unlock, Coins } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
  const [isUnlocking, setIsUnlocking] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const unlockCharacterMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/users/${userId}/unlock-character`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Erreur lors du déblocage');
      }
      return response.json();
    },
    onSuccess: (data) => {
      const character = answer[characterIndex]?.toUpperCase() || '';
      onCharacterUnlocked(characterIndex, character);
      queryClient.invalidateQueries({ queryKey: ['/api/users', userId] });
      toast({
        title: "Caractère débloqué !",
        description: `Lettre "${character}" révélée. Il vous reste ${data.remainingCoins} coins.`,
      });
      setIsUnlocking(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      setIsUnlocking(false);
    }
  });

  const handleUnlock = () => {
    setIsUnlocking(true);
    unlockCharacterMutation.mutate();
  };

  return (
    <Button
      size="sm"
      variant="outline"
      className="h-6 w-6 p-0 border-yellow-300 hover:bg-yellow-50 text-yellow-600"
      onClick={handleUnlock}
      disabled={isUnlocking || unlockCharacterMutation.isPending}
      data-testid={`button-unlock-${characterIndex}`}
    >
      {isUnlocking || unlockCharacterMutation.isPending ? (
        <div className="w-3 h-3 border border-yellow-400 border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          <Unlock className="w-3 h-3" />
          <Coins className="w-2 h-2 -ml-1" />
        </>
      )}
    </Button>
  );
}