FROM alpine:latest

RUN apk update && \
    apk add --no-cache docker && \
    apk add --no-cache nodejs && \
    apk add --no-cache npm

WORKDIR /app

COPY package.json package-lock.json .

COPY . .

RUN npm i --omit=dev

CMD ["npm", "run", "start:dev"]