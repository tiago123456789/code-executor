FROM node:18.17-alpine3.18

WORKDIR app/

COPY package.json package-lock.json .

COPY . .

RUN npm i --omit=dev

CMD ["npm", "run", "start:prod"]
