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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

interface CoinPackage {
  id: string;
  name: string;
  coins: number;
  price: number;
  bonus?: number;
  popular?: boolean;
}

const coinPackages: CoinPackage[] = [
  { id: 'small', name: 'Pack Petit', coins: 10, price: 2 },
  { id: 'medium', name: 'Pack Moyen', coins: 25, price: 5, bonus: 5 },
  { id: 'large', name: 'Pack Grand', coins: 60, price: 10, bonus: 15, popular: true },
  { id: 'mega', name: 'Pack Mega', coins: 150, price: 20, bonus: 50 }
];

export default function CoinsScreen() {
  const [selectedPackage, setSelectedPackage] = useState<CoinPackage | null>(null);
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/api/auth/user');
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },
  });

  const purchaseMutation = useMutation({
    mutationFn: async (packageData: CoinPackage) => {
      // Simulate payment processing
      const response = await fetch(`http://localhost:5000/api/users/${user?.id}/add-coins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ coins: packageData.coins + (packageData.bonus || 0) })
      });
      if (!response.ok) throw new Error('Payment failed');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      Alert.alert(
        'Achat réussi! 🎉',
        'Vos coins ont été ajoutés à votre compte.',
        [{ text: 'Parfait!' }]
      );
      setSelectedPackage(null);
    },
    onError: () => {
      Alert.alert(
        'Erreur de paiement',
        'Une erreur est survenue lors du traitement de votre paiement. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  });

  const handlePurchase = (pkg: CoinPackage) => {
    Alert.alert(
      'Confirmer l\'achat',
      `Voulez-vous acheter ${pkg.name} pour ${pkg.price}€ ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Acheter', 
          onPress: () => purchaseMutation.mutate(pkg) 
        }
      ]
    );
  };

  const renderCoinPackage = (pkg: CoinPackage) => (
    <TouchableOpacity
      key={pkg.id}
      onPress={() => setSelectedPackage(pkg)}
      style={[
        styles.packageCard,
        selectedPackage?.id === pkg.id && styles.selectedPackage,
        pkg.popular && styles.popularPackage
      ]}
    >
      {pkg.popular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>POPULAIRE</Text>
        </View>
      )}
      
      <View style={styles.packageHeader}>
        <Ionicons name="diamond" size={32} color="#FFD700" />
        <Text style={styles.packageName}>{pkg.name}</Text>
      </View>
      
      <View style={styles.coinsInfo}>
        <Text style={styles.coinsAmount}>{pkg.coins}</Text>
        <Text style={styles.coinsLabel}>coins</Text>
        {pkg.bonus && (
          <Text style={styles.bonusText}>+ {pkg.bonus} bonus!</Text>
        )}
      </View>
      
      <View style={styles.priceContainer}>
        <Text style={styles.price}>{pkg.price}€</Text>
        {pkg.bonus && (
          <Text style={styles.totalCoins}>
            Total: {pkg.coins + pkg.bonus} coins
          </Text>
        )}
      </View>
      
      <Button
        mode={selectedPackage?.id === pkg.id ? 'contained' : 'outlined'}
        onPress={() => handlePurchase(pkg)}
        style={styles.purchaseButton}
        loading={purchaseMutation.isPending && selectedPackage?.id === pkg.id}
      >
        {purchaseMutation.isPending && selectedPackage?.id === pkg.id 
          ? 'Traitement...' 
          : 'Acheter'
        }
      </Button>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6366F1" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Header with current coins */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <View style={styles.coinsDisplay}>
              <Ionicons name="diamond" size={24} color="#FFD700" />
              <Text style={styles.currentCoins}>{user?.coins || 0} coins</Text>
            </View>
            <Text style={styles.headerDescription}>
              Utilisez les coins pour débloquer des indices dans les quiz!
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* How it works section */}
      <Card style={styles.infoCard}>
        <Card.Content>
          <Text style={styles.infoTitle}>💡 Comment ça marche ?</Text>
          <View style={styles.infoList}>
            <Text style={styles.infoItem}>• 1 coin = 1 caractère révélé dans une réponse</Text>
            <Text style={styles.infoItem}>• Débloquez des lettres pour vous aider</Text>
            <Text style={styles.infoItem}>• Plus vous jouez, plus vous progressez!</Text>
            <Text style={styles.infoItem}>• Packs bonus avec coins gratuits inclus</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Coin packages */}
      <Text style={styles.sectionTitle}>Choisissez votre pack de coins</Text>
      
      <View style={styles.packagesGrid}>
        {coinPackages.map(renderCoinPackage)}
      </View>

      {/* Security notice */}
      <Card style={styles.securityCard}>
        <Card.Content>
          <View style={styles.securityHeader}>
            <Ionicons name="shield-checkmark" size={20} color="#10B981" />
            <Text style={styles.securityTitle}>Paiement sécurisé</Text>
          </View>
          <Text style={styles.securityText}>
            Tous les paiements sont traités de manière sécurisée via Stripe. 
            Vos informations sont protégées et jamais stockées sur nos serveurs.
          </Text>
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
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  headerCard: {
    marginBottom: 16,
    elevation: 4,
  },
  headerContent: {
    alignItems: 'center',
  },
  coinsDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  currentCoins: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    marginLeft: 8,
  },
  headerDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  infoCard: {
    marginBottom: 16,
    elevation: 2,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoList: {
    gap: 4,
  },
  infoItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  packagesGrid: {
    gap: 16,
    marginBottom: 24,
  },
  packageCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  selectedPackage: {
    borderColor: '#6366F1',
  },
  popularPackage: {
    borderColor: '#FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    right: 16,
    backgroundColor: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  packageHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  packageName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  coinsInfo: {
    alignItems: 'center',
    marginBottom: 16,
  },
  coinsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6366F1',
  },
  coinsLabel: {
    fontSize: 14,
    color: '#666',
  },
  bonusText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  priceContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  totalCoins: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 4,
  },
  purchaseButton: {
    width: '100%',
  },
  securityCard: {
    elevation: 2,
  },
  securityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginLeft: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
});