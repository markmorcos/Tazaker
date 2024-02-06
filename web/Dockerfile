FROM node:alpine as development
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV NEXT_PUBLIC_ENVIRONMENT=development
CMD ["npm", "run", "dev"]

FROM node:alpine as production
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
RUN NEXT_PUBLIC_ENVIRONMENT=production npm run build
CMD ["npm", "run", "start"]

FROM development as final
