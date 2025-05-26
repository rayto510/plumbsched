FROM node:24-slim

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend .

CMD ["npx", "expo", "start", "--tunnel"]
