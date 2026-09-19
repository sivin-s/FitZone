FROM node:20-alpine AS build

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

RUN npm prune --omit=dev

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

COPY --from=build /app/node_modules ./node_modules

COPY --from=build /app/dist ./dist

RUN mkdir -p uploads logs

EXPOSE 8080

CMD ["node", "dist/server.js"]