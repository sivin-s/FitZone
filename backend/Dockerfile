FROM node:20-alpine AS build

# Install build tools for native packages (like bcrypt)
RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Remove devDependencies from node_modules (keeps native binaries intact)
RUN npm prune --omit=dev

# ---------- Runtime stage ----------
FROM node:20-alpine

WORKDIR /app

# Copy package files (for metadata only, not for installing)
COPY package*.json ./

# Copy pruned node_modules from build stage (native modules already compiled)
COPY --from=build /app/node_modules ./node_modules

# Copy compiled output
COPY --from=build /app/dist ./dist

RUN mkdir -p uploads logs

EXPOSE 8080

# Use node directly instead of npm start (saves a process, cleaner signals)
CMD ["node", "dist/server.js"]