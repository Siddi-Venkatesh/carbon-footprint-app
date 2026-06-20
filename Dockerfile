# Step 1: Build the Vite React app
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy the rest of the application
COPY . .

# ARGs are available during the build step. 
# We map the ARG to an ENV so Vite bakes it into the static files.
ARG VITE_GEMINI_API_KEY
ENV VITE_GEMINI_API_KEY=$VITE_GEMINI_API_KEY

# Build the project (outputs to /app/dist)
RUN npm run build

# Step 2: Serve the app with Nginx
FROM nginx:alpine

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy our custom nginx config for React Router and Port 8080
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built React app from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Cloud Run requires the container to listen on the port defined by $PORT (default is 8080)
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
