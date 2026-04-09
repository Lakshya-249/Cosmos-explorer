# Step 1: Build frontend
FROM node:22-alpine AS frontend-builder

WORKDIR /app/frontend
COPY cosmos-explorer-ui/package.json cosmos-explorer-ui/package-lock.json ./
RUN npm install
COPY cosmos-explorer-ui/ .
RUN npm run build


# Step 2: Setup backend
FROM node:22-alpine

WORKDIR /app

# Install backend deps
COPY cosmos-server/package.json cosmos-server/package-lock.json ./
RUN npm install --only=production

# Copy backend code
COPY cosmos-server/ .

# Copy frontend build into backend
COPY --from=frontend-builder /app/frontend/dist ./public

EXPOSE 4000

CMD ["node", "index.js"]
