FROM node:18-bullseye-slim as nft-build

RUN apt-get update \
    && apt-get install git -y -qq

WORKDIR /usr/src/app

RUN cd /usr/src/app \
    && git clone https://github.com/MarshalW/my-nocobase-app.git my-app
RUN cd my-app \
    && git checkout nft4

WORKDIR /usr/src/app/my-app

# RUN git pull
RUN rm -f yarn.lock
RUN yarn install

RUN NODE_OPTIONS=--openssl-legacy-provider yarn nocobase build

RUN 
RUN yarn add mysql2 -W

# RUN apt-get install htop -y -qq

# # RUN cd /usr/src/app \
# #   && yarn create nocobase-app my-app -a cdn \
# #   && cd /usr/src/app/my-app \
# #   && yarn install --production

FROM nginx:alpine as nft-client

COPY --from=0 /usr/src/app/my-app/packages/app/client /usr/share/nginx/html
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html
CMD nginx -g 'daemon off;'

FROM node:18-alpine as nft-server

WORKDIR /usr/src/app/my-app

COPY --from=0 /usr/src/app/my-app .
COPY start.sh /usr/src/app/my-app

CMD ["/usr/src/app/my-app/start.sh"]