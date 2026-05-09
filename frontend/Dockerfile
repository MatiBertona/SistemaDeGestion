# Etapa 1: Construcción (Build)
FROM node:20-slim AS build

WORKDIR /app

# Argumentos de construcción
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Etapa 2: Producción (Servidor Estático)
FROM nginx:alpine

# Copiar los archivos compilados desde la etapa anterior al directorio de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Exponer el puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
