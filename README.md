# CarCheck — Plateforme d'inspection de véhicules d'occasion

## 📌 Présentation

**CarCheck** est une plateforme web Full-Stack dédiée à l'inspection de véhicules d'occasion. Elle met en relation des **clients** souhaitant faire inspecter un véhicule et des **mécaniciens certifiés** chargés de réaliser cette inspection.

L'application couvre l'ensemble du parcours : création d'une demande d'inspection, prise de rendez-vous selon les disponibilités du mécanicien, réalisation de l'inspection, génération d'un rapport détaillé, puis évaluation du mécanicien par le client. Un espace d'administration permet de superviser la plateforme (mécaniciens, clients, demandes, rendez-vous).

## Diagram use case 
<img width="559" height="439" alt="digram de use casse" src="https://github.com/user-attachments/assets/a0a58545-037a-4992-a9a2-84900de0d740" />

## Diagram de class
<img width="2330" height="1824" alt="Gemini_Generated_Image_jt8etnjt8etnjt8e" src="https://github.com/user-attachments/assets/c8b1a303-2bf8-4e2a-b3e2-630c2667ec55" />

## Erd
<img width="1152" height="926" alt="Gemini_Generated_Image_q8paymq8paymq8pa" src="https://github.com/user-attachments/assets/3aaba950-fe2e-4a94-8075-dde218e4120b" />

## 🎯 Objectifs du projet

- Faciliter la demande d'inspection d'un véhicule d'occasion.
- Permettre aux mécaniciens de gérer les demandes qui leur sont adressées.
- Organiser les rendez-vous selon les disponibilités déclarées par chaque mécanicien.
- Générer des rapports d'inspection détaillés et téléchargeables au format PDF.
- Permettre aux clients de suivre leurs demandes, rendez-vous et rapports.
- Mettre en place un système d'avis et de notation des mécaniciens.
- Fournir un espace d'administration pour la supervision de la plateforme.

## 👥 Acteurs et rôles

L'application distingue trois rôles (`client`, `mechanic`, `admin`), stockés sur le modèle `User`.

### Client
- Créer un compte, se connecter, réinitialiser son mot de passe et vérifier son adresse e‑mail.
- Gérer ses véhicules (ajout, consultation).
- Créer une demande d'inspection pour un véhicule (formule `standard` ou `complete`).
- Consulter et annuler ses demandes d'inspection.
- Consulter les créneaux disponibles et réserver un rendez-vous.
- Consulter et annuler ses rendez-vous.
- Ajouter des photos liées à une demande d'inspection.
- Consulter ses rapports d'inspection et les télécharger en PDF.
- Laisser un avis (note + commentaire) après réception d'un rapport.
- Consulter son tableau de bord et ses notifications.

### Mécanicien
- Créer un compte, se connecter et gérer son profil professionnel (ville, spécialisation, expérience, numéro de certification, document de certification, statut de certification).
- Consulter les demandes d'inspection qui lui sont adressées, les accepter ou les rejeter.
- Déclarer ses disponibilités hebdomadaires (jour, heure de début/fin).
- Consulter et gérer ses rendez-vous.
- Réaliser une inspection et produire un rapport détaillé (état moteur, transmission, freins, suspension, pneus, carrosserie, électricité, état général, recommandations).
- Ajouter des photos au rapport d'inspection.
- Consulter les avis reçus des clients.
- Consulter son tableau de bord et ses notifications.

### Administrateur
- Accéder à un tableau de bord global (statistiques de la plateforme).
- Consulter et gérer la liste des mécaniciens, y compris certifier ou rejeter leur certification.
- Consulter la liste des clients.
- Consulter l'ensemble des demandes d'inspection.
- Consulter l'ensemble des rendez-vous.

## 🔄 Workflow principal

