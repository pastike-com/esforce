FROM node:14.17-buster-slim as build

RUN apt-get update \
    && apt-get install -y build-essential python

WORKDIR /opt/app

COPY . .
RUN npm install \
    && npm run build



FROM nginx:1.21

WORKDIR /var/www/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/app/dist /var/www/html
