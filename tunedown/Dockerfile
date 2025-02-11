FROM node:18-alpine

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
