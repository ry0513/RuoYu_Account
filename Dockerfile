FROM node:16.17.0-alpine
WORKDIR /app
COPY ./config ./config
COPY ./static/js ./static/js
COPY ./static/css ./static/css
COPY ./static/plugin ./static/plugin
COPY ./dist ./dist
COPY ./package.json ./package.json
COPY ./views ./views
RUN  npm run install:dev
EXPOSE 4000
CMD [ "npm", "run", "app" ]