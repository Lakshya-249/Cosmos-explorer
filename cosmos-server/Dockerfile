FROM node:18-alpine

WORKDIR /app

# Copy package files first (better caching)
COPY package.json package-lock.json ./

# Install only production deps
RUN npm install --only=production

# Copy rest of the app
COPY . .

# Expose your app port
EXPOSE 4000

# Start app
CMD ["node", "index.js"]
