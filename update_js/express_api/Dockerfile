FROM node:16.18.1

WORKDIR /express_api

COPY package.json .
COPY package-lock.json .
RUN npm ci

COPY app.ts .
COPY public/ ./public/
