# ⚓ Port de Russell – Gestion des Catways

Application web interne pour la **capitainerie du port de Russell**, permettant la gestion :
- des **catways** (places d’amarrage),
- des **réservations**,
- et des **utilisateurs** (administration et connexion).

---

## 🚀 Fonctionnalités principales
- Authentification sécurisée (session + bcrypt)
- Tableau de bord et interface web dynamique (EJS)
- API REST complète documentée via Swagger
- CRUD complet :
  - Catways : création, édition d’état, suppression
  - Réservations : ajout, visualisation, suppression
  - Utilisateurs : gestion interne (admin)
- Import automatisé des données depuis JSON (`catways.json`, `reservations.json`)
- Docker prêt à l’emploi (API + MongoDB)

---

## 🧩 Technologies utilisées
- **Node.js / Express**
- **MongoDB + Mongoose**
- **EJS** (templating)
- **connect-mongo** (sessions persistantes)
- **Helmet**, **Morgan**, **Method-Override**
- **Swagger UI** (documentation API)
- **Docker / Docker Compose**

---

## ⚙️ Installation et configuration

### 1️⃣ Prérequis
- [Node.js ≥ 20](https://nodejs.org)
- [Docker Desktop](https://www.docker.com/)
- [MongoDB](https://www.mongodb.com/) (si exécution hors Docker)

### 2️⃣ Cloner le projet
```bash
git clone https://github.com/<Boubou008>/port-plaisance-api.git
cd port-plaisance-api
```

### 3️⃣ Installer les dépendances
```bash
npm install
```

### 4️⃣ Configurer les variables d’environnement
Crée un fichier `.env` à la racine du projet (non versionné) à partir de `.env.example` :
```bash
cp .env.example .env
```

Exemple de contenu :
```env
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/port_russell
SESSION_SECRET=devsecret
```

---

## 🐳 Lancement avec Docker

### Construction et exécution
```bash
docker compose up --build
```

L’application sera disponible sur :  
👉 http://localhost:3000

### Arrêt
```bash
docker compose down
```

---

## 🧰 Lancement manuel (hors Docker)

### Démarrer le serveur
```bash
npm run dev
```

L’application s’ouvre automatiquement sur [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💼 Comptes par défaut

| Email             | Mot de passe |
|--------------------|--------------|
| `admin@port.fr`   | `Passw0rd!`  |

---

## 🧬 Scripts utiles

| Script | Description |
|--------|--------------|
| `npm run dev` | Lance le serveur avec rechargement auto et ouverture du navigateur |
| `npm run start` | Démarre l’application en production |
| `npm run seed:import` | Importe les données (`catways.json`, `reservations.json`) |
| `npm run seed:admin` | Crée un compte administrateur |
| `npm run swagger` | Reconstruit la documentation Swagger |
| `npm run lint` | Vérifie le code avec ESLint |

---

## 🗃️ Structure du projet

```
port-plaisance-api/
├── server.js
├── package.json
├── catways.json
├── reservations.json
├── scripts/
│   ├── create-admin.js
│   └── importJson.js
├── src/
│   ├── config/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── views/
├── swagger/
└── docker-compose.yml
```

---

## 📄 Documentation de l’API
L’API est documentée via **Swagger** :  
👉 [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 🧠 JSDoc & commentaires

Le code est commenté avec **JSDoc**, par exemple :
```js
/**
 * @file Gère les routes d’authentification (login/logout)
 * @module routes/api/auth
 */
```

---

## ✨ Qualité & bonnes pratiques
- Code clair et indenté
- Règles de nommage cohérentes (`camelCase`)
- Routes RESTful
- ESLint configuré

---

## 📚 Auteurs
Projet réalisé dans le cadre du **Devoir API – Port de Russell**  
par **[Feck François-Xavier / Pour le CEF]**
