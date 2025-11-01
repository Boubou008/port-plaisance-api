# Port de Russell — Gestion des catways (API + Frontend)

Application Express + MongoDB + EJS avec documentation Swagger.  
Authentification par *session* (formulaire de connexion).

## Démarrage local

```bash
npm install
cp .env.example .env
# Ajuster MONGODB_URI si besoin
npm run seed:admin         # crée/maj le compte admin (voir .env)
npm run seed:import        # importe data/catways.json et data/reservations.json
npm run dev                # lance sur http://localhost:3000
```

- Accueil: `/`
- Tableau de bord: `/dashboard` (après connexion)
- Doc API Swagger: `/docs`
- API: `/api/...`

**Identifiants par défaut**
- Email: `admin@port.fr`
- Mot de passe: `Passw0rd!`

## Routes API (extrait)

- `GET /api/catways` — liste
- `GET /api/catways/:id` — détail
- `POST /api/catways` — créer
- `PUT /api/catways/:id` — maj état
- `DELETE /api/catways/:id` — supprimer
- `GET /api/catways/:id/reservations` — liste des réservations d'un catway
- `GET /api/catways/:id/reservations/:idReservation` — détail d'une réservation
- `POST /api/catways/:id/reservations` — créer
- `PUT /api/catways/:id/reservations` — modifier (body avec _id)
- `DELETE /api/catways/:id/reservations/:idReservation` — supprimer
- `GET /api/users` — liste
- `GET /api/users/:email` — détail
- `POST /api/users` — créer
- `PUT /api/users/:email` — modifier
- `DELETE /api/users/:email` — supprimer
- `POST /api/login` — connexion
- `GET /api/logout` — déconnexion

## Déploiement

- Base de données : MongoDB Atlas
- Hébergement : Render / Railway / Fly.io (Node 18+)
- Var env requises : `MONGODB_URI`, `SESSION_SECRET`, `ADMIN_*`
- Exposez `/docs` pour la doc publique et protégez le frontend via session.

## JSDoc

Le code contient des blocs JSDoc sur les modèles et routes principales. Vous pouvez générer une doc plus complète avec des outils comme `jsdoc` si nécessaire.
