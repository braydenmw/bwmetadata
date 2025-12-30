### Multi-stage Dockerfile for production
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies and build frontend + server bundle
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build && npm run build:server

### Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app

# Production deps
COPY package*.json ./
RUN npm ci --production --silent

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server

EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist-server/server/index.js"]
### Multi-stage Dockerfile for production
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies and build frontend + server bundle
COPY package*.json ./
RUN npm ci --silent

# Copy source and build
COPY . .
RUN npm run build && npm run build:server

### Runtime image
FROM node:20-alpine AS runtime
WORKDIR /app

# Production deps
COPY package*.json ./
RUN npm ci --production --silent

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server

EXPOSE 3000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 CMD wget -qO- http://localhost:3000/api/health || exit 1

CMD ["node", "dist-server/server/index.js"]
# ═══════════════════════════════════════════════════════════════════════════════
# BW NEXUS AI - DOCKER PRODUCTION CONFIGURATION
# ═══════════════════════════════════════════════════════════════════════════════

# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Build frontend
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built frontend
COPY --from=builder /app/dist ./dist

# Copy server files
COPY --from=builder /app/server ./server

# Copy type definitions
COPY --from=builder /app/types.ts ./types.ts

# Set environment
ENV NODE_ENV=production
ENV PORT=3001

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start server
CMD ["node", "--experimental-specifier-resolution=node", "server/index.js"]
