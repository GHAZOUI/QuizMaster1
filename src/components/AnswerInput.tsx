import React from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Text } from 'react-native-paper';

interface AnswerInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  answer: string;
}

export default function AnswerInput({ value, onChangeText, onSubmit, answer }: AnswerInputProps) {
  const renderCharacterFeedback = () => {
    const userChars = value.toLowerCase().split('');
    const correctChars = answer.toLowerCase().split('');
    
    return (
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackLabel}>Vérification caractère par caractère:</Text>
        <View style={styles.charactersRow}>
          {correctChars.map((correctChar, index) => {
            const userChar = userChars[index];
            let backgroundColor = '#F3F4F6'; // Default gray
            let textColor = '#6B7280';
            
            if (userChar) {
              if (userChar === correctChar) {
                backgroundColor = '#10B981'; // Green for correct
                textColor = 'white';
              } else {
                backgroundColor = '#EF4444'; // Red for incorrect
                textColor = 'white';
              }
            }
            
            return (
              <View
                key={index}
                style={[
                  styles.characterBox,
                  { backgroundColor }
                ]}
              >
                <Text style={[styles.characterText, { color: textColor }]}>
                  {correctChar === ' ' ? '⎵' : (userChar || '_')}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Votre réponse"
        value={value}
        onChangeText={onChangeText}
        onSubmitEditing={onSubmit}
        mode="outlined"
        style={styles.input}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
      />
      
      {value.length > 0 && renderCharacterFeedback()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  input: {
    marginBottom: 16,
  },
  feedbackContainer: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  feedbackLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  charactersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
  },
  characterBox: {
    minWidth: 28,
    height: 32,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  characterText: {
    fontSize: 14,
    fontWeight: '600',
  },
});