# Dockerfile for ReactTS (Vite) App
FROM node:18-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Vite app
RUN npm run build

# Use Nginx for serving the build files
FROM nginx:stable-alpine

# Copy built files to Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Expose the Nginx port
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
