# step 1
FROM node:14.21.3 AS builder
WORKDIR /app
COPY package.json package-lock.json .env ./
COPY public public
COPY src src
RUN npm install -f
RUN npm run build

# step 2 (nginx)
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
