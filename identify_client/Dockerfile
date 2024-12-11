# Use the appropriate base image for amd64
FROM --platform=linux/amd64 node:21 AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use Node.js for the production server
FROM --platform=linux/amd64 node:21 AS production

# Set the working directory
WORKDIR /app

# Copy built files from the build stage
COPY --from=build /app ./

# Expose the port for the Next.js server
EXPOSE 8080

# Start the Next.js application
CMD ["npm", "start", "--", "-p", "8080"]