FROM node:12-alpine as build
LABEL maintainer="Varakh <varakh@varakh.de>"
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH

ADD package.json /usr/src/app/package.json
COPY public /usr/src/app/public
COPY src /usr/src/app/src

RUN npm config set unsafe-perm true
RUN npm install --silent
RUN npm install react-scripts -g --silent
RUN npm run build

FROM nginx:alpine
LABEL maintainer="Varakh <varakh@varakh.de>"
COPY docker-nginx.conf /etc/nginx/nginx.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html

WORKDIR /usr/share/nginx/html
COPY ./env.sh .
COPY .env .
RUN apk add --no-cache bash
RUN chmod +x env.sh

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]
