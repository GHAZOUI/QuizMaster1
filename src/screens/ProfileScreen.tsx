import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Button, Avatar, Chip } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
  totalScore: number;
  quizzesCompleted: number;
  coins: number;
  continent: string;
  country: string;
}

export default function ProfileScreen() {
  const [selectedCategories, setSelectedCategories] = useState(['Geography', 'History']);

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/auth/user');
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });

  const { data: userRank } = useQuery({
    queryKey: ['user-rank', user?.id],
    queryFn: async () => {
      const response = await fetch(`http://localhost:5000/api/users/${user?.id}/rank/Geography`);
      if (!response.ok) throw new Error('Failed to fetch rank');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const categories = [
    { id: 'Geography', label: 'Géographie', completed: 23 },
    { id: 'History', label: 'Histoire', completed: 18 },
    { id: 'Science', label: 'Sciences', completed: 12 },
    { id: 'Arts', label: 'Arts', completed: 5 },
    { id: 'Sports', label: 'Sports', completed: 8 },
  ];

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleExportStats = () => {
    Alert.alert(
      'Fonctionnalité à venir',
      'L\'export des statistiques sera disponible dans une prochaine mise à jour.'
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', style: 'destructive', onPress: () => {
          // Handle logout logic here
        }}
      ]
    );
  };

  if (isLoading || !user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Chargement du profil...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* User Stats Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <View style={styles.userHeader}>
            <Avatar.Image
              size={80}
              source={{ uri: user.profileImageUrl || 'https://via.placeholder.com/80' }}
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{user.username || `${user.firstName} ${user.lastName}`}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.totalScore?.toLocaleString() || 0}</Text>
              <Text style={styles.statLabel}>Points Totaux</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.quizzesCompleted || 0}</Text>
              <Text style={styles.statLabel}>Quiz</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userRank?.rank || 'N/A'}</Text>
              <Text style={styles.statLabel}>Rang</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Location Card */}
      <Card style={styles.locationCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Ionicons name="location" size={20} color="#6366F1" />
            <Text style={styles.sectionTitle}>Localisation</Text>
          </View>
          <View style={styles.locationInfo}>
            <Text style={styles.locationText}>
              📍 {user.country || 'Pays non défini'}, {user.continent || 'Continent non défini'}
            </Text>
            <Button mode="outlined" onPress={() => Alert.alert('Fonctionnalité à venir', 'La modification de localisation sera disponible bientôt.')}>
              Modifier
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Favorite Categories Card */}
      <Card style={styles.categoriesCard}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Ionicons name="list" size={20} color="#6366F1" />
            <Text style={styles.sectionTitle}>Catégories Favorites</Text>
          </View>
          
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <View key={category.id} style={styles.categoryRow}>
                <Chip
                  mode={selectedCategories.includes(category.id) ? 'flat' : 'outlined'}
                  selected={selectedCategories.includes(category.id)}
                  onPress={() => handleCategoryToggle(category.id)}
                  style={styles.categoryChip}
                >
                  {category.label}
                </Chip>
                <Text style={styles.categoryStats}>{category.completed} complétés</Text>
              </View>
            ))}
          </View>
        </Card.Content>
      </Card>

      {/* Actions Card */}
      <Card style={styles.actionsCard}>
        <Card.Content>
          <Button
            mode="outlined"
            onPress={handleExportStats}
            style={styles.actionButton}
            icon="download"
          >
            📊 Exporter les Statistiques
          </Button>
          
          <Button
            mode="outlined"
            onPress={handleLogout}
            style={styles.actionButton}
            icon="logout"
          >
            🚪 Se Déconnecter
          </Button>
        </Card.Content>
      </Card>
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
    fontSize: 16,
    color: '#666',
  },
  statsCard: {
    marginBottom: 16,
    elevation: 4,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  email: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  locationCard: {
    marginBottom: 16,
    elevation: 2,
  },
  categoriesCard: {
    marginBottom: 16,
    elevation: 2,
  },
  actionsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  categoriesGrid: {
    gap: 8,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  categoryChip: {
    flex: 1,
    marginRight: 16,
  },
  categoryStats: {
    fontSize: 12,
    color: '#666',
  },
  actionButton: {
    marginBottom: 12,
  },
});