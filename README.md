# Festival Backend Core

API backend permettant de gérer les utilisateurs, les événements, les créneaux et les réservations d'un festival de photographie.

## Prérequis

- Node.js 22 ou une version plus récente
- npm

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

L'API est accessible à l'adresse `http://localhost:3000`. La route de vérification de son état est `GET /health`.

## Tests

```bash
npm test
```

## Clean Architecture

Le code source est organisé en plusieurs couches : domaine, application, infrastructure, interface HTTP et composition de l'application. Les règles métier restent indépendantes d'Express, de Prisma et des autres outils externes.

La première fonctionnalité implémentée est l'inscription d'un utilisateur. Elle comprend :

- une entité `User` indépendante du framework ;
- un contrat `UserRepository` défini dans le domaine ;
- un port `PasswordHasher` défini dans la couche application ;
- un cas d'usage `RegisterUser` ;
- un repository en mémoire utilisé pour les tests ;
- des tests unitaires des règles métier.

Le cas d'usage dépend uniquement de contrats. Les futures implémentations avec Prisma et bcrypt seront placées dans l'infrastructure.

## Authentification avancée

Cette section présentera l'authentification JWT, le stockage sécurisé des mots de passe, les rôles et les permissions au fur et à mesure de leur implémentation.

À cette étape, le cas d'usage d'inscription refuse les adresses e-mail déjà utilisées, impose une longueur minimale au mot de passe et utilise une abstraction de hachage. L'implémentation réelle avec bcrypt sera ajoutée avec l'infrastructure de sécurité.
