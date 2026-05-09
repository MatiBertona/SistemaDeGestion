# Etapa 1: Base de dependencias
FROM node:20-slim AS base
WORKDIR /app
COPY package*.json ./
RUN npm install

# Etapa 2: Desarrollo (Para usar con volúmenes y hot-reload)
FROM base AS dev
COPY . .
CMD ["npm", "run", "dev", "--", "--host"]

# Etapa 3: Construcción (Build para producción)
FROM base AS build
COPY . .
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# Etapa 4: Producción (Servidor Estático Nginx)
FROM nginx:alpine AS prod
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
