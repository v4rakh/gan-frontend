#
# Build image
#
FROM node:14-alpine as builder
LABEL maintainer="Varakh <varakh@varakh.de>"

RUN mkdir -p /app
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH

ADD package.json /app/package.json
ADD package-lock.json /app/package-lock.json
ADD .eslintrc.json /app/.eslintrc.json
ADD .env.example /app/.env.example
ADD  env.sh /app/env.sh
COPY public /app/public
COPY src /app/src

RUN npm config set unsafe-perm true && \
    npm install --silent && \
    npm install react-scripts -g --silent && \
    npm run build-unix

#
# Actual image
#
FROM nginx:alpine
LABEL maintainer="Varakh <varakh@varakh.de>"

ENV USER nginx
ENV GROUP nginx
#ENV UID 101
#ENV GID 101

ENV PORT 80

COPY docker-nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /app/build /usr/share/nginx/html
COPY env.sh .

RUN apk --update upgrade && \
    apk add bash && \
    rm -rf /var/cache/apk/* && \
    chmod +x env.sh && \
    chown -R ${USER}:${GROUP} /usr/share/nginx/html

WORKDIR /usr/share/nginx/html

EXPOSE ${PORT}
CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && chown -R ${USER}:${GROUP} /usr/share/nginx/html/env-config.js && nginx -g \"daemon off;\""]