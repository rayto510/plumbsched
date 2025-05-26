FROM node:18

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json* /app/
RUN npm install

COPY frontend/ /app/

EXPOSE 19000 19001 19002

CMD ["npx", "expo", "start", "--tunnel"]
