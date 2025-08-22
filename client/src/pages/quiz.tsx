import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import QuizProgress from "@/components/quiz/quiz-progress";
import QuestionCard from "@/components/quiz/question-card";
import AnswerInput from "@/components/quiz/answer-input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Trophy, RefreshCw } from "lucide-react";
import type { Question, QuizSession } from "@shared/schema";

interface QuizPageProps {
  userId: string;
}

export default function QuizPage({ userId }: QuizPageProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("Geography");
  const [quizSession, setQuizSession] = useState<QuizSession | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [answerFeedback, setAnswerFeedback] = useState<{
    show: boolean;
    isCorrect: boolean;
    message: string;
  }>({ show: false, isCorrect: false, message: "" });

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['/api/questions/random', selectedCategory, '10'],
    enabled: !!selectedCategory
  });

  const { data: categories } = useQuery({
    queryKey: ['/api/questions/categories']
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await fetch('/api/quiz-sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      return response.json();
    },
    onSuccess: (session) => {
      setQuizSession(session);
    }
  });

  const completeQuizMutation = useMutation({
    mutationFn: async ({ sessionId, score, correctAnswers }: any) => {
      const response = await fetch(`/api/quiz-sessions/${sessionId}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, correctAnswers })
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/leaderboard'] });
      setShowResults(true);
    }
  });

  useEffect(() => {
    if (questions && questions.length > 0 && !quizSession) {
      createSessionMutation.mutate({
        userId,
        category: selectedCategory,
        totalQuestions: questions.length
      });
    }
  }, [questions, selectedCategory, userId]);

  const currentQuestion = questions?.[currentQuestionIndex];
  const totalQuestions = questions?.length || 0;
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0;

  const handleSubmitAnswer = () => {
    if (!currentQuestion || !userAnswer.trim()) return;

    const isCorrect = userAnswer.trim().toLowerCase() === currentQuestion.answer.toLowerCase();
    
    if (isCorrect) {
      const points = 100;
      setScore(prev => prev + points);
      setCorrectAnswers(prev => prev + 1);
      setAnswerFeedback({
        show: true,
        isCorrect: true,
        message: `Correct! +${points} points earned`
      });
    } else {
      setAnswerFeedback({
        show: true,
        isCorrect: false,
        message: `Incorrect. The answer was: ${currentQuestion.answer}`
      });
    }

    setTimeout(() => {
      setAnswerFeedback({ show: false, isCorrect: false, message: "" });
      
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setUserAnswer("");
      } else {
        // Quiz complete
        if (quizSession) {
          completeQuizMutation.mutate({
            sessionId: quizSession.id,
            score,
            correctAnswers: isCorrect ? correctAnswers + 1 : correctAnswers
          });
        }
      }
    }, 2000);
  };

  const handleNewQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer("");
    setScore(0);
    setCorrectAnswers(0);
    setQuizSession(null);
    setShowResults(false);
    queryClient.invalidateQueries({ queryKey: ['/api/questions/random'] });
  };

  const showHint = () => {
    if (currentQuestion?.hint) {
      alert(currentQuestion.hint);
    }
  };

  if (questionsLoading) {
    return (
      <div className="p-4 flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="animate-spin w-8 h-8 mx-auto mb-4 text-primary" />
          <p className="text-gray-600">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">No questions available for this category.</p>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Category Selection */}
      <div className="mb-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-xl focus:border-primary focus:outline-none"
          data-testid="select-category"
        >
          {categories?.map((category: string) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      <QuizProgress
        currentQuestion={currentQuestionIndex + 1}
        totalQuestions={totalQuestions}
        category={selectedCategory}
        progress={progress}
      />

      <QuestionCard question={currentQuestion} />

      <AnswerInput
        question={currentQuestion}
        userAnswer={userAnswer}
        onAnswerChange={setUserAnswer}
        onSubmit={handleSubmitAnswer}
        onShowHint={showHint}
        disabled={answerFeedback.show}
      />

      {/* Answer Feedback */}
      {answerFeedback.show && (
        <div
          className={`rounded-xl p-4 flex items-center space-x-3 ${
            answerFeedback.isCorrect
              ? 'bg-secondary/10 border border-secondary/20'
              : 'bg-destructive/10 border border-destructive/20'
          }`}
          data-testid="feedback-answer"
        >
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center ${
              answerFeedback.isCorrect ? 'bg-secondary' : 'bg-destructive'
            }`}
          >
            <span className="text-white">
              {answerFeedback.isCorrect ? '✓' : '✗'}
            </span>
          </div>
          <div className="flex-1">
            <p
              className={`font-medium ${
                answerFeedback.isCorrect ? 'text-secondary' : 'text-destructive'
              }`}
            >
              {answerFeedback.isCorrect ? 'Correct!' : 'Incorrect!'}
            </p>
            <p className="text-sm text-gray-600">{answerFeedback.message}</p>
          </div>
        </div>
      )}

      {/* Results Modal */}
      <Dialog open={showResults} onOpenChange={setShowResults}>
        <DialogContent className="max-w-sm">
          <div className="text-center space-y-4 p-6">
            <div className="w-20 h-20 bg-secondary/10 rounded-full flex items-center justify-center mx-auto">
              <Trophy className="text-secondary text-3xl w-10 h-10" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800" data-testid="text-quiz-complete">Quiz Complete!</h2>
            
            <div className="space-y-2">
              <p className="text-3xl font-bold text-primary" data-testid="text-final-score">{score} points</p>
              <p className="text-gray-600" data-testid="text-correct-answers">
                {correctAnswers} out of {totalQuestions} correct
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-800 mb-2">Great Job!</h3>
              <p className="text-sm text-gray-600">
                You completed the {selectedCategory} quiz with {Math.round((correctAnswers / totalQuestions) * 100)}% accuracy!
              </p>
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowResults(false)}
                data-testid="button-close-results"
              >
                Close
              </Button>
              <Button
                className="flex-1"
                onClick={handleNewQuiz}
                data-testid="button-play-again"
              >
                Play Again
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
