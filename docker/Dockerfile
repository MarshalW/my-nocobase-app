FROM node:18-bullseye-slim as nft-build

RUN apt-get update \
    && apt-get install git -y -qq

WORKDIR /usr/src/app

RUN cd /usr/src/app \
    && git clone https://github.com/MarshalW/my-nocobase-app.git . && echo 'OK'
RUN git checkout nft4

RUN rm -f yarn.lock
RUN yarn install

RUN NODE_OPTIONS=--openssl-legacy-provider \
    yarn nocobase build

RUN yarn add mysql2 -W

FROM nginx:alpine as nft-client

COPY --from=0 /usr/src/app/packages/app/client/dist /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
CMD nginx -g 'daemon off;'

FROM node:18-alpine as nft-server

WORKDIR /usr/src/app

COPY --from=0 /usr/src/app .
COPY ./start.sh /usr/src/app

CMD ["/usr/src/app/start.sh"]