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

# COPY . .
# COPY package.json package-lock.json ./

COPY .env .env

# RUN npm run build

# RUN ls -la

EXPOSE 5173

# CMD [ "serve", "-s", "dist" ]
CMD [ "npm", "run", "dev" ]