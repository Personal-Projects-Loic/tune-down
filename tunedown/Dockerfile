FROM node:18-alpine

ARG VITE_AUTH_DOMAIN
ARG VITE_PROJECT_ID
ARG VITE_STORAGE_BUCKET
ARG VITE_MESSAGING_SENDER_ID
ARG VITE_APP_ID
ARG VITE_MEASUREMENT_ID
ARG VITE_API_KEY

WORKDIR /app

COPY package.json .

RUN npm install

RUN npm i -g serve

COPY . .

COPY .env .env

RUN npm run build

RUN ls -la

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]
