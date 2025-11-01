FROM node:20-bullseye-slim

WORKDIR /app

# Tools pour compiler les modules natifs
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Important: on copie d'abord uniquement les manifests pour un cache propre
COPY package*.json ./

# Force la build from source pour les addons natifs (dont bcrypt)
ENV npm_config_build_from_source=true

# Installe les deps (pas de node_modules venant de l'hôte)
RUN npm ci

# Puis seulement maintenant on copie le reste du code
COPY . .

EXPOSE 3000
ENV NODE_ENV=production

# (Optionnel mais utile) s'assurer que bcrypt est bien (re)compilé dans ce contexte Linux
RUN npm rebuild bcrypt --build-from-source || true

CMD sh -c "npm run seed:admin && npm run seed:import && node server.js"
