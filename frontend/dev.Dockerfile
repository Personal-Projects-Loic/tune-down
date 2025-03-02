FROM node:18-alpine

WORKDIR /app

RUN ls -lah

COPY package.json ./

RUN npm install
