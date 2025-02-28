FROM node:18-alpine

WORKDIR /app

RUN ls -lah

COPY package.json package-lock.json ./


RUN npm install