```text
Client
   │
   ▼
Création d'une demande d'inspection (véhicule + formule + localisation)
   │
   ▼
Mécanicien
   │
   ▼
Acceptation (ou rejet) de la demande
   │
   ▼
Réservation d'un rendez-vous (selon les créneaux disponibles du mécanicien)
   │
   ▼
Réalisation de l'inspection du véhicule
   │
   ▼
Création du rapport d'inspection (par le mécanicien, photos incluses)
   │
   ▼
Client consulte / télécharge le rapport (PDF)
   │
   ▼
Client évalue le mécanicien (note + commentaire)
```

## 🚀 Fonctionnalités

### Authentification
Inscription, connexion, déconnexion, vérification d'e‑mail et réinitialisation de mot de passe, via l'API Laravel Breeze + Sanctum (authentification par cookies/session pour SPA).

### Gestion des véhicules
Création et consultation des véhicules d'un client (marque, modèle, année, kilométrage, immatriculation, carburant, transmission).

### Demandes d'inspection
Création, consultation, mise à jour et annulation d'une demande d'inspection par le client ; formule `standard` ou `complete` ; statuts (`pending`, `accepted`, `rejected`, `scheduled`, `completed`, `cancelled`).

### Gestion des mécaniciens
Profil professionnel du mécanicien, avec statut de certification (`pending`, `certified`, `rejected`) validé côté administration.

### Rendez-vous
Consultation des créneaux disponibles pour une demande, prise de rendez-vous, consultation et annulation, côté client comme côté mécanicien.

### Disponibilités
Déclaration par le mécanicien de ses créneaux hebdomadaires récurrents (jour de la semaine, heure de début, heure de fin).

### Rapports d'inspection
Génération d'un rapport structuré par le mécanicien à l'issue du rendez-vous (état de sept composants du véhicule, condition générale, recommandations, commentaire), consultable par le client et le mécanicien, et téléchargeable au format PDF (`barryvdh/laravel-dompdf`).

### Photos
Ajout de photos liées à une demande d'inspection et/ou à un rapport d'inspection.

### Notifications
Liste des notifications de l'utilisateur connecté, marquage individuel ou global comme lues, suppression (basé sur le système de notifications natif de Laravel).

### Avis et notation
Le client note et commente le mécanicien après réception du rapport ; le mécanicien peut consulter les avis reçus.

### Administration
Tableau de bord, gestion des mécaniciens (certification), consultation des clients, des demandes d'inspection et des rendez-vous.

### Dashboards
Un tableau de bord dédié existe pour chacun des trois rôles (client, mécanicien, administrateur), avec des indicateurs propres à chaque espace.

## 🛠️ Technologies utilisées

| Technologie | Usage |
|---|---|
| Laravel 12 (PHP 8.2+) | Framework backend, API REST |
| Laravel Sanctum | Authentification SPA par cookies/session |
| Laravel Breeze | Base du système d'authentification (contrôleurs, requêtes) |
| Eloquent ORM | Modélisation et accès aux données |
| barryvdh/laravel-dompdf | Génération des rapports d'inspection au format PDF |
| MySQL | Base de données (via Docker) / SQLite en développement local |
| React 19 | Bibliothèque frontend |
| Vite | Outil de build et serveur de développement frontend |
| React Router (v7) | Routage côté client |
| Axios | Client HTTP pour la consommation de l'API |
| Tailwind CSS v4 | Framework utilitaire CSS |
| Lucide React | Icônes |
| Docker / Docker Compose | Conteneurisation du backend, du frontend et de la base de données |
| Nginx | Serveur web pour le backend (conteneur) et pour servir le build frontend |
| PHPUnit | Tests automatisés du backend |

Les outils Git/GitHub, Postman, VS Code, Figma et Jira font partie de l'environnement de travail du projet ; leur usage effectif est précisé dans les sections dédiées ci-dessous.

## 🏗️ Architecture du projet

