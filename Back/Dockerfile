FROM node:18-alpine

# Crée et définit le répertoire de travail dans le conteneur
WORKDIR /app/Back

# Copie package.json et package-lock.json
COPY Back/package*.json ./

# Installe les dépendances
RUN npm install

# Copie le reste des fichiers du backend
COPY Back .

# Variable d'environnement pour le port
ENV PORT=3000

# Expose le port
EXPOSE 3000

# Démarre l'application
CMD ["npm", "start"]