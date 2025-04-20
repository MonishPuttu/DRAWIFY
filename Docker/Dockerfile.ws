# syntax=docker/dockerfile:1.4

# ---------- Builder Stage ----------
    FROM node:20-alpine AS builder

    WORKDIR /app
    
    # Copy root-level config
    COPY package.json package-lock.json turbo.json ./
    COPY pnpm-lock.yaml pnpm-workspace.yaml ./
    
    # Copy all packages
    COPY packages/typescript-config ./packages/typescript-config
    COPY packages/common ./packages/common
    COPY packages/database ./packages/database
    COPY apps/ws-backend ./apps/ws-backend
    
    # Install pnpm
    RUN npm install -g pnpm@10.5.2
    
    # Install dependencies
    RUN pnpm install --frozen-lockfile
    
    # Install dependencies for each package
    RUN cd packages/typescript-config && pnpm install
    RUN cd packages/common && pnpm install
    RUN cd packages/database && pnpm install
    RUN cd apps/ws-backend && pnpm install
    
    # Build all necessary packages
    RUN pnpm --filter @repo/common build
    RUN pnpm --filter @repo/database build
    RUN pnpm --filter @repo/ws-backend build
    
    # Ensure the dist folder is created and built for ws-backend
    RUN mkdir -p dist/apps/ws-backend
    
    # ---------- Runtime Stage ----------
    FROM node:20-alpine
    
    WORKDIR /app
    
    # Copy only what we need from builder
    COPY --from=builder /app/dist/apps/ws-backend ./dist/apps/ws-backend
    COPY --from=builder /app/node_modules ./node_modules
    COPY --from=builder /app/apps/ws-backend/package.json ./package.json
    
    # Set environment vars if needed
    ENV NODE_ENV production
    
    # Expose the port for ws-backend
    EXPOSE 3002
    
    # Start the app
    CMD ["pnpm", "run", "start:ws"]
    