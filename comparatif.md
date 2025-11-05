# 🚀 Analyse et Restitution : API Hybride Bookly-

Ce document résume l'analyse du projet d'API hybride (SQL + NoSQL) "Bookly-".

## 1. Ce que j'ai appris sur la complémentarité SQL/NoSQL

Ce projet m'a permis de comprendre concrètement pourquoi une entreprise choisirait de ne pas "tout mettre" dans une seule base de données.

* **Pour SQL (PostgreSQL) :**
    J'ai utilisé SQL pour les données `users` et `books`. J'ai compris que sa force réside dans la **structure** et la **garantie des données**.
    *(Par exemple : la contrainte `UNIQUE` sur l'email est gérée nativement, les relations entre tables sont claires, on sait exactement à quoi s'attendre).*

* **Pour NoSQL (MongoDB) :**
    J'ai utilisé NoSQL pour les `profiles` (préférences, historique). J'ai vu que sa force est dans la **flexibilité**.
    *(Par exemple : je n'ai pas eu besoin de définir une structure fixe pour les préférences. L'historique de lecture est un tableau qui peut grandir sans impacter la performance de la table principale).*

* **La complémentarité (Le "Pont") :**
    Le "déclic" a été la création de la route `/api/user-full/:id`. J'ai compris que je pouvais utiliser l'ID stable et fiable de PostgreSQL (`users.id`) comme **clé de liaison** (`_id`) pour le document flexible dans MongoDB. On garde ainsi la rigueur (SQL) comme "source de vérité" pour l'identité, et la souplesse (NoSQL) pour tout ce qui gravite autour.

---

## 2. Les difficultés rencontrées

* **Configuration de l'environnement :**
    La difficulté la plus importante a été la configuration de **PostgreSQL** sur mon environnement local (Fedora). J'ai dû :
    1.  Comprendre le fichier `pg_hba.conf`.
    2.  Gérer les méthodes d'authentification (`peer` vs `md5`).
    3.  Changer le mot de passe de l'utilisateur `postgres` via `psql`.
    Cette étape a pris du temps mais a été très formatrice.

* **Démarrage asynchrone :**
    J'ai rencontré un bug où mes tests échouaient (Erreur 500). J'ai appris que c'était parce que mon serveur Express acceptait des requêtes **avant** que la connexion à Mongoose (MongoDB) ne soit totalement terminée. J'ai dû modifier `server.js` pour utiliser une fonction `async startServer` qui `await` les connexions avant de lancer `app.listen()`.

* **Erreurs de modèles :**
    J'ai eu une erreur `Profile.findById is not a function`. J'ai appris que cela venait d'une erreur d'exportation dans mon modèle Mongoose (j'exportais le `Schema` au lieu du `Model` compilé).

---

## 3. Les avantages du modèle hybride

* **Le meilleur des deux mondes :** On ne fait pas de compromis. On utilise la **rigueur** de SQL pour les données critiques et la **souplesse** de NoSQL pour les données annexes ou volumineuses (comme un historique, des logs, des préférences, etc.).

* **Performance :** Si j'avais mis l'historique de lecture en SQL, j'aurais eu besoin d'une table de jointure. Lire le profil complet d'un utilisateur aurait nécessité des jointures complexes. Ici, une requête sur SQL et une requête par clé sur Mongo sont très rapides.

* **Évolutivité :** Si demain je veux ajouter une nouvelle préférence (ex: "theme_sombre: true"), je n'ai **aucune modification de structure** de base de données à faire. Je l'ajoute simplement à l'objet `preferences` dans MongoDB.

---

## 4. Schéma d'architecture final

Voici une représentation de l'architecture de l'API.

*(Vous pouvez créer un schéma simple sur [Draw.io (diagrams.net)](https://app.diagrams.net/) et l'exporter en image, ou même le dessiner à la main et l'insérer ici)*.

**Exemple de structure pour le schéma :**

> [ **Client** (Postman / Jest / Front-end) ]
> |
> v
> [ **API Node.js / Express** (`server.js`) ]
> |
> +--- (Port :5000) ---+
> |                     |
> v                     v
> [ **Routes** ]          [ **Routes** ]
> `(ex: /api/users)`    `(ex: /api/profiles)`
> |                     |
> v                     v
> [ **Contrôleurs SQL** ] [ **Contrôleurs NoSQL** ]
> |                     |
> v                     v
> [ **Base PostgreSQL** ] [ **Base MongoDB** ]
> *(Tables: users, books)* *(Collection: profiles)*
>
> **La Route Mixte (`/api/user-full/:id`) :**
> Le contrôleur `getFullUserById` fait appel aux deux bases (PostgreSQL D'ABORD, puis MongoDB avec l'ID reçu) avant de fusionner les résultats.
