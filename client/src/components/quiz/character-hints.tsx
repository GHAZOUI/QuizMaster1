interface CharacterHintsProps {
  answer: string;
  userInput: string;
}

export default function CharacterHints({ answer, userInput }: CharacterHintsProps) {
  const renderCharacterBox = (index: number) => {
    const userChar = userInput[index]?.toUpperCase() || "";
    const hasInput = index < userInput.length;
    
    return (
      <div
        key={index}
        className="w-10 h-10 border-2 border-gray-300 rounded-lg flex items-center justify-center text-lg font-semibold bg-white"
        data-testid={`char-box-${index}`}
      >
        <span className={hasInput ? "text-primary" : "text-gray-400"}>
          {userChar}
        </span>
      </div>
    );
  };

  return (
    <div className="flex justify-center space-x-2 flex-wrap gap-2" data-testid="character-hints">
      {Array.from({ length: answer.length }, (_, index) => renderCharacterBox(index))}
    </div>
  );
}
