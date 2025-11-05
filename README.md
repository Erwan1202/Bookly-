🚀 BOOKLY- : API HYBRIDE SQL + NOSQL
==================================

🛠️ TECHNOLOGIES UTILISÉES
------------------------
* Serveur : Node.js
* Framework : Express
* Base de données SQL : PostgreSQL (avec le module pg)
* Base de données NoSQL : MongoDB (avec le module mongoose)
* Gestion des variables d'env : dotenv
* Tests : jest et supertest

--------------------------------------------------

🏗️ ARCHITECTURE DES DONNÉES
--------------------------
* Base PostgreSQL (La "Source de Vérité")
    * users : Stocke les informations d'identification (id, nom, email).
    * books : Stocke le catalogue de livres (id, titre, auteur).

* Base MongoDB (La "Donnée Flexible")
    * profiles : Stocke les données annexes liées à un utilisateur. Le champ _id de cette collection est identique à l' id de l'utilisateur en SQL, ce qui forme le "pont" entre les deux systèmes.

--------------------------------------------------

⚙️ INSTALLATION ET DÉMARRAGE
---------------------------

Suivez ces étapes pour lancer le projet localement.

1. Prérequis
    * Node.js (v18+)
    * Un serveur PostgreSQL en cours d'exécution.
    * Un serveur MongoDB (local ou Atlas) en cours d'exécution.

2. Cloner le projet
    # Clonez ce dépôt
    git clone <votre-url-de-depot>
    cd bookly-hybrid

3. Installer les dépendances
    npm install

4. Configurer l'environnement
    Créez un fichier .env à la racine du projet et copiez-y le contenu suivant. Adaptez les valeurs à votre configuration locale.

    # Fichier .env.example

    # Configuration PostgreSQL
    # Note : PG_HOST=127.0.0.1 est souvent requis (plutôt que localhost)
    # pour forcer l'authentification par mot de passe.
    PG_USER=postgres
    PG_HOST=127.0.0.1
    PG_DATABASE=bookly_sql
    PG_PASSWORD=votre_mot_de_passe_pg
    PG_PORT=5432

    # Configuration MongoDB
    MONGO_URI=mongodb://localhost:27017/bookly_nosql

    # Port du serveur
    PORT=5000

5. Configurer les bases de données
    1. PostgreSQL :
        * Assurez-vous que votre utilisateur (PG_USER) a les droits et le bon mot de passe.
        * Connectez-vous à psql et créez la base de données :
            CREATE DATABASE bookly_sql;
        * Note : Si vous avez des problèmes d'authentification, vérifiez votre fichier pg_hba.conf pour autoriser les connexions md5 sur 127.0.0.1.

    2. MongoDB :
        * Aucune configuration initiale n'est requise, Mongoose créera la base bookly_nosql lors de la première connexion.

6. Lancer le serveur
    node server.js

    Le serveur va démarrer, se connecter aux deux bases de données et créer automatiquement les tables users et books dans PostgreSQL si elles n'existent pas.

    Vous devriez voir :
    Connexion à MongoDB réussie !
    Connexion à PostgreSQL réussie.
    Table "users" créée ou déjà existante.
    Table "books" créée ou déjà existante.
    Serveur démarré sur http://localhost:5000

--------------------------------------------------

✅ EXÉCUTER LES TESTS
---------------------
Ce projet inclut une suite de tests d'intégration automatisés avec Jest et Supertest.

1. Terminal 1 : Laissez votre serveur principal tourner.
    node server.js

2. Terminal 2 : Lancez la commande de test.
    npm test

Les tests vont créer un utilisateur, lui assigner un profil, mettre à jour ce profil, et vérifier la route mixte.

--------------------------------------------------

📖 DOCUMENTATION DE L'API
------------------------

Routes SQL (PostgreSQL)
-----------------------
Méthode   Endpoint       Action
-------   ------------   --------------------------------
GET       /api/users     Liste de tous les utilisateurs
POST      /api/users     Ajout d'un nouvel utilisateur
GET       /api/books     Liste de tous les livres
POST      /api/books     Ajout d'un nouveau livre

Routes NoSQL (MongoDB)
----------------------
Méthode   Endpoint                Action
-------   ---------------------   ---------------------------------------
POST      /api/profiles           Crée un profil (lié à un _id SQL)
GET       /api/profiles/:userId   Récupère le profil Mongo d'un utilisateur
PUT       /api/profiles/:userId   Met à jour les préférences ou l'historique

Route Hybride (Le Pont)
-----------------------
C'est la route principale qui combine les deux systèmes.

Méthode   Endpoint                  Action
-------   -----------------------   -----------------------------------------------------------
GET       /api/users/user-full/:id  Renvoie les infos utilisateur (SQL) et son profil (NoSQL)

Exemple de réponse pour la route hybride :
{
  "id": 1,
  "name": "Alice",
  "email": "alice@email.com",
  "profile": {
    "preferences": {
      "genres_favoris": ["Fantasy"],
      "auteurs_preferes": []
    },
    "history": [
      {
        "book": "Livre de Test",
        "rating": 5
      }
    ]
  }
}