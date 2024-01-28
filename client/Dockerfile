FROM node:alpine as development
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["npm", "run", "dev"]

FROM node:alpine as staging
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
ENV NODE_ENV=staging
CMD ["npm", "run", "start"]

FROM node:alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]

FROM development as final
