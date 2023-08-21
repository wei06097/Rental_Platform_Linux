# step 1
FROM node:14.21.3 AS builder
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# step 2
FROM node:14.21.3
WORKDIR /app
COPY --from=builder /app/ReactServer .
RUN npm install
CMD ["node", "server.js"]
