FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json turbo.json ./
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy source files
COPY packages/typescript-config ./packages/typescript-config
COPY packages/common ./packages/common
COPY packages/database ./packages/database
COPY apps/ws-backend ./apps/ws-backend

# Install pnpm
RUN npm install -g pnpm@10.5.2

# Install dependencies and build in order
RUN pnpm install --frozen-lockfile
RUN cd packages/typescript-config && pnpm install
RUN cd packages/common && pnpm install
RUN cd packages/database && pnpm install
RUN cd apps/ws-backend && pnpm install

# Build in order
RUN pnpm run build:ws
RUN pnpm run generate:db

# Create the dist directory structure
RUN mkdir -p dist/apps/ws-backend

# Copy the built files to the correct location
RUN cp -r apps/ws-backend/dist/* dist/apps/ws-backend/

EXPOSE 3002

CMD [ "pnpm", "run", "start:ws" ]