# ==============================================================================
# Second Brain Component Registry — Multi-Stage Production Dockerfile
# Stage 1: Build static assets and bundled server executable
# Stage 2: Minimal Node.js 20 Alpine production runtime
# ==============================================================================

FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source files
COPY . .

# Compile client SPA and standalone esbuild backend
RUN npm run build
RUN npm run build:cli || true

# ==============================================================================
# Stage 2: Production Runner
# ==============================================================================
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Install runtime utilities & dumb-init for clean container signal handling
RUN apk add --no-cache dumb-init postgresql-client curl

# Copy production artifacts from builder
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.ts ./server.ts

# Create unprivileged runner user
RUN addgroup -g 1001 -S secondbrain && \
    adduser -V -u 1001 -S secondbrain -G secondbrain && \
    chown -R secondbrain:secondbrain /app

USER secondbrain

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "dist/server.cjs"]
