# Use Node.js for building the app
FROM node:20-slim AS build

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a lightweight server to serve the static files
FROM node:20-slim

WORKDIR /app

# Install a simple static file server
RUN npm install -g serve

# Copy the build output from the previous stage
COPY --from=build /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["serve", "-s", "dist", "-l", "3000"]
