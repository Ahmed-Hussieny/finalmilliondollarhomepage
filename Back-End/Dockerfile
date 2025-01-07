# Dockerfile for Node.js Backend App
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the app's port (e.g., 5000)
EXPOSE 3000

# Run the application in development mode
CMD ["node", "index.js"]
