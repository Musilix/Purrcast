# Local build stage
FROM  node:20.9.0 As devbuild

WORKDIR /usr/src/app

COPY --chown=node:node package*.json .

RUN npm ci

COPY --chown=node:node . .

USER node

# local runtime stage
FROM node:20.9.0 As dev

WORKDIR /usr/src/app

COPY --chown=node:node --from=devbuild /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=devbuild . .

EXPOSE 3000

CMD [ "npm", "run", "dev" ]