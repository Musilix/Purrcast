###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20.9.0 As devbuild

WORKDIR /usr/src/app

COPY --chown=node:node package*.json .

RUN npm ci

COPY --chown=node:node ./ /usr/src/app/

USER node

###################
# LOCAL RUNTIME
###################
FROM node:20.9.0 As dev

WORKDIR /usr/src/app

COPY --chown=node:node --from=devbuild /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=devbuild /usr/src/app .

EXPOSE 8080

CMD [ "npm", "run", "start:dev" ]

###################
# BUILD FOR PRODUCTION
###################

FROM node:20.9.0 As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=devbuild /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run build

RUN npm ci --only=production && npm cache clean --force

USER node

###################
# PRODUCTION RUNTIME
###################

FROM node:20.9.0 As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

EXPOSE 8080

CMD [ "node", "dist/main.js" ]