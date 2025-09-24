# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD npm run migration:run && npm run start:prod

EXPOSE 3000

CMD ["npm", "run", "start:migrate"]
