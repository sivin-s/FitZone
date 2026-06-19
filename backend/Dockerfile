# Stage 1: Build stage
FROM node:20-alpine AS builder

# Install build tools for native modules (e.g. bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json tsconfig.json ./

# Install dependencies (including devDependencies for building)
RUN npm ci

# Copy source code
COPY src ./src

# Compile TypeScript
RUN npm run build

# Stage 2: Production runtime stage
FROM node:20-alpine

# Install build tools for native modules in runtime production dependencies
RUN apk add --no-cache python3 make g++

WORKDIR /usr/src/app

COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# Copy compiled code from builder stage
COPY --from=builder /usr/src/app/dist ./dist

# Expose backend port (from .env/env.ts)
EXPOSE 8080

CMD ["npm", "start"]