```text
Car-Check/
├── backend/                # API Laravel 12
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/     # Contrôleurs API (client, mécanicien, admin)
│   │   │   ├── Controllers/Auth/    # Contrôleurs d'authentification
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Models/                  # User, Vehicle, InspectionRequest, MechanicProfile,
│   │   │                            # Appointment, MechanicAvailability, InspectionReport,
│   │   │                            # Review, InspectionPhoto
│   │   └── Notifications/
│   ├── database/migrations/
│   ├── routes/               # api.php, auth.php, web.php, console.php
│   ├── tests/                # Feature/Unit (PHPUnit)
│   ├── Dockerfile
│   └── nginx.conf
├── frontend/                 # Application React (Vite)
│   └── src/
│       ├── components/       # common, layout, notifications, reviews
│       ├── context/
│       ├── layouts/          # client, mechanic, admin
│       ├── pages/             # client, mechanic, admin
│       ├── routes/           # router.jsx
│       └── services/
├── docker-compose.yml
└── README.md
```

## 📐 Conception

### Diagramme de cas d'utilisation
À ajouter.

### Diagramme de classes
À ajouter.

### Modèle Entité-Association — ERD
À ajouter.

> Aucun fichier de diagramme UML ou ERD n'a été trouvé dans le dépôt au moment de la rédaction de ce README. Le schéma de données ci-dessous est déduit directement des migrations Laravel.

## 🗄️ Base de données

Les tables principales, définies par les migrations du backend :

- **users** — comptes utilisateurs, avec un champ `role` (`client`, `mechanic`, `admin`).
- **vehicles** — véhicules déclarés par un client.
- **mechanic_profiles** — profil professionnel d'un mécanicien (ville, spécialisation, expérience, certification).
- **inspection_requests** — demandes d'inspection (client, véhicule, mécanicien, formule, statut, localisation, date/heure préférées).
- **mechanic_availabilities** — créneaux de disponibilité hebdomadaire d'un mécanicien.
- **appointments** — rendez-vous liés à une demande d'inspection (date, heure de début/fin, statut).
- **inspection_reports** — rapport d'inspection lié à un rendez-vous (état des composants, condition générale, recommandations).
- **inspection_photos** — photos associées à une demande et/ou à un rapport d'inspection.
- **reviews** — avis (note + commentaire) laissés par un client sur un mécanicien, liés à un rapport d'inspection.
- **notifications** — notifications polymorphes destinées aux utilisateurs.
- **personal_access_tokens** — jetons d'authentification Sanctum.

## 🔌 API

L'API est exposée sous forme de routes REST dans `routes/api.php`, protégées par le middleware `auth:sanctum` (authentification SPA via cookies, avec Sanctum en mode "stateful").

Principales ressources exposées :

- `POST /register`, `POST /login`, `POST /logout`, gestion du mot de passe et de la vérification d'e‑mail (`routes/auth.php`).
- `GET /user` — utilisateur authentifié.
- `apiResource /vehicles` — CRUD des véhicules.
- `/inspection-requests` — création, consultation, mise à jour, annulation ; `/mechanic/inspection-requests` pour la vue mécanicien (acceptation/rejet).
- `/mechanic/profile` — consultation et mise à jour du profil mécanicien.
- `/appointments` et `/mechanic/appointments` — gestion des rendez-vous, créneaux disponibles.
- `/mechanic/availability` — CRUD des disponibilités du mécanicien.
- `/mechanic/appointments/{appointment}/complete` — création du rapport d'inspection.
- `/inspection-reports` — consultation des rapports (client/mécanicien) et téléchargement PDF.
- `/inspection-reports/{inspectionReport}/review` — dépôt d'un avis.
- `/notifications` — liste, marquage comme lu, suppression.
- `/inspection-requests/{inspectionRequest}/photos`, `/inspection-photos/{inspectionPhoto}` — gestion des photos.
- `/admin/dashboard`, `/admin/mechanics`, `/admin/clients`, `/admin/inspection-requests`, `/admin/appointments` — espace d'administration.
- `/client/dashboard`, `/mechanic/dashboard` — indicateurs des tableaux de bord respectifs.

