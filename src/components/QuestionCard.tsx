import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card, Chip } from 'react-native-paper';

interface Question {
  id: string;
  text: string;
  answer: string;
  category: string;
  difficulty: number;
  hint?: string;
}

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

export default function QuestionCard({ question, questionNumber }: QuestionCardProps) {
  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
      case 2:
        return '#10B981'; // Easy - Green
      case 3:
        return '#F59E0B'; // Medium - Yellow
      case 4:
      case 5:
        return '#EF4444'; // Hard - Red
      default:
        return '#6B7280'; // Default - Gray
    }
  };

  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return 'Facile';
    if (difficulty === 3) return 'Moyen';
    return 'Difficile';
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Text style={styles.questionNumber}>Question {questionNumber}</Text>
          <Chip
            textStyle={[styles.difficultyText, { color: getDifficultyColor(question.difficulty) }]}
            style={[styles.difficultyChip, { borderColor: getDifficultyColor(question.difficulty) }]}
            mode="outlined"
          >
            {getDifficultyLabel(question.difficulty)}
          </Chip>
        </View>
        
        <Text style={styles.questionText}>{question.text}</Text>
        
        {question.hint && (
          <View style={styles.hintContainer}>
            <Text style={styles.hintLabel}>💡 Indice:</Text>
            <Text style={styles.hintText}>{question.hint}</Text>
          </View>
        )}
        
        <View style={styles.answerHint}>
          <Text style={styles.answerHintText}>
            Réponse ({question.answer.length} lettres)
          </Text>
          <View style={styles.letterBoxes}>
            {question.answer.split('').map((letter, index) => (
              <View key={index} style={styles.letterBox}>
                <Text style={styles.letterPlaceholder}>
                  {letter === ' ' ? ' ' : '_'}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 16,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  difficultyChip: {
    backgroundColor: 'transparent',
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontSize: 18,
    lineHeight: 24,
    color: '#333',
    marginBottom: 16,
  },
  hintContainer: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  hintLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  hintText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
  answerHint: {
    alignItems: 'center',
  },
  answerHintText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  letterBoxes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 4,
  },
  letterBox: {
    width: 24,
    height: 32,
    borderBottomWidth: 2,
    borderBottomColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 2,
  },
  letterPlaceholder: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
});