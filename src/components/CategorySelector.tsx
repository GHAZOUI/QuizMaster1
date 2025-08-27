import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip } from 'react-native-paper';

interface CategorySelectorProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const categories = [
  { id: 'Geography', label: 'Géographie', icon: '🌍' },
  { id: 'History', label: 'Histoire', icon: '📚' },
  { id: 'Science', label: 'Sciences', icon: '🔬' },
  { id: 'Arts', label: 'Arts', icon: '🎨' },
  { id: 'Sports', label: 'Sports', icon: '⚽' },
];

export default function CategorySelector({ selectedCategory, onCategorySelect }: CategorySelectorProps) {
  return (
    <View style={styles.container}>
      {categories.map((category) => (
        <Chip
          key={category.id}
          mode={selectedCategory === category.id ? 'flat' : 'outlined'}
          selected={selectedCategory === category.id}
          onPress={() => onCategorySelect(category.id)}
          style={[
            styles.chip,
            selectedCategory === category.id && styles.selectedChip
          ]}
        >
          {category.icon} {category.label}
        </Chip>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingBottom: 16,
    gap: 8,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#6366F1',
  },
});