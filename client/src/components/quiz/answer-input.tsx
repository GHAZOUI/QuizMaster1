import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CharacterHints from "./character-hints";
import { Lightbulb, Check } from "lucide-react";
import type { Question } from "@shared/schema";

interface AnswerInputProps {
  question: Question | undefined;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onShowHint: () => void;
  disabled?: boolean;
  userId: string;
}

export default function AnswerInput({
  question,
  userAnswer,
  onAnswerChange,
  onSubmit,
  onShowHint,
  disabled = false,
  userId
}: AnswerInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  if (!question) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="w-10 h-10 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="h-12 bg-gray-200 rounded-xl mt-4"></div>
          <div className="flex space-x-3 mt-4">
            <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
            <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Character hint display */}
      <CharacterHints answer={question.answer || ""} userInput={userAnswer} userId={userId} />

      {/* Text input */}
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Type your answer here..."
          value={userAnswer}
          onChange={(e) => onAnswerChange(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full p-4 border-2 border-gray-300 rounded-xl text-center text-lg font-medium focus:border-primary focus:outline-none transition-colors"
          disabled={disabled}
          data-testid="input-answer"
        />
        <p className="text-xs text-gray-500 text-center" data-testid="text-character-count">
          {userAnswer.length}/{question.answer?.length || 0} characters
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex space-x-3">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onShowHint}
          disabled={disabled}
          data-testid="button-hint"
        >
          <Lightbulb className="w-4 h-4 mr-2" />
          Hint
        </Button>
        <Button
          className="flex-1"
          onClick={onSubmit}
          disabled={disabled || !userAnswer.trim()}
          data-testid="button-submit"
        >
          <Check className="w-4 h-4 mr-2" />
          Submit
        </Button>
      </div>
    </div>
  );
}
