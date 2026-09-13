# build environment
FROM node:18 as builder
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm i
COPY . ./

RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=builder /app/build /usr/share/nginx/html
#COPY docker-entrypoint.sh /docker-entrypoint.d/30-app-entrypoint.sh
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
