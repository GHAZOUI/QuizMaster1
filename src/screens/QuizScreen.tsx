import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Button, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import CategorySelector from '../components/CategorySelector';
import QuestionCard from '../components/QuestionCard';
import AnswerInput from '../components/AnswerInput';

export default function QuizScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Geography');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const { data: questions, isLoading } = useQuery({
    queryKey: ['questions', selectedCategory],
    queryFn: async () => {
      // Cette fonction sera connectée à votre API backend
      const response = await fetch(`http://localhost:5000/api/questions/random?category=${selectedCategory}&limit=10`);
      if (!response.ok) throw new Error('Failed to fetch questions');
      return response.json();
    },
    enabled: !!selectedCategory,
  });

  const currentQuestion = questions?.[currentQuestionIndex];

  const handleAnswer = () => {
    if (!currentQuestion) return;

    const isCorrect = userAnswer.toLowerCase().trim() === currentQuestion.answer.toLowerCase().trim();
    
    if (isCorrect) {
      setScore(score + 100);
      setCorrectAnswers(correctAnswers + 1);
      Alert.alert('Correct!', 'Bonne réponse!', [{ text: 'Continuer', onPress: nextQuestion }]);
    } else {
      Alert.alert('Incorrect', `La bonne réponse était: ${currentQuestion.answer}`, [{ text: 'Continuer', onPress: nextQuestion }]);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setUserAnswer('');
    } else {
      setShowResults(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswer('');
    setScore(0);
    setCorrectAnswers(0);
    setShowResults(false);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Chargement des questions...</Text>
      </View>
    );
  }

  if (showResults) {
    return (
      <View style={styles.container}>
        <Card style={styles.resultsCard}>
          <Card.Content>
            <View style={styles.resultsContent}>
              <Ionicons name="trophy" size={64} color="#FFD700" />
              <Text style={styles.resultsTitle}>Quiz Terminé!</Text>
              <Text style={styles.scoreText}>Score: {score} points</Text>
              <Text style={styles.accuracyText}>
                {correctAnswers}/{questions?.length || 0} bonnes réponses
              </Text>
              <Button
                mode="contained"
                onPress={restartQuiz}
                style={styles.restartButton}
              >
                Recommencer
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <CategorySelector
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />
      
      {currentQuestion && (
        <>
          <View style={styles.progressContainer}>
            <Text style={styles.progressText}>
              Question {currentQuestionIndex + 1} sur {questions?.length || 0}
            </Text>
            <Text style={styles.scoreText}>Score: {score}</Text>
          </View>

          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
          />

          <AnswerInput
            value={userAnswer}
            onChangeText={setUserAnswer}
            onSubmit={handleAnswer}
            answer={currentQuestion.answer}
          />

          <Button
            mode="contained"
            onPress={handleAnswer}
            disabled={!userAnswer.trim()}
            style={styles.submitButton}
          >
            Valider la réponse
          </Button>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
  },
  submitButton: {
    marginTop: 20,
    marginHorizontal: 16,
  },
  resultsCard: {
    margin: 16,
    elevation: 4,
  },
  resultsContent: {
    alignItems: 'center',
    padding: 20,
  },
  resultsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  accuracyText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  restartButton: {
    width: '100%',
  },
});