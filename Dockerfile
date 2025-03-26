FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p log

ENV TZ=Asia/Makassar

CMD ["node", "app.js"]