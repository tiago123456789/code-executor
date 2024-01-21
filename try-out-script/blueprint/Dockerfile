FROM node:20.11.0-alpine3.19

ARG FILENAME

ARG MODULES_TO_INSTALL=""

WORKDIR app/

COPY package.json .

COPY index.js .

COPY codes/$FILENAME .

RUN mv $FILENAME script_to_run.js

RUN npm i $MODULES_TO_INSTALL --no-audit --progress=false

CMD ["node", "index.js", "script_to_run.js"]