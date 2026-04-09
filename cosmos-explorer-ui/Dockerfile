# Step 1: Build the app
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first (for better caching)
COPY package.json package-lock.json ./

RUN npm install

# Copy rest of the code
COPY . .

# Build the Vite app
RUN npm run build


# Step 2: Serve with Nginx
FROM nginx:alpine

# Copy built files to nginx html folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
