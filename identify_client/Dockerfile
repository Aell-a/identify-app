FROM node:23-alpine3.19 AS base
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm update && npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
