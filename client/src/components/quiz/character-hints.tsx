import { useState } from 'react';
import CharacterUnlockButton from './character-unlock-button';

interface CharacterHintsProps {
  answer: string;
  userInput: string;
  userId: string;
}

export default function CharacterHints({ answer, userInput, userId }: CharacterHintsProps) {
  const [unlockedCharacters, setUnlockedCharacters] = useState<Set<number>>(new Set());

  const handleCharacterUnlocked = (index: number, character: string) => {
    setUnlockedCharacters(prev => new Set(prev).add(index));
  };
  if (!answer) {
    return (
      <div className="flex justify-center space-x-2 flex-wrap gap-2" data-testid="character-hints">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
        ))}
      </div>
    );
  }
  const renderCharacterBox = (index: number) => {
    const userChar = userInput[index]?.toUpperCase() || "";
    const hasInput = index < userInput.length;
    const isUnlocked = unlockedCharacters.has(index);
    const correctChar = answer[index]?.toUpperCase() || "";
    
    return (
      <div key={index} className="flex flex-col items-center gap-1">
        <div
          className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center text-lg font-semibold bg-white"
          data-testid={`char-box-${index}`}
        >
          <span className={hasInput ? "text-primary" : isUnlocked ? "text-green-600" : "text-gray-400"}>
            {hasInput ? userChar : isUnlocked ? correctChar : ""}
          </span>
        </div>
        
        {!hasInput && !isUnlocked && (
          <CharacterUnlockButton
            userId={userId}
            characterIndex={index}
            answer={answer}
            onCharacterUnlocked={handleCharacterUnlocked}
          />
        )}
      </div>
    );
  };

  return (
    <div className="flex justify-center space-x-2 flex-wrap gap-2" data-testid="character-hints">
      {Array.from({ length: answer.length }, (_, index) => renderCharacterBox(index))}
    </div>
  );
}
