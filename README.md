# Festival Backend Core

API backend permettant de gérer les utilisateurs, les événements, les créneaux et les réservations d'un festival de photographie.

## Prérequis

- Node.js 22 ou une version plus récente
- npm
- Docker Desktop

## Installation

Installer les dépendances :

```bash
npm install
```

Créer le fichier de configuration locale :

```bash
cp .env.example .env
```

Démarrer PostgreSQL et appliquer les migrations :

```bash
npm run db:up
npm run db:migrate
```

## Développement

```bash
npm run dev
```

L'API est accessible à l'adresse `http://localhost:3000`.

Pour arrêter PostgreSQL :

```bash
npm run db:down
```

## Tests

```bash
npm test
```

Pour vérifier la compilation TypeScript :

```bash
npm run build
```

## Routes disponibles

### Vérifier l'état de l'API

```http
GET /health
```

### Inscrire un utilisateur

```http
POST /users/register
Content-Type: application/json
```

Corps de la requête :

```json
{
  "name": "Raphael PAES",
  "email": "raphael.paes@example.com",
  "password": "mot-de-passe-securise"
}
```

Réponse `201 Created` :

```json
{
  "user": {
    "id": "c40ee0a5-03c7-4866-b163-8a44d8d60c66",
    "name": "Raphael PAES",
    "email": "raphael.paes@example.com",
    "role": "VISITOR",
    "createdAt": "2026-06-29T15:27:42.227Z"
  }
}
```

Le mot de passe et son hash ne sont jamais présents dans la réponse.

### Se connecter

```http
POST /auth/login
Content-Type: application/json
```

Corps de la requête :

```json
{
  "email": "raphael.paes@example.com",
  "password": "mot-de-passe-securise"
}
```

Réponse `200 OK` :

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "c40ee0a5-03c7-4866-b163-8a44d8d60c66",
    "name": "Raphael PAES",
    "email": "raphael.paes@example.com",
    "role": "VISITOR"
  }
}
```

Une adresse inconnue ou un mot de passe incorrect produit la même réponse `401 Unauthorized`. Cette règle évite de révéler si un compte existe.

## Clean Architecture

Le code source est organisé en plusieurs couches :

- `domain` : entités, règles métier et contrats des repositories ;
- `application` : cas d'usage et ports nécessaires à leur fonctionnement ;
- `infrastructure` : Prisma, PostgreSQL, bcrypt et implémentations techniques ;
- `interfaces` : controllers, routes et middlewares HTTP ;
- `main` : création de l'application et assemblage des dépendances.

La fonctionnalité d'inscription comprend une entité `User`, le contrat `UserRepository`, le port `PasswordHasher` et le cas d'usage `RegisterUser`. Le cas d'usage ne dépend pas directement de Prisma ou de bcrypt. Ces outils sont injectés au démarrage de l'application.

Le repository en mémoire permet de tester les règles sans base de données. `PrismaUserRepository` fournit l'implémentation réelle avec PostgreSQL.

## Authentification avancée

L'inscription utilise bcrypt avec 12 tours de salage. L'adresse e-mail doit être unique, le mot de passe doit contenir au moins huit caractères et le rôle initial est `VISITOR`.

La connexion compare le mot de passe avec le hash enregistré et génère un JWT signé avec l'algorithme `HS256`. Le token expire après une heure et contient uniquement l'identifiant de l'utilisateur dans `sub` et son rôle. Le secret et la durée sont configurés avec `JWT_SECRET` et `JWT_EXPIRES_IN`.

Les prochaines étapes ajouteront la vérification du JWT dans les requêtes, la protection des routes et le contrôle des rôles et permissions.
