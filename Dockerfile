# step 1
FROM node:14.21.3 AS builder
ENV REACT_APP_API_URL="Backend URL"
ENV REACT_APP_MAPBOX_TOKEN="Mapbox Token"
WORKDIR /app
COPY package.json package-lock.json ./
COPY public public
COPY src src
RUN npm install
RUN npm run build

# step 2 (nginx)
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
