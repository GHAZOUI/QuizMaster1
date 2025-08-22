import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import CharacterHints from "./character-hints";
import { Lightbulb, Check } from "lucide-react";
import type { Question } from "@shared/schema";

interface AnswerInputProps {
  question: Question;
  userAnswer: string;
  onAnswerChange: (answer: string) => void;
  onSubmit: () => void;
  onShowHint: () => void;
  disabled?: boolean;
}

export default function AnswerInput({
  question,
  userAnswer,
  onAnswerChange,
  onSubmit,
  onShowHint,
  disabled = false
}: AnswerInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && userAnswer.trim()) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      {/* Character hint display */}
      <CharacterHints answer={question.answer} userInput={userAnswer} />

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
          {userAnswer.length}/{question.answer.length} characters
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
