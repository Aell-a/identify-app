FROM node:21-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build && npm cache clean --force

FROM node:21-alpine AS production
WORKDIR /app
COPY --from=build /app ./
EXPOSE 8080
CMD ["npm", "start", "--", "-p", "8080"]