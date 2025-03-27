FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json turbo.json ./

COPY apps/ws-backend ./apps/ws-backend

COPY packages/database ./packages/database

RUN npm install -g pnpm@10.5.2

RUN pnpm install

RUN pnpm run generate:db

EXPOSE 3002

CMD [ "pnpm", "run", "start:ws" ]