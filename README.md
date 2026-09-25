# CarCheck — Plateforme d'inspection de véhicules d'occasion

## 📌 Présentation

**CarCheck** est une plateforme web Full-Stack dédiée à l'inspection des véhicules d'occasion.

L'objectif principal est de faciliter la mise en relation entre les clients souhaitant faire inspecter un véhicule et les mécaniciens chargés de réaliser l'inspection.

La plateforme permet de gérer l'ensemble du processus, depuis la création d'une demande d'inspection jusqu'à la génération du rapport final, en passant par la réservation d'un rendez-vous.

---

## 🎯 Objectifs du projet

- Faciliter la demande d'inspection d'un véhicule d'occasion.
- Permettre aux mécaniciens de gérer les demandes d'inspection.
- Organiser les rendez-vous selon les disponibilités des mécaniciens.
- Générer des rapports d'inspection détaillés.
- Permettre aux clients de consulter et télécharger leurs rapports.
- Mettre en place un système d'avis et de notation.
- Fournir un espace d'administration pour gérer la plateforme.

---

## 👥 Rôles utilisateurs

### Client

Le client peut :

- Créer un compte et se connecter.
- Gérer ses véhicules.
- Créer une demande d'inspection.
- Consulter l'état de ses demandes.
- Réserver un rendez-vous.
- Consulter ses rendez-vous.
- Consulter les rapports d'inspection.
- Télécharger les rapports au format PDF.
- Ajouter des photos liées à une demande.
- Évaluer le mécanicien après l'inspection.
- Consulter ses notifications.

### Mécanicien

Le mécanicien peut :

- Créer un compte et se connecter.
- Accéder à son tableau de bord.
- Gérer son profil professionnel.
- Consulter les demandes d'inspection disponibles.
- Accepter ou rejeter une demande.
- Gérer ses disponibilités.
- Consulter et gérer ses rendez-vous.
- Réaliser une inspection.
- Créer un rapport d'inspection.
- Ajouter des photos au rapport.
- Consulter les avis reçus.

### Administrateur

L'administrateur peut :

- Accéder au tableau de bord administrateur.
- Consulter les statistiques de la plateforme.
- Gérer les clients.
- Gérer les mécaniciens.
- Vérifier et certifier les mécaniciens.
- Consulter les demandes d'inspection.
- Consulter les rendez-vous.
- Gérer les notifications et les informations de la plateforme.

---

## 🔄 Workflow principal

```text
Client
   │
   ▼
Création d'une demande d'inspection
   │
   ▼
Mécanicien
   │
   ▼
Acceptation de la demande
   │
   ▼
Réservation d'un rendez-vous
   │
   ▼
Inspection du véhicule
   │
   ▼
Création du rapport d'inspection
   │
   ▼
Client consulte le rapport
   │
   ▼
Évaluation du mécanicien
