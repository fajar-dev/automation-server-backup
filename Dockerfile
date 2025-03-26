FROM node:20-alpine

RUN apt get update && apt get install -y mysql-client

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV TZ=Asia/Makassar

CMD ["node", "./src/app.js"]