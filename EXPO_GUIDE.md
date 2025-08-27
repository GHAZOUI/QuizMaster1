# Guide d'utilisation - QuizMaster Expo React Native

## Application Mobile Native

QuizMaster est maintenant une application mobile native utilisant Expo React Native. L'application fonctionne sur smartphones et tablettes iOS/Android.

## Démarrage de l'application

### Prérequis
- Node.js installé
- Application Expo Go sur votre mobile (iOS/Android)

### Lancement
```bash
npm run dev
```

Cette commande démarre :
- **Serveur API Express** : Port 5000 (backend/API)
- **Metro Bundler Expo** : Port 8081 (application mobile)

## Comment tester l'application

### Option 1: Sur téléphone/tablette (Recommandé)
1. Installez l'app **Expo Go** sur votre appareil
2. Scannez le QR code affiché dans le terminal
3. L'application QuizMaster s'ouvrira directement

### Option 2: Version web (pour développement)
1. Dans le terminal Expo, tapez `w`
2. L'application s'ouvrira dans votre navigateur
3. Note: certaines fonctionnalités mobiles peuvent différer

### Option 3: Émulateur (avancé)
- **Android**: Tapez `a` dans le terminal Expo
- **iOS**: Tapez `i` dans le terminal Expo (macOS uniquement)

## Structure de l'application

### Navigation
- **Quiz** : Interface de jeu principal avec sélection de catégories
- **Classement** : Leaderboards quotidiens par catégorie/région
- **Profil** : Statistiques et paramètres utilisateur
- **Coins** : Achat de packs de coins pour débloquer des indices

### Fonctionnalités mobiles
- Navigation tactile par onglets
- Interface adaptée aux écrans mobiles
- Composants React Native Paper optimisés
- Feedback visuel natif (alertes, animations)

## Base de données

L'application utilise PostgreSQL avec les mêmes données que la version web précédente :
- Questions dynamiques depuis Open Trivia Database
- Système de coins et déblocage de caractères
- Authentification Replit intégrée
- Classements temps réel

## Développement

### Structure des fichiers
```
├── App.tsx                    # Point d'entrée principal
├── src/screens/              # Écrans de l'application
│   ├── QuizScreen.tsx        # Interface de quiz
│   ├── LeaderboardScreen.tsx # Classements
│   ├── ProfileScreen.tsx     # Profil utilisateur
│   └── CoinsScreen.tsx       # Achat de coins
├── src/components/           # Composants réutilisables
│   ├── CategorySelector.tsx  # Sélecteur de catégories
│   ├── QuestionCard.tsx      # Affichage des questions
│   └── AnswerInput.tsx       # Saisie des réponses
├── server/                   # API Express (backend)
└── shared/schema.ts          # Schémas de base de données
```

### Technologies utilisées
- **Frontend**: Expo React Native, React Navigation, React Native Paper
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Base de données**: PostgreSQL (Neon Serverless)
- **Build**: Metro Bundler, Babel

## Déploiement

### Publication Expo
```bash
expo publish
```

### Build pour stores
```bash
# Android (APK)
expo build:android

# iOS (nécessite compte développeur Apple)
expo build:ios
```

## Dépannage

### Le serveur ne démarre pas
- Vérifiez que le port 5000 est libre
- Assurez-vous que `DATABASE_URL` est configuré

### L'application mobile ne se connecte pas
- Vérifiez que votre mobile et ordinateur sont sur le même réseau WiFi
- Redémarrez Expo avec `r` dans le terminal

### Erreurs de compilation
- Supprimez `node_modules` et relancez `npm install`
- Vérifiez que toutes les dépendances sont installées

## Support

L'application est maintenant prête pour un usage mobile complet avec toutes les fonctionnalités du quiz, système de coins, classements et authentification Replit intégrée.