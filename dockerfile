# Stage 1: Build
FROM node:20-alpine AS build
WORKDIR /app

# Define build-time arguments
ARG VITE_BACKEND_HOST
ARG VITE_BACKEND_PORT

# Set them as environment variables so Vite sees them during 'npm run build'
ENV VITE_BACKEND_HOST=$VITE_BACKEND_HOST
ENV VITE_BACKEND_PORT=$VITE_BACKEND_PORT

COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]