# step 1
FROM node:14.21.3 AS builder
ARG API_URL="Backend URL"
ARG WS_URL="Backend Websocket URL"
ARG MAPBOX_TOKEN="Mapbox Token"
ENV REACT_APP_API_URL=${API_URL}
ENV REACT_APP_WS_URL=${WS_URL}
ENV REACT_APP_MAPBOX_TOKEN=${MAPBOX_TOKEN}
WORKDIR /app
COPY package.json package-lock.json ./
COPY public public
COPY src src
RUN npm install -f
RUN npm run build

# step 2 (nginx)
FROM nginx
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx
ENTRYPOINT ["nginx", "-g", "daemon off;"]
