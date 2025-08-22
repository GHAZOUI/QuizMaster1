import { Globe } from "lucide-react";
import type { Question } from "@shared/schema";

interface QuestionCardProps {
  question: Question;
}

export default function QuestionCard({ question }: QuestionCardProps) {
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      "Geography": "🌍",
      "History": "📜",
      "Science": "🔬",
      "Arts": "🎨",
      "Sports": "⚽"
    };
    return icons[category] || "❓";
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
          <span className="text-primary text-2xl" data-testid="icon-category">
            {getCategoryIcon(question.category)}
          </span>
        </div>
        
        <h2 className="text-lg font-semibold text-gray-800" data-testid="text-question">
          {question.text}
        </h2>
        
        <p className="text-sm text-gray-500" data-testid="text-hint">
          <span className="text-accent">💡</span>
          Hint: This answer has{" "}
          <span className="font-medium text-accent">
            {question.answer.length}
          </span>{" "}
          {question.answer.length === 1 ? "character" : "characters"}
        </p>
      </div>
    </div>
  );
}
