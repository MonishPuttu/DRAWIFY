FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json ./

COPY pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps/ws-backend ./apps/ws-backend

COPY packages/database ./packages/database

COPY packages/common ./packages/common

COPY packages/typescript-config ./packages/typescript-config

RUN npm install -g pnpm@10.5.2

RUN pnpm install

RUN pnpm run generate:db

RUN cd apps/ws-backend && pnpm run build

EXPOSE 3002


ARG DATABASE_URL
ARG WS_PORT
ARG JWT_SECRET
ENV DATABASE_URL=${DATABASE_URL}
ENV WS_PORT=${WS_PORT}
ENV JWT_SECRET=${JWT_SECRET}

CMD [ "pnpm", "run", "start:ws" ]