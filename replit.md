# QuizMaster Application

## Overview

QuizMaster est une application de quiz web avec indices de caractères et classement quotidien. L'application propose des questions dans 5 catégories (Géographie, Histoire, Sciences, Arts, Sports) avec vérification caractère par caractère des réponses. Les utilisateurs peuvent concourir dans des classements filtrés par continent, pays et catégorie.

## Préférences Utilisateur

Style de communication préféré : Langage simple et quotidien en français.

## Base de Données

### Architecture de Stockage
- **Base de données** : PostgreSQL avec Drizzle ORM (migration complète effectuée)
- **Configuration** : Base de données Neon Serverless avec pooling de connexions
- **Questions dynamiques** : Récupération automatique depuis Open Trivia Database API
- **Logique intelligente** : Fetch automatique de 50 nouvelles questions quand l'utilisateur arrive à 40 questions par catégorie

### Schéma de Base de Données

#### Table `users`
- `id` : UUID (clé primaire)
- `username` : Nom d'utilisateur unique
- `email` : Adresse email unique
- `password` : Mot de passe crypté
- `continent` : Continent de l'utilisateur
- `country` : Pays de l'utilisateur
- `totalScore` : Score total accumulé
- `quizzesCompleted` : Nombre de quiz terminés

#### Table `questions`
- `id` : UUID (clé primaire)
- `text` : Texte de la question
- `answer` : Réponse correcte (en majuscules)
- `category` : Catégorie (Geography, History, Science, Arts, Sports)
- `difficulty` : Niveau de difficulté (1-5)
- `hint` : Indice pour aider l'utilisateur

#### Table `quiz_sessions`
- `id` : UUID (clé primaire)
- `userId` : Référence vers l'utilisateur
- `score` : Score de la session
- `correctAnswers` : Nombre de bonnes réponses
- `totalQuestions` : Nombre total de questions
- `category` : Catégorie du quiz
- `completedAt` : Date de completion
- `isCompleted` : Statut de completion

#### Table `leaderboard_entries`
- `id` : UUID (clé primaire)
- `userId` : Référence vers l'utilisateur
- `score` : Score obtenu
- `category` : Catégorie du quiz
- `date` : Date de l'entrée
- `rank` : Position dans le classement

### Contenu de la Base de Données

L'application utilise un **système de questions dynamiques** :

- **Source initiale** : 50 questions par catégorie depuis Open Trivia Database API
- **Rechargement automatique** : Récupération de 50 nouvelles questions quand besoin
- **5 catégories** : Geography, History, Science, Arts, Sports
- **Niveaux de difficulté** : Medium (3) et Hard (4)
- **Déclencheur** : Fetch automatique quand moins de 50 questions disponibles
- **API externe** : https://opentdb.com/api.php avec mapping des catégories

### Types de Questions

Chaque question propose :
- **Indice de caractères** : Affichage du nombre de lettres dans la réponse
- **Indice contextuel** : Description pour aider l'utilisateur
- **Vérification caractère par caractère** : Interface visuelle montrant les lettres saisies
- **Scoring** : 100 points par bonne réponse

## Architecture Système

### Frontend (Expo React Native + TypeScript)
- **Plateforme** : Application mobile native avec Expo
- **Navigation** : React Navigation avec onglets (Quiz, Classement, Profil, Coins)
- **UI Components** : React Native Paper pour l'interface native
- **État** : TanStack Query pour la gestion des données serveur
- **Icons** : Expo Vector Icons pour les icônes natives

### Backend (Express.js + TypeScript)
- **API REST** : Routes pour questions, sessions, classements (compatible mobile)
- **Validation** : Schémas Zod pour la validation des données
- **Interface de stockage** : PostgreSQL avec Drizzle ORM
- **Serveur simplifié** : API standalone sans Vite (adapté pour Expo)

### Fonctionnalités Principales

#### Système de Quiz
- Sélection de catégorie
- Questions aléatoires par catégorie
- Affichage des indices de caractères en temps réel
- Vérification immédiate des réponses
- Feedback visuel (correct/incorrect)
- Calcul du score en temps réel

#### Classement
- Classements quotidiens automatiques
- Filtres par continent, pays et catégorie
- Affichage du rang de l'utilisateur
- Mise à jour en temps réel des positions

#### Profil Utilisateur
- Statistiques personnelles (score total, quiz complétés)
- Paramètres de localisation (continent/pays)
- Préférences de catégories
- Rang actuel dans les classements

## Modifications Récentes

