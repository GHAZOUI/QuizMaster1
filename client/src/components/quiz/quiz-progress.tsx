interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  category: string;
  progress: number;
}

export default function QuizProgress({ 
  currentQuestion, 
  totalQuestions, 
  category, 
  progress 
}: QuizProgressProps) {
  return (
    <div className="bg-gray-100 rounded-full p-1">
      <div className="flex items-center justify-between text-xs text-gray-600 mb-1 px-2">
        <span data-testid="text-question-progress">
          Question {currentQuestion} of {totalQuestions}
        </span>
        <span data-testid="text-category">{category}</span>
      </div>
      <div className="bg-gray-200 rounded-full h-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
          data-testid="progress-bar"
        />
      </div>
    </div>
  );
}
