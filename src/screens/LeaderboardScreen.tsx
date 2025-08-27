import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { Card, Chip, ActivityIndicator } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

interface LeaderboardEntry {
  id: string;
  userId: string;
  username: string;
  score: number;
  rank: number;
  country: string;
}

export default function LeaderboardScreen() {
  const [selectedCategory, setSelectedCategory] = useState('Geography');
  const [selectedFilter, setSelectedFilter] = useState('global');

  const { data: leaderboard, isLoading } = useQuery({
    queryKey: ['leaderboard', selectedCategory, selectedFilter],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/leaderboard?category=${selectedCategory}&filter=${selectedFilter}`);
      if (!response.ok) throw new Error('Failed to fetch leaderboard');
      return response.json();
    },
  });

  const categories = [
    { id: 'Geography', label: 'Géographie' },
    { id: 'History', label: 'Histoire' },
    { id: 'Science', label: 'Sciences' },
    { id: 'Arts', label: 'Arts' },
    { id: 'Sports', label: 'Sports' },
  ];

  const filters = [
    { id: 'global', label: 'Global' },
    { id: 'country', label: 'Pays' },
    { id: 'continent', label: 'Continent' },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `${rank}`;
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return '#FFD700'; // Gold
    if (rank === 2) return '#C0C0C0'; // Silver
    if (rank === 3) return '#CD7F32'; // Bronze
    return '#6B7280'; // Gray
  };

  const renderLeaderboardItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => (
    <Card style={styles.entryCard}>
      <Card.Content style={styles.entryContent}>
        <View style={[styles.rankContainer, { backgroundColor: getRankColor(item.rank) }]}>
          <Text style={styles.rankText}>{getRankIcon(item.rank)}</Text>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.username}>{item.username || `Joueur ${item.userId.slice(0, 8)}`}</Text>
          <Text style={styles.country}>{item.country || 'Pays inconnu'}</Text>
        </View>
        
        <View style={styles.scoreContainer}>
          <Text style={styles.score}>{item.score.toLocaleString()}</Text>
          <Text style={styles.pointsLabel}>points</Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Chargement du classement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header with reset timer */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <Ionicons name="trophy" size={24} color="#FFD700" />
            <Text style={styles.headerTitle}>Classement Quotidien</Text>
            <Text style={styles.resetTimer}>⏰ Remise à zéro dans 6h 23m</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Category filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
      >
        {categories.map((category) => (
          <Chip
            key={category.id}
            mode={selectedCategory === category.id ? 'flat' : 'outlined'}
            selected={selectedCategory === category.id}
            onPress={() => setSelectedCategory(category.id)}
            style={styles.filterChip}
          >
            {category.label}
          </Chip>
        ))}
      </ScrollView>

      {/* Scope filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.scopeFiltersContainer}
      >
        {filters.map((filter) => (
          <Chip
            key={filter.id}
            mode={selectedFilter === filter.id ? 'flat' : 'outlined'}
            selected={selectedFilter === filter.id}
            onPress={() => setSelectedFilter(filter.id)}
            style={styles.filterChip}
          >
            {filter.label}
          </Chip>
        ))}
      </ScrollView>

      {/* Leaderboard list */}
      <FlatList
        data={leaderboard || []}
        renderItem={renderLeaderboardItem}
        keyExtractor={(item) => item.id}
        style={styles.leaderboardList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Aucune entrée trouvée pour ces filtres</Text>
            <Text style={styles.emptySubtext}>Soyez le premier à terminer un quiz aujourd'hui!</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
  headerCard: {
    margin: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    marginLeft: 8,
  },
  resetTimer: {
    fontSize: 12,
    color: '#666',
  },
  filtersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  scopeFiltersContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterChip: {
    marginRight: 8,
  },
  leaderboardList: {
    flex: 1,
    paddingHorizontal: 16,
  },
  entryCard: {
    marginBottom: 8,
    elevation: 2,
  },
  entryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rankText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  country: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  scoreContainer: {
    alignItems: 'flex-end',
  },
  score: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  pointsLabel: {
    fontSize: 12,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
});