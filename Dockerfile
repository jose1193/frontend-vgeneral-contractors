# Usa una imagen base de Node.js
FROM node:20-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia el package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de tu código fuente
COPY . .

# Expone el puerto
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
# Comando para ejecutar la aplicación
CMD ["npm", "run", "dev"]
