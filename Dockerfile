FROM node:20-alpine

RUN apk update && apk add --no-cache \
    mysql-client \
    ftp

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV TZ=Asia/Makassar

CMD ["node", "./src/app.js"]