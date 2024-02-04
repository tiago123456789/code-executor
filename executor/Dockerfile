FROM alpine:latest

ARG USERNAME
ARG PASSWORD

RUN apk update && \
    apk add --no-cache docker && \
    apk add --no-cache nodejs && \
    apk add --no-cache npm

RUN docker login -u $USERNAME -p $PASSWORD docker.io

WORKDIR /app

COPY package.json package-lock.json .

COPY . .

RUN npm i --omit=dev

CMD ["npm", "run", "start:prod"]