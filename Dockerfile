# Use official Node.js LTS image
FROM node:20-alpine

# Set working directory inside the container
WORKDIR /src

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy the rest of the application
COPY src .

# Expose the app port
EXPOSE 3000

# Start the app
CMD ["node", "server.js"]