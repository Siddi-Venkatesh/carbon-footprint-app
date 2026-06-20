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

# Step 2: Serve the app with Node Express (to support runtime env variables)
FROM node:20-alpine
WORKDIR /app

# Copy the built app and server script
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY server.js ./

# Cloud Run requires the container to listen on the port defined by $PORT (default is 8080)
EXPOSE 8080

CMD ["node", "server.js"]