## 🔐 Sécurité

- Authentification via **Laravel Sanctum** en mode SPA stateful (cookies de session, `SANCTUM_STATEFUL_DOMAINS` configuré pour le frontend Vite).
- Toutes les routes métier de l'API sont protégées par le middleware `auth:sanctum`.
- Vérification d'adresse e‑mail disponible (middleware `EnsureEmailIsVerified`).
- Séparation des rôles au niveau applicatif (`isClient()`, `isMechanic()`, `isAdmin()` sur le modèle `User`), utilisée pour distinguer les accès client / mécanicien / admin.
- Mots de passe hachés (cast `hashed` sur l'attribut `password`).
- Validation des données via les classes `Http\Requests` de Laravel.

## ⚙️ Installation

### Prérequis
- PHP 8.2 ou supérieur
- Composer
- Node.js et npm
- MySQL (ou SQLite pour un environnement de développement local rapide)
- Docker et Docker Compose (optionnel, pour un déploiement conteneurisé)

### Backend

```bash
cd backend
composer install
copy .env.example .env
php artisan key:generate
php artisan migrate
php artisan storage:link
php artisan serve
```

Par défaut, le fichier `.env.example` configure une base **SQLite** (`DB_CONNECTION=sqlite`) pour un démarrage rapide en local. Pour utiliser MySQL, adapter les variables `DB_CONNECTION`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME` et `DB_PASSWORD` dans `.env`.

Un script Composer `dev` est également disponible pour lancer simultanément le serveur, la file d'attente, les logs et Vite :

```bash
composer run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 🐳 Docker

Un fichier `docker-compose.yml` est présent à la racine du projet et définit quatre services :

- **backend** — API Laravel (image construite depuis `backend/Dockerfile`, PHP 8.2-FPM).
- **webserver** — Nginx servant le backend Laravel (port `8080`).
- **db** — MySQL 8.0 (base `carcheck_db`, port exposé `4306`).
- **frontend** — build de production React servi par Nginx (image construite depuis `frontend/Dockerfile`, port `5173`).

Pour démarrer l'ensemble de la stack :

```bash
docker compose up --build
```

L'API sera alors accessible via le service `webserver` (port `8080`) et le frontend via le service `frontend` (port `5173`).

## 🧪 Tests

Le backend dispose d'une suite de tests **PHPUnit** (`backend/tests`), couvrant notamment l'authentification (connexion, inscription, réinitialisation de mot de passe, vérification d'e‑mail). Ils peuvent être exécutés avec :

```bash
cd backend
php artisan test
```

Aucun test automatisé n'a été détecté côté frontend au moment de la rédaction de ce README.

## 🎨 Maquettes

Les maquettes seront ajoutées ici.

## 📋 Planification

[Voir la planification Jira](YOUR_JIRA_LINK)

## 📚 Documentation

- README (ce document)
- `backend/README.md` et `frontend/README.md` — README par défaut de chaque sous-projet.

Les documents suivants (guide d'installation détaillé, cahier des charges, diagrammes UML, ERD, maquettes) ne sont pas présents dans le dépôt à ce jour et seront ajoutés ultérieurement.

## 🚀 Déploiement

Le déploiement de l'application est prévu avec Docker, à l'aide de la configuration `docker-compose.yml` déjà présente dans le dépôt. Aucune URL de production n'est disponible à ce jour.


## 👨‍💻 Auteur

**Achraf Outamghart**

Projet Full-Stack — CarCheck

GitHub : [https://github.com/outamghartAchraf/Car-Check](https://github.com/outamghartAchraf/Car-Check)

## 📄 Licence

Ce projet a été développé dans un cadre pédagogique, en tant que projet Full-Stack de fin de formation en développement web. Il n'est associé à aucune licence commerciale.
