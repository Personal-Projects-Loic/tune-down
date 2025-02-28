FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN ls -lah

RUN npm install
