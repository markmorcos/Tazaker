FROM node:alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
ENV NEXT_PUBLIC_ENVIRONMENT=development
CMD ["npm", "run", "dev"]
