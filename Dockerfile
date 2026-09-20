# build environment
FROM node:25-alpine AS builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
COPY . ./

RUN npm run build

# production environment
FROM nginx:stable-alpine

ENV API_UPSTREAM=backend:3000 \
    PRINT_UPSTREAM=print:3200 \
    DNS_RESOLVER=127.0.0.11 \
    MAX_UPLOAD_SIZE=50m

COPY --from=builder /app/build /usr/share/nginx/html
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY proxy-common.conf /etc/nginx/proxy-common.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
