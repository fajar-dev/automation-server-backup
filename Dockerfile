FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV TZ=Asia/Makassar

CMD ["node", "./src/app.js"]