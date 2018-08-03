FROM node

WORKDIR /app

COPY ./dist /app/dist

ADD ./server/server.js /app

ADD ./server/package.json /app

CMD cd server/

RUN npm install

CMD node server.js