**27 Août 2025 (Soir) - Configuration de Déploiement** :
- **Scripts de build ajoutés** : Configuration TypeScript pour build de production (tsconfig.server.json)
- **Fichiers de déploiement** : build.sh, start.sh, deploy.js pour automatiser le déploiement
- **Routes de production** : Version simplifiée sans auth pour déploiement (routes.production.ts)
- **Serveur production** : index.production.js avec configuration déploiement
- **Build fonctionnel** : Express server compile vers dist/ avec TypeScript
- **Déploiement Replit** : Configuration prête pour Replit Deployments
- **API mobile** : CORS configuré pour clients mobile, endpoints /api/health
- **Commands de déploiement** : 
  - Build: `node deploy.js build` ou `./build.sh`
  - Start: `node deploy.js start` ou `./start.sh`
  - Deploy: `node deploy.js deploy`

**27 Août 2025 (Soir) - Conversion vers Expo React Native** :
- **Conversion complète vers application mobile native** : Migration de React/Vite vers Expo React Native
- **Structure mobile optimisée** : Navigation par onglets avec React Navigation
- **Composants React Native** : Remplacement des composants HTML/CSS par React Native Paper
- **Interface adaptée mobile** : QuizScreen, LeaderboardScreen, ProfileScreen, CoinsScreen
- **Backend API simplifié** : Serveur Express standalone sans dépendance Vite
- **Assets générés** : Icônes et splash screen créés pour l'application mobile
- **Configuration Expo** : Metro bundler, TypeScript, babel-preset-expo configurés
- **Application fonctionnelle** : Serveur Express port 5000, Metro Bundler port 8081
- **Déploiement mobile** : Application prête pour iOS/Android via Expo Go ou émulateur

## Configuration de Déploiement

### Build et Déploiement
- **Build Command** : `node deploy.js build`
- **Run Command** : `node deploy.js start`  
- **Port** : 5000 (configuré via PORT env var)
- **Environment** : NODE_ENV=production

### Fichiers de Déploiement
- `tsconfig.server.json` : Configuration TypeScript pour build
- `deploy.js` : Script principal de déploiement
- `server/index.production.ts` : Serveur pour production
- `server/routes.production.ts` : Routes API simplifiées
- `build.sh` / `start.sh` : Scripts shell alternatifs

**26 Août 2025 (Nuit) - Authentification Replit Intégrée** :
- **Système d'authentification Replit complet** : Utilisateurs connectés via OpenID Connect 
- **Pages dédiées** : Landing page pour visiteurs, interface authentifiée pour utilisateurs connectés
- **Gestion de session** : Sessions PostgreSQL sécurisées avec connect-pg-simple
- **Redirection intelligente** : Landing page → Login Replit → Interface quiz complète
- **Intégration utilisateur** : Profile Replit (nom, email, avatar) synchronisé avec données quiz
- **Protection des routes** : Middleware d'authentification sur routes sensibles
- **Interface adaptée** : useAuth hook pour gestion état utilisateur côté client

**26 Août 2025 (Soir) - Migration Base de Données & Questions Dynamiques** :
- **Migration PostgreSQL complète** : Remplacement du stockage en mémoire par vraie BDD
- **API externe intégrée** : Récupération automatique de questions depuis Open Trivia Database
- **Système intelligent** : Fetch automatique de 50 nouvelles questions par catégorie 
- **Logique de déclenchement** : Quand l'utilisateur atteint 40 questions, recharge automatique
- **Mapping des catégories** : Geography(22), History(23), Science(17), Arts(25), Sports(21)
- **Questions à difficultés variables** : Medium et Hard mélangées automatiquement
- **Seed automatique** : 50 questions par catégorie au premier lancement

**26 Août 2025 (Matin) - Système de Paiement** :
- **Système de paiement Stripe intégré** : Achat de packs de coins avec interface Stripe sécurisée
- **Système de déblocage de caractères** : 1 coin = 1 caractère révélé dans les réponses
- **Interface de coins** : Nouvelle page d'achat avec 4 packs (10, 25, 60, 150 coins)
- **Boutons de déblocage** : Intégrés dans les indices de caractères avec feedback visuel
- **Base de données enrichie** : Champ `coins` ajouté au schéma utilisateur
- **Utilisateur par défaut** : Créé avec 10 coins pour tester le système
- **Navigation améliorée** : Nouvel onglet "Coins" dans l'interface mobile

**22 Août 2025** :
- Ajout de 30 nouvelles questions (total : 35 questions)
- Correction des erreurs de validation dans les composants Select
- Documentation complète de la base de données
- Extension du contenu dans toutes les catégories (Géographie, Histoire, Sciences, Arts, Sports)

## Technologies Utilisées

- **Frontend Mobile** : Expo React Native, TypeScript, React Navigation, React Native Paper, TanStack Query
- **Backend** : Express.js, TypeScript, Drizzle ORM
- **Base de données** : PostgreSQL avec Neon Serverless Database
- **Mobile** : Expo SDK, Metro Bundler, expo-vector-icons
- **Development** : Concurrently pour backend + Expo simultanés